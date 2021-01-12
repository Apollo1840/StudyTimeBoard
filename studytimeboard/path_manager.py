import os
from datetime import datetime, timedelta

from .constant import *


# path manager
def path_to_chart(chart_name):
    # add datetime

    _, img_format = os.path.split(PATH_TO_BARCHART)[1].split(".")  # filename.split(".")

    # reason to add time: no reason
    new_chart_name = "{}_{}.{}".format(chart_name, datetime.now().strftime('%H_%M_%S'), img_format)

    return os.path.join(os.path.dirname(PATH_TO_BARCHART), new_chart_name)


def path_to_chart_with_prefix(chart_prefix):
    new_chart_name = chart_prefix + "_" + extract_filename_addtime(PATH_TO_BARCHART)

    return os.path.join(os.path.dirname(PATH_TO_BARCHART), new_chart_name)


def path_to_chart_user_study_events(username):
    username = username.replace(" ", "_")
    return path_to_chart(username + "_se")


def path_to_chart_user_min_by_day(username):
    username = username.replace(" ", "_")
    return path_to_chart(username + "_md")


def path_to_chart_user_today_king(username):
    username = username.replace(" ", "_")
    return path_to_chart(username + "_today_king")


def extract_filename_addtime(path_str):
    file_name, file_format = os.path.split(path_str)[1].split(".")
    new_file_name = "{}_{}.{}".format(file_name, datetime.now().strftime('%H_%M_%S'), file_format)
    return new_file_name
