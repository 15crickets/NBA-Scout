# NBA Scout

An AI-powered NBA scouting tool that generates scouting reports, shot zone analysis, and player highlight clips for any NBA player.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/15crickets/NBA-Scout.git
cd NBA-Scout
```

### 2. Set Up API Keys

Create a `.env` file inside the `backend/` directory:

```
OPENROUTER_API_KEY=your_openrouter_key_here
YOUTUBE_API_KEY=your_youtube_data_api_key_here
```

- **OpenRouter** — sign up at [openrouter.ai](https://openrouter.ai) to get an API key
- **YouTube Data API v3** — enable it in the [Google Cloud Console](https://console.cloud.google.com) and generate a key

### 3. Run the Project

Open two terminal windows:

**Frontend** (from `nba-scout/`)
```bash
npm install
npm run dev
```

**Backend** (from `backend/src/`)
```bash
python app.py
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.