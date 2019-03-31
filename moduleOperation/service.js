const path = require('path');
const assert = require('assert');
let cwd = process.cwd();
const {DCacheOptPrx, DCacheOptStruct, client} = require(path.join(cwd, './app/service/util/rpcClient'));

const TarsStream = require("@tars/stream");

const Dao = require('./dao.js');
const ExpandServerDao = require('./expandServerDao');

const service = {};

service.add = async function ({type, status, appName, moduleName, servers, cache_version}) {

  let operationRecord = await Dao.add({type, status, appName, moduleName, servers, cache_version});

  let preExpandServers = servers.map(item => {
    return {
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
    }
  });

  // 扩容数据入库
  let expandServers = await ExpandServerDao.addList(preExpandServers);

  operationRecord.setDataValue('expandServers', expandServers);

  return operationRecord
};

service.findOne = async function ({type, status, appName, moduleName, cache_version}) {
  return await Dao.findOne({where: {type, status, appName, moduleName, cache_version}});
};

service.optExpandDCache = async function ({appName, moduleName, expandServers, cache_version, replace = false}) {

  let cacheHost = expandServers.map ( item => {
    return {
      serverName: `DCache.${item.server_name}`,
      serverIp: item.server_ip,
      templateFile: 'tars.default',
      type: item.server_type ? 'S' : 'M',
      bakSrcServerName: item.server_type ? `DCache.${expandServers[0].server_name}` : '',
      idc: item.area,
      priority: item.server_type ? '2' : '1',
      groupName: item.group_name,
      shmSize: item.memory.toString(),
      // 共享内存key?
      shmKey: item.shmKey,
      isContainer: item.is_docker.toString()
    }
  });

  let option = new DCacheOptStruct.ExpandReq();
  option.readFromObject({
    appName,
    moduleName,
    cacheHost,
    cacheType: cache_version,
    version: '',
    replace,
  });

  let {__return, expandRsp, expandRsp: {errMsg}} = await DCacheOptPrx.expandDCache(option);
  assert(__return === 0, errMsg);
  return expandRsp;
};

service.releaseServer = async function ({expandServers}) {

  let serverList = [];
  expandServers.forEach( item => {
    let releaseInfo = new DCacheOptStruct.ReleaseInfo();
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
  let option = new TarsStream.List(DCacheOptStruct.ReleaseInfo);
  option.readFromObject(serverList);

  let {__return, releaseRsp, releaseRsp: {releaseId, errMsg}} = await DCacheOptPrx.releaseServer(option);
  assert(__return === 0, errMsg);
  return releaseRsp;
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
service.configTransfer = async function ({appName, moduleName, type = 1, srcGroupName = [], dstGroupName = []}) {

  let option = new DCacheOptStruct.ConfigTransferReq();
  option.readFromObject({
    appName,
    moduleName,
    type,
    srcGroupName,
    dstGroupName,
  });

  let {__return, rsp, rsp: {errMsg}} = await DCacheOptPrx.configTransfer(option);
  assert(__return === 0, errMsg);
  return rsp
};
/**
 *  0 require map<string, string> cond; // 查询条件
 *  1 require int index;                // 获取数据的索引(从0开始)
 *  2 require int number;               // 一次获取数据的个数(获取全部数据 number设置为-1)
 *  应用名: key为 appName, value为应用名
 *  模块名: key为 module, value为模块名
 *  迁移源组: key为src_group, value为源组名
 *  迁移目的组: key为dest_group, value为目的组名
 *  状态: key为 status， value: "0"为新增迁移任务，"1"为配置阶段完成，"2"为发布完成，"3"为正在迁移，"4"为完成，"5"为停止
 *  类型: key为 type, value: "0"为迁移,"1"为扩容,"2"为缩容,"3"为路由整理
 * 
 */
service.getRouterChange = async function ( {
  appName = '',
  module = '',
  src_group = '',
  dest_group = '',
  status = '',
  type = '1',
}) {
  let option = new DCacheOptStruct.RouterChangeReq();
  let cond = {};
  if (appName) cond.appName = appName;
  if (module) cond.module= module;
  if (src_group) cond.src_group = src_group;
  if (dest_group) cond.dest_group = dest_group;
  cond.type = type;
  option.readFromObject({
    index: 0,
    number: -1,
    cond
  });
  let {__return, rsp, rsp: {errMsg, totalNum, transferRecord}} = await DCacheOptPrx.getRouterChange(option);
  assert(__return === 0, errMsg);
  return rsp
};

module.exports = service;
