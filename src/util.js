const {
    exec
} = require('child_process');

// Mac 下无法使用 `process-list` 模块
var snapshot = null;
try {
    const processList = require('process-list');
    snapshot = processList.snapshot;
} catch (error) {
    console.error('Cannot find module', error);
}
const simpleGit = require('simple-git');
const ora = require('ora');

const consoleSeparator = '--------------------------';

/**
 * 从当前进程中查找进程的路径
 * 
 * @param {string} processName
 * @return {Promise<string>} 进程的路径
 */
function findProcessPathFromCurrentProcessList(processName) {
    var spinner = ora(`Find "${processName}" process from the current process list`).start();

    if (snapshot) {
        return snapshot('pid', 'name', 'path').then(tasks => {
            var processPath;

            var foundTask = tasks.find(function(task) {
                return task.name.indexOf(processName) !== -1;
            });

            if (foundTask) {
                spinner.succeed(`Find "${processName}" process: ${JSON.stringify(foundTask)}`);
                processPath = foundTask.path;
            } else {
                spinner.fail(`Not find "${processName}" process`);
            }

            return processPath;
        }, function(error) {
            spinner.fail(`Find "${processName}" process fail: ${error}`);
        });
    } else {
        spinner.fail(`Find "${processName}" process fail: Not find module process-list`);
        return Promise.reject('Not find module process-list');
    }
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

    return new Promise(function(resolve, reject) {
        var git = simpleGit(gitProject);
        git.log({
            n: 1
        }, function(error, listLogSummary) {
            if (!error) {
                spinner.succeed(`Get last commit log: ${JSON.stringify(listLogSummary.latest)}`);
                resolve(listLogSummary.latest);
            } else {
                spinner.fail(`Get last commit log fail: ${error}`);
                reject(error);
            }
        });
    });
}

module.exports = {
    consoleSeparator,
    findProcessPathFromCurrentProcessList,
    executeCmd,
    getLastCommitLog
};