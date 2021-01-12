import os
from datetime import datetime, timedelta
import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.dates import DateFormatter
from matplotlib.dates import HourLocator

plt.style.use("seaborn")

# from mpld3 import fig_to_html

from .constant import *
from .utils.data_utils import *


def add_analysis_columns(df):
    df[START_TIME_DT] = df[START_TIME].apply(time2datetime)
    df[END_TIME_DT] = df[END_TIME].apply(time2datetime)
    df[MINUTES] = [(t_end - t_start).seconds / 60 for t_start, t_end in zip(df[START_TIME_DT], df[END_TIME_DT])]

    df[DATE_DT] = pd.to_datetime(df[DATE])
    df[WEEKDAY] = df[DATE_DT].dt.day_name()

    return df


def add_istoday_column(df):
    today_str = datetime2date(datetime.today())
    df[TODAY_OR_NOT] = [IS_TODAY if i else NOT_TODAY for i in df[DATE] == today_str]
    return df


def merge_dur_eve(df_dur, df_eve):
    df_dur2 = df_eve2df_dur(df_eve)
    return pd.concat([df_dur, df_dur2])


class StudyEvent:

    def __init__(self, start_time: str = None, end_time: str = None, name=None, date=None):
        self.start_time = start_time
        self.end_time = end_time
        self.name = name
        self.date = date

    @property
    def default_end_time(self):
        return datetime2time(time2datetime(self.start_time) + timedelta(minutes=30))

    @property
    def default_start_time(self):
        return datetime2time(time2datetime(self.end_time) - timedelta(minutes=30))


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


def to_minutes_leaderboard(df):
    """

    :param df:
    :return:
    """

    df_r = df.groupby(NAME)[MINUTES].apply(sum)
    df_r = df_r.reset_index()
    df_r = df_r.sort_values(by=MINUTES, ascending=False)

    return df_r


def to_this_week_table(df):
    """


    :param df:
    :return:
    """

    d = datetime.today()
    sun_offset = (d.weekday() - 6) % 7
    sun_offset = sun_offset if sun_offset != 0 else 7
    last_sunday = d - timedelta(days=sun_offset)

    last_sunday = pd.Timestamp(last_sunday)
    filter_mask = df[DATE_DT] > last_sunday
    filtered_df = df[filter_mask]

    filtered_df = add_istoday_column(filtered_df)

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


# visualization

def plot_hours_per_day(df, output_path="sample.png", **plot_kwargs):
    fig = plt.figure(figsize=(10, 8))
    sns.barplot(y=DATE, x=MINUTES, data=df, **plot_kwargs)
    plt.axvline(x=8 * 60, color="r", ls=":")
    plt.title("The study time of every day")

    fig.savefig(os.path.join(APP_PATH, output_path))


def plot_the_bar_chart(df, output_path="sample.png"):
    sns.set_style("darkgrid")

    fig = plt.figure(figsize=(10, 8))
    if df.shape[0] > 0:
        sns.barplot(data=df, y=NAME, x=MINUTES)
        plt.title("The study time of the candidates (in minutes)")

    fig.savefig(os.path.join(APP_PATH, output_path))
    # return fig_to_html(fig)


def plot_the_bar_chart_with_today(df, output_path="sample.png"):
    def grow_color():
        for c in ["royalblue", "turquoise"]:
            yield c

    sns.set_style("darkgrid")

    fig = plt.figure(figsize=(10, 8))
    starborn_barhplot_stacked(MINUTES, NAME, TODAY_OR_NOT, data=df,
                              hues=[NOT_TODAY, IS_TODAY],
                              show=False,
                              color_palette=grow_color())
    plt.title("The study time of the candidates (in minutes)")

    fig.savefig(os.path.join(APP_PATH, output_path))


def plot_study_events(df, output_path="sample.png"):
    date = df[DATE].tolist()
    ts = df[START_TIME_DT].tolist()
    te = df[END_TIME_DT].tolist()

    fig = plt.figure(figsize=(10, 8))
    ax = plt.subplot()

    for i in range(len(df)):
        ax.plot([date[i], date[i]], [ts[i], te[i]], ".-", linewidth=15)

    ax.yaxis.set_major_locator(HourLocator())
    ax.yaxis.set_major_formatter(DateFormatter('%H:%M'))

    plt.axhline(y=datetime.strptime("08:00", "%H:%M"), color="r", ls=":")
    plt.axhline(y=datetime.strptime("12:30", "%H:%M"), color="r", ls=":")
    plt.axhline(y=datetime.strptime("18:30", "%H:%M"), color="r", ls=":")

    plt.xticks(rotation=45)
    plt.ylim((datetime.strptime("00:00", "%H:%M"), datetime.strptime("23:59", "%H:%M")))
    plt.gca().invert_yaxis()

    plt.title("The study events of the candidate")
    fig.savefig(os.path.join(APP_PATH, output_path))


def plot_study_events_singleday(df, output_path="sample.png"):
    ts = df[START_TIME_DT].tolist()
    te = df[END_TIME_DT].tolist()

    fig = plt.figure(figsize=(20, 1))
    ax = plt.subplot()

    for i in range(len(df)):
        ax.plot([ts[i], te[i]], [0, 0], ".-", linewidth=20)

    ax.xaxis.set_major_locator(HourLocator())
    ax.xaxis.set_major_formatter(DateFormatter('%H:%M'))

    plt.axvline(x=datetime.strptime("08:00", "%H:%M"), color="r", ls=":")
    plt.axvline(x=datetime.strptime("12:30", "%H:%M"), color="r", ls=":")
    plt.axvline(x=datetime.strptime("18:30", "%H:%M"), color="r", ls=":")

    plt.xlim((datetime.strptime("00:00", "%H:%M"), datetime.strptime("23:59", "%H:%M")))

    plt.xticks([datetime.strptime("{:02d}:00".format(hour), "%H:%M") for hour in range(0, 24)], fontsize=18)
    plt.yticks([])

    plt.tight_layout()

    fig.savefig(os.path.join(APP_PATH, output_path))


def starborn_barhplot_stacked(x, y, hue, data, sort_by_x=True, ys=None, hues=None, show=True,
                              color_palette=None):
    """

    > df_test = pd.DataFrame({
            "x": [20, 35, 30, 35, 27],
            "y": ['G1', 'G1', 'G2', 'G2', 'G3'],
            "hue": ["stage1", "stage2", "stage1", "stage2","stage1"]
        })

    > barhplot_stacked("x", "y", "hue", df_test)


    """

    if sort_by_x:
        df_sort = data.groupby(y)[x].apply(sum)
        df_sort = df_sort.reset_index()
        df_sort = df_sort.sort_values(by=x, ascending=True)
        ys = df_sort[y]
    elif ys is None:
        ys = sorted(set(data[y]))

    if hues is None:
        hues = sorted(set(data[hue]))

    last_xs = [0 for _ in range(len(ys))]
    for huei in hues:
        xs = [sum(data.loc[(data[y] == yi) & (data[hue] == huei), x]) for yi in ys]

        if color_palette is not None:
            plt.barh(ys, xs, left=last_xs, label=huei, color=next(color_palette))
        else:
            plt.barh(ys, xs, left=last_xs, label=huei)

        last_xs = xs

    plt.ylabel(y)
    plt.legend()

    if show:
        plt.show()
