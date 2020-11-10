from flask import Flask, render_template
import os
from datetime import datetime
import shutil

from utils.gsheet import gs_read_excel
from data_analysis import plot_the_bar_chart, min2duration_str
from constant import *

# in deploy_branch

app = Flask(__name__)


@app.route('/')
def main_page():
    df = gs_read_excel(STUDY_TIME_TABLE_NAME, least_col_name=START_TIME)

    # rm the folder to avoid multiple rendering data explode
    bar_chart_folder = os.path.dirname(PATH_TO_BARCHART)
    if os.path.exists(bar_chart_folder):
        shutil.rmtree(bar_chart_folder)
    os.makedirs(os.path.dirname(PATH_TO_BARCHART))

    # add datetime time to avoid read from cache
    chart_name, img_format = os.path.split(PATH_TO_BARCHART)[1].split(".")
    new_chart_name = "{}_{}.{}".format(chart_name, datetime.now().strftime('%H_%M_%S'), img_format)
    path_to_chart = os.path.join(os.path.dirname(PATH_TO_BARCHART), new_chart_name)

    df_r = plot_the_bar_chart(df, output_path=path_to_chart)
    name_winner = list(df_r[NAME])[0]
    duration_str = min2duration_str(list(df_r[MINUTES])[0])

    return render_template('index.html',
                           path_to_chart=path_to_chart,
                           name_winner=name_winner,
                           duration_str=duration_str)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555)
