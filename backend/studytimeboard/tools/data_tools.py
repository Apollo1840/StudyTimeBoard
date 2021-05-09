from datetime import datetime
import os
import numpy as np


def date2datetime(time: str):
    try:
        return datetime.strptime(str(time), "%Y.%m.%d")
    except:
        # print("in data analysising: invalid input:", time)
        return None


def time2datetime(time: str):
    try:
        return datetime.strptime(str(time), "%H:%M")
    except:
        # print("in data analysising: invalid input:", time)
        return None


def varify_time(time_str):
    # todo: modify this stupid check
    items = time_str.split(":")
    if len(items) != 2:
        return False
    hour, min = items
    if len(hour) != 2 or len(min) != 2:
        return False
    return True


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


def exponential_moving_average(a, theta=0.5):
    b = [a[i] for i in range(len(a))]
    for i in range(1, len(a)):
        b[i] = (1 - theta) * b[i - 1] + theta * a[i]
    return b


def along_average(a):
    return [np.mean(a[0:i]) if i > 0 else a[0] for i in range(len(a))]
