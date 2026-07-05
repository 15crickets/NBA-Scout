from flask import Flask, request, jsonify
from flask_cors import CORS
import extract_stats

app = Flask(__name__)
CORS(app)  # allows your React dev server (different port) to call this API

@app.route("/api/player-report", methods=["GET"])
def player_report():
    player_name = request.args.get("player")
    if not player_name:
        return jsonify({"error": "Missing 'player' query parameter"}), 400

    try:
        report = extract_stats.analyze_player(player_name)
        return jsonify({"player": player_name, "report": report})
    except IndexError:
        return jsonify({"error": f"Player '{player_name}' not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/player-stats", methods=["GET"])
def player_stats():
    player_name = request.args.get("player")
    if not player_name:
        return jsonify({"error": "Missing 'player' query parameter"}), 400

        


if __name__ == "__main__":
    app.run(debug=True, port=5000)