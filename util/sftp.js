const Client = require("ssh2-sftp-client");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { root } = require("./index.js");

module.exports = function upload(configs) {
  configs.forEach(async config => {
    const sftpConfig = config.sftp;
    const filesPath = config.filesPath;

    const sftp = new Client();

    let filesGroup = [];
    filesPath.forEach(obj => {
      const fileGroup = handleFilePath(obj);
      filesGroup = filesGroup.concat(handleFilePath(obj));
    });
    // console.log(filesGroup);
    await handleSftp(sftp, sftpConfig, filesGroup);

    process.exit();
  });
};

function handleFilePath(files) {
  const fileGroup = [];
  function getFilePath(filePath) {
    const { local, remote, mode } = filePath;
    const files = fs.readdirSync(path.resolve(root, local));
    if (files.length === 0) {
      return false;
    }
    files.forEach(file => {
      // 判断文件是否为目录
      const fullname = path.join(local, file);
      const stats = fs.statSync(fullname);

      if (stats.isDirectory()) {
        if (mode !== "onlyFile") {
          // 只读取文件，不读取目录
          // 循环读取文件
          getFilePath({
            local: fullname,
            remote: `${remote}/${file}`,
            mode
          });
        }
      } else {
        const _lp = `${local}/${file}`;
        const index = file.lastIndexOf(".");
        //获取后缀
        const ext = file.substr(index + 1);
        const type = /png|jpeg|bmp|jpg|gif/.test(ext) ? "img" : ext;
        fileGroup.push({
          type: type,
          file: file,
          localPath: type !== "img" ? _lp : fs.readFileSync(_lp),
          remotePath: `${remote}/${file}`
        });
      }
    });
  }
  getFilePath(files);
  return fileGroup;
}

/**
 * 上传文件
 **/
function uploadFile(sftp, filesGroup) {
  const tasks = filesGroup.map(item => {
    return new Promise((resolve, reject) => {
      //TODO: 保留当前文件信息
      sftp
        .put(item.localPath, item.remotePath)
        .then(() => {
          console.log(`${chalk.cyan(item.file)} √`);
          resolve();
        })
        .catch(err => {
          console.log(`${item.file} x，error：${err} \n`);
          //TODO: 遇到服务端目录不存在的情况，则在服务端创建目录然后重新传输文件
          reject();
        });
    });
  });

  return Promise.all(tasks);
}

function handleSftp(sftp, config, filesGroup) {
  return new Promise(async (resovle, reject) => {
    // 传入 config ，则调用connect 函数
    if (Object.keys(config).length > 0) {
      try {
        await sftp.connect(config);
      } catch (error) {
        console.log("\n------ sftp文件服务器连接失败 ------\n");
        return false;
      }
    }
    console.log("\n--------开始上传文件...------- \n");
    uploadFile(sftp, filesGroup)
      .then(() => {
        console.log("\n------所有文件上传完成!-------\n");
        resovle();
      })
      .catch(() => {
        console.log("\n------上传失败,请检查!-------\n");
        reject();
      });
  });
}
