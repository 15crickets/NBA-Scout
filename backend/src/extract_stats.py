from nba_api.stats.endpoints import shotchartdetail
from nba_api.stats.static import players
from nba_api.stats.endpoints import playerdashboardbyclutch
from nba_api.stats.endpoints import alltimeleadersgrids

from nba_api.stats.endpoints import teamyearbyyearstats
from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.endpoints import playercareerstats

import requests
from bs4 import BeautifulSoup
import pandas as pd
import llm_api

def extract_stats(cells):

    return {
        "Year": cells[0],
        "Age": cells[1],
        "Team": cells[2],
        "Games Played": cells[5],
        "Games Started": cells[6],
        "Field Goals": cells[8],
        "Field Goal Attempts": cells[9],
        "Field Goal Percentage": cells[10],
        "3 Pointers": cells[11],
        "3 Point Attempts": cells[12],
        "3 Point Percentage": cells[13],
        "Free Throws": cells[18],
        "Free Throw Attempts": cells[19],
        "Free Throw Percentage": cells[20],
        "Rebounds Per Game": cells[23],
        "Assists Per Game": cells[24],
        "Steals Per Game": cells[25],
        "Blocks Per Game": cells[26],
        "Turnovers Per Game": cells[27],
        "Points Per Game": cells[29]

    }


def extract_season_stats(player_name):
    return_array = []
    first_last = player_name.split()
    first = first_last[0].lower()
    last = first_last[-1].lower()

    letter = last[0]
    url = f"""https://www.basketball-reference.com/players/{letter}/{last[:5]}{first[:2]}01.html"""
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")

    row1 = soup.find("tr", {"id": "per_game_stats.2026"})
    if row1 != None:
        cells = [cell.get_text(strip=True) for cell in row1.find_all(["th", "td"])]

        return_array.append({"2025-2026": extract_stats(cells)})
    
    row2 = soup.find("tr", {"id": "per_game_stats.2025"})
    if row2 != None:
        cells = [cell.get_text(strip=True) for cell in row2.find_all(["th", "td"])]

        return_array.append({"2024-2025": extract_stats(cells)})    
        

    row3 = soup.find("tr", {"id": "per_game_stats.2024"})
    if row3 != None:
        cells = [cell.get_text(strip=True) for cell in row3.find_all(["th", "td"])]

        return_array.append({"2023-2024": extract_stats(cells)})

    row4 = soup.find("tr", {"id": "per_game_stats.2023"})
    if row4 != None:
        cells = [cell.get_text(strip=True) for cell in row4.find_all(["th", "td"])]

        return_array.append({"2022-2023": extract_stats(cells)})

    row5 = soup.find("tr", {"id": "per_game_stats.2022"})
    if row5 != None:
        cells = [cell.get_text(strip=True) for cell in row5.find_all(["th", "td"])]

        return_array.append({"2021-2022": extract_stats(cells)})

    return return_array



def extract_career_stats(player_name):
    first_last = player_name.split()
    first = first_last[0].lower()
    last = first_last[-1].lower()

    letter = last[0]
    url = f"""https://www.basketball-reference.com/players/{letter}/{last[:5]}{first[:2]}01.html"""
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")
    row = soup.find("tr", {"id": "per_game_stats.Yrs"})

    # Extract all <td> and <th> cells
    cells = [cell.get_text(strip=True) for cell in row.find_all(["th", "td"])]

    return {
        "Years": cells[0],
        "Games": cells[2],
        "Games Started": cells[3],
        "Field Goals": cells[5],
        "Field Goal Attempts": cells[6],
        "Field Goal Percentage": cells[7],
        "3 Pointers": cells[8],
        "3 Point Attempts": cells[9],
        "3 Point Percentage": cells[10],
        "Free Throws": cells[15],
        "Free Throw Attempts": cells[16],
        "Free Throw Percentage": cells[17],
        "Rebounds Per Game": cells[20],
        "Assists Per Game": cells[21],
        "Steals Per Game": cells[22],
        "Blocks Per Game": cells[23],
        "Turnovers Per Game": cells[24],
        "Points Per Game": cells[26]

    }



