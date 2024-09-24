from flask import Flask, jsonify, request, abort

app = Flask(__name__)

# Mock data (replace this with a database later)
players = [{"id": 1, "name": "Alice", "rating": 1200}, {"id": 2, "name": "Bob", "rating": 1100}]
games = []

# Get all players
@app.route('/players', methods=['GET'])
def get_players():
    return jsonify(players), 200

# Get a specific player by ID
@app.route('/players/<int:player_id>', methods=['GET'])
def get_player(player_id):
    player = next((p for p in players if p['id'] == player_id), None)
    if player is None:
        return jsonify({"error": "Player not found"}), 404
    return jsonify(player), 200

# Add a new player
@app.route('/players', methods=['POST'])
def add_player():
    if not request.json or 'name' not in request.json:
        return jsonify({"error": "Invalid input"}), 400
    new_player = {
        'id': players[-1]['id'] + 1 if players else 1,
        'name': request.json['name'],
        'rating': 1000  # Default rating for new players
    }
    players.append(new_player)
    return jsonify(new_player), 201

# Remove a player
@app.route('/players/<int:player_id>', methods=['DELETE'])
def remove_player(player_id):
    player = next((p for p in players if p['id'] == player_id), None)
    if player is None:
        return jsonify({"error": "Player not found"}), 404
    players.remove(player)
    return jsonify({"message": "Player removed successfully"}), 200

# Get rankings (implement Elo logic later)
@app.route('/rankings', methods=['GET'])
def get_rankings():
    return jsonify(sorted(players, key=lambda x: x.get("rating", 1000), reverse=True)), 200

# Submit game results (just a placeholder for now)
@app.route('/games', methods=['POST'])
def add_game():
    data = request.get_json()
    if not data or 'player1_id' not in data or 'player2_id' not in data or 'result' not in data:
        return jsonify({"error": "Invalid input"}), 400
    new_game = {
        'player1_id': data['player1_id'],
        'player2_id': data['player2_id'],
        'result': data['result']  # Placeholder for now
    }
    games.append(new_game)
    return jsonify(new_game), 201

if __name__ == '__main__':
    app.run(debug=True)