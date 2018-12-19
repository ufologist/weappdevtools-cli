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
         describe: '微信小程序项目的根目录'
     })
     .option('cliPath', {
         describe: '微信小程序开发者工具 CLI 的路径, 默认从当前进程中查找',
     })
     .command('preview', '提交预览', function() {}, function(argv) {
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
             describe: '版本号, 默认读取微信小程序项目 package.json 中的版本号'
         }).positional('desc', {
             type: 'string',
             default: '',
             describe: '项目备注'
         });
     }, function(argv) {
         var version = argv.version;

         if (!version) {
            try {
                var pkg = require(path.resolve(argv.projectRoot, 'package.json'));
                version = pkg.version;
            } catch (error) {
                version = '0.0.0';
                console.error('Read project package.json fail :(', error);
            }
         }

         var desc = `env: ${argv.env} ${argv.desc}`;

         getLastCommitLog(argv.projectRoot).then(function(latest) {
             // 本来是想用 1.0.0+commit.xxxxxxx
             // 但微信小程序的版本号只允许字母和数字
             version = `${version}.${latest.hash.substring(0, 7)}.${argv.env}`;

             new WechatdevtoolsCli(argv.cliPath).upload(argv.projectRoot, version, desc);
         }, function() {
             new WechatdevtoolsCli(argv.cliPath).upload(argv.projectRoot, version, desc);
         });
     })
     .demandOption(['projectRoot'])
     .help()
     .argv;