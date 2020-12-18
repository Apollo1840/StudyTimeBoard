from flask import Flask, render_template, request

import os
from datetime import datetime

# internal utils

from .app_utils import *
from .constant import *


app = Flask(__name__)

@app.route('/')
def main_page():

    # rm the folder to avoid multiple rendering data explode
    clean_chart_folder()

    df_all = get_the_basic_dataframe()

    # transfer it to plot-ready data table
    df_min_all = to_minutes_leaderboard(df_all)
    df_min_last_week = to_minutes_leaderboard(to_this_week_table(df_all))

    # add datetime time: for nothing, if we already remove the chart folder
    chart_name, img_format = os.path.split(PATH_TO_BARCHART)[1].split(".")
    new_chart_name = "{}_{}.{}".format(chart_name, datetime.now().strftime('%H_%M_%S'), img_format)

    # component 1: the last week bar chart
    path_to_chart_last_week = os.path.join(os.path.dirname(PATH_TO_BARCHART), "last_week_" + new_chart_name)
    plot_the_bar_chart(df_min_last_week, output_path=path_to_chart_last_week)

    # component 2: the bar charts
    path_to_chart_all = os.path.join(os.path.dirname(PATH_TO_BARCHART), "all_" + new_chart_name)
    plot_the_bar_chart(df_min_all, output_path=path_to_chart_all)

    # component 3: name_winner and duration_str
    name_winner = list(df_min_all[NAME])[0]
    duration_str = min2duration_str(list(df_min_all[MINUTES])[0])

    return render_template('index.html',
                           path_to_chart_last_week=path_to_chart_last_week,
                           path_to_chart_all=path_to_chart_all,
                           name_winner=name_winner,
                           duration_str=duration_str)


@app.route('/about')
def about_page():
    return render_template('about.html')


@app.route('/personal_analysis', methods=['GET', 'POST'])
def personal_analysis_page():
    # rm the folder to avoid multiple rendering data explode
    clean_chart_folder()

    no_such_user = False

    if request.method == 'POST':  # this block is only entered when the form is submitted
        username = request.form.get('username')

        df_all = get_the_basic_dataframe()

        if username in df_all[NAME].unique():
            df_user = df_all.loc[df_all[NAME] == username, :]
            df_user_minutes = to_minutes_by_day_table(df_user)

            path_umd = path_to_chart_user_min_by_day(username)
            plot_hours_per_day(df_user_minutes, output_path=path_umd)

            path_use = path_to_chart_user_study_events(username)
            plot_study_events(df_user, output_path=path_use)

            return render_template('personal_analysis.html',
                                   username=username,
                                   path_umd=path_umd,
                                   path_use=path_use)
        else:
            no_such_user = True

    if no_such_user:
        name_warning = ""
    else:  # has such user
        name_warning = "visibility: hidden"

    return render_template('personal_analysis_login.html', name_warning=name_warning)




