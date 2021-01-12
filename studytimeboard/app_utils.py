import os
import shutil
import pytz

from .constant import *
from .models import StudyEventDB
from .data_analysis import *
from .utils.gsheet import GoogleSheet

tz = pytz.timezone('Europe/Berlin')


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
            datetime2date(datetime.now(tz)),
            request.form.get(START_TIME),
            request.form.get(END_TIME),
        ])

    elif ACT_START in request.form or ACT_END in request.form:
        # print(datetime.now())

        act = ACT_START if ACT_START in request.form else ACT_END

        GoogleSheet.read_from(STUDY_TIME_TABLE_NAME).append_row(SHEET2, [
            username,
            act,
            datetime2date(datetime.now(tz)),
            datetime2time(datetime.now(tz)),
        ])


def clean_chart_folder():
    bar_chart_folder = os.path.dirname(os.path.join(APP_PATH, PATH_TO_BARCHART))
    if os.path.exists(bar_chart_folder):
        shutil.rmtree(bar_chart_folder)
    os.makedirs(bar_chart_folder)


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


def minutes_dashboard_info(df_this_week, chart_prefix, sep_today=False):

    df_minutes = to_minutes_leaderboard(df_this_week)
    if df_minutes.shape[0] > 0:
        name_winner = list(df_minutes[NAME])[0]
        duration_str = min2duration_str(list(df_minutes[MINUTES])[0])

        # add datetime time: for nothing, if we already remove the chart folder
        new_chart_name = extract_chartname_addtime(PATH_TO_BARCHART)

        path_to_chart = os.path.join(os.path.dirname(PATH_TO_BARCHART), chart_prefix + "_" + new_chart_name)

        if sep_today:
            plot_the_bar_chart_with_today(df_this_week, output_path=path_to_chart)
        else:
            plot_the_bar_chart(df_minutes, output_path=path_to_chart)

    else:
        name_winner = "None"
        duration_str = "0 minutes"
        path_to_chart = "static/sample.png"

    return name_winner, duration_str, path_to_chart


# path manager
def regular_chart_path(chart_name):
    # add datetime

    _, img_format = os.path.split(PATH_TO_BARCHART)[1].split(".")  # filename.split(".")

    # reason to add time: no reason
    new_chart_name = "{}_{}.{}".format(chart_name, datetime.now().strftime('%H_%M_%S'), img_format)
    the_path = os.path.join(os.path.dirname(PATH_TO_BARCHART), new_chart_name)

    return the_path


def path_to_chart_user_study_events(username):
    username = username.replace(" ", "_")
    return regular_chart_path(username + "_se")


def path_to_chart_user_min_by_day(username):
    username = username.replace(" ", "_")
    return regular_chart_path(username + "_md")
