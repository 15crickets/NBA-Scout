from nba_api.stats.endpoints import shotchartdetail
from nba_api.stats.static import players
from nba_api.stats.endpoints import playerdashboardbyclutch
from nba_api.stats.endpoints import alltimeleadersgrids

import time



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
    
    if zone_splits.get("Above the Break 3", 0) != 0:
        atb_three_fga = zone_splits.loc["Above the Break 3", "FGA"]
        atb_three_fgm = zone_splits.loc["Above the Break 3", "FGM"]

    if zone_splits.get("Mid-Range", 0) != 0:
        mid_range_fga = zone_splits.get["Mid-Range", "FGA"]
        mid_range_fgm = zone_splits.loc["Mid-Range", "FGM"]
    
    if zone_splits.get("Right Corner 3", 0) != 0:
        right_corner_three_fga = zone_splits.get["Right Corner 3", "FGA"]
        right_corner_three_fgm = zone_splits.get["Right Corner 3", "FGM"]

    if zone_splits.get("Left Corner 3", 0) != 0:
        left_corner_three_fga = zone_splits.get["Left Corner 3", "FGA"]
        left_corner_three_fgm = zone_splits.get["Left Corner 3", "FGM"]

    if zone_splits.get("In The Paint (Non-RA)", 0) != 0:
        itp_fga = zone_splits.loc["In The Paint (Non-RA)", "FGA"]
        itp_fgm = zone_splits.loc["In The Paint (Non-RA)", "FGM"]

    if zone_splits.get("Restricted Area", 0) != 0:
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







def get_team_stats(player_name):



    return

def get_career_stats(player_name):

    return


def get_season_stats(player_name):


    return



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
    
    if zone_splits.get("Above the Break 3", 0) != 0:
        atb_three_fga = zone_splits.loc["Above the Break 3", "FGA"]
        atb_three_fgm = zone_splits.loc["Above the Break 3", "FGM"]

    if zone_splits.get("Mid-Range", 0) != 0:
        mid_range_fga = zone_splits.get["Mid-Range", "FGA"]
        mid_range_fgm = zone_splits.loc["Mid-Range", "FGM"]
    
    if zone_splits.get("Right Corner 3", 0) != 0:
        right_corner_three_fga = zone_splits.get["Right Corner 3", "FGA"]
        right_corner_three_fgm = zone_splits.get["Right Corner 3", "FGM"]

    if zone_splits.get("Left Corner 3", 0) != 0:
        left_corner_three_fga = zone_splits.get["Left Corner 3", "FGA"]
        left_corner_three_fgm = zone_splits.get["Left Corner 3", "FGM"]

    if zone_splits.get("In The Paint (Non-RA)", 0) != 0:
        itp_fga = zone_splits.loc["In The Paint (Non-RA)", "FGA"]
        itp_fgm = zone_splits.loc["In The Paint (Non-RA)", "FGM"]

    if zone_splits.get("Restricted Area", 0) != 0:
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
    

print(all_time_rankings("Lebron James"))