const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const warning = require('warning')
const genrc = require('../util/getGenrc.js')
const { root, checkDirExist } = require('../util/index')

module.exports = function genComponent(params) {
    switch (params.type) {
        case 'pure':
            console.log('生成纯函数组件', params.name);
            // console.log('组件存放路径', path.resolve(root, genrc.component.path))
            const componentRootPath = path.resolve(root, genrc.component.path)
            const componentPath = path.join(componentRootPath, params.name);
            // 检查目录是否存在 && 检查是否存在同名组件
            if (checkDirExist(componentRootPath) && !checkDirExist(componentPath)) {
                // 新建组件目录
                fs.mkdir(componentPath, err => {
                    if (err) {
                        console.log('创建文件失败', err);
                    }
                })
                // 读取 example 文件
                const exampleRoot = path.resolve(__dirname, `../example/react/${params.type}`)
                const indexText = fs.readFileSync(path.join(exampleRoot, 'index.js'), 'utf8');

                // 替换模块名
                const newIndexText = indexText.replace(/Name/g, params.name);

                // 写入文件
                fs.writeFileSync(path.join(componentPath, 'index.js'), newIndexText, 'utf8')

                // 判断是否添加 story.js
                if (params.storybook) {
                    const storyText = fs.readFileSync(path.join(exampleRoot, 'story.js'), 'utf8');

                    // 替换模块名
                    const newStoryText = storyText.replace(/Name/g, params.name);

                    // 写入文件
                    fs.writeFileSync(path.join(componentPath, 'story.js'), newStoryText, 'utf8')
                }
                if (params.cssExtends === 'scss') {
                    // 写入文件
                    fs.writeFileSync(path.join(componentPath, 'index.scss'), '', 'utf8')
                }
                // console.log('读取 example 文件', newIndexText);
            } else {
                warning(false, chalk.red('component 目录不存在或存在同名组件'))
            }
            break;
    
        default:
            break;
    }
}
