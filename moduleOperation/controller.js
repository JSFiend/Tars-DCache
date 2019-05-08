/**
 * Tencent is pleased to support the open source community by making Tars available.
 *
 * Copyright (C) 2016THL A29 Limited, a Tencent company. All rights reserved.
 *
 * Licensed under the BSD 3-Clause License (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * https://opensource.org/licenses/BSD-3-Clause
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

const cwd = process.cwd();
const path = require('path');

const logger = require(path.join(cwd, './app/logger'));


const { Op } = require('sequelize');

// 触发轮询任务
require('./timeTask');

const Service = require('./service.js');


const Controller = {
  /**
     * 扩容
     */
  async expandDCache(ctx) {
    try {
      const {
        appName, moduleName, status, servers, cache_version, srcGroupName, dstGroupName,
      } = ctx.paramsObj;
      logger.info({
        appName, moduleName, status, servers, cache_version, srcGroupName, dstGroupName,
      });

      // 是否有扩容的记录没有完成
      const { totalNum } = await Service.getRouterChange({ appName, moduleName, type: '1' });
      if (totalNum > 0) throw new Error('#dcache.hasExpandOperation#');

      // 扩容服务入库 opt
      await Service.optExpandDCache({
        appName, moduleName, expandServers: servers, cache_version, replace: false,
      });

      // 扩容服务入库 opt 后， 发布服务
      const expandRsq = await Service.releaseServer({ expandServers: servers });

      // 发布完成后， 需要入库 前台 dcache 数据库，才会在目录树显示
      await Service.putInServerConfig({ appName, servers });

      // 发布进入轮询， 轮询发布成功后调用 configTransfer， 让 opt 启动资源分配
      //  type  后台是 1、2、0
      const { releaseId } = expandRsq;
      Service.getReleaseProgress(releaseId, appName, moduleName, 1, srcGroupName, dstGroupName);

      ctx.makeResObj(200, '', expandRsq);
    } catch (err) {
      logger.error('[module operation expend]:', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  /**
   * 迁移
   * @param ctx
   * @returns {Promise<void>}
   */
  async transferDCache(ctx) {
    let type = 'migration';
    try {
      const {
        appName, moduleName, status, servers, cache_version, srcGroupName, dstGroupName,
      } = ctx.paramsObj;
      logger.info({
        appName, moduleName, status, servers, cache_version, srcGroupName, dstGroupName,
      });

      // 是否有扩容的记录没有完成
      const hasOperation = await Service.findOne({
        appName, moduleName, status: { [Op.not]: '0' },
      });
      if (hasOperation) throw new Error('#dcache.hasMigrationOperation#');

      // 没有就填加一条扩容记录
      const operationRecord = await Service.add({
        type, status, appName, moduleName, servers, cache_version,
      });

      // 扩容服务入库 opt
      const expandServers = operationRecord.get('expandServers');
      await Service.transferDCache({
        appName, moduleName, servers: expandServers, cacheType: cache_version, srcGroupName,
      });

      // 扩容服务入库 opt 后， 发布服务
      const expandRsq = await Service.releaseServer({ expandServers });

      // 发布完成后， 需要入库 前台 dcache 数据库，才会在目录树显示
      await Service.putInServerConfig({ appName, servers });

      // 发布进入轮询， 轮询发布成功后调用 configTransfer， 让 opt 启动资源分配
      // 前台数据库的 type 是 expand、shriankge、migration，  后台是 1、2、0
      const { releaseId } = expandRsq;
      Service.getReleaseProgress(releaseId, appName, moduleName, type = 0, [srcGroupName], [dstGroupName]);

      ctx.makeResObj(200, '', expandRsq);
    } catch (err) {
      logger.error('[module operation migration]:', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  async transferDCacheGroup(ctx) {
    try {
      const { appName, moduleName, srcGroupName, dstGroupName, transferData } = ctx.paramsObj;
      const rsp = await Service.transferDCacheGroup({ appName, moduleName, srcGroupName, dstGroupName, transferData });
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  /**
     * 获取迁移管理数据
     */
  async getRouterChange(ctx) {
    try {
      const { appName, moduleName, srcGroupName, dstGroupName, status, type } = ctx.paramsObj;
      const rsp = await Service.getRouterChange({ appName, moduleName, srcGroupName, dstGroupName, status, type });
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      logger.error('[module operation getRouterChange]:', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  async configTransfer(ctx) {
    try {
      const {
        appName, moduleName, type, srcGroupName, dstGroupName,
      } = ctx.paramsObj;
      const rsp = await Service.configTransfer({
        appName, moduleName, type, srcGroupName, dstGroupName,
      });
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      logger.error('[module operation configTransfer]:', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  /**
     * 缩容
     */
  async reduceDcache(ctx) {
    try {
      const { appName, moduleName, srcGroupName } = ctx.paramsObj;
      const rsp = await Service.reduceDCache({ appName, moduleName, srcGroupName });
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      logger.error('[module operation reduce dcache]', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
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
  async stopTransfer(ctx) {
    try {
      const {
        appName, moduleName, type, srcGroupName, dstGroupName,
      } = ctx.paramsObj;
      const rsp = await Service.stopTransfer({
        appName, moduleName, type, srcGroupName, dstGroupName,
      });

      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      logger.error('stopTransfer:', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
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
  async deleteTransfer(ctx) {
    try {
      const {
        appName, moduleName, type, srcGroupName, dstGroupName,
      } = ctx.paramsObj;
      // 删除 opt 记录
      let rsp = await Service.deleteTransfer({
        appName, moduleName, type, srcGroupName, dstGroupName,
      });

      // 删除dcache 操作记录
      const operationType = {
        0: 'migration',
        1: 'expand',
        2: 'shrinage',
      };
      rsp = await Service.deleteOperation({ appName, moduleName, type: operationType[type] });

      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      logger.error('stopTransfer:', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  async deleteOperation(ctx) {
    try {
      let { appName, moduleName, type } = ctx.paramsObj;

      type = `${type}`;

      // 删除dcache 操作记录
      const operationType = {
        0: 'migration',
        1: 'expand',
        2: 'shrinage',
      };
      const rsp = await Service.deleteOperation({ appName, moduleName, type: operationType[type] });

      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      logger.error('stopTransfer:', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  async hasOperation(ctx) {
    try {
      const { appName, moduleName, type } = ctx.paramsObj;
      const rsp = await Service.findOne({
        appName, moduleName, type, status: { [Op.not]: '0' },
      });
      ctx.makeResObj(200, '', !!rsp);
    } catch (err) {
      logger.error('has Operation:', err);
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  /**
     * 主备切换
     */
  async switchServer(ctx) {
    try {
      const { appName, moduleName, groupName } = ctx.paramsObj;
      // opt 主备切换
      let rsp = await Service.switchServer({ appName, moduleName, groupName });
      // 后台切换成功，前台数据库切换
      rsp = await Service.switchMainBackup({ appName, moduleName, groupName });
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  /**
     * 查询主备切换
     */
  async getSwitchInfo(ctx) {
    try {
      const { appName, moduleName, groupName } = ctx.paramsObj;
      const rsp = await Service.getSwitchInfo({ appName, moduleName, groupName });
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  async recoverMirrorStatus(ctx) {
    try {
      const { appName, moduleName, groupName, mirrorIdc, dbFlag, enableErase } = ctx.paramsObj;
      const rsp = await Service.recoverMirrorStatus({ appName, moduleName, groupName, mirrorIdc, dbFlag, enableErase });
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
  /**
   * 下线 cache 服务，
   * 后台没有提供批量下线 cache 服务的接口，自己多次请求
   * @param ctx
   * @returns {Promise<void>}
   */
  async uninstall4DCache(ctx) {
    try {
      const { unType, appName, moduleName, serverNames } = ctx.paramsObj;
      let rsp;
      if (unType) {
        // 选中的服务有主机， 下线该模块所有的服务
        rsp = await Service.uninstall4DCache({ unType, appName, moduleName });
      } else {
        const result = [];
        serverNames.forEach(serverName => result.push(Service.uninstall4DCache({ unType, appName, moduleName, serverName })));
        rsp = await Promise.all(result);
      }
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      console.error(err);
      ctx.makeResObj(500, err.message);
    }
  },
};
module.exports = Controller;
