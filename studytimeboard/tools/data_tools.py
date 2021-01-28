from datetime import datetime
import os


def date2datetime(time: str):
    try:
        return datetime.strptime(str(time), "%Y.%m.%d")
    except:
        print("invalid input:", time)
        return None


def time2datetime(time: str):
    try:
        return datetime.strptime(str(time), "%H:%M")
    except:
        print("invalid input:", time)
        return None


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
        if min == 1:
            duration_str += " 1 minute"
        else:
            duration_str += " {} minutes".format(min)

    return duration_str
