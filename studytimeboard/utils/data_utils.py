from datetime import datetime
import os


def time2datetime(time: str):
    return datetime.strptime(str(time), "%H:%M")


def datetime2time(time: datetime.time):
    return datetime.strftime(time, "%H:%M")


def datetime2date(time: datetime.time):
    return datetime.strftime(time, "%Y.%m.%d")


def min2duration_str(minutes):
    duration_str = ""
    hour = int(minutes // 60)
    min = int(minutes % 60)

    if hour != 0:
        if hour == 1:
            duration_str += "1 hour"
        else:
            duration_str += "{} hours".format(hour)

    if min != 0:
        duration_str += " {} minutes".format(min)

    return duration_str


def extract_chartname_addtime(path_str):
    chart_name, img_format = os.path.split(path_str)[1].split(".")
    new_chart_name = "{}_{}.{}".format(chart_name, datetime.now().strftime('%H_%M_%S'), img_format)
    return new_chart_name
