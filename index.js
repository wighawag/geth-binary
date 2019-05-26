const {spawn} = require('child_process');
const {onExit} = require('@rauschma/stringio');
const path = require('path');
const os = require('os');
var fs = require('fs');

// 1.8.23
const platform = os.platform();
let suffix = platform + '_' + os.arch();
if(platform == 'win' || platform == 'win32') {
    suffix = suffix + '.exe';
}
// TODO chmod ?
const filepath = path.join(__dirname, 'binaries', 'geth_' + suffix);

if(require.main === module) {

    let args = [];
    if(process.env._GETH_CMD_ARGUMENTS) {
        args = process.env._GETH_CMD_ARGUMENTS.split(' '); // work around 
    } else {
        args = process.argv.slice(2);
    }

    console.log(filepath + ' ' + args.join(' '));
    if (fs.existsSync(filepath)) {
        execute(filepath, args);
    } else {
        console.error('platform not supported', suffix);
    }

    async function execute(filepath, args) {
        const childProcess = spawn(
            filepath,
            args,
            {
                stdio: [process.stdin, process.stdout, process.stderr]
            }
        );
        let exitCode = 0;
        try{
            exitCode = await onExit(childProcess);
        } catch(e) {}
        process.exit(exitCode);
    }
} else {
    module.exports = {
        path: filepath
    }
}

