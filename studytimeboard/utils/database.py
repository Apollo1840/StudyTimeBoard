import os
import shutil
import numpy as np
from tqdm import tqdm
import time

from ..models import StudyEventDB, UserDB
from ..tools.gsheet import GoogleSheet

from .data_analysis import *


class BaseAPI():

    def into_go(self, username, date, start_time):
        raise NotImplemented

    def into_hold(self, username, date, end_time):
        raise NotImplemented

    def into_duration(self, username, date, start_time, end_time):
        raise NotImplemented

    def into_user(self, username, password):
        raise NotImplemented


class GSAPI(BaseAPI):

    def __init__(self, sheetname, deepest_col_name):
        self.sheetname = sheetname

        # for input
        self.gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)

        # for output
        self.gsheet = self.gs.sheet(sheet_name=self.sheetname, least_col_name=deepest_col_name)

    def _gsheet_appendrow(self, row):
        self.gs.append_row(self.sheetname, row)

    def _gsheet_deleterow(self, index):
        self.gs.delete_row(self.sheetname, index + 2)
        # google sheet include header as one row, so + 1,
        # and it starts from 1, so + 1

    def into_go(self, username, date, start_time):
        # delete last "go"
        df = self.gsheet
        study_rows = np.where((df[NAME] == username) & (df[END_TIME] == UNKNOWN))[0]
        if len(study_rows) >= 1:
            study_index = int(study_rows[0])
            self._gsheet_deleterow(study_index)

        # add "go"
        row = [username, datetime2date(date), start_time, UNKNOWN]
        self._gsheet_appendrow(row)

    def into_hold(self, username, date, end_time):
        # delete imcomplete study event and and new
        df = self.gsheet
        study_rows = np.where((df[NAME] == username) & (df[END_TIME] == UNKNOWN))[0]
        if len(study_rows) >= 1:
            study_index = int(study_rows[0])
            _, _, start_time, _ = df.iloc[study_index, :]  # type: str

            self._gsheet_deleterow(study_index)

            row = [username, datetime2date(date), start_time, end_time]
            self._gsheet_appendrow(row)
        else:
            print("there is no go row in google sheet {} for {} , "
                  "when someone clicked hold".format(self.sheetname,
                                                     username))

    def into_duration(self, username, date, start_time, end_time):
        row = [username, datetime2date(date), start_time, end_time]
        self._gsheet_appendrow(row)

    def into_user(self, username, password):
        row = [username, password]
        self._gsheet_appendrow(row)


class FlaskSQLAPI(BaseAPI):

    def __init__(self, db):
        self.db = db

    def into_go(self, username, date, start_time):
        # delete last "go"
        study_event_studying = StudyEventDB.query.filter_by(username=username, end_time=UNKNOWN).first()
        if study_event_studying is not None:
            self.db.session.delete(study_event_studying)
            self.db.session.commit()

        # add "go"
        study_event = StudyEventDB(username=username, date=date, start_time=start_time, end_time=UNKNOWN)
        self.db.session.add(study_event)
        self.db.session.commit()

    def into_hold(self, username, date, end_time):
        study_event_studying = StudyEventDB.query.filter_by(username=username, end_time=UNKNOWN).first()
        if study_event_studying is not None:

            # delete imcomplete study event and and new
            start_time = study_event_studying.start_time  # type: str

            self.db.session.delete(study_event_studying)
            self.db.session.commit()

            study_event = StudyEventDB(username=username, date=date, start_time=start_time, end_time=end_time)
            self.db.session.add(study_event)
            self.db.session.commit()

        else:
            print("there is no go event in flask_sql for {} , when someone clicked hold".format(username))

    def into_duration(self, username, date, start_time, end_time):
        study_event = StudyEventDB(username=username, date=date, start_time=start_time, end_time=end_time)
        self.db.session.add(study_event)
        self.db.session.commit()

    def into_user(self, username, password):
        user = UserDB(username=username, password=password)
        self.db.session.add(user)
        self.db.session.commit()

    def into_studyevents(self, study_events):
        self.db.session.add_all(study_events)
        self.db.session.commit()

    def into_users(self, users):
        self.db.session.add_all(users)
        self.db.session.commit()

    def delete_studyevents(self):
        StudyEventDB.query.delete()
        self.db.session.commit()

    def delete_users(self):
        UserDB.query.delete()
        self.db.session.commit()


