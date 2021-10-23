const {Command} = require('commander');
const program = new Command();
const api = require("./index.js");


// 声明命令
program
    .option('-x, --xxx', 'this is x')

// 声明子命令
program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const word = args.slice(0, -1).join(" ");
        api.add(word);
    });
program
    .command('clear')
    .description('clear all tasks')
    .action(() => {
        console.log("clear all");
        api.clear("claer");
    });

program.parse(process.argv);

// const options = program.opts();
// if (options.xxx) console.log('- this is x');
// console.log(program.opts().xxx);



