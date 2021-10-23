// 获取系统 home 目录
const homeDir = require("os").homedir();
// 获取用户设置的 home 变量
const homeVar = process.env.HOME;
const home = homeVar || homeDir;

// 使用 nodejs 的 path 拼接url
const p = require("path");
const dbpath = p.join(home, ".todo");

const fs = require("fs");

// module.exports 对外暴露对象
module.exports.add = (title) => {
    // 首先读取文件，若文件不存在就创建空文件
    fs.readFile(dbpath, {flag: "a+"}, (error, data) => {
        let list;
        if (error) {
            console.log(error);
        } else {
            // 读取文件以后，以文件中的数组创建 list 数组，若文件为空则创建 list 空数组。
            try {
                list = JSON.parse(data.toString());
            } catch (e) {
                list = [];
            }
            console.log(list);

            const task = {
                title,
                done: false
            }

            list.push(task);

            // 将 list 写入文件
            const string = JSON.stringify(list);
            fs.writeFile(dbpath,string+"\n",(error2)=>{
                if(error2){
                    console.log(error2);
                }
            });
        }
    });
}

module.exports.clear = (title) => {
    console.log("clear");
}