import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
import os

CREDS_LOC = os.path.join(os.path.dirname(__file__), "creds", "client_secret.json")


class GoogleSheet:

    def __init__(self, table):
        self.table = table

    @staticmethod
    def read_from(table_name):
        """

        follow the steps to get the client_screte.json:
        # https://www.youtube.com/watch?v=w533wJuilao&ab_channel=JayMartMedia

        make sure you have allow the access for the client email from 'client_secret.json'  to the sheet



        :param table_name:
        :return:
        """

        scope = ['https://www.googleapis.com/auth/spreadsheets',
                 "https://www.googleapis.com/auth/drive.file",
                 "https://www.googleapis.com/auth/drive"]
        creds = ServiceAccountCredentials.from_json_keyfile_name(CREDS_LOC, scope)
        client = gspread.authorize(creds)

        if table_name.endswith(".xlsx"):
            table_name = table_name.split(".")[0]

        gs = GoogleSheet(client.open(table_name))
        return gs

    def sheet(self, sheet_name, least_col_name=None, preprocess_func=None):
        sheet = self.table.worksheet(sheet_name)

        data = sheet.get_all_values()
        headers = data.pop(0)

        df = pd.DataFrame(data, columns=headers)

        if least_col_name is None:
            least_col_name = df.columns[0]

        df = self.clean_df_from_gsheet(df, least_col_name)

        if preprocess_func:
            df = preprocess_func(df)

        return df

    def append_row(self, sheet_name, row):
        sheet = self.table.worksheet(sheet_name)
        sheet.append_row(row)

    def delete_row(self, sheet_name, row_index):
        sheet = self.table.worksheet(sheet_name)
        sheet.delete_row(row_index)

    @staticmethod
    def clean_df_from_gsheet(df, least_col_name):
        df = df.loc[df[least_col_name] != "", :]
        headers = [h for h in df.columns if h != ""]
        df = df[headers]

        return df


def gs_read_excel(table_name, least_col_name, sheet_name="sheet1", preprocess_func=None):
    """
    follow the steps to get the client_screte.json:
    # https://www.youtube.com/watch?v=w533wJuilao&ab_channel=JayMartMedia

    make sure you have allow the access for the client email from 'client_secret.json'  to the sheet


    :param sheet_name:
    :param table_name:
    :param preprocess_func: function handler
    :return:
    """

    gs = GoogleSheet.read_from(table_name)
    return gs.sheet(sheet_name, least_col_name, preprocess_func)
