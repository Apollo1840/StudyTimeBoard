import os
import shutil

from utils.gsheet import GoogleSheet
from constant import *
from data_analysis import *


def clean_chart_folder():
    bar_chart_folder = os.path.dirname(PATH_TO_BARCHART)
    if os.path.exists(bar_chart_folder):
        shutil.rmtree(bar_chart_folder)
    os.makedirs(os.path.dirname(PATH_TO_BARCHART))


def get_the_basic_dataframe():
    """

    :return: dataframe, each row is a clip of study duration(event)
    """

    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    df_dur = gs.sheet(sheet_name=SHEET1, least_col_name=START_TIME)
    df_eve = gs.sheet(sheet_name=SHEET2, least_col_name=NAME)
    df = merge_dur_eve(df_dur, df_eve)

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
