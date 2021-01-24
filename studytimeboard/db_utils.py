import os
import shutil
import numpy as np
from tqdm import tqdm
import time

from .constant import *
from .path_manager import *
from .models import StudyEventDB
from .data_analysis import *
from .plotters import *
from .utils.gsheet import GoogleSheet


class DataBaseAPI:

    def __init__(self, backup_googlesheet=None):
        self.backup_googlesheet = backup_googlesheet

        if self.backup_googlesheet is not None:
            self.gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
            self.gsheet = self.gs.sheet(sheet_name=self.backup_googlesheet, least_col_name=START_TIME)

    def gsheet_appendrow(self, row):
        self.gs.append_row(self.backup_googlesheet, row)

    def gsheet_deleterow(self, index):
        self.gs.delete_row(self.backup_googlesheet, index + 2)
        # google sheet include header as one row, so + 1,
        # and it starts from 1, so + 1

    def into_from_request(self, request, username, db=None):
        """
        into flask_sql as well as googlesheet

        :param request:
        :param username:
        :param db:
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
                self.into_go(username, date, start_time, db)

            # ”hold"
            elif act == ACT_END:
                date = datetime.now(TZ)
                end_time = datetime2time(datetime.now(TZ))
                self.into_hold(username, date, end_time, db)

        # whole time input form
        elif request.form.get(START_TIME) and request.form.get(END_TIME):
            # print(request.form.get("username"), request.form.get("start_time"), request.form.get("end_time"),)
            date = datetime.now(TZ)
            start_time = request.form.get(START_TIME)
            end_time = request.form.get(END_TIME)
            self.into_duration(username, date, start_time, end_time, db)

    def into_go(self, username, date, start_time, db):

        # first backup, then add into DB, because backup has higher priority in this case
        if self.backup_googlesheet is not None:
            self.into_go_gs(username, date, start_time)

        # delete last "go"
        study_event_studying = StudyEventDB.query.filter_by(username=username, end_time=UNKNOWN).first()
        if study_event_studying is not None:
            db.session.delete(study_event_studying)
            db.session.commit()

        # add "go"
        study_event = StudyEventDB(username=username, date=date, start_time=start_time, end_time=UNKNOWN)
        db.session.add(study_event)
        db.session.commit()

    def into_go_gs(self, username, date, start_time):
        # delete last "go"
        df = self.gsheet
        study_rows = np.where((df[NAME] == username) & (df[END_TIME] == UNKNOWN))[0]
        if len(study_rows) >= 1:
            study_index = int(study_rows[0])
            self.gsheet_deleterow(study_index)

        # add "go"
        row = [username, datetime2date(date), start_time, UNKNOWN]
        self.gsheet_appendrow(row)

    def into_hold(self, username, date, end_time, db):

        # first backup, then add into DB, because backup has higher priority in this case
        if self.backup_googlesheet is not None:
            self.into_hold_gs(username, date, end_time)

        study_event_studying = StudyEventDB.query.filter_by(username=username, end_time=UNKNOWN).first()
        if study_event_studying is not None:

            # delete imcomplete study event and and new
            start_time = study_event_studying.start_time  # type: str

            db.session.delete(study_event_studying)
            db.session.commit()

            study_event = StudyEventDB(username=username, date=date, start_time=start_time, end_time=end_time)
            db.session.add(study_event)
            db.session.commit()

        else:
            print("there is no go event in flask_sql for {} , when someone clicked hold".format(username))

    def into_hold_gs(self, username, date, end_time):
        # delete imcomplete study event and and new
        df = self.gsheet
        study_rows = np.where((df[NAME] == username) & (df[END_TIME] == UNKNOWN))[0]
        if len(study_rows) >= 1:
            study_index = int(study_rows[0])
            _, _, start_time, _ = df.iloc[study_index, :]  # type: str

            self.gsheet_deleterow(study_index)

            row = [username, datetime2date(date), start_time, end_time]
            self.gsheet_appendrow(row)
        else:
            print("there is no go row in google sheet {} for {} , "
                  "when someone clicked hold".format(self.backup_googlesheet,
                                                     username))

    def into_duration(self, username, date, start_time, end_time, db):
        #  add start_end
        if self.backup_googlesheet is not None:
            self.into_duration_gs(username, date, start_time, end_time)

        study_event = StudyEventDB(username=username, date=date, start_time=start_time, end_time=end_time)
        db.session.add(study_event)
        db.session.commit()

    def into_duration_gs(self, username, date, start_time, end_time):
        row = [username, datetime2date(date), start_time, end_time]
        self.gsheet_appendrow(row)

    def init_from_gs(self, db):
        """
        should be used for database initialization

        :param db:
        :return:
        """

        study_events = []
        if self.backup_googlesheet is not None:
            for i, row in self.gsheet.iterrows():
                study_events.append(StudyEventDB(username=row[NAME],
                                                 date=date2datetime(row[DATE]),
                                                 start_time=row[START_TIME],
                                                 end_time=row[END_TIME]))

        # delete study events
        StudyEventDB.query.delete()
        db.session.commit()

        # load df to db
        db.session.add_all(study_events)
        db.session.commit()

    @staticmethod
    def out_as_dataframe():
        study_events = StudyEventDB.query.all()

        df_dict = {}
        df_dict[NAME] = [se.username for se in study_events]
        df_dict[DATE] = [datetime2date(se.date) for se in study_events]
        df_dict[START_TIME] = [se.start_time for se in study_events]
        df_dict[END_TIME] = [se.end_time for se in study_events]

        return pd.DataFrame(df_dict)


def read_data_from_db_gs1_gs2(db=None):
    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    df_dur = gs.sheet(sheet_name=SHEET1, least_col_name=START_TIME)
    df_eve = gs.sheet(sheet_name=SHEET2, least_col_name=NAME)

    # df = studyeventsdb2df(db)

    df_all = merge_dur_eve(df_dur, df_eve)
    return [df_all, df_eve]


def read_data_from_db_gs3(db):
    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    df = gs.sheet(sheet_name=SHEET3)
    return df


def add_gs1_gs2_to_gs3():
    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    df_dur = gs.sheet(sheet_name=SHEET1, least_col_name=START_TIME)
    df_eve = gs.sheet(sheet_name=SHEET2, least_col_name=NAME)

    df = merge_dur_eve(df_dur, df_eve)

    gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
    for i, row in tqdm(df.iterrows(), total=len(df)):
        gs.append_row(SHEET3, row.tolist())
        time.sleep(1.001)
