import os
import shutil

from .constant import *
from .data_analysis import *
from .utils.gsheet import GoogleSheet
from .utils.lcsheet import LocalSheet


def parse_request_to_db(request):

    if request.form.get("start_time") and request.form.get("end_time"):
        # print(request.form.get("username"), request.form.get("start_time"), request.form.get("end_time"),)
        GoogleSheet.read_from(STUDY_TIME_TABLE_NAME).append_row(SHEET1, [
            request.form.get("username"),
            datetime2date(datetime.today()),
            request.form.get("start_time"),
            request.form.get("end_time"),
        ])

    elif "go" in request.form or "hold" in request.form:
        # print(datetime.now())

        act = "go" if "go" in request.form else "hold"

        GoogleSheet.read_from(STUDY_TIME_TABLE_NAME).append_row(SHEET2, [
            request.form.get("username"),
            act,
            datetime2date(datetime.today()),
            datetime2time(datetime.now()),
        ])


def clean_chart_folder():
    bar_chart_folder = os.path.dirname(os.path.join(APP_PATH, PATH_TO_BARCHART))
    if os.path.exists(bar_chart_folder):
        shutil.rmtree(bar_chart_folder)
    os.makedirs(bar_chart_folder)


def get_the_basic_dataframe():
    """

    :return: dataframe, each row is a clip of study duration(event)
    """

    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    df_dur = gs.sheet(sheet_name=SHEET1, least_col_name=START_TIME)
    df_eve = gs.sheet(sheet_name=SHEET2, least_col_name=NAME)

    df = merge_dur_eve(df_dur, df_eve)

    # ls = LocalSheet.read_from(PATH_TO_LOCALDB)
    # df_dur = ls.sheet(sheet_name=SHEET1)
    # df_eve = ls.sheet(sheet_name=SHEET2)
    # df2 = merge_dur_eve(df_dur, df_eve)
    # df = pd.concat([df, df2])

    # process the data table
    df_all = add_analysis_columns(df)

    df_all = df_all.sort_values(by=DATE_DT)

    return df_all


# path manager
def regular_chart_path(chart_name):
    # add datetime

    _, img_format = os.path.split(PATH_TO_BARCHART)[1].split(".")  # filename.split(".")

    # reason to add time: no reason
    new_chart_name = "{}_{}.{}".format(chart_name, datetime.now().strftime('%H_%M_%S'), img_format)
    the_path = os.path.join(os.path.dirname(PATH_TO_BARCHART), new_chart_name)

    return the_path


def path_to_chart_user_study_events(username):
    return regular_chart_path(username + "_se")


def path_to_chart_user_min_by_day(username):
    return regular_chart_path(username + "_md")


# depracated
def initialize_db():
    # initiate database
    sheet_columns = {
        SHEET1: [NAME, DATE, START_TIME, END_TIME],
        SHEET2: [NAME, ACT, DATE, TIME]
    }
    for sheet_name in [SHEET1, SHEET2]:
        path_df = os.path.join(PATH_TO_LOCALDB, sheet_name + ".csv")
        if not os.path.exists(path_df):
            df = pd.DataFrame(columns=sheet_columns[sheet_name])
            df.to_csv(path_df, index=False)
            print("initialize {}.csv".format(sheet_name))


def parse_request_to_local_db(request):
    if request.form.get("start_time") and request.form.get("end_time"):
        # print(request.form.get("username"), request.form.get("start_time"), request.form.get("end_time"),)
        LocalSheet.read_from(PATH_TO_LOCALDB).add_row(SHEET1, [
            request.form.get("username"),
            datetime2date(datetime.today()),
            request.form.get("start_time"),
            request.form.get("end_time"),
        ])

    elif "go" in request.form or "hold" in request.form:
        # print(datetime.now())

        act = "go" if "go" in request.form else "hold"

        LocalSheet.read_from(PATH_TO_LOCALDB).add_row(SHEET2, [
            request.form.get("username"),
            act,
            datetime2date(datetime.today()),
            datetime2time(datetime.now()),
        ])
