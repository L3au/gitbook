'use strict';

const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const execa = require('execa');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

const root = path.join(__dirname, '..');
const pkgPath = path.join(root, 'package.json');

const checkArg = process.argv[2];
const pkgName = process.env.npm_package_name;
const tmpDir = process.env.npm_config_tmp;
const boilerplateUrl = process.env.npm_package_config_boilerplate_url;
const localCommitId = process.env.npm_package_config_boilerplate_commit;

const pkg = require(pkgPath);

Promise.resolve()
    .then(() => {
        if (!boilerplateUrl) {
            return Promise.reject('boilerplate not set');
        }
    })
    .then(() => {
        // 获取模版远程 master 分支最新 commit
        return execa.shell(`git ls-remote ${boilerplateUrl} HEAD`).then((ret) => {
            return ret.stdout.split(/\s+/)[0];
        });
    })
    .then(Promise.coroutine(function*(remoteCommitId) {
        const isLatest = localCommitId === remoteCommitId;

        if (checkArg === '--check' && !isLatest) {
            console.log('Boilerplate update available');
            console.log('Run: `npm run update` to update');
            console.log('-------------------------------');
            process.exit(0);
        }

        if (isLatest) {
            console.log('Already up-to-date');
            return Promise.resolve();
        }

        const pkgDir = path.join(tmpDir, pkgName);

        console.log('git cloning...');

        // 如果存在先移除
        yield fs.removeAsync(pkgDir);

        // clone 远程模版到临时目录
        yield execa.shell(`git clone ${boilerplateUrl} ${pkgDir}`);

        console.log('updating files...');

        // 收集需要更新的文件
        const needUpdateFiles = glob.sync('{scripts,config}/**/*.*', {
            cwd: pkgDir
        }).concat(['book.json', 'manifest.json', 'package.json']);

        yield Promise.map(needUpdateFiles, (file) => {
            const srcPath = path.join(root, file);
            const distPath = path.join(pkgDir, file);
            const bakPath = srcPath.replace(/\.(\w+)$/, '.bak.$1');

            return Promise.all([
                fs.readFileAsync(srcPath).catch(() => {
                    // 当前项目不存在此文件
                    return Promise.resolve(new Buffer(''))
                }),
                fs.readFileAsync(distPath)
            ]).then(Promise.coroutine(function*(results) {
                const srcBuf = results[0];
                const distBuf = results[1];

                // 判断内容是否修改
                if (srcBuf.equals(distBuf)) {
                    return Promise.resolve();
                }

                // 生成原文件备份文件
                if (srcBuf.length > 0) {
                    yield fs.renameAsync(srcPath, bakPath)
                }

                // 创建更新后的文件
                yield fs.outputFileAsync(srcPath, distBuf)
            }), (e) => {
                return Promise.resolve();
            });
        });

        // 更新 package.json
        const pkgJson = yield fs.readJsonAsync(pkgPath);

        pkgJson.name = pkg.name;
        pkgJson.version = pkg.version;
        pkgJson.group = pkg.group;
        pkgJson.config.boilerplate.commit = remoteCommitId;

        yield fs.writeJsonAsync(pkgPath, pkgJson);

        console.log('update success');
    }))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