def get_team_stats(player_name):
    id = get_id(player_name)
    info = commonplayerinfo.CommonPlayerInfo(player_id=id)
    df = info.get_data_frames()[0]

    team_name = df["TEAM_NAME"]
    team_id = df["TEAM_ID"].iloc[0]

    team_stats = teamyearbyyearstats.TeamYearByYearStats(
        league_id="00",
        per_mode_simple="PerGame",
        season_type_all_star="Regular Season",
        team_id=team_id
    )

    df = team_stats.get_data_frames()[0]
    row = df.loc[df["YEAR"] == "2025-26"]
    return{
        "Wins": row["WINS"].iloc[0],
        "Losses": row["LOSSES"].iloc[0],
        "Seed": row["CONF_RANK"].iloc[0],
        "Field Goals": row["FGM"].iloc[0],
        "Field Goal Attempts": row["FGA"].iloc[0],
        "Field Goal Percentage": row["FG_PCT"].iloc[0],
        "3 Point Makes": row["FG3M"].iloc[0],
        "3 Point Attempts": row["FG3A"].iloc[0],
        "3 Point Percentage": row["FG3_PCT"].iloc[0],
        "Offensive Rebounds": row["OREB"].iloc[0],
        "Defensive Rebounds": row["DREB"].iloc[0],
        "Rebounds": row["REB"].iloc[0],
        "Assists": row["AST"].iloc[0],
        "Steals": row["STL"].iloc[0],
        "Turnovers": row["TOV"].iloc[0],
        "Blocks": row["BLK"].iloc[0],
        "Points": row["PTS"].iloc[0],
        "Points Rank": row["PTS_RANK"].iloc[0] 
    }


    
def all_time_rankings(player_name):
    player_dict = players.find_players_by_full_name(player_name)[0]

    id = player_dict["id"]

    leaders = alltimeleadersgrids.AllTimeLeadersGrids(
        league_id="00",
        per_mode_simple="Totals",
        season_type="Regular Season",
        topx="5000"
    )

    gp_df = leaders.get_data_frames()[0]
    points_df = leaders.get_data_frames()[1]
    assists_df = leaders.get_data_frames()[2]
    steals_df = leaders.get_data_frames()[3]
    rebounds_df = leaders.get_data_frames()[6]
    blocks_df = leaders.get_data_frames()[7]


    return {
        "Games Played": gp_df.loc[gp_df['PLAYER_ID'] == id]["GP"].iloc[0],
        "Games Played Rank": gp_df.loc[gp_df['PLAYER_ID'] == id]["GP_RANK"].iloc[0],
        "Total Points": points_df.loc[points_df['PLAYER_ID'] == id]["PTS"].iloc[0],
        "Total Points Rank": points_df.loc[points_df['PLAYER_ID'] == id]["PTS_RANK"].iloc[0],
        "Total Assists": assists_df.loc[assists_df['PLAYER_ID'] == id]["AST"].iloc[0],
        "Total Assists Rank": assists_df.loc[assists_df['PLAYER_ID'] == id]["AST_RANK"].iloc[0],
        "Total Steals": steals_df.loc[steals_df['PLAYER_ID'] == id]["STL"].iloc[0],
        "Total Steals Rank": steals_df.loc[steals_df['PLAYER_ID'] == id]["STL_RANK"].iloc[0],
        "Total Rebounds": rebounds_df.loc[rebounds_df['PLAYER_ID'] == id]["REB"].iloc[0],
        "Total Rebounds Rank": rebounds_df.loc[rebounds_df['PLAYER_ID'] == id]["REB_RANK"].iloc[0],
        "Total Blocks": blocks_df.loc[blocks_df['PLAYER_ID'] == id]["BLK"].iloc[0],
        "Total Blocks Rank": blocks_df.loc[blocks_df['PLAYER_ID'] == id]["BLK_RANK"].iloc[0],

    }


def get_id(player_name):
    player_dict = players.find_players_by_full_name(player_name)[0]

    id = player_dict["id"]

    return id


