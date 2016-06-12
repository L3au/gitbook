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

getCmd('serve').exec([bookRoot], {
    port: 4000,
    lrport: 35729,
    watch: true,
    live: true,
    log: 'info',
    format: 'website'
});
