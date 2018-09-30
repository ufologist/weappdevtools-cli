const path = require('path');
const fs = require('fs');

const Table = require('cli-table3');

const {
    consoleSeparator,
    findProcessPathFromCurrentProcessList,
    executeCmd
} = require('./util.js');

class WechatdevtoolsCli {
    /**
     * 微信开发者工具命令行
     * 
     * @param {string} cliPath 微信小程序开发者工具 CLI 的路径, 默认从当前进程中查找
     */
    constructor(cliPath) {
        this.cliPath = cliPath;

        this.processName = 'wechatdevtools';
        this.cliBin = (process.platform === 'win32') ? 'cli.bat' : 'cli';
    }

    /**
     * 尝试从当前进程中查找"微信Web开发者工具" cli 可执行文件的路径
     * 
     * @return {Promise<string>} cli 可执行文件的路径
     */
    tryFindCliPathFromCurrentProcessList() {
        return findProcessPathFromCurrentProcessList(this.processName).then((processPath) => {
            this.cliPath = path.resolve(path.dirname(processPath), this.cliBin);
            return this.cliPath;
        });
    }

    /**
     * 执行"微信Web开发者工具"的命令行工具
     * 
     * @param {string} args 命令参数
     * @return {Promise}
     * @see https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html
     */
    execute(args) {
        if (this.cliPath) {
            console.log(consoleSeparator);
            console.log(`Use wechatdevtools cli: ${this.cliPath}`);
            console.log(consoleSeparator);

            return executeCmd(`${path.basename(this.cliPath)} ${args}`, {
                cwd: path.dirname(this.cliPath)
            }).then(function(stout) {
                return stout;
            });
        } else {
            return this.tryFindCliPathFromCurrentProcessList().then(() => {
                if (this.cliPath) {
                    console.log(consoleSeparator);
                    console.log(`Use wechatdevtools cli: ${this.cliPath}`);
                    console.log(consoleSeparator);

                    return executeCmd(`${path.basename(this.cliPath)} ${args}`, {
                        cwd: path.dirname(this.cliPath)
                    }).then(function(stout) {
                        return stout;
                    });
                } else {
                    console.error('Required a wechatdevtools cli path');
                    process.exit(1);
                }
            }, function() {
                console.error('Required a wechatdevtools cli path');
                process.exit(1);
            });
        }
    }

    /**
     * 提交预览
     * 
     * @param {string} projectRoot 项目根路径
     * @return {Promise} 预览的额外信息
     */
    preview(projectRoot) {
        var previewInfoOutput = path.resolve(process.cwd(), 'preview-info.json');
        var args = `-p ${path.resolve(projectRoot)} --preview-info-output "${previewInfoOutput}"`;

        return this.execute(args).then(function() {
            var previewInfo = {};
            try {
                var previewInfo = JSON.parse(fs.readFileSync(previewInfoOutput));
                console.log(consoleSeparator);
                console.log(`本次预览的额外信息: ${JSON.stringify(previewInfo)}`);

                fs.unlink(previewInfoOutput, function() {});
            } catch (error) {
                console.error('Read preview info fail :(', error);
            }
            return previewInfo;
        });
    }

    /**
     * 上传代码
     * 
     * @param {string} projectRoot 项目根路径
     * @param {string} version 版本号
     * @param {string} desc 备注
     * @return {Promise} 上传的额外信息
     */
    upload(projectRoot, version, desc) {
        var uploadInfoOuput = path.resolve(process.cwd(), 'upload-info.json');
        var args = `-u ${version}@${path.resolve(projectRoot)} --upload-desc "${desc}" --upload-info-output "${uploadInfoOuput}"`;

        return this.execute(args).then(function() {
            console.log(consoleSeparator);
            var table = new Table({
                head: ['项目', '版本号', '项目备注']
            });
            table.push([projectRoot, version, desc]);
            console.log(table.toString());

            var uploadInfo = {};
            try {
                var uploadInfo = JSON.parse(fs.readFileSync(uploadInfoOuput));
                console.log(consoleSeparator);
                console.log(`本次上传的额外信息: ${JSON.stringify(uploadInfo)}`);

                fs.unlink(uploadInfoOuput, function() {});
            } catch (error) {
                console.error('Read upload info fail :(', error);
            }

            return uploadInfo;
        });
    }
}

module.exports = WechatdevtoolsCli;