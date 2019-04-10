## 介绍
`tars-dcache` 模块是依赖于 `tars` 管理平台上运行的 `dcache` 服务管理平台。
 
 ## 用法
 
 1、在`tars`管理平台配置文件中`dcacheConf.js`，启动`dcache`。
 ```
 ├─config
 │      authConf.js
 │      compileConf.js
 │      dcacheConf.js
 │      loginConf.js
 │      resourceConf.js
 │      sshConf.json
 │      tars.conf
 │      webConf.js
 ```
 dcacheConf.js
 ```
 module.exports = {
   enableDcache: true
 }
 ```
 2、安装 `tars-dcache` 模块
 > npm install tars-dcache --save
 
 3、新建 `db_cache_web` 数据库， 并执行管理平台上的`db_cache_web.sql`脚本新建`Dcache`表。
 ```
 CREATE DATABASE db_cache_web;
 use db_cache_web;
 source sql/db_cache_web.sql;
 ```
 4、启动或者重启管理平台即可在管理平台看到 Dcache 管理平台的入口。
 > npm run prd   //启动
 pm2 restart tars-node-web  // 重启