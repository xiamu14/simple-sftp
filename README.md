## auto-sftp
编写 sftp 配置文件，自动上传本地文件到服务器

## 安装

```js
yarn add auto-sftp -D
// 或
npx sftp u
```

(npx comes with npm 5.2+ and higher, see instructions for older npm versions)

## 配置 sftprc.json


```json
{
  "test": [
    {
      "sftp": {
        "host": "",
        "post": 22,
        "username": "",
        "password": "",
        "privateKey": "",
        "passphrase": ""
      },
      "filesPath": [
        {
          "local": "./example/static",
          "remote": "/remote",
          "mode": "all"
        }
      ]
    }
  ],
  "prod": []
}

```