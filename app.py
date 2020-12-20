import pandas as pd
import os

from studytimeboard import app
from studytimeboard.constant import *

if __name__ == '__main__':

    # initiate database
    sheet_columns = {
        "duration": ["name", "date", "start_time", "end_time"],
        "event": ["name", "act", "date", "time"]
    }
    for sheet_name in [SHEET1, SHEET2]:
        path_df = os.path.join(PATH_TO_LOCALDB, sheet_name + ".csv")
        if not os.path.exists(path_df):
            df = pd.DataFrame(columns=sheet_columns[sheet_name])
            df.to_csv(path_df, index=False)

    # start the app
    app.run(host='0.0.0.0', port=5555, debug=True)
