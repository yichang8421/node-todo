const db = require("./db.js");

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