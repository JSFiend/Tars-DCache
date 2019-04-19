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
const logger = require(path.join(cwd, './app/logger'));
const TarsStream = require('@tars/stream');

const Dao = require('./dao.js');
const ExpandServerDao = require('./expandServerDao');
const serverConfigService = require('./../serverConfig/service.js');
const applyService = require('./../apply/service.js');
const ModuleConfigService = require('../moduleConfig/service');

const service = {};

service.add = async function ({
  type, status, appName, moduleName, servers, cache_version,
}) {
  const operationRecord = await Dao.add({
    type, status, appName, moduleName, servers, cache_version,
  });

  const preExpandServers = servers.map(item => ({
    operation_id: operationRecord.get('id'),
    area: item.area,
    app_name: item.app_name,
    module_name: item.module_name,
    group_name: item.group_name,
    server_name: item.server_name,
    server_ip: item.server_ip,
    server_type: item.server_type,
    memory: item.memory,
    shmKey: item.shmKey,
    idc_area: item.idc_area,
    status: 0,
    modify_person: item.modify_person,
    modify_time: item.modify_time,
    is_docker: item.is_docker,
    patch_version: item.patch_version,
  }));

  // 扩容数据入库
  const expandServers = await ExpandServerDao.addList(preExpandServers);

  operationRecord.setDataValue('expandServers', expandServers);

  return operationRecord;
};

service.findOne = async function ({
  type, status, appName, moduleName, cache_version,
}) {
  const where = {};
  if (type) where.type = type;
  if (status !== undefined) where.status = status;
  if (appName) where.appName = appName;
  if (moduleName) where.moduleName = moduleName;
  if (cache_version) where.cache_version = cache_version;
  return Dao.findOne({ where });
};
service.findAll = function ({
  type, status, appName, moduleName, cache_version,
}) {
  const where = {};
  if (type) where.type = type;
  if (status !== undefined) where.status = status;
  if (appName) where.appName = appName;
  if (moduleName) where.moduleName = moduleName;
  if (cache_version) where.cache_version = cache_version;
  return Dao.findAll({ where });
};

service.deleteOperation = function ({ appName, moduleName, type }) {
  const where = {
    appName,
    moduleName,
    type,
  };
  return Dao.destroy({ where });
};

service.optExpandDCache = async function ({
  appName, moduleName, expandServers, cache_version, replace = false,
}) {
  const cacheHost = expandServers.map((server) => {
    const item = server.dataValues;
    return {
      serverName: `DCache.${item.server_name}`,
      serverIp: item.server_ip,
      templateFile: 'tars.default',
      // 主机是 0，  传的 type 是 M
      type: [0, '0'].includes(item.server_type) ? 'M' : 'S',
      // 主机的 bakSrcServerName 为 空， 备机和镜像为主机的名称
      bakSrcServerName: [0, '0'].includes(item.server_type) ? '' : `DCache.${expandServers[0].server_name}`,
      idc: item.area,
      priority: item.server_type ? '2' : '1',
      groupName: item.group_name,
      shmSize: item.memory.toString(),
      // 共享内存key?
      shmKey: item.shmKey,
      isContainer: item.is_docker.toString(),
    };
  });
  console.log('cacheHost', cacheHost);
  const option = new DCacheOptStruct.ExpandReq();
  option.readFromObject({
    appName,
    moduleName,
    cacheHost,
    cacheType: cache_version,
    version: '',
    replace,
  });
  const { __return, expandRsp, expandRsp: { errMsg } } = await DCacheOptPrx.expandDCache(option);
  assert(__return === 0, errMsg);
  return expandRsp;
};

service.releaseServer = async function ({ expandServers }) {
  const serverList = [];
  expandServers.forEach((item) => {
    const releaseInfo = new DCacheOptStruct.ReleaseInfo();
    releaseInfo.readFromObject({
      appName: 'DCache',
      serverName: item.server_name,
      nodeName: item.server_ip,
      groupName: 'DCacheServerGroup',
      version: item.patch_version,
      user: 'adminUser',
      md5: '',
      status: 0,
      error: '',
      ostype: '',
    });
    serverList.push(releaseInfo);
  });
  const option = new TarsStream.List(DCacheOptStruct.ReleaseInfo);
  option.readFromObject(serverList);

  const { __return, releaseRsp, releaseRsp: { errMsg } } = await DCacheOptPrx.releaseServer(option);
  assert(__return === 0, errMsg);
  return releaseRsp;
};

