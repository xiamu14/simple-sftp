const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const warning = require('warning');
const { root } = require('./index');
let sftprcStr = '';

try {
   sftprcStr = fs.readFileSync(path.resolve(root, './sftprc.json'))
} catch (error) {
    // throw new Error('配置文件不存在')
    warning(
        false,
        chalk.red('sftprc.json is not exist.')
    )
    return false
}

const sftprc = JSON.parse(sftprcStr);

module.exports = sftprc;