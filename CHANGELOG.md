# CHANGELOG

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