service.putInServerConfig = async function ({ appName, servers }) {
  const apply = await applyService.findApplyByName({ appName });
  servers.forEach((item) => {
    item.apply_id = apply.id;
  });
  return serverConfigService.addExpandServer(servers);
};

/**
 *
 * @param appName
 * @param moduleName
 * @param type // TRANSFER(0): 迁移， EXPAND(1): 扩容， REDUCE(2): 缩容
 * @param srcGroupName // 源组组名
 * @param dstGroupName // 目的组组名
 * @returns {Promise.<void>}
 */
service.configTransfer = async function ({
  appName, moduleName, type = 1, srcGroupName = [], dstGroupName = [],
}) {
  const option = new DCacheOptStruct.ConfigTransferReq();
  option.readFromObject({
    appName,
    moduleName,
    type,
    srcGroupName,
    dstGroupName,
  });

  const { __return, rsp, rsp: { errMsg } } = await DCacheOptPrx.configTransfer(option);
  assert(__return === 0, errMsg);
  return rsp;
};
/**
 * 查询路由变更(迁移，扩容，缩容)
 * cond 查询条件: <"appName", "Test">表示查询应用名为Test的变更信息
 *   map的key是TransferRecord中的成员: appName, moduleName, srcGroupName, dstGroupName, status, type
 *   map的key都是字符串
 *   status: "0"-新增迁移任务，"1"-配置阶段完成，"2"-发布完成，"3"-正在迁移，"4"-完成，5""-停止
 *   type: "0"-迁移, "1"-扩容, "2"-缩容, "3"-路由整理
 * index: 获取数据的索引(从0开始)
 * number: 一次获取数据的个数(获取全部数据 number设置为-1)
 */
service.getRouterChange = async function ({
  appName = '', moduleName = '', srcGroupName = '', dstGroupName = '', status = '', type = '1',
}) {
  const option = new DCacheOptStruct.RouterChangeReq();
  const cond = {};
  if (appName) cond.appName = appName;
  if (moduleName) cond.moduleName = moduleName;
  if (status) cond.status = status;
  if (srcGroupName) cond.srcGroupName = srcGroupName;
  if (dstGroupName) cond.dstGroupName = dstGroupName;
  cond.type = type;
  option.readFromObject({
    index: 0,
    number: -1,
    cond,
  });
  const { __return, rsp, rsp: { errMsg } } = await DCacheOptPrx.getRouterChange(option);
  assert(__return === 0, errMsg);
  return rsp;
};

