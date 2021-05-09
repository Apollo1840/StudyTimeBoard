# StudyTimeBoard

This is the server of the study-time-board web app.

## Live demo

Use your browser, go to https://study-time-board.herokuapp.com/.

## For developers

### 1. Dev setup:

(if you have not worked with python, virtual environment, or node, please read ['How to install dependencies.md'](https://github.com/Apollo1840/StudyTimeBoard/blob/master/project_docs/How%20to%20install%20dependencies.md)')

2 ways to start the server:

**Way 1**

Suitable for Linux machine.

```shell
    # Before this, you need set up your work virtualenv, for example: workon web.
   ./launch.sh

```

**Way 2**

Suitable for windows machine.

```shell
    # Before this, you need set up your work virtualenv, for example: workon web.
   python backend/app.py

   # Before this, you need to open a new console
   cd frontend/
   npm start
```

---

You may found out that this dev web is different from demo web app.
That is because we deployed "main" branch, whereas we are developing on "master" branch.

(The biggest difference of these two are "main" branch use Flask as full-stack,
but "master" branch use React as frontend and Flask only as backend)

by the way, We are still working on rebuild the web app piece by piece.

#### (optional) Full dev setup (with Google Sheet as Manager(backup) database) [ 4 steps ]

1. follow the steps from：

   https://www.youtube.com/watch?v=w533wJuilao&ab_channel=JayMartMedia

   to get the `client_secret.json` and put it in `./utils/creds`.

2. Ask me (github account: apollo1840) to give you the access to this google sheet:
   https://docs.google.com/spreadsheets/d/1FGoY2IrXavkyiRGZQkvTIgHwHmIrlohR-IDoQ5K4hw4/edit?usp=sharing

3. Add the "client_email" in `./studytimeboard/utils/creds/client_secret.json` to the share list of that google sheet.

### 2. Code structure explanation

- Structure UML-like: see https://drive.google.com/file/d/1aKUYA_8heqd9J4BFsBoivuQ1iEqZ1aJE/view?usp=sharing.
- Video description: see https://www.bilibili.com/video/BV1nU4y1Y7yn (in Chinese)

editing ...

### 3. Todos:

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

### 4. Contributions:

项目将保持开源。
非常欢迎加入我们的开发。
你的名字将会出现在本文档和部署版网站的 About 界面。
寻求合作具体见 ['CONTRIBUTING.md'](https://github.com/Apollo1840/StudyTimeBoard/blob/master/CONTRIBUTING.md)

- 主要联系人：(github)Apollo1840[https://github.com/Apollo1840]

## Contributors

- (Repo Manager) Apollo1840 [https://github.com/Apollo1840]
- (Repo Manager) changdiqing [https://github.com/changdiqing])

## Reference: How to build web app

https://www.freecodecamp.org/news/how-to-build-a-web-application-using-flask-and-deploy-it-to-the-cloud-3551c985e492/

https://dev.to/techparida/how-to-deploy-a-flask-app-on-heroku-heb (recommended by DiQing Chang [https://github.com/changdiqing])
