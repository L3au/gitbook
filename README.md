# Gitbook

[![Greenkeeper badge](https://badges.greenkeeper.io/L3au/gitbook.svg)](https://greenkeeper.io/)

[Gitbook](https://github.com/GitbookIO/gitbook) 是基于 `git` 和 `Markdown` 书写电子书的工具, 同时提供一整套 [工具链](http://toolchain.gitbook.com/) 来开发和生成它. 除了生成静态网站外, 还可以编译成 `pdf` `mobi` `epub` 等电子书格式. 同时支持多语言、自定义主题和插件等功能.

本模版提供了 Gitbook 初始化配置及常用插件, 并集成方便的构建脚本.

## 使用

### 初始化

```bash
git clone git@git.caimi-inc.com:boilerplate/gitbook.git 
cd gitbook && rm -rf .git

# 初始化并设置 git repository url
git init
git remote add origin ${URL}
```

### 安装启动

```bash
npm i
npm start
```

然后打开: `http://localhost:4000` 查看

修改任意 `markdown` 文件后会自动编译并刷新

### 如何编写

gitbook 里最重要的两个文件 `README.md` 和 `SUMMARY.md` , 其中 `README.md` 经编译后生成网站首页(每个目录下的 `README.md` 都会生成一个 `index.html` 作为此目录的首页), 就是你现在看到的页面. `SUMMARY.md` 则是右侧导航栏, 里面为链接列表. 示例如下

`README.md`

```md
# Gibook

content
```

`SUMMARY.md`

```md
# Summary

- [使用配置说明](usage.md)
- [一级链接](part/README.md)
  - [二级链接](part/level2.md)
```

### [使用配置说明](usage.md)
