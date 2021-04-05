# StudyTimeBoard

This is the server of the study-time-board web app.

## Live demo

Use your browser, go to https://study-time-board.herokuapp.com/.

## For developers

### 1. Dev setup:

    cd backend
    python app.py

    # open a new terminal tab
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

see https://drive.google.com/file/d/1aKUYA_8heqd9J4BFsBoivuQ1iEqZ1aJE/view?usp=sharing.

editing ...

### 4. Contributions:

项目将保持开源。非常欢迎加入我们的开发。
你的名字将会出现在本文档和部署版网站的 About 界面。

- 主要联系人：(github)Apollo1840[https://github.com/Apollo1840]

#### 基本方法

**高人** | 对于活跃工作在各种开源项目的程序员, 按照基本流程就行。

**游侠** | 对于不想要加入团队的没有开源项目经验的贡献者，可参考按照这个方式提交修改：https://jarv.is/notes/how-to-pull-request-fork-github/

**骨干** | 对于想要加入团队（有不经常，不定期的组会，会讨论功能发展，工作分配，根据熟练度赋予完全权限，或是给予教学辅导）的,有较好软件开发经验的开发者。请在 issue 中留言，标题中注明想加入。
并按照以下方法提交代码：

normal modification: 
1. 在 issue 里按照 'devissue.template' 写下开发内容。
2. 创建与之对应的 branch following 'branch name convention'。
3. 完成修改后，进行本地测试。
4. 如果有 contributors 身份，可以 push 这个 branch，并提交 pull request。
5. assign 一个 Repo Manager（见 Contributors） 作为 reviewer。
6. 只有 Repo Manager 有 merge 的权限。

big module modification:
1. add a issue named start with "VERSION."
2. add multiple barnches and connect those branches to this issue.
3. local test branch
5. assign to all Repo Managers
6. leave a communicate method and keep in touch with RMs.

---

##### branch name convention

`/owner/work_category/purpose_category/purpose`

(P.S work category means `dev` or `debug`).

| | Meaning
--- | --- 
`dev` | feature development
`debug` | debug & refactor
`fr` | frontend
`bc` | backend

eg:
- `congyu/debug/fr/leaderboard_weekdays_order`.
- `Diqing/dev/bc/leaderboad_data`.
- `tom/dev/fr/homeview/go_hold_buttons`.


---

##### devissue.template

- is it a feature developing， or is it a code refactoring? (Note: if it is a feature, it should be one single feature, so it is easier for reviewers to review.)
- what is this feature about?
- potential affected files?
- are there some depending RP which are not appoved yet?

---

**干员** | 对于想要加入团队的,没有合作开发经验的程序员。请在 issue 中留言，标题中注明想加入。
你需要学习 git 和 github 的正确使用方法。我们会安排教员，并按照 https://jarv.is/notes/how-to-pull-request-fork-github/ 手把手教你提交代码。
通过时间的积累可以成为 **骨干**。

**新手** | 对于没有经验的程序爱好者，如果你想要成为代码贡献员，你需要学习下述东西的一些基础知识（不用很深入）：

- python
- python flask, pandas
- html
- bootstrap
- javascript
- javascript react, plotly

这并不是全部，但是就可以开始有些贡献了。然后按照 **干员** 的方式加入我们。

**好手** | 但代码贡献并不是唯一贡献方式。你还可以提供以下贡献，并获得提名：

- UI/UX design
- Feature design
- Regular user feedback

#### recommendations

- you are highly recommended to use 2 spaces as incident for the frontend dev, and 4 spaces as incident for the backedn dev
- you are highly recommended to use Prettier(https://prettier.io/) add-on to format your code. and use formatOnSave(following https://www.robinwieruch.de/how-to-use-prettier-vscode)

## Contributors

- (Repo Manager) Apollo1840 [https://github.com/Apollo1840]
- (Repo Manager) changdiqing [https://github.com/changdiqing])

## Reference: How to build web app

https://www.freecodecamp.org/news/how-to-build-a-web-application-using-flask-and-deploy-it-to-the-cloud-3551c985e492/

https://dev.to/techparida/how-to-deploy-a-flask-app-on-heroku-heb (recommended by DiQing Chang [https://github.com/changdiqing])
