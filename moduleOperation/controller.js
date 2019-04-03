let cwd = process.cwd();
let path = require('path');
let assert = require('assert');

const logger = require(path.join(cwd, './app/logger'));
const util = require(path.join(cwd, './app/tools/util'));


const {Op} = require('sequelize');

const Service = require('./service.js');


const Controller = {
  /**
   * 扩容
   */
  async expandDCache (ctx) {
    // 是否重试
    let replace = true;

    try {
      let {appName, moduleName, type, status, servers, cache_version} = ctx.paramsObj;

      // 是否有扩容的记录没有完成
      let operationRecord = await Service.findOne({type, appName, moduleName, cache_version, status: {[Op.not]: "0"}});

      if (!operationRecord) {
        // 没有就填加一条扩容记录
        operationRecord = await Service.add({type, status, appName, moduleName, servers, cache_version});

        replace = false;
      }

      // 扩容服务入库 opt
      let expandServers = operationRecord.get('expandServers');
      let args = await Service.optExpandDCache({appName, moduleName, expandServers, cache_version, replace, });

      // 扩容服务入库 opt 后， 发布服务
      let expandRsq = await Service.releaseServer({expandServers});

      // 发布完成后， 需要入库 前台 dcache 数据库

      ctx.makeResObj(200, '', expandRsq)
    } catch (err) {

      logger.error('[module operation expend]:', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  /**
   * 获取迁移管理数据
   */
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
  },
  async configTransfer (ctx) {
    try {
      let {appName, moduleName, type, srcGroupName, dstGroupName} = ctx.paramsObj;
      let = rsp = await Service.configTransfer({appName, moduleName, type, srcGroupName, dstGroupName});
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      
      logger.error('[module operation configTransfer]:', err);
      console.error(err);
      ctx.makeResObj(500, err.message)
    }
  },
  /**
   * 缩容
   */
  async reduceDcache (ctx) {
    try {
      let {appName, moduleName, srcGroupName} = ctx.paramsOb;
      let rsp = await Service.reduceDCache({appName, moduleName, srcGroupName});
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      logger.error('[module operation reduce dcache]', err);
      console.error(err);
      ctx.makeResObj(500, err.message)
    }
  },
  /**
   * 停止迁移、扩容、缩容操作
   * @appName     应用名
   * @moduleName  模块名
   * @type        '0' 是迁移， '1' 是扩容， '2' 是缩容
   * @srcGroupName 原组
   * @dstGroupName 目标组
   * 
   */
  async stopTransfer (ctx) {
    try {
      let {appName, moduleName, type, srcGroupName, dstGroupName} = ctx.paramsObj;
      let rsp = await Service.stopTransfer({appName, moduleName, type, srcGroupName, dstGroupName});
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      logger.error('stopTransfer:', err);
      console.error(err);
      ctx.makeResObj(500, err.message)
    }
  },
  /**
   * 删除迁移、扩容、缩容操作记录
   * @appName     应用名
   * @moduleName  模块名
   * @type        '0' 是迁移， '1' 是扩容， '2' 是缩容
   * @srcGroupName 原组
   * @dstGroupName 目标组
   * 
   */
  async deleteTransfer (ctx) {
    try {
      let {appName, moduleName, type, srcGroupName, dstGroupName} = ctx.paramsObj;
      let rsp = await Service.deleteTransfer({appName, moduleName, type, srcGroupName, dstGroupName});
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      logger.error('stopTransfer:', err);
      console.error(err);
      ctx.makeResObj(500, err.message)
    }
  },

};


module.exports = Controller;
