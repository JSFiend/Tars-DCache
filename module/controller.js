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
const assert = require('assert');

const logger = require(path.join(cwd, './app/logger'));
const { DCacheOptPrx, DCacheOptStruct } = require(path.join(cwd, './app/service/util/rpcClient'));

const ModuleService = require('./service.js');


const ModuleController = {
  async queryProperptyData(ctx) {
    try {
      const { thedate, predate, startshowtime, endshowtime, moduleName, serverName } = ctx.paramsObj;
      console.log(ctx.paramsObj);
      // ctx.makeResObj(200, '', ctx.paramsObj);
      // return;
      const option = {
        moduleName,
        serverName,
        date: [thedate, predate],
        startTime: startshowtime,
        endTime: endshowtime,
      };
      const rsp = await ModuleService.queryProperptyData(option);
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      console.error('queryProperptyData', err);
      logger.error('[queryProperptyData]:', err);
      ctx.makeResObj(500, err.message);
    }
  },
  async addModuleBaseInfo(ctx) {
    try {
      const {
        follower, cache_version, mkcache_struct, apply_id,
      } = ctx.paramsObj;
      const create_person = 'adminUser';
      const item = await ModuleService.addModuleBaseInfo({
        apply_id,
        follower,
        cache_version,
        mkcache_struct,
        create_person,
      });
      ctx.makeResObj(200, '', item);
    } catch (err) {
      logger.error('[addModuleBaseInfo]:', err);
      ctx.makeResObj(500, err.message);
    }
  },
  async getModuleInfo(ctx) {
    try {
      const { moduleId } = ctx.paramsObj;
      const item = await ModuleService.getModuleInfo({ id: moduleId });
      ctx.makeResObj(200, '', item);
    } catch (err) {
      logger.error('[getModuleInfo]:', err);
      ctx.makeErrResObj();
    }
  },
  /**
  * 获取模块信息
  * @returns {Promise.<void>}
  */
  async getModuleStruct(ctx) {
    try {
      const { appName, moduleName } = ctx.paramsObj;
      const option = new DCacheOptStruct.ModuleStructReq();
      option.readFromObject({
        appName,
        moduleName,
      });
      const args = await DCacheOptPrx.getModuleStruct(option);
      const {
        __return, rsp, rsp: { errMsg },
      } = args;
      assert(__return === 0, errMsg);
      ctx.makeResObj(200, '', rsp);
    } catch (err) {
      logger.error('[getModuleStruct]:', err);
      ctx.makeResObj(500, err.message);
    }
  },

};

module.exports = ModuleController;
