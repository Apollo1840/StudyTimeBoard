import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
import os

CREDS_LOC = os.path.join(os.path.dirname(__file__), "creds", "client_secret.json")


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

    scope = ['https://www.googleapis.com/auth/spreadsheets',
             "https://www.googleapis.com/auth/drive.file",
             "https://www.googleapis.com/auth/drive"]
    creds = ServiceAccountCredentials.from_json_keyfile_name(CREDS_LOC, scope)
    client = gspread.authorize(creds)

    if table_name.endswith(".xlsx"):
        table_name = table_name.split(".")[0]

    table = client.open(table_name)
    sheet = getattr(table, sheet_name)

    data = sheet.get_all_values()
    headers = data.pop(0)

    df = pd.DataFrame(data, columns=headers)

    df = clean_df_from_gsheet(df, least_col_name)

    if preprocess_func:
        df = preprocess_func(df)

    return df


def clean_df_from_gsheet(df, least_col_name):
    df = df.loc[df[least_col_name] != "", :]
    headers = [h for h in df.columns if h != ""]
    df = df[headers]

    return df