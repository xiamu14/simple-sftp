const findRoot = require("find-root");
const fs = require('fs');

function getRoot() {
    return findRoot(__dirname).split('/node_modules')[0];
}

function checkDirExist(path) {
    try {
        return fs.statSync(path).isDirectory();
    }
    catch (e) {

        if (e.code == 'ENOENT') { // no such file or directory. File really does not exist
            return false;
        }

        console.log("Exception fs.statSync (" + path + "): " + e);
        throw e; // something else went wrong, we don't have rights, ...
    }
}

function firstUpperCase(str) {
    return str.replace(/^\S/, function (s) { return s.toUpperCase(); });
}

module.exports = {
    root: getRoot(),
    checkDirExist,
    firstUpperCase,
}