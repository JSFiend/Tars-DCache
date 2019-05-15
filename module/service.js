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

const path = require('path');
const assert = require('assert');

const cwd = process.cwd();
const { DCacheOptPrx, DCacheOptStruct } = require(path.join(cwd, './app/service/util/rpcClient'));

const moduleDao = require('./dao.js');

const ModuleService = {};

/**
 * 获取特性监控数据
 * @param moduleName
 * @param serverName
 * @param date
 * @param startTime
 * @param endTime
 * @returns {Promise<void>}
 * struct QueryPropReq
 {
    0 require string moduleName;    //Dcache模块名
    1 require string serverName;    //服务名 DCache.xxx, 不填表示查询模块下所有服务合并统计数据，填"*"表示列出所有服务的独立数据
    2 require vector<string> date;  //需要查询的日期，日期格式20190508
    3 require string startTime;     //e.g. 0800
    4 require string endTime;       //e.g. 2360
};
 */
ModuleService.queryProperptyData = async function ({ moduleName, serverName = '', date = [], startTime = '0000', endTime = '2360' }) {
  const option = new DCacheOptStruct.QueryPropReq();
  option.readFromObject({ moduleName, serverName, date, startTime, endTime });
  console.log('option', option);
  const args = await DCacheOptPrx.queryProperptyData(option);
  console.log(args);
  const { __return, rsp } = args;
  assert(__return === 0, '获取特性监控数据出错');
  return rsp;
};

ModuleService.addModuleBaseInfo = async function ({ apply_id, follower, cache_version, mkcache_struct, create_person }) {
  return moduleDao.addModuleBaseInfo({
    apply_id, follower, cache_version, mkcache_struct, create_person,
  });
};

ModuleService.getModuleInfo = async function ({ id }) {
  return moduleDao.findOne({ where: { id } });
};


module.exports = ModuleService;
