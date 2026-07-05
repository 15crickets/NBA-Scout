import requests
from dotenv import load_dotenv
import os
import json



def api_call(prompt):
    print("Getting called")
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))
    OPENROUTER_API_KEY = os.environ["OPENROUTER_API_KEY"]

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",  # optional but recommended
            "X-Title": "My App"
        },
        json={
            "model": "nvidia/nemotron-3-super-120b-a12b:free",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )
    print("No post")

    return (response.json()["choices"][0]["message"]["content"])


def create_prompt(player_clutch, player_career, player_current, player_zones, team_stats):
    prompt_string = f"""You are an NBA scout Use the following information to provide a two paragraph scouting report for this player.
    Keep in mind this player's career stats, how they're performing this year, where they like to take their shots, how they perform in the clutch,
    and how they fit within the team. How important are they to their team's performance? What percentage of team statistics do they account for? Consider these things while making your report.
    CLUTCH STATS (last 5 min, close games):
    {json.dumps(player_clutch, indent=2, default=str)}

    CAREER STATS:
    {json.dumps(player_career, indent=2, default=str)}

    RECENT SEASON STATS:
    {json.dumps(player_current, indent=2, default=str)}

    SHOT ZONE BREAKDOWN:
    {json.dumps(player_zones, indent=2, default=str)}

    TEAM STATS:
    {json.dumps(team_stats, indent=2, default=str)}
    """

    print("Prompt length: ", len(prompt_string))
    return prompt_string



