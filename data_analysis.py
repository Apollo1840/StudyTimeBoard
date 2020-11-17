from datetime import datetime
import seaborn as sns
import matplotlib.pyplot as plt

from constant import *


def time_to_datetime(time):
    return datetime.strptime(str(time), "%H:%M")


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
        duration_str += " {} minutes".format(min)

    return duration_str


def plot_the_bar_chart(df, output_path="sample.png"):

    # process the data table
    df[START_TIME_DT] = df[START_TIME].apply(time_to_datetime)
    df[END_TIME_DT] = df[END_TIME].apply(time_to_datetime)
    df[MINUTES] = [(t_end - t_start).seconds / 60 for t_start, t_end in zip(df[START_TIME_DT], df[END_TIME_DT])]

    # transfer it to plot-ready data table
    df_r = df.groupby(NAME)[MINUTES].apply(sum)
    df_r = df_r.reset_index()
    df_r = df_r.sort_values(by=MINUTES, ascending=False)

    sns.set_style("darkgrid")
    fig = plt.figure(figsize=(10, 10))
    sns.barplot(data=df_r, y=df_r[NAME], x=df_r[MINUTES])
    plt.title("The study time of the candidates (in minutes)")
    fig.savefig(output_path)

    return df_r
