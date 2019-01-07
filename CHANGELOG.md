# CHANGELOG

* v1.0.7 2019-1-7

  * 设置 `projectRoot` 命令行参数默认为当前目录

* v1.0.6 2018-12-19

  * 生成的 **版本号** 规则追加环境参数, 便于一眼就可以知道上传的版本是什么环境的

    > 例如
    > * 原来的版本号: `1.0.0.7004c7b`
    > * 现在的版本号: `1.0.0.7004c7b.prod`
    
    * 上传小程序的版本时, 环境说明是放在备注信息中的
    * 但在"小程序开发助手"上无法看到这个备注信息
    * 已给"小程序开发助手"提了意见, 建议可以看到体验版的备注信息  

* v1.0.5 2018-12-7

  * 上传完成后输出的表格中添加了**时间**字段, 便于备忘操作上传的时间

* v1.0.4 2018-11-30

  * 解决 Mac 与 Windows 平台可执行文件执行方式不一样的问题

    > 现在统一处理为: `"./${path.basename(this.cliPath)}" ${args}`

* v1.0.3 2018-11-30

  * Mac 下无法使用 `process-list` 模块, 加载模块时需要做异常处理

* v1.0.2 2018-10-9

  * 由于 `process-list` 模块不兼容 `Mac` 系统, 改为可选模块
  * 预设了默认的命令行工具所在位置(Windows/Mac)

  试过的跨平台获取进程列表
  * [process-list](https://www.npmjs.com/package/process-list) 不兼容 Mac
  * [ps-list](https://www.npmjs.com/package/ps-list) 获取不到进程的路径
  * [xps](https://www.npmjs.com/package/xps) 获取不到进程的路径
  * [ps-man](https://www.npmjs.com/package/ps-man) 获取不到进程的路径
  * [getprocesses](https://www.npmjs.com/package/getprocesses) 乱码/跨平台有问题
  * [ps-node](https://www.npmjs.com/package/ps-node) 获取到的 command 乱码/windows下面运行速度慢
  * [find-process](https://www.npmjs.com/package/find-process) 获取到的 command 乱码/windows下面运行速度慢

* v1.0.1 2018-9-30

  * **fix:** 输出的项目应该显示为完整的路径

* v1.0.0 2018-9-30

  初始版本: 规范化 upload 和 preview 命令