const homeDir = require("os").homedir();
// 获取用户设置的 home 变量
const homeVar = process.env.HOME;
const home = homeVar || homeDir;

// 使用 nodejs 的 path 拼接url
const p = require("path");
const dbpath = p.join(home, ".todo");

const fs = require("fs");

const db = {
    read(path = dbpath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: "a+"}, (error, data) => {
                let list;
                if (error) {
                    return reject(error);
                }
                // 读取文件以后，以文件中的数组创建 list 数组，若文件为空则创建 list 空数组。
                try {
                    list = JSON.parse(data.toString());
                } catch (e) {
                    list = [];
                }
                resolve(list);
            });
        });
    },
    write(list, path = dbpath) {
        return new Promise((resolve, reject) => {
            const string = JSON.stringify(list);
            fs.writeFile(path, string + "\n", (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        })
    }
}

module.exports = db;