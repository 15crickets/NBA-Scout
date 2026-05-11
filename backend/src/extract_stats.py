from nba_api.stats.endpoints import shotchartdetail
from nba_api.stats.static import players





def get_id(player_name):
    player_dict = players.find_players_by_full_name(player_name)[0]

    id = player_dict["id"]

    return id


def get_clutch_stats(player_name):

    return

def get_team_stats(player_name):

    return

def get_career_stats(player_name):

    return


def get_season_stats(player_name):


    return



def get_zones(player_name):
    player_dict = players.find_players_by_full_name(player_name)[0]


    id = player_dict["id"]
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


    print(zone_splits["FG_PCT"])

    return zone_splits["FG_PCT"]
    






get_zones("Lebron James")