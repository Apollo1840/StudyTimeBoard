"""

like API of backend.

logic units for routes.

"""

import os
import shutil

from .constant import *
from .config import *

from .utils.database import DataBaseAPI
from .utils.data_analysis import *
from .utils.plotters import *
from .utils.plotter_path_manager import *

from .tools.data_tools import min2duration_str


def clean_chart_folder():
    bar_chart_folder = os.path.dirname(os.path.join(APP_PATH, PATH_TO_BARCHART))
    if os.path.exists(bar_chart_folder):
        shutil.rmtree(bar_chart_folder)
    os.makedirs(bar_chart_folder)


def get_df_all_from_db(db=None):
    """

    :return: dataframe, each row is a clip of study duration(event)
    """

    df = DataBaseAPI.out_as_dataframe()
    df_all = add_analysis_columns(df)
    df_all = df_all.sort_values(by=DATE_DT)

    return df_all


def info_studying_users(df):
    return df.loc[df[END_TIME] == UNKNOWN, NAME].unique().tolist()


def info_user_status(df, username):
    # todo: fix the kind of nested if-else

    if username in df[NAME].unique():

        df_user = df.loc[df[NAME] == username, :]

        if UNKNOWN in df_user[END_TIME].tolist():
            user_status = ACT_START
            df_recent = df_user.loc[df_user[END_TIME] == UNKNOWN, :]
            time_str = df_recent[START_TIME].tolist()[-1]

        else:
            user_status = ACT_END
            df_recent = df_user.sort_values([DATE_DT, END_TIME_DT])
            time_str = df_recent[END_TIME].tolist()[-1]

        if time_str == UNKNOWN:
            raise ValueError("go branch {}:\n invalid time_str out of :\n".format(
                UNKNOWN in df_user[END_TIME]),
                df_recent)

        date_str = df_recent[DATE].tolist()[-1]
        back_then = datetime.strptime(date_str + "_" + time_str, "%Y.%m.%d_%H:%M")
        now = datetime.now(TZ).replace(tzinfo=None)

        if now > back_then:
            up_to_now_minutes = (now - back_then).seconds / 60
            user_status_time = min2duration_str(up_to_now_minutes)
        else:
            user_status_time = ""

    else:
        user_status = "unknown"
        user_status_time = "unkonwn"

    return user_status, user_status_time


def info_user_status_from_gs1_gs2(data, username):
    """

    :param username:
    :return: str, str:
    """

    _, df_eve = data

    if username in df_eve[NAME].unique():

        user_status = list(df_eve.loc[df_eve[NAME] == username, ACT])[-1]

        date_str = list(df_eve.loc[df_eve[NAME] == username, DATE])[-1]
        time_str = list(df_eve.loc[df_eve[NAME] == username, TIME])[-1]
        back_then = datetime.strptime(date_str + "_" + time_str, "%Y.%m.%d_%H:%M")
        now = datetime.now(TZ).replace(tzinfo=None)

        up_to_now_minutes = (now - back_then).seconds / 60
        user_status_time = min2duration_str(up_to_now_minutes)

    else:

        user_status = UNKNOWN
        user_status_time = UNKNOWN

    return user_status, user_status_time


def info_today_study_king(df_this_week):
    df_today = df_this_week.loc[df_this_week[TODAY_OR_NOT] == IS_TODAY, :]

    if len(df_today) > 0:
        df_minutes = to_minutes_leaderboard(df_today)

        name_winner = list(df_minutes[NAME])[0]
        duration_str = min2duration_str(list(df_minutes[MINUTES])[0])

        df_user_today = df_today.loc[df_today[NAME] == name_winner, :]

        path_to_chart = path_to_chart_user_today_king(username=name_winner)
        plot_study_events_singleday(df_user_today, output_path=path_to_chart)

    else:
        name_winner = "nobody"
        duration_str = "0 seconds"
        path_to_chart = "sample.png"

    return name_winner, duration_str, path_to_chart


def info_minutes_dashboard(df_this_week, chart_prefix, sep=None):
    df_minutes = to_minutes_leaderboard(df_this_week)
    if df_minutes.shape[0] > 0:
        name_winner = list(df_minutes[NAME])[0]
        duration_str = min2duration_str(list(df_minutes[MINUTES])[0])

        path_to_chart = path_to_chart_with_prefix(chart_prefix)

        if sep == TODAY_OR_NOT:
            plot_the_bar_chart_with_today(df_this_week, output_path=path_to_chart)
        elif sep == WEEKDAY:
            plot_the_bar_chart_with_weekday(df_this_week, output_path=path_to_chart)
        else:
            plot_the_bar_chart(df_minutes, output_path=path_to_chart)

    else:
        name_winner = "None"
        duration_str = "0 minutes"
        path_to_chart = "static/sample.png"

    return name_winner, duration_str, path_to_chart
