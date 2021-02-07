"""

plot_...() functions

"""

import os
from datetime import datetime, timedelta
import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.dates import DateFormatter
from matplotlib.dates import HourLocator

plt.style.use("seaborn")

# from mpld3 import fig_to_html
from ..constant import *
from ..tools.data_tools import exponential_moving_average, along_average


# visualization

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


def plot_the_bar_chart_with_weekday(df, output_path="sample.png"):
    def week_color():
        for c in WEEKDAY_COLORS:
            yield c

    fig = plt.figure(figsize=(10, 8))
    starborn_barhplot_stacked(MINUTES, NAME, WEEKDAY, data=df,
                              hues=ORDERED_WEEKDAYS,
                              show=False,
                              color_palette=week_color())
    plt.title("The study time of the candidates (in minutes)")

    fig.savefig(os.path.join(APP_PATH, output_path))


# personal visualization

def plot_hours_per_day(df, output_path="sample.png", **plot_kwargs):
    fig = plt.figure(figsize=(10, 8))
    sns.barplot(y=DATE, x=MINUTES, data=df, **plot_kwargs)
    plt.axvline(x=8 * 60, color="r", ls=":", alpha=0.4)
    plt.title("The study time of every day")

    fig.savefig(os.path.join(APP_PATH, output_path))


def plot_hours_per_day_average(df, output_path="sample.png"):
    HOURS = "hours"
    HOURS_AVG = "hours_avg"
    HOURS_AVG_EXP = "hours_expo_avg"

    df[HOURS] = df[MINUTES] / 60
    df[HOURS_AVG] = along_average(df[HOURS])
    df[HOURS_AVG_EXP] = exponential_moving_average(df[HOURS], 0.1)

    fig = plt.figure(figsize=(10, 8))
    plt.plot(df[DATE], df[HOURS], "-.", alpha=0.1, label="exact")
    plt.plot(df[DATE], df[HOURS_AVG], alpha=0.2, linewidth=10, label="average")
    plt.plot(df[DATE], df[HOURS_AVG_EXP], label="average_exponential")
    plt.axhline(y=8, color="r", ls=":", alpha=0.4)
    plt.xticks(range(0, len(df) + 1, 7))
    plt.xticks(rotation=45)
    plt.legend()
    plt.title("The (exponential) average study time of the candidates (in hours)")

    fig.savefig(os.path.join(APP_PATH, output_path))
    # return fig_to_html(fig)


def plot_study_events(df, output_path="sample.png"):
    date = df[DATE].tolist()
    ts = df[START_TIME_DT].tolist()
    te = df[END_TIME_DT].tolist()

    fig = plt.figure(figsize=(10, 8))
    ax = plt.subplot()

    for i in range(len(df)):
        if te[i] > ts[i]:
            ax.plot([date[i], date[i]], [ts[i], te[i]], ".-", linewidth=15)

    ax.yaxis.set_major_locator(HourLocator())
    ax.yaxis.set_major_formatter(DateFormatter('%H:%M'))

    plt.axhline(y=datetime.strptime("08:00", "%H:%M"), color="r", ls=":", alpha=0.5)
    plt.axhline(y=datetime.strptime("12:30", "%H:%M"), color="r", ls=":", alpha=0.5)
    plt.axhline(y=datetime.strptime("18:30", "%H:%M"), color="r", ls=":", alpha=0.5)

    plt.xticks(rotation=45)
    plt.ylim((datetime.strptime("00:00", "%H:%M"), datetime.strptime("23:59", "%H:%M")))
    plt.gca().invert_yaxis()

    plt.title("The study events of the candidate")
    fig.savefig(os.path.join(APP_PATH, output_path))


def plot_study_events_overlap(df, output_path="sample.png"):
    ts = df[START_TIME_DT].tolist()
    te = df[END_TIME_DT].tolist()

    weekdaylist = []
    week_batch_index = []
    week_batch = []
    for i, weekday in enumerate(df[ID_WEEK].tolist()):
        if weekday not in weekdaylist:
            week_batch_index.append(week_batch)
            week_batch = [i]
            weekdaylist.append(weekday)
        else:
            week_batch.append(i)
    week_batch_index.append(week_batch)
    week_batch_index = week_batch_index[1:]

    fig = plt.figure(figsize=(10, 8))
    ax = plt.subplot()

    for j, batch_index in enumerate(week_batch_index[:-1]):
        for i in batch_index:
            if te[i] > ts[i]:
                ax.plot([weekdaylist[j], weekdaylist[j]], [ts[i], te[i]], "-", alpha=0.12, color="b",
                        solid_capstyle="butt", linewidth=10)
    for i in week_batch_index[-1]:
        if te[i] > ts[i]:
            ax.plot([weekdaylist[-1], weekdaylist[-1]], [ts[i], te[i]], "-", alpha=0.12, color="r",
                    solid_capstyle="butt", linewidth=10)

    ax.yaxis.set_major_locator(HourLocator())
    ax.yaxis.set_major_formatter(DateFormatter('%H:%M'))

    plt.axhline(y=datetime.strptime("08:00", "%H:%M"), color="r", ls=":", alpha=0.5)
    plt.axhline(y=datetime.strptime("12:30", "%H:%M"), color="r", ls=":", alpha=0.5)
    plt.axhline(y=datetime.strptime("18:30", "%H:%M"), color="r", ls=":", alpha=0.5)

    plt.xticks(rotation=45)
    plt.ylim((datetime.strptime("00:00", "%H:%M"), datetime.strptime("23:59", "%H:%M")))
    plt.gca().invert_yaxis()

    plt.title("The study events of the candidate per week (red is this week)")
    fig.savefig(os.path.join(APP_PATH, output_path))


def plot_study_events_singleday(df, output_path="sample.png"):
    ts = df[START_TIME_DT].tolist()
    te = df[END_TIME_DT].tolist()

    fig = plt.figure(figsize=(20, 1))
    ax = plt.subplot()

    for i in range(len(df)):
        if te[i] > ts[i]:
            ax.plot([ts[i], te[i]], [0, 0], ".-", linewidth=20)

    ax.xaxis.set_major_locator(HourLocator())
    ax.xaxis.set_major_formatter(DateFormatter('%H:%M'))

    plt.axvline(x=datetime.strptime("08:00", "%H:%M"), color="r", ls=":", alpha=0.5)
    plt.axvline(x=datetime.strptime("12:30", "%H:%M"), color="r", ls=":", alpha=0.5)
    plt.axvline(x=datetime.strptime("18:30", "%H:%M"), color="r", ls=":", alpha=0.5)

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
        if sum(xs) > 0:
            if color_palette is not None:
                plt.barh(ys, xs, left=last_xs, label=huei, color=next(color_palette))
            else:
                plt.barh(ys, xs, left=last_xs, label=huei)
        last_xs = [last_xs[i] + xs[i] for i in range(len(ys))]

    plt.ylabel(y)
    plt.legend()

    if show:
        plt.show()
