import os
import pandas as pd


class LocalSheet:
    def __init__(self, path_db):
        self.path_db = path_db

    @staticmethod
    def read_from(path_str):
        return LocalSheet(path_str)

    def sheet(self, sheet_name):

        path_df = os.path.join(self.path_db, sheet_name + ".csv")
        df = pd.read_csv(path_df)

        return df

    def append_row(self, sheet_name, item):
        """
        for sheet1: [name, date, start_time, end_time]
        for sheet2: [name, act, date, time]

        :param sheet_name:
        :param item: tuple
        :return:
        """

        df = self.sheet(sheet_name)
        df.loc[len(df), :] = item
        df.to_csv(os.path.join(self.path_db, sheet_name + ".csv"), index=False)
