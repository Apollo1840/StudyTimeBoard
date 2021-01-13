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

from .constant import *
from .utils.data_utils import *


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
