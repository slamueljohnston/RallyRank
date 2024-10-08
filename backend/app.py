import os
import sys
from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_
from datetime import datetime
from flask_cors import CORS
import logging
from sqlalchemy.exc import SQLAlchemyError
from flask_migrate import Migrate
from config import DevelopmentConfig, ProductionConfig
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Determine environment
if os.getenv('FLASK_ENV') == 'development':
    app.config.from_object(DevelopmentConfig)
else:
    app.config.from_object(ProductionConfig)

# Configure PostgreSQL database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Define models (Player, Game, etc.)
class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    rating = db.Column(db.Integer, default=1000)
    is_active = db.Column(db.Boolean, default=True)

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player1_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    player2_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    player1_score = db.Column(db.Integer, nullable=False)
    player2_score = db.Column(db.Integer, nullable=False)
    result = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default = datetime.now, nullable=False)
    prior_rating_player1 = db.Column(db.Integer, nullable=False, default = 1000)
    prior_rating_player2 = db.Column(db.Integer, nullable=False, default = 1000)
    rating_change_player1 = db.Column(db.Integer, nullable=False, default = 0)
    rating_change_player2 = db.Column(db.Integer, nullable=False, default =0)

# Create tables before handling the first request
@app.before_request
def create_tables():
    db.create_all()

# Get all players
@app.route('/players', methods=['GET'])
def get_players():
    players = Player.query.all()
    return jsonify([{"id": player.id, "name": player.name, "rating": player.rating, "is_active": player.is_active} for player in players]), 200

# Get a specific player by ID
@app.route('/players/<int:player_id>', methods=['GET'])
def get_player(player_id):
    player = Player.query.get(player_id)
    if player is None:
        return jsonify({"error": "Player not found"}), 404
    return jsonify({"id": player.id, "name": player.name, "rating": player.rating}), 200

# Add a new player
@app.route('/players', methods=['POST'])
def add_player():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Invalid input"}), 400
    
    existing_inactive_player = Player.query.filter_by(name=data['name'], is_active=False).first()

    if existing_inactive_player:
        return jsonify({
            "message": "An inactive player with this name already exists. Would you like to reactivate the player?",
            "player_id": existing_inactive_player.id
        }), 409

    new_player = Player(name=data['name'], is_active=True)
    db.session.add(new_player)
    db.session.commit()
    return jsonify({"id": new_player.id, "name": new_player.name, "rating": new_player.rating}), 201

# Reactivate an inactive player
@app.route('/players/reactivate/<int:player_id>', methods=['POST'])
def reactivate_player(player_id):
    player = Player.query.get(player_id)
    if not player or player.is_active:
        return jsonify({"error": "Player not found or already active"}), 404
    
    player.is_active = True
    db.session.commit()
    return jsonify({"message": "Player reactivated successfully", "id": player.id}), 200

# Remove a player
@app.route('/players/<int:player_id>', methods=['DELETE'])
def remove_player(player_id):
    player = Player.query.get(player_id)
    if not player:
        return jsonify({"error": "Player not found"}), 404
    player.is_active = False
    db.session.commit()
    return jsonify({"message": "Player removed successfully"}), 200

# Delete a player permanently
@app.route('/players/<int:player_id>/delete', methods=['DELETE'])
def delete_player(player_id):
    player = Player.query.get(player_id)
    if not player:
        return jsonify({"error": "Player not found"}), 404
    
    # Remove all related games
    Game.query.filter(or_(Game.player1_id == player_id, Game.player2_id == player_id)).delete()
    
    db.session.delete(player)
    db.session.commit()
    return jsonify({"message": "Player and all related games deleted successfully"}), 200

# Get rankings
@app.route('/rankings', methods=['GET'])
def get_rankings():
    players = Player.query.filter_by(is_active=True).order_by(Player.rating.desc()).all()  # Sort by rating in descending order
    return jsonify([{"id": player.id, "name": player.name, "rating": player.rating} for player in players]), 200

# Submit game results
@app.route('/games', methods=['POST'])
def add_game():
    try:
        data = request.get_json()

        # Validate and fetch necessary data
        if not data or 'player1_id' not in data or 'player2_id' not in data or 'player1_score' not in data or 'player2_score' not in data:
            return jsonify({"error": "Invalid input: player IDs and scores are required"}), 400

        player1 = Player.query.get(data['player1_id'])
        player2 = Player.query.get(data['player2_id'])
        if not player1 or not player2:
            return jsonify({"error": "Player not found"}), 404

        player1_score = int(data['player1_score'])
        player2_score = int(data['player2_score'])

        # Ensure new game record is created
        prior_rating_player1 = player1.rating
        prior_rating_player2 = player2.rating

        # Calculate the result and rating changes
        if player1_score > player2_score:
            result = 'player1win'
            score1 = 1
            score2 = 0
        elif player2_score > player1_score:
            result = 'player2win'
            score1 = 0
            score2 = 1
        else:
            result = 'draw'
            score1 = score2 = 0.5

        K = 32
        rating_diff = player2.rating - player1.rating
        expected_score1 = 1 / (1 + 10 ** (rating_diff / 400))
        expected_score2 = 1 - expected_score1

        score_diff = abs(player1_score - player2_score)
        margin_multiplier = (score_diff + 1) / 20

        rating_change_player1 = int(K * margin_multiplier * (score1 - expected_score1))
        rating_change_player2 = int(K * margin_multiplier * (score2 - expected_score2))

        player1.rating += rating_change_player1
        player2.rating += rating_change_player2

        # Create a new game record with unique values for each game
        new_game = Game(
            player1_id=player1.id,
            player2_id=player2.id,
            player1_score=player1_score,
            player2_score=player2_score,
            result=result,
            prior_rating_player1=prior_rating_player1,
            prior_rating_player2=prior_rating_player2,
            rating_change_player1=rating_change_player1,
            rating_change_player2=rating_change_player2
        )

        # Add the new game to the database and commit
        db.session.add(new_game)
        db.session.commit()

        return jsonify({
            "id": new_game.id,
            "player1_id": new_game.player1_id,
            "player2_id": new_game.player2_id,
            "player1_score": new_game.player1_score,
            "player2_score": new_game.player2_score,
            "result": new_game.result,
            "timestamp": new_game.timestamp,
            "new_ratings": {
                "player1": player1.rating,
                "player2": player2.rating
            }
        }), 201

    except SQLAlchemyError as e:
        logging.error(f"Database error: {e}")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

