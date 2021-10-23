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

module.exports.showAll = async () => {
    // 读取之前的任务
    const list = await db.read();
    // 使用 inquirer.js 勾销任务

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
                // 选中任务
                inquirer.prompt({
                    type: "list",
                    name: "action",
                    message: "Which task to operate ",
                    choices: [
                        {name: "◀ come back", value: "quit"},
                        {name: "completed", value: "markAsDone"},
                        {name: "undone", value: "markAsUnDone"},
                        {name: "rename", value: "updateTitle"},
                        {name: "- delete", value: "delete"},
                    ]
                }).then((answer2) => {
                    switch (answer2.action) {
                        case "markAsDone":
                            list[Index].done = true;
                            // 存入文件
                            db.write(list);
                            break;
                        case "markAsUnDone":
                            list[Index].done = false;
                            db.write(list);
                            break;
                        case "updateTitle":
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
                            break;
                        case "delete":
                            list.splice(Index, 1);
                            db.write(list);
                            break;
                    }
                });
                console.log(answer.index);
            } else if (Index === -2) {
                // 创建新任务
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
        });
}