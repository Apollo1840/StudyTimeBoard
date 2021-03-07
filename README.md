# StudyTimeBoard

This is the server of the study-time-board web app.

## Live demo

Use your browser, go to https://study-time-board.herokuapp.com/.

## For developers

### 1. Dev setup:

    cd backend
    python app.py
    cd ..
    cd frontend
    npm start

---

#### Full dev setup (with Google Sheet as Manager(backup) database) [ 4 steps ]

1. follow the steps from：

   https://www.youtube.com/watch?v=w533wJuilao&ab_channel=JayMartMedia

   to get the `client_secret.json` and put it in `./utils/creds`.

2. Ask me (github account: apollo1840) to give you the access to this google sheet:
   https://docs.google.com/spreadsheets/d/1FGoY2IrXavkyiRGZQkvTIgHwHmIrlohR-IDoQ5K4hw4/edit?usp=sharing

3. Add the "client_email" in `./studytimeboard/utils/creds/client_secret.json` to the share list of that google sheet.

Now you are ready to go.

run:

    pip install -r requiremnts.txt
    python app.py

to start a server locally.

4. Go to `http://0.0.0.0:5555/` to view the main page of this web app.

### 2. Todos:

- more leaderboards, eg. weekday king bar chart.
- less information on the record form block, hover on question mark to see how to use.

#### outlook:

- use Database software to check updates then update the charts regularly, instead of tigered by visit the web.
- new way to record time
- gamefication
- join study group to see group leadboard.
- study time can earn study-coin
- study zone (decoration using study-coin)
- earn study-coin within group
- visit others study zone

### 3. Code structure explanation

editing ...

## Reference: How to build web app

https://www.freecodecamp.org/news/how-to-build-a-web-application-using-flask-and-deploy-it-to-the-cloud-3551c985e492/

https://dev.to/techparida/how-to-deploy-a-flask-app-on-heroku-heb (recommended by DiQing Chang [https://github.com/changdiqing])
