import requests
from dotenv import load_dotenv
import os

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
            {"role": "user", "content": "Explain transformers in simple terms"}
        ]
    }
)

print(response.json()["choices"][0]["message"]["content"])


def create_prompt(player_clutch, player_career, player_current, player_zones, team_stats):



    return ""


def send_to_agent():


    return


