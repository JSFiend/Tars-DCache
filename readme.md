## 介绍
`tars-dcache` 模块， 是 Tars web service 的扩展，用于管理 DCache 服务。
* [Tars web service](https://github.com/TarsCloud/TarsWeb)
 
 ## 用法
 
 1、在 `Tars web service` 项目的配置文件中，找到`dcacheConf.js`文件，修改 `enableDcache` 的值为 `true`
 ```
 module.exports = {
   enableDcache: true
 }
 ```
 2、安装 `tars-dcache` 模块
 > npm install tars-dcache --save
 
 3、新建 `db_cache_web` 数据库， 并执行管理平台上的`db_cache_web.sql`脚本创建`Dcache web`所需要的表。
 ```
 CREATE DATABASE db_cache_web;
 use db_cache_web;
 source sql/db_cache_web.sql;
 ```
 4、启动或者重启管理平台即可在管理平台看到 Dcache 管理平台的入口。
 > npm run prd   //启动
 pm2 restart tars-node-web  // 重启