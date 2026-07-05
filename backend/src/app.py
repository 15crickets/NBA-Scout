from flask import Flask, request, jsonify
from flask_cors import CORS
import extract_stats
import numpy as np

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


def to_native(obj):
    if isinstance(obj, dict):
        return {k: to_native(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [to_native(v) for v in obj]
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj

@app.route("/api/player-stats", methods=["GET"])
def player_stats():
    player_name = request.args.get("player")
    if not player_name:
        return jsonify({"error": "Missing 'player' query parameter"}), 400
    try:
        data = {
            "player": player_name,
            "player_info": extract_stats.get_player_info(player_name),
            "season_stats": extract_stats.extract_season_stats(player_name),
            "career_stats": extract_stats.extract_career_stats(player_name),
            "team_stats": extract_stats.get_team_stats(player_name),
            "all_time_ranks": extract_stats.all_time_rankings(player_name),
            "clutch_stats": extract_stats.get_clutch_stats(player_name),
            "zones": extract_stats.get_zones(player_name),
        }
        return jsonify(to_native(data))
    except IndexError:
        return jsonify({"error": f"Player '{player_name}' not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        


if __name__ == "__main__":
    app.run(debug=True, port=5001)