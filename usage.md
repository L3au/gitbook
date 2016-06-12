## 目录结构

```sh
├── .bookignore        // gitbook 忽略配置, 不处理及拷贝忽略文件到 _book , 规则同 .gitignore
├── .editorconfig      // 编辑器配置
├── .gitignore         // gitignore
├── .npmrc             // npm 配置
├── README.md          // 网站首页
├── SUMMARY.md         // 右侧导航栏
├── _book              // 生成静态网站目录
├── book.json          // gitbook 配置文件
├── package.json       // package.json
├── scripts            // 构建脚本
└── styles             // 网站自定义样式

```

## book.json

book.json 中定义了所有 gitbook 相关的配置, 包括插件及自定义样式. [参考](http://toolchain.gitbook.com/config.html)

### anchors

为 h1-h6 标题增加锚点, 书写 markdown 时指定 `id`

```md
# 标题内容 {#header-content}
```

### prism

使用 `prism.js` 替代 默认 `highlight`(配置中前面有个 - 符号) 处理代码高亮

测试:

```css
.git-author-container {
    font-size: 90%;
}
```

### disqus

[disqus](https://disqus.com/) 社会化评论系统, 需要先注册 disqus, 然后创建一个 site, 配置 `shortName`

```js
"disqus": {
    "shortName": "xxxxxx"
}
```

### editlink

为每个页面增加跳转到 git 页面的编辑地址, 配置 `base` URL

```js
"editlink": {
    "label": "Edit This Page",
    "base": "http://git.caimi-inc.com/boilerplate/gitbook/edit/master/"
}
```

### 自定义样式

修改 `styles/website.css`

## 构建任务

### start

启动本地开发服务, 自动监听 `markdown` 文件变化并重新编译

```bash
npm start
```

### build

重新 build , 生成静态网站

```bash
npm run build
```

### build:pdf

生成 `pdf` 电子书, 需要依赖 [Calibre](https://calibre-ebook.com/) 中的 `ebook-convert` 命令

安装 `Calibre`

[下载](https://calibre-ebook.com/download) 安装后设置系统 `PATH`, 如 Mac 中

```bash
# .bashrc
export PATH=/Applications/calibre.app/Contents/MacOS/:$PATH
```

```
npm run build:pdf
```

### update

升级模版配置及构建脚本

```bash
npm run update
```

检查是否需要有更新

```bash
npm run update:check
```

### gh-pages

发布到 github pages, 前提为本仓库托管在 `github`

如: `git@github.com:L3au/gitbook.git`

执行如下命令

```bash
npm run gh-pages
```

然后访问: [https://l3au.github.io/gitbook](https://l3au.github.io/gitbook)
