from flask import Flask, jsonify, request

app = Flask(__name__)

# Mock data (replace this with a database later)
players = [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
games = []

# Get all players
@app.route('/players', methods=['GET'])
def get_players():
    return jsonify(players)

# Add a new player
@app.route('/players', methods=['POST'])
def add_player():
    new_player = request.get_json()
    players.append(new_player)
    return jsonify(new_player), 201

# Get rankings (implement Elo logic later)
@app.route('/rankings', methods=['GET'])
def get_rankings():
    return jsonify(sorted(players, key=lambda x: x.get("rating", 1000), reverse=True))

# Submit game results (just a placeholder for now)
@app.route('/games', methods=['POST'])
def add_game():
    new_game = request.get_json()
    games.append(new_game)
    return jsonify(new_game), 201

if __name__ == '__main__':
    app.run(debug=True)