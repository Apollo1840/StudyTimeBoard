"""

functions from a df to another df. close relate to this particular project.

"""

import os
from datetime import datetime, timedelta
import seaborn as sns
import pandas as pd

from ..tools.data_tools import *
from ..constant import *
from ..models import StudyEvent


def add_analysis_columns(df):
    df[START_TIME_DT] = df[START_TIME].apply(time2datetime)
    df[END_TIME_DT] = df[END_TIME].apply(time2datetime)
    df[MINUTES] = [(t_end - t_start).seconds / 60 for t_start, t_end in zip(df[START_TIME_DT], df[END_TIME_DT])]

    df[DATE_DT] = pd.to_datetime(df[DATE])
    df[ID_WEEK] = df[DATE_DT].dt.isocalendar().week
    df[YEAR] = df[DATE_DT].dt.isocalendar().year
    df[WEEKDAY] = df[DATE_DT].dt.day_name()

    return df


def add_istoday_column(df):
    today_str = datetime2date(datetime.now(TZ))
    df.loc[:, TODAY_OR_NOT] = [IS_TODAY if i else NOT_TODAY for i in df[DATE] == today_str]
    return df


def df_eve2df_dur(df_eve):
    dur = []  # tuple of (name, date, start_time, end_time)

    studying_dict = {}  # name: Study_event
    for _, row in df_eve.iterrows():
        if row[NAME] not in studying_dict:
            # expect to be act_start
            if row[ACT] == ACT_START:
                studying_dict.update({row[NAME]: StudyEvent(start_time=row[TIME], name=row[NAME], date=row[DATE])})

            else:  # row[ACT] == ACT_END  -> close a non.existed event
                study_event = StudyEvent(end_time=row[TIME])
                dur.append((row[NAME], row[DATE], study_event.default_start_time, study_event.end_time))

        else:  # row[NAME] in studying_dict
            study_event: StudyEvent = studying_dict[row[NAME]]

            # expect to be act_end
            if row[ACT] == ACT_END:
                study_event.end_time = row[TIME]

                # assert study_event.date == row[DATE]
                dur.append((study_event.name, study_event.date, study_event.start_time, study_event.end_time))
                studying_dict.pop(study_event.name)

            else:  # row[ACT] == ACT_START  -> a new event on a not-closed event

                # assert study_event.date == row[DATE]
                dur.append((study_event.name, study_event.date, study_event.start_time, study_event.default_end_time))
                studying_dict.update({row[NAME]: StudyEvent(start_time=row[TIME], name=row[NAME], date=row[DATE])})

    for study_event in studying_dict.values():
        if study_event.end_time is None:
            dur.append((study_event.name, study_event.date, study_event.start_time, study_event.default_end_time))

    return pd.DataFrame(dur, columns=[NAME, DATE, START_TIME, END_TIME])


def df_merge_dur_eve(df_dur, df_eve):
    df_dur2 = df_eve2df_dur(df_eve)
    df = pd.concat([df_dur, df_dur2])
    return df


def to_minutes_leaderboard(df):
    """

    :param df:
    :return:
    """

    df_r = df.loc[df[END_TIME] != UNKNOWN, :]
    df_r = df_r.groupby(NAME)[MINUTES].apply(sum)
    df_r = df_r.reset_index()
    df_r = df_r.sort_values(by=MINUTES, ascending=False)

    return df_r


def to_this_week_table(df):
    """


    :param df:
    :return:
    """

    # get this weeks dataframe
    d = datetime.today()
    sunday_offset = (d.weekday() - 6) % 7
    sunday_offset = sunday_offset if sunday_offset != 0 else 7
    last_sunday = d - timedelta(days=sunday_offset)

    last_sunday = pd.Timestamp(last_sunday)
    filter_mask = df[DATE_DT] > last_sunday
    filtered_df = df[filter_mask]

    # some post preprocess steps
    filtered_df = add_istoday_column(filtered_df)
    filtered_df = filtered_df.loc[filtered_df[END_TIME] != UNKNOWN, :]

    return filtered_df


def to_minutes_by_day_table(df):
    """

    :param df:
    :return:
    """

    df_r = df.groupby(DATE)[MINUTES].apply(sum)
    df_r = df_r.reset_index()

    # df_r[DATE_DT] = pd.to_datetime(df_r[DATE])
    # df_r[WEEKDAY] = df_r[DATE_DT].dt.week

    return df_r