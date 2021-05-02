import pytz

APP_PATH = "./studytimeboard"
PATH_TO_LOCALDB = "./studytimeboard/data/db"
PATH_TO_DB_STATUS = "db_status.txt"
# PATH_TO_BARCHART = "static/charts/barchart.png"

# table name and sheet name for google sheet
STUDY_TIME_TABLE_NAME = "record_study_time"
SHEET1 = "duration"
SHEET2 = "event"
SHEET_EVENTS = "data"
SHEET_EVENTS_DEBUG = "data_debug"
SHEET_USERBANK = "userbank"
SHEET_USERBANK_DEBUG = "userbank_debug"

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
USERNAME = "username"
PASSWORD = "password"
N_STARS = "n_stars"

# analysis columns
MINUTES = "minutes"
WEEKDAY = "weekday"
ID_WEEK = "id_week"
ORDERED_WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
WEEKDAY_COLORS = ["tab:pink", "tab:purple", "tab:blue", "tab:cyan", "tab:green", "tab:olive", "tab:orange"]


TZ = pytz.timezone('Europe/Berlin')

# constants
SOMEONE = "someone"
UNKNOWN = "unknown"
STUDY_USERS = "studying_users"
INITIED = "initialized"
UNBORN = "unborn"
GROUPATTR = "groupAttr"

class FlashMessages:
    UNAUTHENTICATED = "User not authenticated, " \
                   "please login or register one on the right top corner."
    NO_SUCH_USER = "Username not registered, " \
                   "please try the name in the leaderboard or register one on the right top corner."
    PASSWD_INCORRECT = "Wrong password. Contact us if you forget the password."
    REGISTERED_USER = "Sorry, this username has been registered, try another one please. "
    TOO_MUCH_USERS = "Sorry, in beta stage we have reach the limit of max amount of users. " \
                     "You are welcome to contact us to help you sign up regardless of the limit."

    WRONG_DURATION = "there is something with the input of your duration, try something like 09:00 or 22:31"

    @staticmethod
    def NO_SUCH_FUNC(function_name):
        return 'Sorry, {} function is not open yet. ' \
               'You are very welcome to join the develop team to speed up the process'.format(function_name)

    @staticmethod
    def WELCOME_NEW_USER(username):
        return "hi, {}. Welcome to study-time-board, you are successfully regiseterd, now please login".format(username)