def get_clutch_stats(player_name):
    id = get_id(player_name)
    shots = shotchartdetail.ShotChartDetail(
        team_id=0,
        player_id=id,
        season_nullable='2025-26',
        season_type_all_star='Regular Season',
        context_measure_simple='FGA',
        clutch_time_nullable="Last 5 Minutes",
        point_diff_nullable=5
    )

    df = shots.get_data_frames()[0]


    zone_splits = (
        df.groupby("SHOT_ZONE_BASIC")
        .agg(
            FGM=("SHOT_MADE_FLAG", "sum"),
            FGA=("SHOT_ATTEMPTED_FLAG", "sum")
        )
    )

    zone_splits["FG_PCT"] = (
        zone_splits["FGM"] / zone_splits["FGA"]
    )

    clutch_fga = zone_splits["FGA"]

    clutch_fg_makes = zone_splits["FGM"]


    atb_three_fgm = 0
    atb_three_fga = 0

    right_corner_three_fga = 0
    right_corner_three_fgm = 0

    left_corner_three_fga = 0
    left_corner_three_fgm = 0

    mid_range_fga = 0
    mid_range_fgm = 0

    atb_three_fga = 0
    atb_three_fgm = 0

    itp_fga = 0
    itp_fgm = 0

    ra_fga = 0
    ra_fgm = 0
    
    if "Above the Break 3" in zone_splits.index:
        atb_three_fga = zone_splits.loc["Above the Break 3", "FGA"]
        atb_three_fgm = zone_splits.loc["Above the Break 3", "FGM"]

    if "Mid-Range" in zone_splits.index:
        mid_range_fga = zone_splits.loc["Mid-Range", "FGA"]
        mid_range_fgm = zone_splits.loc["Mid-Range", "FGM"]
    
    if "Right Corner 3" in zone_splits.index:
        right_corner_three_fga = zone_splits.loc["Right Corner 3", "FGA"]
        right_corner_three_fgm = zone_splits.loc["Right Corner 3", "FGM"]

    if "Left Corner 3" in zone_splits.index:
        left_corner_three_fga = zone_splits.loc["Left Corner 3", "FGA"]
        left_corner_three_fgm = zone_splits.loc["Left Corner 3", "FGM"]

    if "In The Paint (Non-RA)" in zone_splits.index:
        itp_fga = zone_splits.loc["In The Paint (Non-RA)", "FGA"]
        itp_fgm = zone_splits.loc["In The Paint (Non-RA)", "FGM"]

    if "Restricted Area" in zone_splits.index:
        ra_fga = zone_splits.loc["Restricted Area", "FGA"]
        ra_fgm = zone_splits.loc["Restricted Area", "FGM"]


    overall_fg_attempts = atb_three_fga + mid_range_fga + right_corner_three_fga + left_corner_three_fga + itp_fga + ra_fga
    overall_fg_makes = atb_three_fgm + mid_range_fgm + right_corner_three_fgm + left_corner_three_fgm + itp_fgm + ra_fgm

    fg_percentage = overall_fg_makes/overall_fg_attempts

    overall_3pa = atb_three_fga + right_corner_three_fga + left_corner_three_fga
    overall_3pm = atb_three_fgm + right_corner_three_fgm + left_corner_three_fgm

    three_point_percentage = overall_3pm/overall_3pa

    return {
        "Mid-Range FGA": mid_range_fga,
        "Mid-Range FGM": mid_range_fgm,
        "Above the Break 3 FGA": atb_three_fga,
        "Above the Break 3 FGM": atb_three_fgm,
        "Right Corner 3 FGA": right_corner_three_fga,
        "Right Corner 3 FGM": right_corner_three_fgm,
        "Left Corner 3 FGA": left_corner_three_fga,
        "Left Corner 3 FGM": left_corner_three_fgm,
        "In The Paint (Non-RA) FGA": itp_fga,
        "In The Paint (Non-RA) FGM": itp_fgm,
        "Restricted Area FGA": ra_fga,
        "Restricted Area FGM": ra_fgm,
        "Overall FGA": overall_fg_attempts,
        "Overall FGM": overall_fg_makes,
        "Overall FG Percentage": fg_percentage,
        "Overall 3PA": overall_3pa,
        "Overall 3PM": overall_3pm,
        "Overall 3 Point Percentage": three_point_percentage
    }

