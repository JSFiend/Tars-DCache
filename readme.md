## @tars/dcache
[![npm](https://img.shields.io/npm/v/@tars/dcache.svg)](https://www.npmjs.com/package/@tars/dcache)
[![node](https://img.shields.io/node/v/@tars/dcache.svg)](https://nodejs.org/en/)
[![Build Status](https://travis-ci.org/JSFiend/Tars-DCache.svg?branch=master)](https://travis-ci.org/JSFiend/Tars-DCache)
[![coverage reporting](https://img.shields.io/coveralls/github/JSFiend/Tars-DCache.svg)](https://coveralls.io/github/JSFiend/Tars-DCache)

`@tars/dcache` 模块， 是 Tars web 的扩展，用于管理 DCache 服务。依赖 [Tars web](https://github.com/TarsCloud/TarsWeb) 和 [DCache](https://github.com/Tencent/DCache)，请参考安装文档进行安装再引入 `@tars/dcache` 模块。
#### 安装
`@tars/dcache` 模块，依赖 `Tars` 、`Tars web` 和 `DCache`，请参考安装文档进行安装再引入 `@tars/dcache` 模块。
* [Tars 安装文档](https://github.com/TarsCloud/Tars/blob/master/Install.zh.md)
* [DCache 安装文档](https://github.com/Tencent/DCache/blob/master/docs/install.md)
 
## 用法
 
 1、在 `Tars web service` 项目的配置文件中，找到`dcacheConf.js`文件，修改 `enableDcache` 的值为 `true`
 ```
 module.exports = {
   enableDcache: true
 }
 ```
 2、安装 `@tars/dcache` 模块
 > npm install @tars/dcache --save
 
 3、新建 `db_cache_web` 数据库， 并执行 `Tars web service` 项目`sql`文件夹下的`db_cache_web.sql`脚本，创建`DCache web`所需要的表。
 ```
 CREATE DATABASE db_cache_web;
 use db_cache_web;
 source sql/db_cache_web.sql;
 ```
 4、启动或者重启管理平台即可在管理平台看到 Dcache 管理平台的入口。
 * npm run prd   //启动
 * pm2 restart tars-node-web  // 重启