service.syncOperation = async function ({
  appName, module, type, id,
}) {
  try {
    const { totalNum, transferRecord } = await service.getRouterChange({ appName, module, type });
    if (totalNum === 0) return false;
    const item = transferRecord[0];
    // 4、5 完成、停止
    if (item.status <= 3) return false;
    return Dao.update({ where: { id }, values: { status: '0' } });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

/**
 * 缩容 opt 接口
 * 0 require string appName;
 * 1 require string moduleName;
 * 2 require vector<string> srcGroupName; // 源组组名
 *
 * */
service.reduceDCache = async function ({ appName = '', moduleName = '', srcGroupName = [] }) {
  const option = new DCacheOptStruct.ReduceReq();
  option.readFromObject({
    appName,
    moduleName,
    srcGroupName,
  });
  const { __return, reduceRsp, reduceRsp: { errMsg } } = await DCacheOptPrx.reduceDCache(option);
  assert(__return === 0, errMsg);
  const configTransferRsp = await service.configTransfer({
    appName, moduleName, type: 2, srcGroupName, dstGroupName: [],
  });
  return {
    reduceRsp,
    configTransferRsp,
  };
};

/**
 * 停止迁移、扩容、缩容操作
 * @appName     应用名
 * @moduleName  模块名
 * @type        '0' 是迁移， '1' 是扩容， '2' 是缩容
 * @srcGroupName 原组
 * @dstGroupName 目标组
 *
 */
service.stopTransfer = async function ({
  appName = '', moduleName = '', type = '1', srcGroupName = '', dstGroupName = '',
}) {
  const option = new DCacheOptStruct.StopTransferReq();
  option.readFromObject({
    appName,
    moduleName,
    type: `${type}`,
    srcGroupName,
    dstGroupName,
  });
  const res = await DCacheOptPrx.stopTransfer(option);
  console.log('rsp', res);
  console.log('rsp', res);
  const { __return, rsp, rsp: { errMsg } } = res;
  assert(__return === 0, errMsg);
  return rsp;
};

/**
 * 删除迁移、扩容、缩容操作记录
 * @appName     应用名
 * @moduleName  模块名
 * @type        '0' 是迁移， '1' 是扩容， '2' 是缩容
 * @srcGroupName 原组
 * @dstGroupName 目标组
 *
 */
service.deleteTransfer = async function ({
  appName = '', moduleName = '', type = '1', srcGroupName = '', dstGroupName = '',
}) {
  const option = new DCacheOptStruct.DeleteTransferReq();
  option.readFromObject({
    appName,
    moduleName,
    type: `${type}`,
    srcGroupName,
    dstGroupName,
  });
  const res = await DCacheOptPrx.deleteTransfer(option);
  console.log('res', res);
  const { __return, rsp, rsp: { errMsg } } = res;
  assert(__return === 0, errMsg);
  return rsp;
};

/**
 * 主备切换
 * 0 require string appName;
 * 1 require string moduleName;
 * 2 require string groupName;
 * 3 optional bool forceSwitch; // 是否强制切换
 * 4 optional int diffBinlogTime;
 * @returns {Promise<void>}
 */
service.switchServer = async function ({
  appName, moduleName, groupName, forceSwitch = false, diffBinlogTime = 5,
}) {
  const option = new DCacheOptStruct.SwitchReq();
  option.readFromObject({
    appName, moduleName, groupName, forceSwitch, diffBinlogTime,
  });
  const { __return, rsp, rsp: { errMsg } } = await DCacheOptPrx.switchServer(option);
  assert(__return === 0, errMsg);
  return rsp;
};

// 主备切换
service.switchMainBackup = async function ({ moduleName, groupName }) {
  const main = await serverConfigService.findOne({ where: { module_name: moduleName, group_name: groupName, server_type: 1 } });
  const backup = await serverConfigService.findOne({ where: { module_name: moduleName, group_name: groupName, server_type: 0 } });
  return Promise.all([
    main.update({ server_type: 0 }),
    backup.update({ server_type: 1 }),
  ]);
};

/*
* 查询切换信息请求
* cond 查询条件，<"appName", "Test">表示查询应用名为Test的切换信息，
*   索引值为 SwitchRecord 中的成员: appName, moduleName, groupName, msterServer, slaveServer, mirrorIdc, masterMirror, slaveMirror, switchTime, switchType, switchResult, groupStatus,
*   除switchTime外其它为字符串值，switchTime为时间范围，其条件格式为从小到大的时间且以"|"分隔:"2019-01-01 12:00:00|2019-01-01 13:00:00"
*   switchType: "0"-主备切换，"1"-镜像主备切换，"2"-无镜像备机切换，"3"-备机不可读
*   switchResult: "0"-正在切换, "1"-切换成功, "2"-未切换, "3"-切换失败
*   groupStatus: "0"-标识读写, "1"-标识只读, "2"-镜像不可用
* index: 获取数据的索引(从0开始)
* number: 一次获取数据的个数(获取全部数据 number设置为-1)
* struct SwitchInfoReq
{
  0 require map<string, string> cond;
  1 require int index;
  2 require int number;
};
*/
service.getSwitchInfo = async function ({
  appName = '', moduleName = '', groupName = '', msterServer = '', slaveServer = '',
}) {
  const option = new DCacheOptStruct.SwitchInfoReq();
  const cond = {};
  if (appName) cond.appName = appName;
  if (moduleName) cond.moduleName = moduleName;
  if (groupName) cond.groupName = groupName;
  if (msterServer) cond.msterServer = msterServer;
  if (slaveServer) cond.slaveServer = slaveServer;
  option.readFromObject({
    index: 0,
    number: -1,
    cond,
  });
  const { __return, rsp, rsp: { errMsg } } = await DCacheOptPrx.getSwitchInfo(option);
  assert(__return === 0, errMsg);
  return rsp;
};

let timer = null;
service.getReleaseProgress = async function (releaseId, appName, moduleName, type, srcGroupName, dstGroupName) {
  try {
    const { percent } = await ModuleConfigService.getReleaseProgress(releaseId);
    if (+percent !== 100) {
      timer = setTimeout(() => { service.getReleaseProgress(releaseId, appName, moduleName, type, srcGroupName, dstGroupName); }, 2000);
    } else {
      if (timer) clearInterval(timer);
      await service.configTransfer({
        appName, moduleName, type, srcGroupName, dstGroupName,
      });
    }
  } catch (err) {
    logger.error('[getReleaseProgress]:', err);
    console.error(err);
  }
};

module.exports = service;
