import pytz

APP_PATH = "./studytimeboard"
PATH_TO_LOCALDB = "./studytimeboard/data/db"

STUDY_TIME_TABLE_NAME = "record_study_time"

SHEET1 = "duration"
SHEET2 = "event"
SHEET3 = "data"
DEBUG_SHEET = "data_debug"

# sheet 1 columns
NAME = "name"
DATE = "date"
START_TIME = "start_time"
END_TIME = "end_time"
START_TIME_DT = "start_time_datetime"
END_TIME_DT = "end_time_datetime"
DATE_DT = "date_datetime"
TODAY_OR_NOT = "today_or_not"
IS_TODAY = "is_today"
NOT_TODAY = "not_today"

# sheet 2 columns
ACT = "act"
ACT_START = "go"
ACT_END = "hold"
TIME = "time"

# sheet 3 columns


# analysis columns
MINUTES = "minutes"
WEEKDAY = "weekday"
ORDERED_WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
WEEKDAY_COLORS = ["tab:pink", "tab:purple", "tab:blue", "tab:cyan", "tab:green", "tab:olive", "tab:orange"]

PATH_TO_BARCHART = "static/charts/barchart.png"

REGISTED_USERS = [
    "Congyu",
    "Shangsu",
    "Nia.Dai",
    "Amber",
    "LiuYang",
    "Lanlan",
    "L.path",
    "Hanyu",
    "Ye Liu",
    "Chen Dong",
    "Diqing",
    "vivi",
    "Vicky.Huang",
    
    "Alpha",
    "Beta",
    "Theta",
]

SOMEONE = "someone"
UNKNOWN = "unknown"

TZ = pytz.timezone('Europe/Berlin')


class FlashMessages:
    NO_SUCH_USER = "Username not registered, please try the name in the leaderboard or register one on the right top corner"

    @staticmethod
    def NO_SUCH_FUNC(function_name):
        return 'Sorry, {} function is not open yet. ' \
               'You are very welcome to join the develop team to speed up the process'.format(function_name)
