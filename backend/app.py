from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rallyrank.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define models (Player, Game, etc.)
class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    rating = db.Column(db.Integer, default=1000)

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player1_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    player2_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    player1_score = db.Column(db.Integer, nullable=False)
    player2_score = db.Column(db.Integer, nullable=False)
    result = db.Column(db.String(10), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

# Create tables before handling the first request
@app.before_request
def create_tables():
    db.create_all()

# Get all players
@app.route('/players', methods=['GET'])
def get_players():
    players = Player.query.all()
    return jsonify([{"id": player.id, "name": player.name, "rating": player.rating} for player in players]), 200

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
    new_player = Player(name=data['name'])
    db.session.add(new_player)
    db.session.commit()
    return jsonify({"id": new_player.id, "name": new_player.name, "rating": new_player.rating}), 201

# Remove a player
@app.route('/players/<int:player_id>', methods=['DELETE'])
def remove_player(player_id):
    player = Player.query.get(player_id)
    if player is None:
        return jsonify({"error": "Player not found"}), 404
    db.session.delete(player)
    db.session.commit()
    return jsonify({"message": "Player removed successfully"}), 200

# Get rankings
@app.route('/rankings', methods=['GET'])
def get_rankings():
    players = Player.query.order_by(Player.rating.desc()).all()  # Sort by rating in descending order
    return jsonify([{"id": player.id, "name": player.name, "rating": player.rating} for player in players]), 200

# Submit game results
@app.route('/games', methods=['POST'])
def add_game():
    data = request.get_json()
    
    # Check if the required fields are in the request
    if not data or 'player1_id' not in data or 'player2_id' not in data or 'player1_score' not in data or 'player2_score' not in data:
        return jsonify({"error": "Invalid input: player IDs and scores are required"}), 400
    
    # Prevent players from playing against themselves
    if data['player1_id'] == data['player2_id']:
        return jsonify({"error": "A player cannot play against themselves"}), 400
    
    # Ensure scores are valid (positive integers)
    if not isinstance(data['player1_score'], int) or not isinstance(data['player2_score'], int):
        return jsonify({"error": "Scores must be valid integers"}), 400
    if data['player1_score'] < 0 or data['player2_score'] < 0:
        return jsonify({"error": "Scores must be positive integers"}), 400
    
    # Fetch players from the database
    player1 = Player.query.get(data['player1_id'])
    player2 = Player.query.get(data['player2_id'])
    if not player1 or not player2:
        return jsonify({"error": "Player not found"}), 404

    # Calculate the result based on scores
    player1_score = data['player1_score']
    player2_score = data['player2_score']
    
    if player1_score > player2_score:
        result = 'player1_win'
        score1 = 1  # player1 wins
        score2 = 0  # player2 loses
    elif player2_score > player1_score:
        result = 'player2_win'
        score1 = 0  # player1 loses
        score2 = 1  # player2 wins
    else:
        result = 'draw'
        score1 = score2 = 0.5  # draw scenario

    # Elo rating calculation (same logic as before)
    K = 32  # K-factor
    rating_diff = player2.rating - player1.rating
    expected_score1 = 1 / (1 + 10 ** (rating_diff / 400))
    expected_score2 = 1 - expected_score1

    # Margin multiplier (same as before)
    score_diff = abs(player1_score - player2_score)
    margin_multiplier = (score_diff + 1) / 20

    # Update player ratings
    player1.rating += K * margin_multiplier * (score1 - expected_score1)
    player2.rating += K * margin_multiplier * (score2 - expected_score2)

    # Create and store the game record
    new_game = Game(
        player1_id=player1.id,
        player2_id=player2.id,
        player1_score=player1_score,
        player2_score=player2_score,
        result=result
    )
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

# Get all games
@app.route('/games', methods=['GET'])
def get_games():
    games = Game.query.all()
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
            "timestamp": game.timestamp
        })

    return jsonify(game_data), 200

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
        (Game.player1_id == player_id) & (Game.result == 'player1_win'),
        (Game.player2_id == player_id) & (Game.result == 'player2_win')
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