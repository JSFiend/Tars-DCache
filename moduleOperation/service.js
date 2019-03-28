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


module.exports = service;