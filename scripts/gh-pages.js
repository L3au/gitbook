'use strict';

const path = require('path');
const execa = require('execa');
const Promise = require('bluebird');
const build = require('./build');

const root = path.join(__dirname, '..');
const bookPath = path.join(root, '_book');

// 获取当前项目 git repository url
execa.shell('git config --get remote.origin.url')
    .then(Promise.coroutine(function*(ret) {
        const originUrl = ret.stdout;

        // 非 github 仓库不作处理
        if (!originUrl || originUrl.indexOf('github.com') == -1) {
            return Promise.reject('not a github repository');
        }

        const match = originUrl.match(/:(\S+)\/(\S+)\.git/);
        const githubIOUrl = `https://${match[1]}.github.io/${match[2]}`;

        // 重新生成 _book
        console.log('rebuilding book...');
        yield build.exec([root], {
            log: 'info',
            format: 'website'
        });

        // change to _book
        process.chdir(bookPath);
        // init git
        console.log('initializing git...');
        yield execa.shell('git init').then((ret) => {
            console.log(ret.stdout);
        });
        // add remote url
        yield execa.shell(`git remote add origin ${originUrl}`);
        // commit
        yield execa.shell('git add . -A && git commit -m "gh-pages"');
        // checkout gh-pages
        yield execa.shell('git checkout -b gh-pages');
        // force push
        yield execa.shell('git push origin gh-pages --force');
        console.log(`publish success! visit: ${githubIOUrl}`);
    }))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
