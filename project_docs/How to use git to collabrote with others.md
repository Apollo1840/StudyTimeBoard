# How to use git to collaborate with others

This documentation is for the official collaboraters of this project.
For unofficial collaboraters please see [CONTRIBUTING.md](https://github.com/Apollo1840/StudyTimeBoard/blob/master/CONTRIBUTING.md). 

## Normal process

0.  First you need to git clone this project to your local machine:

    ```shell
        git clone git@github.com:Apollo1840/StudyTimeBoard.git
    ```

1.  Assume you have an idea to implement, then you need to create a branch.

    ```shell
         git checkout master
         git pull origin master             # get the latest master branch before branch from it
         git branch /yourname/youridea/     # following the branch name convention
         git checkout /yourname/youridea/   # following the branch name convention
    ```

    check branch name convention at the end of [CONTRIBUTING.md](https://github.com/Apollo1840/StudyTimeBoard/blob/master/CONTRIBUTING.md):

2.  then you could modify the code as you like. When you confirm with some modification, you could commit it.

    ```shell
        # cd to the main folder of this project
        git add .                       # stage all modifications you made
        git add <file>...               # stage specified files
        git reset HEAD .                # unstage all modifications
        git reset HEAD <file>...        # unstage specified files
        git commit -m "the content of this modification"   # commit with commit message
    ```

    and remember to keep updated with master **regularly** by:

    ```shell
        git pull origin master
    ```

3.  when you complete the implementation:

    ```shell
        git push
        # you will see a message to ask you create upstream, just copy the command and do it.
    ```

4.  then go to the github, find your branch, create a PR, ask a reviewer, communicate, modify your code after the discussion. Commit your changes and push again. until it got merged to the master.

---

## Do not

1. Delete any remote branchs by git cli.

   Do it manually on github, to make sure you did what you want, free from typo. commands like :

   ```shell
       git push origin --delete <branch_name>
   ```

   are not allowed to use.

2. Directly push to master branch.

   ```shell
       git push orgin master
   ```

   are not allowed to use.

   every modification happens to master branch is from branch merging.

   **Unless**: you make some instant small debug on master branch, and you are 100% sure correct, and it is easy to understand. Or it has nothing to with code, eg. documenting.

3. Merge a branch to master on yourself. At least one Repo manager (see [README.md](https://github.com/Apollo1840/StudyTimeBoard/blob/master/README.md)) must be informed and agreed before merging a branch to master.

---

## When Things go wrong

### Conflicts!
Conflicts can happen, when two commits made modification at the same place.
```shell
    # action: Go to the conflict files, resolve the conflicts.
    git add .
    git commit -m "resolve conflicts"
    git push
```

### Forget to create a new branch and modified some code on master.

1.  case 1: not committed yet

    ```shell
        git stash                        # Stash the changes in a dirty working directory away 
        git branch /yourname/youridea/   # following the branch name convention
        git stash pop
    ```

2.  case 2: committed

    ```shell
        # action: copy the whole folder to another folder.
        git reset --hard                 # this will clean the working tree
        git branch /yourname/youridea/   # following the branch name convention
        # action: paste that folder back
    ```

3.  case 3: pushed

    The situation is servious, better ask a reviewer with you to do the following:

    ```shell

        # action: copy the whole folder to another folder.
        git log                         # find your starting commit hash code,
                                        # should not before any merge from other branch
        git reset --soft 1t2hashcode    # make sure the code is correct!
        git push
        git branch /yourname/youridea/   # following the branch name convention
        # action: paste that folder back
    ```

### Worked on a wrong branch

1. case 1: you have a correct branch already has some modfication.

```shell
    git branch                   # make sure you are on your old_branch, if not, checkout it.
    git add .
    git commit -m "last commit on this/wrong branch"
    git merge <old_branch>
    git pull origin master       # normally you need to do this.
    # action: manually remove unwanted changes on old_branch
```

2. case 2: you do not have a correct branch.

```shell
    git branch                   # make sure you are on your old_branch, if not, checkout it.
    git add .
    git commit -m "last commit on this/wrong branch"
    git branch <correct_branch>
    git checkout <correct_branch>
    git pull origin master       # normally you need to do this.
    # action: manually remove unwanted changes on old_branch
```

For safety, your old branch is not deleted via this approach.
You could do it afterwards if you want:

```shell
    git branch -d <old_branch>
```

### Rename a branch

Diffent from other more 'correct' renaming approaches, this approach is just checkout a new branch.

```shell
    git branch                   # make sure you are on your old_branch, if not, checkout it.
    git add .
    git commit -m "last commit on old branch"
    git branch <new_name>
    git checkout <new_name>
```

For safety, your old branch is not deleted via this approach.
You could do it afterwards if you want:

```shell
    git branch -d <old_name>
```

### You want to work on some unmerged branches

```shell
    git pull origin <that_branch_name>
```
