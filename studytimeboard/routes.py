# external utils
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import login_user, current_user, logout_user, login_required

# internal utils
from .app_utils import *
from .constant import *
from studytimeboard import app
from studytimeboard.models import User


@app.route('/', methods=["GET", "POST"])
@app.route("/home", methods=["GET", "POST"])
def home():
    # handle the time input
    if request.method == "POST":
        if current_user.is_authenticated:
            username = current_user.username
        else:
            username = request.form.get("username")

        if username in REGISTED_USERS:
            parse_request_to_db(request)

    # show the charts:

    # rm the folder to avoid multiple rendering data explode
    clean_chart_folder()

    df_all = get_the_basic_dataframe()

    # transfer it to plot-ready data table
    df_min_last_week = to_minutes_leaderboard(to_this_week_table(df_all))

    # add datetime time: for nothing, if we already remove the chart folder
    new_chart_name = extract_chartname_addtime(PATH_TO_BARCHART)

    # last week dashboard
    name_winner = list(df_min_last_week[NAME])[0]
    duration_str = min2duration_str(list(df_min_last_week[MINUTES])[0])

    path_to_chart_last_week = os.path.join(os.path.dirname(PATH_TO_BARCHART), "last_week_" + new_chart_name)
    plot_the_bar_chart(df_min_last_week, output_path=path_to_chart_last_week)

    return render_template('home.html',
                           path_to_chart_last_week=path_to_chart_last_week,
                           name_winner=name_winner,
                           duration_str=duration_str)


@app.route("/leaderboard")
def leaderboard():
    # rm the folder to avoid multiple rendering data explode
    clean_chart_folder()

    df_all = get_the_basic_dataframe()

    # transfer it to plot-ready data table
    df_min_all = to_minutes_leaderboard(df_all)
    df_min_last_week = to_minutes_leaderboard(to_this_week_table(df_all))

    # add datetime time: for nothing, if we already remove the chart folder
    new_chart_name = extract_chartname_addtime(PATH_TO_BARCHART)

    # component 1: the last week bar chart
    name_winner_lastweek = list(df_min_last_week[NAME])[0]
    duration_str_lastweek = min2duration_str(list(df_min_last_week[MINUTES])[0])

    path_to_chart_last_week = os.path.join(os.path.dirname(PATH_TO_BARCHART), "last_week_" + new_chart_name)
    plot_the_bar_chart(df_min_last_week, output_path=path_to_chart_last_week)

    # component 2: the entire time bar charts
    name_winner = list(df_min_all[NAME])[0]
    duration_str = min2duration_str(list(df_min_all[MINUTES])[0])

    path_to_chart_all = os.path.join(os.path.dirname(PATH_TO_BARCHART), "all_" + new_chart_name)
    plot_the_bar_chart(df_min_all, output_path=path_to_chart_all)

    return render_template('leaderboard.html',
                           path_to_chart_last_week=path_to_chart_last_week,
                           path_to_chart_all=path_to_chart_all,
                           name_winner_lastweek=name_winner_lastweek,
                           duration_str_lastweek=duration_str_lastweek,
                           name_winner=name_winner,
                           duration_str=duration_str)


@app.route('/analysis')
def analysis():
    if current_user.is_authenticated:
        username = current_user.username

        # rm the folder to avoid multiple rendering data explode
        clean_chart_folder()

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
        return redirect(url_for("login"))


@app.route("/login", methods=['GET', 'POST'])
def login():
    # if current_user.is_authenticated:
    #    return redirect(url_for('home'))

    # form = LoginForm()
    # if form.validate_on_submit():
    if request.method == 'POST':  # this block is only entered when the form is submitted
        username = request.form.get('username')

        if username in REGISTED_USERS:
            user = User(username=username)
            login_user(user, remember=True)

            return redirect(url_for('home'))
        else:
            flash(FlashMessages.NO_SUCH_USER, "danger")
            return render_template('login.html')  # no such user

    else:
        return render_template('login.html')


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))


@app.route('/register')
def register():
    flash(FlashMessages.NO_SUCH_FUNC("registration"), 'danger')
    return render_template('home.html')


@app.route('/about')
def about():
    return render_template('about.html')
