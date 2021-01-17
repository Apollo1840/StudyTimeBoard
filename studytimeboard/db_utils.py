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
    google_sheet_name = SHEET3

    @staticmethod
    def into_from_request(request, username, db=None):
        """
        into flask_sql as well as googlesheet

        :param request:
        :param username:
        :param db:
        :return:
        """

        # NOTE! sometimes, username is not in the request
        gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)

        # "go" and "hold" input form
        if ACT_START in request.form or ACT_END in request.form:
            act = ACT_START if ACT_START in request.form else ACT_END

            # “go"
            if act == ACT_START:

                date = datetime.now(TZ)
                start_time = datetime2time(datetime.now(TZ))

                df = gs.sheet(sheet_name=DataBaseAPI.google_sheet_name, least_col_name=START_TIME)
                study_rows = np.where((df[NAME] == username) & (df[END_TIME] == UNKNOWN))[0]
                if len(study_rows) >= 1:
                    study_index = int(study_rows[0])
                    gs.delete_row(DataBaseAPI.google_sheet_name, study_index + 2)  # google sheet include header as one row, so + 1,
                    # and it starts from 1, so + 1

                row = [username, datetime2date(date), start_time, UNKNOWN]
                gs.append_row(DataBaseAPI.google_sheet_name, row)

                study_event_studying = StudyEventDB.query.filter_by(username=username, end_time=UNKNOWN).first()
                if study_event_studying is not None:
                    db.session.delete(study_event_studying)
                    db.session.commit()

                study_event = StudyEventDB(username=username, date=date, start_time=start_time, end_time=UNKNOWN)
                db.session.add(study_event)
                db.session.commit()

            # ”hold"
            elif act == ACT_END:

                date = datetime.now(TZ)
                end_time = datetime2time(datetime.now(TZ))

                df = gs.sheet(sheet_name=DataBaseAPI.google_sheet_name, least_col_name=START_TIME)
                study_rows = np.where((df[NAME] == username) & (df[END_TIME] == UNKNOWN))[0]
                if len(study_rows) >= 1:
                    study_index = int(study_rows[0])
                    _, _, start_time, _ = df.iloc[study_index, :]

                    gs.delete_row(DataBaseAPI.google_sheet_name, study_index + 2)  # google sheet include header as one row, so + 1,
                    # and it starts from 1, so + 1

                    row = [username, datetime2date(date), start_time, end_time]
                    gs.append_row(DataBaseAPI.google_sheet_name, row)

                    study_event_studying = StudyEventDB.query.filter_by(username=username, end_time=UNKNOWN).first()
                    if study_event_studying is not None:
                        db.session.delete(study_event_studying)
                        db.session.commit()

                    study_event = StudyEventDB(username=username, date=date, start_time=start_time, end_time=end_time)
                    db.session.add(study_event)
                    db.session.commit()

        # whole time input form
        elif request.form.get(START_TIME) and request.form.get(END_TIME):
            # print(request.form.get("username"), request.form.get("start_time"), request.form.get("end_time"),)
            date = datetime.now(TZ)
            start_time = request.form.get(START_TIME)
            end_time = request.form.get(END_TIME)

            row = [username, datetime2date(date), start_time, end_time]
            gs.append_row(DataBaseAPI.google_sheet_name, row)

            study_event = StudyEventDB(username=username, date=date, start_time=start_time, end_time=end_time)
            db.session.add(study_event)
            db.session.commit()

    @staticmethod
    def init_from_gs(db):
        """
        should be used for database initialization

        :param db:
        :return:
        """
        gs = GoogleSheet.read_from(STUDY_TIME_TABLE_NAME)
        df = gs.sheet(sheet_name=DataBaseAPI.google_sheet_name)

        study_events = []
        for i, row in df.iterrows():
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
