#!/usr/bin/env node
const path = require('path');

var yargs = require('yargs');

var WechatdevtoolsCli = require('../src/wechatdevtools-cli.js');
const {
    getLastCommitLog
} = require('../src/util.js');

var pkg = require('../package.json');

yargs.usage(`微信小程序开发者工具命令行小秘书@${pkg.version}`)
     .version(false)
     .option('projectRoot', {
         default: '.',
         describe: '微信小程序项目的根目录, 默认为当前目录'
     })
     .option('cliPath', {
         describe: '微信小程序开发者工具 CLI 的路径, 默认从当前进程中查找',
     })
     .command('preview', '提交预览', function() {}, function(argv) {
         console.log(JSON.stringify(argv, null, 4));
         new WechatdevtoolsCli(argv.cliPath).preview(argv.projectRoot);
     })
     .command('upload [env] [version] [desc]', '上传代码', function(yargs) {
         yargs.positional('env', {
             type: 'string',
             default: '',
             describe: '环境类型, 例如 dev | ip | local | test | stage | prod'
         }).positional('version', {
             type: 'string',
             default: '',
             describe: '版本号, 默认读取微信小程序项目 package.json 中的版本号 + latest commit hash'
         }).positional('desc', {
             type: 'string',
             default: '',
             describe: '项目备注, 默认读取微信小程序项目的 latest commit message'
         });
     }, function(argv) {
         console.log(JSON.stringify(argv, null, 4));

         var version = argv.version || process.env.npm_package_version;

         if (!version) {
            try {
                var pkg = require(path.resolve(argv.projectRoot, 'package.json'));
                version = pkg.version;
            } catch (error) {
                version = '0.0.0';
                console.error('Read project package.json fail :(', error);
            }
         }

         var desc = '';
         var envDesc = argv.env ? `env: ${argv.env}` : '';

         getLastCommitLog(argv.projectRoot).then(function(latest) {
             // 版本号补充 commit hash
             // 本来是想用 1.0.0+commit.xxxxxxx
             // 但微信小程序的版本号只允许字母和数字
             version = `${version}.${latest.hash.substring(0, 7)}`;
             // 版本号补充环境信息
             if (argv.env) {
                 version = `${version}.${argv.env}`;
             }

             // 说明信息补充提交日志
             desc = `${envDesc} ${argv.desc || latest.message.substring(0, 80)}`;

             new WechatdevtoolsCli(argv.cliPath).upload(argv.projectRoot, version, desc);
         }, function() {
             // 版本号补充环境信息
             if (argv.env) {
                 version = `${version}.${argv.env}`;
             }
             // 说明信息补充提交日志
             desc = `${envDesc} ${argv.desc}`;

             new WechatdevtoolsCli(argv.cliPath).upload(argv.projectRoot, version, desc);
         });
     })
     .help()
     .argv;