# Get all games
@app.route('/games', methods=['GET'])
def get_games():
    games = Game.query.order_by(Game.timestamp.desc()).all()
    game_data = []

    for game in games:
        player1 = Player.query.get(game.player1_id)
        player2 = Player.query.get(game.player2_id)
        game_data.append({
            "id": game.id,
            "player1_name": player1.name,
            "player2_name": player2.name,
            "player1_score": game.player1_score,
            "player2_score": game.player2_score,
            "result": game.result,
            "timestamp": game.timestamp,
            "prior_rating_player1": game.prior_rating_player1,
            "prior_rating_player2": game.prior_rating_player2,
            "rating_change_player1": game.rating_change_player1,
            "rating_change_player2": game.rating_change_player2,
            "new_rating_player1": player1.rating,
            "new_rating_player2": player2.rating
        })

    return jsonify(game_data), 200

# Delete a game
@app.route('/games/<int:game_id>', methods=['DELETE'])
def delete_game(game_id):
    game = Game.query.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    # Fetch players
    player1 = Player.query.get(game.player1_id)
    player2 = Player.query.get(game.player2_id)

    # Reverse the rating changes caused by this game
    player1.rating -= game.rating_change_player1
    player2.rating -= game.rating_change_player2

    db.session.delete(game)
    db.session.commit()
    return jsonify({"message": "Game deleted successfully"}), 200

# Edit a game
@app.route('/games/<int:game_id>', methods=['PUT'])
def edit_game(game_id):
    game = Game.query.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    data = request.get_json()

    # Fetch players
    player1 = Player.query.get(game.player1_id)
    player2 = Player.query.get(game.player2_id)

    # Reverse the previous rating changes
    player1.rating -= game.rating_change_player1
    player2.rating -= game.rating_change_player2

    # Update the scores
    game.player1_score = data.get('player1_score', game.player1_score)
    game.player2_score = data.get('player2_score', game.player2_score)

    # Recalculate the result based on the new scores
    if game.player1_score > game.player2_score:
        game.result = 'player1win'
        score1 = 1
        score2 = 0
    elif game.player2_score > game.player1_score:
        game.result = 'player2win'
        score1 = 0
        score2 = 1
    else:
        game.result = 'draw'
        score1 = score2 = 0.5

    # Recalculate rating changes
    K = 32
    rating_diff = player2.rating - player1.rating
    expected_score1 = 1 / (1 + 10 ** (rating_diff / 400))
    expected_score2 = 1 - expected_score1

    score_diff = abs(game.player1_score - game.player2_score)
    margin_multiplier = (score_diff + 1) / 20

    game.rating_change_player1 = int(K * margin_multiplier * (score1 - expected_score1))
    game.rating_change_player2 = int(K * margin_multiplier * (score2 - expected_score2))

    # Apply the new rating changes
    player1.rating += game.rating_change_player1
    player2.rating += game.rating_change_player2

    db.session.commit()
    return jsonify({"message": "Game updated successfully"}), 200

# Get game history for a specific player
@app.route('/games/player/<int:player_id>', methods=['GET'])
def get_player_games(player_id):
    games = Game.query.filter((Game.player1_id == player_id) | (Game.player2_id == player_id)).all()
    return jsonify([{
        "player1_id": game.player1_id,
        "player2_id": game.player2_id,
        "player1_score": game.player1_score,
        "player2_score": game.player2_score,
        "result": game.result,
        "timestamp": game.timestamp
    } for game in games]), 200

# Get player profile and stats
@app.route('/players/<int:player_id>/stats', methods=['GET'])
def get_player_stats(player_id):
    player = Player.query.get(player_id)
    if not player:
        return jsonify({"error": "Player not found"}), 404

    # Count total games played
    games_played = Game.query.filter(or_(Game.player1_id == player_id, Game.player2_id == player_id)).count()

    # Count total wins (either as player1 or player2)
    wins = Game.query.filter(or_(
        (Game.player1_id == player_id) & (Game.result == 'player1win'),
        (Game.player2_id == player_id) & (Game.result == 'player2win')
    )).count()

    # Calculate losses
    losses = games_played - wins

    return jsonify({
        "name": player.name,
        "rating": player.rating,
        "games_played": games_played,
        "wins": wins,
        "losses": losses
    }), 200

# Define routes (e.g., /players, /games, etc.)
@app.route('/')
def home():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)