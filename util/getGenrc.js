const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const warning = require('warning');
const { root } = require('./index');
let genrcStr = '';

try {
   genrcStr = fs.readFileSync(path.resolve(root, './genrc.json'))
} catch (error) {
    // throw new Error('配置文件不存在')
    warning(
        false,
        chalk.red('genrc.json is not exist.')
    )
    return false
}

const genrc = JSON.parse(genrcStr);

module.exports = genrc;