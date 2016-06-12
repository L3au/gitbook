'use strict';

const path = require('path');
const gitbook = require('gitbook');

function getCmd(cmdName) {
    const commands = gitbook.commands;
    return commands.filter((command) => {
        return command.name.split(' ')[0] === cmdName;
    })[0];
}

const bookRoot = path.join(__dirname, '../');
const format = (process.argv[2] || '').replace(/-/g, '');
const bookPath = path.join(bookRoot, `book.${format}`);

if (require.main !== module) {
    return module.exports = getCmd('build');
}

if (format) {
    // 生成 pdf
    getCmd(format).exec([bookRoot, bookPath], {
        log: 'info'
    });
} else {
    // 生成 website
    getCmd('build').exec([bookRoot], {
        log: 'info',
        format: 'website'
    });
}
