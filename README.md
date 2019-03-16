## auto-generator
使用指令快速生成 react 模块、组件的预备文件

## 快速概述

```
yarn add auto-generator -D
npx gen c
```

(npx comes with npm 5.2+ and higher, see instructions for older npm versions)

![](http://static.ohcat.xyz/ping-mu-kuai-zhao-2019-03-16-shang-wu-10-20-28-png%282019-03-16T10:20:50+08:00%29.png)

## 安装与使用

- 安装到项目里

```
yarn add auto-generator -D (npm install auto-generator -D)
```

- 添加 script 指令

```json
"gen:c": "gen c"
```

- 本地使用

```
yarn gen:c
```

## 配置 genrc.json
在使用 auto-generator 生成组件预文件时，需要先配置项目组件、模块的路径，常见配置如下：

```json
{
    "component": {
        "path": "./src/component"
    }
}
```
### 参数
...

## 预备文件定义(暂无)
auto-generator 内部有一套 react 的纯函数组件、无状态组件、状态组件的预备文件，可以在 github 仓库(/example) 查看预备文件定义，并参照设置符合项目的预备文件。

```
.
└── react
    └── pure
        ├── index.js
        ├── index.scss
        └── story.js
```