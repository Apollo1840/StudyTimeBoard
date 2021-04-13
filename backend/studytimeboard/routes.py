"""

    UseCase design & Display information generation through app_utils.py ( info_...() )

    JSON API Style: JSend https://github.com/omniti-labs/jsend
    example 1:
    {
        status : "success",
        data : { "post" : { "id" : 2, "title" : "Another blog post", "body" : "More content" }， “tail”： “1234”}
    }
    example 2:
    {
        "status" : "error",
        "message" : "Unable to communicate with database"
    }

"""

# external utils
import numpy as np
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import login_user, current_user, logout_user, login_required
import json

# internal utils
from . import app, dbapi, logger
from .constant import FlashMessages
from .app_utils import *


@app.route('/', methods=["GET", "POST"])
@app.route("/home", methods=["GET", "POST"])
def home():
    if current_user.is_authenticated:
        username = current_user.username
    else:
        username = SOMEONE

    # 0. handle the time input
    if request.method == "POST":
        if username == SOMEONE:  # user not authenticated
            username = request.form.get("username")

        if username in dbapi.all_users():
            result_signal = dbapi.into_from_request(request, username)
        else:
            flash(FlashMessages.NO_SUCH_USER, "danger")
            result_signal = True

        if not result_signal:
            flash(FlashMessages.WRONG_DURATION, "danger")

    # if the user type in the form with duration, the next user is unknown, so the username is SOMEONE
    if not current_user.is_authenticated:
        username = SOMEONE

    df_all = get_df_ana(dbapi)

    studying_users = info_studying_users(df_all)
    no_studying_users = len(studying_users) == 0

    # 1. user previous status
    user_status, user_status_time = info_user_status(df_all, username)

    # 2. other chart info
    df_last_week = to_this_week_table(df_all)

    # prepare to plot
    # first rm the folder to avoid image database exploding
    clean_chart_folder()

    # 2.1 today's study king
    today_king, duration_str_king, path_to_chart_king = info_today_study_king(df_last_week)

    # 2.2 show the last week chart:
    # get display information
    name_winner_lw, duration_str_lw, path_to_chart_lw = info_minutes_dashboard(df_last_week, chart_prefix="lastweek",
                                                                               sep=TODAY_OR_NOT)

    return render_template('home.html',
                           studying_users=studying_users,
                           no_studying_users=no_studying_users,
                           user_status=user_status,
                           user_status_time=user_status_time,
                           path_to_chart_king=path_to_chart_king,
                           today_king=today_king,
                           duration_str_king=duration_str_king,
                           path_to_chart_lastweek=path_to_chart_lw,
                           name_winner=name_winner_lw,
                           duration_str_winner=duration_str_lw)

@app.route('/analysis')
def analysis():
    if current_user.is_authenticated:
        username = current_user.username
        n_stars = dbapi.out_user_n_stars(username)

        # rm the folder to avoid multiple rendering data explode
        clean_chart_folder()
        df_all = get_df_ana(dbapi)

        if username in df_all[NAME].unique():
            df_user = df_all.loc[df_all[NAME] == username, :]
            df_user = df_user.loc[df_user[END_TIME] != UNKNOWN, :]

            df_user_minutes = to_minutes_by_day_table(df_user)
            average_hour_per_day = min2duration_str(np.mean(df_user_minutes[MINUTES]))

            path_umd = path_to_chart_user_min_by_day(username)
            plot_hours_per_day(df_user_minutes, output_path=path_umd)

            path_umd_avg = path_to_chart_user_min_by_day_average(username)
            plot_hours_per_day_average(df_user_minutes, output_path=path_umd_avg)

            path_use = path_to_chart_user_study_events(username)
            plot_study_events(df_user, output_path=path_use)

            path_use_overlap = path_to_chart_user_study_events_overlap(username)
            plot_study_events_overlap(df_user, output_path=path_use_overlap)

            return render_template('personal_analysis.html',
                                   username=username,
                                   n_stars=n_stars,
                                   average_hour_per_day=average_hour_per_day,
                                   path_umd=path_umd,
                                   path_umd_avg=path_umd_avg,
                                   path_use=path_use,
                                   path_use_overlap=path_use_overlap)
        else:
            return redirect(url_for("login"))
    else:
        return redirect(url_for("login"))

# Backend APIs
@app.route("/api/go", methods=["POST"])
def api_handle_go_event():
    data = json.loads(request.data)
    username = data["username"]
    if username in dbapi.all_users():
        date = datetime.now(TZ)
        start_time = datetime2time(datetime.now(TZ))
        dbapi.into_go(username, date, start_time)
        print("Into go", username)
        return {"status": "success"}, 200
    else:
        return {"status": "fail", "message": FlashMessages.NO_SUCH_USER}, 400
    