class DataBaseAPI():
    gsapi_main = None
    gsapi_user = None

    def __init__(self, db, main_googlesheet_name=None, user_googlesheet_name=None):

        self.fsqlapi = FlaskSQLAPI(db)

        if main_googlesheet_name is not None:
            self.gsapi_main = GSAPI(sheetname=main_googlesheet_name, deepest_col_name=START_TIME)
        if user_googlesheet_name is not None:
            self.gsapi_user = GSAPI(sheetname=user_googlesheet_name, deepest_col_name=USERNAME)

    def into_from_request(self, request, username):
        """
        into flask_sql as well as googlesheet

        :param request:
        :param username:
        :return:
        """

        # NOTE! sometimes, username is not in the request

        # "go" and "hold" input form
        if ACT_START in request.form or ACT_END in request.form:
            act = ACT_START if ACT_START in request.form else ACT_END

            # “go"
            if act == ACT_START:
                date = datetime.now(TZ)
                start_time = datetime2time(datetime.now(TZ))
                self.into_go(username, date, start_time)

            # ”hold"
            elif act == ACT_END:
                date = datetime.now(TZ)
                end_time = datetime2time(datetime.now(TZ))
                self.into_hold(username, date, end_time)

        # whole time input form
        elif request.form.get(START_TIME) and request.form.get(END_TIME):
            # print(request.form.get("username"), request.form.get("start_time"), request.form.get("end_time"),)
            date = datetime.now(TZ)
            start_time = request.form.get(START_TIME)
            end_time = request.form.get(END_TIME)
            self.into_duration(username, date, start_time, end_time)

    def into_go(self, username, date, start_time):

        # first backup, then add into DB, because backup has higher priority in this case
        if self.gsapi_main is not None:
            self.gsapi_main.into_go(username, date, start_time)

        self.fsqlapi.into_go(username, date, start_time)

    def into_hold(self, username, date, end_time):

        # first backup, then add into DB, because backup has higher priority in this case
        if self.gsapi_main is not None:
            self.gsapi_main.into_hold(username, date, end_time)

        self.fsqlapi.into_hold(username, date, end_time)

    def into_duration(self, username, date, start_time, end_time):
        # first backup, then add into DB, because backup has higher priority in this case
        if self.gsapi_main is not None:
            self.gsapi_main.into_duration(username, date, start_time, end_time)

        self.fsqlapi.into_duration(username, date, start_time, end_time)

    def into_user(self, username, password):
        if self.gsapi_user is not None:
            self.gsapi_user.into_user(username, password)

        self.fsqlapi.into_user(username, password)

    def init_db(self, add_examples=False, add_users=False):

        self.init_empty()

        self.into_studyevents_from_gs()
        self.into_users_from_gs()

        # add examples
        if add_examples:
            self.into_some_examples()

        # add users
        if add_users:
            self.into_some_users()

    def into_studyevents_from_gs(self):
        study_events = []
        if self.gsapi_main is not None:
            print("load study events from google sheet {}".format(self.gsapi_main.sheetname))
            for i, row in self.gsapi_main.gsheet.iterrows():
                study_events.append(StudyEventDB(username=row[NAME],
                                                 date=date2datetime(row[DATE]),
                                                 start_time=row[START_TIME],
                                                 end_time=row[END_TIME]))
        self.fsqlapi.into_studyevents(study_events)

    def into_users_from_gs(self):
        users = []
        if self.gsapi_user is not None:
            existed_users = self.all_users()
            print("load users from google sheet {}".format(self.gsapi_user.sheetname))
            for i, row in self.gsapi_user.gsheet.iterrows():
                if row[USERNAME] not in existed_users:
                    users.append(UserDB(username=row[USERNAME], password=row[PASSWORD]))
        self.fsqlapi.into_users(users)

    def init_empty(self):
        self.fsqlapi.delete_studyevents()
        self.fsqlapi.delete_users()

    def into_some_examples(self):

        # load some example to db
        yesterday = datetime.today() - timedelta(days=1)
        yesterday2 = datetime.today() - timedelta(days=2)
        yesterday3 = datetime.today() - timedelta(days=3)

        self.into_duration(username="Alpha",
                           date=yesterday3,
                           start_time="08:00",
                           end_time="12:00")

        self.into_duration(username="Alpha",
                           date=yesterday,
                           start_time="08:00",
                           end_time="12:00")

        self.into_duration(username="Beta",
                           date=yesterday3,
                           start_time="14:00",
                           end_time="16:00")

        self.into_duration(username="Beta",
                           date=yesterday2,
                           start_time="14:00",
                           end_time="16:00")

        self.into_duration(username="Beta",
                           date=yesterday,
                           start_time="11:00",
                           end_time="12:00")

        self.into_duration(username="Beta",
                           date=datetime.today(),
                           start_time="07:00",
                           end_time="12:00")

        self.into_duration(username="Theta",
                           date=datetime.today(),
                           start_time="08:00",
                           end_time="19:00")

        self.into_go(username="Theta",
                     date=datetime.today(),
                     start_time="20:00")

    def into_some_users(self):
        self.into_user(username="Alpha", password="1234")
        self.into_user(username="Beta", password="1234")
        self.into_user(username="Theta", password="1234")

    @staticmethod
    def out_as_dataframe():
        study_events = StudyEventDB.query.all()

        df_dict = dict()
        df_dict[NAME] = [se.username for se in study_events]
        df_dict[DATE] = [datetime2date(se.date) for se in study_events]
        df_dict[START_TIME] = [se.start_time for se in study_events]
        df_dict[END_TIME] = [se.end_time for se in study_events]

        return pd.DataFrame(df_dict)

    @staticmethod
    def all_users():
        return [user.username for user in UserDB.query.all()]


def read_data_from_db_gs1_gs2(db=None):
    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    df_dur = gs.sheet(sheet_name=SHEET1, least_col_name=START_TIME)
    df_eve = gs.sheet(sheet_name=SHEET2, least_col_name=NAME)

    # df = studyeventsdb2df(db)

    df_all = df_merge_dur_eve(df_dur, df_eve)
    return [df_all, df_eve]


def read_data_from_db_gs3(db):
    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    df = gs.sheet(sheet_name=SHEET_EVENTS)
    return df


def add_gs1_gs2_to_gs3():
    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    df_dur = gs.sheet(sheet_name=SHEET1, least_col_name=START_TIME)
    df_eve = gs.sheet(sheet_name=SHEET2, least_col_name=NAME)

    df = df_merge_dur_eve(df_dur, df_eve)

    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    for i, row in tqdm(df.iterrows(), total=len(df)):
        gs.append_row(SHEET_EVENTS, row.tolist())
        time.sleep(1.001)
