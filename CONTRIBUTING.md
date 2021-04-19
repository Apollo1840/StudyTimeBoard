# Opensource Manual 开源手册

## 基本方法

**高人** | 对于活跃工作在各种开源项目的程序员, 按照基本流程就行。

**游侠** | 对于不想要加入团队的没有开源项目经验的贡献者，可参考按照这个方式提交修改：https://jarv.is/notes/how-to-pull-request-fork-github/

**骨干** | 对于想要加入团队（有不经常，不定期的组会，会讨论功能发展，工作分配，根据熟练度赋予完全权限，或是给予教学辅导）的,有较好软件开发经验的开发者。请在 issue 中留言，标题中注明想加入。
并按照以下方法提交代码：

normal modification:

1. 在 issue 里按照 'devissue.template'(at the end of section) 写下开发内容。
2. 创建与之对应的 branch following 'branch name convention'(at the end of section)。
3. 完成修改后，进行本地测试。
4. 如果有 contributors 身份，可以 push 这个 branch，并提交 pull request。
5. assign 一个 Repo Manager（见 Contributors） 作为 reviewer。
6. 只有 Repo Manager 有 merge 的权限。

big module modification:

1. add a issue named start with "VERSION." or mark it as "BigChunk" with github labels.
2. add multiple barnches and connect those branches to this issue.
3. local test branch
4. assign to all Repo Managers
5. leave a communicate method and keep in touch with RMs.

### 骨干合作基本原则

1. 任务自由，没有人有权给你安排任务，自由决定想进行什么开发。主流开发计划只起到一个参考作用。如果有人问：“xxx, 你可不可以 开发一下 xxx”， 请记住，这只是一个建议，你有 100%权力拒绝。
2. 时间自由，所有任务没有 deadline。自由安排开发时间，自由选择是否参加组会。如果有人问你进度如何，他只是单纯想知道进度如何，没有催的意思。但是如果开发进度过慢，也要接受别人让你提交已开发的内容并在你的基础上完成开发，或者直接重复开发了你开发的内容。
3. 进退自由，你可以任何时间加入或退出经常开发队伍，但是请及时通知我。
4. 接受 Repo Manager 的代码质量管理。不符合质量要求的代码将不会被 Merge，不管你在这个 PR 上花费了多少时间精力。
5. 接受 Product Manager 产品功能管理。对于 feature 的管理相对会比较宽松，但不代表没有限制，不符合产品管理的开发将不会被 Merge，不管你在这个 PR 上花费了多少时间精力。
6. 接受项目负责人的提名权力。贡献了代码到 Main 上则会进入 Contributors 名单。对于非程序员，由项目负责人决定是否进入 Contributor 名单。

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

## recommendations

- you are highly recommended to use 2 spaces as incident for the frontend dev, and 4 spaces as incident for the backedn dev
- you are highly recommended to use Prettier(https://prettier.io/) add-on to format your code. and use formatOnSave(following https://www.robinwieruch.de/how-to-use-prettier-vscode)

## Appendix

---

##### branch name convention

`/owner/work_category/purpose_category/purpose`

(P.S work category means `dev` or `debug`).

|         | Meaning             |
| ------- | ------------------- |
| `dev`   | feature development |
| `debug` | debug & refactor    |
| `fr`    | frontend            |
| `bc`    | backend             |

eg:

- `congyu/debug/fr/leaderboard_weekdays_order`.
- `Diqing/dev/bc/leaderboad_data`.
- `tom/dev/fr/homeview/go_hold_buttons`.

---

##### devissue.template

- is it a feature developing， or is it a code refactoring? (Note: if it is a feature, it should be one single feature, so it is easier for reviewers to review.). You do not need to answer this if you could mark the issue as "refactor" for the GitHub label when it is a refactoring work.
- what is this feature about?
- potential affected files?
- are there some depending RP that is not approved yet?

---
