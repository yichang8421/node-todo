#!/usr/bin/env node

const {Command} = require('commander');
const program = new Command();
const api = require("./index.js");
const pkg = require("./package.json");

// 声明命令
program
    .version(pkg.version)

// 声明子命令
program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const word = args.slice(0, -1).join(" ");
        api.add(word).then(() => {
            console.log("The task has been added.");
        }, () => {
            console.log("Add failed.");
        });
    });
program
    .command('clear')
    .description('clear all tasks')
    .action(() => {
        api.clear().then(() => {
            console.log("Clear complete.");
        }, () => {
            console.log("Clearing failed");
        });
    });

program.parse(process.argv);
if (process.argv.length) {
    // 当用户直接运行 node cli 时
    void api.showAll();
}

// const options = program.opts();
// if (options.xxx) console.log('- this is x');
// console.log(program.opts().xxx);



