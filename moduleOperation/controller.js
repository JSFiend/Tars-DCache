let cwd = process.cwd();
let path = require('path');
let assert = require('assert');

const logger = require(path.join(cwd, './app/logger'));
const util = require(path.join(cwd, './app/tools/util'));


const {Op} = require('sequelize');

const Service = require('./service.js');


const Controller = {
  async expandDCache (ctx) {
    // 是否重试
    let replace = true;

    try {
      let {appName, moduleName, type, status, servers, cache_version} = ctx.paramsObj;

      // 是否有扩容的记录没有完成
      let operationRecord = await Service.findOne({type, appName, moduleName, cache_version, status: {[Op.not]: "0"}});

      // 没有就填加一条扩容记录
      if (!operationRecord) {
        operationRecord = await Service.add({type, status, appName, moduleName, servers, cache_version});
        replace = false;
      }

      // 扩容服务入库 opt
      let expandServers = operationRecord.get('expandServers');
      let args = await Service.optExpandDCache({appName, moduleName, expandServers, cache_version, replace, });

      // 扩容服务入库 opt 后， 发布服务
      let expandRsq = await Service.releaseServer({expandServers});

      ctx.makeResObj(200, '', expandRsq)
    } catch (err) {

      logger.error('[module operation expend]:', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },

  async getRouterChange (ctx) {
    try {
      let { type } = ctx.paramsObj;
      let rsp =  await Service.getRouterChange({type});
      ctx.makeResObj(200, '', rsp)
    } catch (err) {
      logger.error('[module operation getRouterChange]:', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  }

};


module.exports = Controller;
