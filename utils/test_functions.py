from gsheet import gs_read_excel

if __name__ == '__main__':
    df = gs_read_excel("record_study_time", least_col_name="start_time")
    print(df)



