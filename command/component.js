const program = require('commander')
const inquirer = require('inquirer')
const { genComponent } = require('../gen/index');

program
    .command('component')
    .alias('c')
    .description('创建组件')
    .action(option => {
        const promps = []
        promps.push({
            type: 'input',
            name: 'name',
            message: '请输入组件名称',
            validate: function (input) {
                if (!input) {
                    return '不能为空'
                }
                return true
            }
        })
        promps.push({
            type: 'list',
            name: 'type',
            message: '创建哪一类组件',
            choices: [
                {
                    name: '纯函数组件',
                    value: 'pure'
                },
                {
                    name: '无状态组件',
                    value: 'stateless'
                },
                {
                    name: '状态组件',
                    value: 'stateful'
                }
            ]
        })
        promps.push({
            type: 'list',
            name: 'storybook',
            message: '是否使用 storybook',
            choices: [
                {
                    name: '是',
                    value: true,
                },
                {
                    name: '否',
                    value: false,
                }
            ]
        })
        promps.push({
            type: 'list',
            name: 'cssExtends',
            message: '是否使用 css 扩展语法',
            choices: [
                {
                    name: 'scss',
                    value: 'scss',
                },
                {
                    name: 'styled-component',
                    value: 'styled'
                }
            ]
        })
        inquirer.prompt(promps).then(function (answers) {
            genComponent(answers);
            // 执行具体函数
        })
    })

program.parse(process.argv)