const { Command } = require('commander')
const program = new Command()

program
    .name('file-manager')
    .description('CLI tool to manage the file-system')
    .version('0.1');

program
    .command('test')
    .description('testing the test command')
    .argument('<string>', 'get the string of the test command')
    .option('-f, --first', 'display first string',)
    .option('--hello <string>', 'a seecond option')
    .action((str, options) => {
        console.log(str)
        console.log(options)
        const opts = options.hello
        console.log(opts)


    })

program.parse(process.argv)
// const options = program.opts()
// const input = options.first




