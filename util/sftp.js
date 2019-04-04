const Client = require("ssh2-sftp-client");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { root } = require("./index.js");

module.exports = async function upload(configs) {
  configs.forEach(config => {
    const sftpConfig = config.sftp;
    const filesPath = config.filesPath;

    const sftp = new Client();

    const filesGroup = handleFilePath(filesPath);

    await handleSftp(sftp, sftpConfig, filesGroup);

    process.exit();
  });
};

function handleFilePath(filesPath) {
  return filesPath.map(obj => {
    const { local, remote, mode } = obj;
    const files = fs.readdirSync(path.resolve(root, local));
    if (files.length === 0) {
      return false;
    }
    return files.map(file => {
      // 判断文件是否为目录
      const fullname = path.join(local, file);
      const stats = fs.statSync(fullname);

      if (stats.isDirectory()) {
        if (mode !== "onlyFile") {
          // 只读取文件，不读取目录
          // 循环读取文件
          handleFilePath({
            local: fullname,
            remote: `${remote}/${file}`
          });
        }
      } else {
        const _lp = `${local}/${file}`;
        const index = file.lastIndexOf(".");
        //获取后缀
        const ext = file.substr(index + 1);
        const type = /png|jpeg|bmp|jpg|gif/.test(ext) ? "img" : ext;

        return {
          type: type,
          file: file,
          localPath: type !== "img" ? _lp : fs.readFileSync(_lp),
          remotePath: `${remote}/${file}`
        };
      }
    });
  });
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
        console.log(error, "sftp文件服务器连接失败");
        reject();
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
