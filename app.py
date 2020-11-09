from flask import Flask
import os
from datetime import datetime
import shutil

from utils.gsheet import gs_read_excel
from data_analysis import plot_the_bar_chart
from constant import *

# in deploy_branch

app = Flask(__name__)


@app.route('/')
def demo():
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

    plot_the_bar_chart(df, output_path=path_to_chart)

    return "<img src='{}'>".format(path_to_chart)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555)


