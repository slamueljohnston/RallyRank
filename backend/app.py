from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rallyrank.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define the Player model (table)
class Player(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80), nullable = False)
    rating = db.Column(db.Integer, default = 1000)

# Define the Game model (table)
class Game(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    player1_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable = False)
    player2_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable = False)
    player1_score = db.Column(db.Integer, nullable=False)
    player2_score = db.Column(db.Integer, nullable=False)
    result = db.Column(db.String(10), nullable=False)  # Who won (e.g., 'player1_win')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

# Create the tables
@app.before_first_request
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
    if not data or 'player1_id' not in data or 'player2_id' not in data or 'player1_score' not in data or 'player2_score' not in data:
        return jsonify({"error": "Invalid input"}), 400

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

    # Elo rating calculation
    K = 32  # K-factor, can be adjusted
    rating_diff = player2.rating - player1.rating
    expected_score1 = 1 / (1 + 10 ** (rating_diff / 400))
    expected_score2 = 1 - expected_score1

    # Calculate margin of victory factor (to enhance Elo change)
    score_diff = abs(player1_score - player2_score)
    margin_multiplier = (score_diff + 1) / 20  # scaling factor, can be adjusted

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


if __name__ == '__main__':
    app.run(debug=True)