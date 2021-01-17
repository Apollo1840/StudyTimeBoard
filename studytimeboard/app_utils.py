"""

like API of backend.

logic units for routes.

"""

import os
import shutil

from .constant import *
from .path_manager import *
from .models import StudyEventDB
from .data_analysis import *
from .plotters import *
from .utils.gsheet import GoogleSheet


def load_google_data_to_db(db):
    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    df_dur = gs.sheet(sheet_name=SHEET1, least_col_name=START_TIME)
    df_eve = gs.sheet(sheet_name=SHEET2, least_col_name=NAME)

    df = merge_dur_eve(df_dur, df_eve)

    # delete study events
    StudyEventDB.query.delete()
    db.session.commit()

    # load df to db
    study_events = df2studyeventsdb(df)
    db.session.add_all(study_events)
    db.session.commit()


def df2studyeventsdb(df):
    study_events = []
    for i, row in df.iterrows():
        study_events.append(StudyEventDB(username=row[NAME],
                                         date=date2datetime(row[DATE]),
                                         start_time=time2datetime(row[START_TIME]),
                                         end_time=time2datetime(row[END_TIME])))
    return study_events


def studyeventsdb2df(db):
    study_events = StudyEventDB.query.all()

    df_dict = {}
    df_dict[NAME] = [se.username for se in study_events]
    df_dict[DATE] = [datetime2date(se.date) for se in study_events]
    df_dict[START_TIME] = [datetime2time(se.start_time) for se in study_events]
    df_dict[END_TIME] = [datetime2time(se.end_time) for se in study_events]

    return pd.DataFrame(df_dict)


def parse_request_to_db(request, username, db=None):
    # NOTE! sometimes, username is not in the request

    if request.form.get(START_TIME) and request.form.get(END_TIME):
        # print(request.form.get("username"), request.form.get("start_time"), request.form.get("end_time"),)
        GoogleSheet.read_from(STUDY_TIME_TABLE_NAME).append_row(SHEET1, [
            username,
            datetime2date(datetime.now(TZ)),
            request.form.get(START_TIME),
            request.form.get(END_TIME),
        ])

    elif ACT_START in request.form or ACT_END in request.form:
        # print(datetime.now())

        act = ACT_START if ACT_START in request.form else ACT_END

        GoogleSheet.read_from(STUDY_TIME_TABLE_NAME).append_row(SHEET2, [
            username,
            act,
            datetime2date(datetime.now(TZ)),
            datetime2time(datetime.now(TZ)),
        ])


def clean_chart_folder():
    bar_chart_folder = os.path.dirname(os.path.join(APP_PATH, PATH_TO_BARCHART))
    if os.path.exists(bar_chart_folder):
        shutil.rmtree(bar_chart_folder)
    os.makedirs(bar_chart_folder)


def info_user_status(df_eve, username):
    """

    :param username:
    :return: str, str:
    """

    if username in df_eve[NAME].unique():

        user_status = list(df_eve.loc[df_eve[NAME] == username, ACT])[-1]

        date_str = list(df_eve.loc[df_eve[NAME] == username, DATE])[-1]
        time_str = list(df_eve.loc[df_eve[NAME] == username, TIME])[-1]
        back_then = datetime.strptime(date_str + "_" + time_str, "%Y.%m.%d_%H:%M")
        now = datetime.now(TZ).replace(tzinfo=None)

        up_to_now_minutes = (now - back_then).seconds / 60
        user_status_time = min2duration_str(up_to_now_minutes)

    else:

        user_status = "unknown"
        user_status_time = "unkonwn"

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


# depracated
def get_the_basic_dataframe(db=None):
    """

    :return: dataframe, each row is a clip of study duration(event)
    """

    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    df_dur = gs.sheet(sheet_name=SHEET1, least_col_name=START_TIME)
    df_eve = gs.sheet(sheet_name=SHEET2, least_col_name=NAME)

    df = merge_dur_eve(df_dur, df_eve)

    # df = studyeventsdb2df(db)

    # process the data table
    df_all = add_analysis_columns(df)

    df_all = df_all.sort_values(by=DATE_DT)

    return df_all
