const {
    exec
} = require('child_process');

const {
    snapshot
} = require('process-list');
const simpleGit = require('simple-git/promise');
const ora = require('ora');

const consoleSeparator = '--------------------------';

/**
 * 从当前进程中查找进程的路径
 * 
 * @param {string} processName
 * @return {Promise<string>} 进程的路径
 */
function findProcessPathFromCurrentProcessList(processName) {
    var spinner = ora(`Find ${processName} process from the current process list`).start();

    return snapshot('pid', 'name', 'path').then(tasks => {
        var processPath;

        var task = tasks.find(function(task) {
            return task.name.indexOf(processName) !== -1;
        });

        if (task) {
            spinner.succeed(`Find ${processName} process: ${JSON.stringify(task)}`);
            processPath = task.path;
        } else {
            spinner.fail(`Not find ${processName} process`);
        }

        return processPath;
    }, function(error) {
        spinner.fail(`Find ${processName} process fail: ${error}`);
    });
}

/**
 * 执行命令
 * 
 * @param {string} command 
 * @param {object} options
 * @return {Promise}
 */
function executeCmd(command, options) {
    console.log(consoleSeparator);
    console.log(`> ${command}`);
    console.log(consoleSeparator);

    return new Promise(function(resolve, reject) {
        var childProcess = exec(command, options, function(error, stout, stderr) {
            if (error) {
                reject(error);
            } else {
                resolve(stout);
            }
        });

        childProcess.stdout.on('data', function(msg) {
            console.log(msg);
        });
        childProcess.stderr.on('data', function(msg) {
            console.error(msg);
        });
    });
}

/**
 * 获取 GIT 项目最后提交的日志
 * 
 * @param {string} gitProject
 * @return {Promise}
 */
function getLastCommitLog(gitProject) {
    var spinner = ora(`Get last commit log: ${gitProject}`).start();

    var git = simpleGit(gitProject);
    return git.log({
        n: 1
    }).then(function(listLogSummary) {
        spinner.succeed(`Get last commit log: ${JSON.stringify(listLogSummary.latest)}`);
        return listLogSummary.latest;
    }, function(error) {
        spinner.fail(`Get last commit log fail: ${error}`);
    });
}

module.exports = {
    consoleSeparator,
    findProcessPathFromCurrentProcessList,
    executeCmd,
    getLastCommitLog
};