const program = require("commander");
const inquirer = require("inquirer");
const sftprc = require('../util/getSftprc.js');
const upload = require('../util/sftp');
const envs = Object.keys(sftprc);

if (!envs || envs.length === 0) {
  console.error('缺少 sftp 配置！', envs)
  return false;
}

const choices = envs.map((env) => {
  return {
    name: env,
    value: env,
  }
})

// 读取配置文件

program
  .version("0.0.1", "-v, --version")
  .command("upload")
  .alias("u")
  .description("upload files uing sftp.")
  .action(option => {
    const promps = [];
    promps.push({
      type: "list",
      name: "env",
      message: "请选择上传到哪个环境？",
      choices,
    });
    inquirer.prompt(promps).then(function(answers) {
      // 执行具体函数
      upload(sftprc[answers.env]);
    });
  })

program.parse(process.argv);