def get_zones(player_name):
    id = get_id(player_name)
    # Nikola Jokić

    shots = shotchartdetail.ShotChartDetail(
        team_id=0,
        player_id=id,
        season_nullable='2024-25',
        season_type_all_star='Regular Season',
        context_measure_simple='FGA'
    )


    # pandas data frames (optional: pip install pandas)

    df = shots.get_data_frames()[0]


    zone_splits = (
        df.groupby("SHOT_ZONE_BASIC")
        .agg(
            FGM=("SHOT_MADE_FLAG", "sum"),
            FGA=("SHOT_ATTEMPTED_FLAG", "sum")
        )
    )

    zone_splits["FG_PCT"] = (
        zone_splits["FGM"] / zone_splits["FGA"]
    )


    atb_three_fgm = 0
    atb_three_fga = 0

    right_corner_three_fga = 0
    right_corner_three_fgm = 0

    left_corner_three_fga = 0
    left_corner_three_fgm = 0

    mid_range_fga = 0
    mid_range_fgm = 0

    atb_three_fga = 0
    atb_three_fgm = 0

    itp_fga = 0
    itp_fgm = 0

    ra_fga = 0
    ra_fgm = 0
    
    if "Above the Break 3" in zone_splits.index:
        atb_three_fga = zone_splits.loc["Above the Break 3", "FGA"]
        atb_three_fgm = zone_splits.loc["Above the Break 3", "FGM"]

    if "Mid-Range" in zone_splits.index:
        mid_range_fga = zone_splits.loc["Mid-Range", "FGA"]
        mid_range_fgm = zone_splits.loc["Mid-Range", "FGM"]
    
    if "Right Corner 3" in zone_splits.index:
        right_corner_three_fga = zone_splits.loc["Right Corner 3", "FGA"]
        right_corner_three_fgm = zone_splits.loc["Right Corner 3", "FGM"]

    if "Left Corner 3" in zone_splits.index:
        left_corner_three_fga = zone_splits.loc["Left Corner 3", "FGA"]
        left_corner_three_fgm = zone_splits.loc["Left Corner 3", "FGM"]

    if "In The Paint (Non-RA)" in zone_splits.index:
        itp_fga = zone_splits.loc["In The Paint (Non-RA)", "FGA"]
        itp_fgm = zone_splits.loc["In The Paint (Non-RA)", "FGM"]

    if "Restricted Area" in zone_splits.index:
        ra_fga = zone_splits.loc["Restricted Area", "FGA"]
        ra_fgm = zone_splits.loc["Restricted Area", "FGM"]


    overall_fg_attempts = atb_three_fga + mid_range_fga + right_corner_three_fga + left_corner_three_fga + itp_fga + ra_fga
    overall_fg_makes = atb_three_fgm + mid_range_fgm + right_corner_three_fgm + left_corner_three_fgm + itp_fgm + ra_fgm

    fg_percentage = overall_fg_makes/overall_fg_attempts

    overall_3pa = atb_three_fga + right_corner_three_fga + left_corner_three_fga
    overall_3pm = atb_three_fgm + right_corner_three_fgm + left_corner_three_fgm

    three_point_percentage = overall_3pm/overall_3pa

    return {
        "Mid-Range FGA": mid_range_fga,
        "Mid-Range FGM": mid_range_fgm,
        "Above the Break 3 FGA": atb_three_fga,
        "Above the Break 3 FGM": atb_three_fgm,
        "Right Corner 3 FGA": right_corner_three_fga,
        "Right Corner 3 FGM": right_corner_three_fgm,
        "Left Corner 3 FGA": left_corner_three_fga,
        "Left Corner 3 FGM": left_corner_three_fgm,
        "In The Paint (Non-RA) FGA": itp_fga,
        "In The Paint (Non-RA) FGM": itp_fgm,
        "Restricted Area FGA": ra_fga,
        "Restricted Area FGM": ra_fgm,
        "Overall FGA": overall_fg_attempts,
        "Overall FGM": overall_fg_makes,
        "Overall FG Percentage": fg_percentage,
        "Overall 3PA": overall_3pa,
        "Overall 3PM": overall_3pm,
        "Overall 3 Point Percentage": three_point_percentage
    }

def get_last_season_stats(player_name):
    first_last = player_name.split()
    first = first_last[0].lower()
    last = first_last[-1].lower()

    letter = last[0]
    url = f"""https://www.basketball-reference.com/players/{letter}/{last[:5]}{first[:2]}01.html"""
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")

    row1 = soup.find("tr", {"id": "per_game_stats.2026"})
    if row1 != None:
        cells = [cell.get_text(strip=True) for cell in row1.find_all(["th", "td"])]

        return extract_stats(cells)
    return "Did not play last season"    


def analyze_player(player_name):
    stats = {
        "clutch":get_clutch_stats(player_name),
        "career": extract_career_stats(player_name),
        "season": get_last_season_stats(player_name),
        "zones": get_zones(player_name),
        "team": get_team_stats(player_name)
    }
    prompt = llm_api.create_prompt(
        stats["clutch"], stats["career"], stats["season"],
        stats["zones"], stats["team"]
    )
    print("Past here")
    return llm_api.api_call(prompt)