@app.route("/api/hold", methods=["POST"])
def api_handle_hold_event():
    data = json.loads(request.data)
    username = data["username"]
    if username in dbapi.all_users():
        date = datetime.now(TZ)
        end_time = datetime2time(datetime.now(TZ))
        dbapi.into_hold(username, date, end_time)
        print("into_hold", username)
        return {"status": "success"}, 200
    else:
        return {"status": "fail", "message": FlashMessages.NO_SUCH_USER}, 400


@app.route("/api/studying_users", methods=["GET"])
def api_studying_users():
    df_all = get_df_ana(dbapi)
    studying_users = info_studying_users(df_all)
    return {"studying_users": studying_users}


@app.route("/api/minutes_lastweek", methods=["GET"])
def api_dashboard_leaderboard_week():
    df_all = get_df_ana(dbapi)
    df_last_week = to_this_week_table(df_all)  # filter only the data for last week
    result = info_duration_by_weekday(df_last_week)  # list of entries -> data grouped by weekdays
    result_json = result.unstack(level=0).to_json()  # to proper json format
    return {"status": "success", "data": result_json}, 200


@app.route("/api/minutes_total", methods=["GET"])
def api_get_leaderboards():
    df_all = get_df_ana(dbapi)
    result = info_duration_by_name(df_all)
    result_json = result.to_json()
    return {"status": "success", "data": result_json}, 200


# Minispec for authentication response:
#   on success: response should contain token: String
#   on failure: response should contain error: String

@app.route('/api/login', methods=['POST'])
def api_login():
    # body contains only username and password, chose http body over authentication to minimize the code for httpservice
    username = request.json.get('username')
    password = request.json.get("password")
    user = UserDB.query.filter_by(username=username).first()

    # fail case 1: no such user, status 401
    if user is None:
        return {"status": "error", "message": FlashMessages.NO_SUCH_USER}, 401
    # fail case 2: invalid/wrong password, status 401
    elif password is None or user.password != password:  # todo: use bcrypt
        return {"status": "error", "message": FlashMessages.PASSWD_INCORRECT}, 401
    # success, status 200
    else:
        login_user(user, remember=True)
        return {"status": "success", "data": {"token": username}}, 200  # TODO: use JWT token


@app.route('/api/registration', methods=['POST'])
def api_register():
    username = request.json.get('username')
    password = request.json.get("password")

    all_users = dbapi.all_users()
    if username not in all_users:
        if len(all_users) <= user_amount_limit:
            dbapi.into_user(username, password)
            user = UserDB.query.filter_by(username=username).first()
            login_user(user, remember=True)
            return {"status": "success", "data": {"token": username}}, 200
        else:
            return {"status": "error", "message": FlashMessages.TOO_MUCH_USERS}, 400
    else:
        return {"status": "error", "message": FlashMessages.REGISTERED_USER}, 409


@app.route('/api/logout', methods=['POST'])
def api_logout():
    logout_user()
    return {"status": "success", "data": {"token": None}}, 200


@app.route('/api/admin/clean_chart_folder', methods=['GET'])
def api_admin_clean_chart_folder():
    clean_chart_folder()

# admin pages
@app.route('/admin_log')
def admin_log():
    with open(logger.filename, "r") as f:
        infos = f.readlines()
    for info in infos:
        if len(info.strip()) > 0:
            flash(info, "success")
    return render_template('about.html')


@app.route('/admin_reload_data')
def admin_reload_data():
    logger.info("ADMIN: admin_reload_data")
    dbapi.init_db()
    return render_template('about.html')


@app.route('/admin_clean_data')
def admin_clean_data():
    dbapi.init_empty()
    return render_template('about.html')


@app.route('/admin_create_some_data')
def admin_create_some_data():
    dbapi.into_some_examples()
    return render_template('about.html')


@app.route('/admin_create_some_users')
def admin_create_some_user():
    dbapi.into_some_users()
    return render_template('about.html')


@app.route('/admin_star', methods=['GET', 'POST'])
def admin_star():
    if USERNAME in request.args:
        username = request.args[USERNAME]
        dbapi.into_user_onestar(username)
    return render_template('about.html')

# depracated
@app.route("/api/handle_record_form", methods=["POST"])
def api_handle_record_form():
    # 0. handle the time input
    if request.method == "POST":
        username = request.form.get("username")
        if username in dbapi.all_users():
            result_signal = dbapi.into_from_request(request, username)

            if not result_signal:
                return {"is_success": False, "flash_msg": FlashMessages.WRONG_DURATION}
            else:
                return {"is_success": True}
        else:
            return {"is_success": False, "flash_msg": FlashMessages.NO_SUCH_USER}