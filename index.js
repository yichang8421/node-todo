const db = require("./db.js");
const inquirer = require('inquirer');

// module.exports 对外暴露对象
module.exports.add = async (title) => {
    // 读取任务列表
    let list = await db.read();
    // 向列表中添加任务
    list.push({title, done: false});
    // 将列表存入本地文件中
    await db.write(list);
}

module.exports.clear = async () => {
    await db.write([]);
}

function markAsDone(list, Index) {
    list[Index].done = true;
    // 存入文件
    db.write(list);
}

function markAsUnDone(list, Index) {
    list[Index].done = false;
    db.write(list);
}

function updateTitle(list, Index) {
    inquirer
        .prompt({
            type: 'input',
            name: 'title',
            message: "What's new title",
            default: list[Index].title
        })
        .then((answer3) => {
            list[Index].title = answer3.title;
            db.write(list);
        });
}

function deleteTask(list, Index) {
    list.splice(Index, 1);
    db.write(list);
}

function askForAction(list, Index) {
    const actions = {
        markAsDone,
        markAsUnDone,
        deleteTask,
        updateTitle
    }
    inquirer.prompt({
        type: "list",
        name: "action",
        message: "Which task to operate ",
        choices: [
            {name: "◀ come back", value: "quit"},
            {name: "completed", value: "markAsDone"},
            {name: "undone", value: "markAsUnDone"},
            {name: "rename", value: "updateTitle"},
            {name: "- delete", value: "deleteTask"},
        ]
    }).then((answer2) => {
        const action = actions[answer2.action];
        action && action(list, Index);
    });
}

function askForCreateTask(list) {
    inquirer
        .prompt({
            type: 'input',
            name: 'title',
            message: "What's new task",
        })
        .then((answer4) => {
            list.push({
                title: answer4.title,
                done: false
            })
            db.write(list);
        });
}

function printTasks(list) {
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: 'Please select completed tasks:',
            choices: [
                {name: "◀ come back", value: "-1"},
                ...list.map((task, index) => {
                    return {
                        name: `${task.done ? "[✔]" : "[_]"} ${index + 1}: ${task.title}`,
                        value: index.toString()
                    }
                }),
                {name: "+ add task", value: "-2"}
            ]
        })
        .then((answer) => {
            const Index = Number(answer.index)
            if (Index >= 0) {
                // 询问操作的任务
                askForAction(list, Index);
            } else if (Index === -2) {
                // 创建新任务
                askForCreateTask(list);
            }
        });
}

module.exports.showAll = async () => {
    // 读取之前的任务
    const list = await db.read();

    // 使用 inquirer.js 勾销任务
    printTasks(list);
}