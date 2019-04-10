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

let cwd = process.cwd();
let path = require('path');
let assert = require('assert');


var TarsStream = require("@tars/stream");

const {DCacheOptPrx, DCacheOptStruct, client} = require(path.join(cwd, './app/service/util/rpcClient'));
let Service = {};

module.exports = Service;

Service.getConfig = async function () {
	let option = new DCacheOptStruct.CacheConfigReq();
	option.readFromObject({
		id: "",
		remark: "",
		item: "",
		path: "",
		reload: "",
		period: "",
	});
	let {__return, configRsp: {errMsg, configItemList}} = await DCacheOptPrx.getCacheConfigItemList(option);
	assert(__return === 0, errMsg);
	return configItemList;
};

Service.addConfig = async function ({remark, item, path, reload, period}) {
	let option = new DCacheOptStruct.CacheConfigReq();
	option.readFromObject({
		remark,
		item,
		path,
		reload,
		period,
	});
	let {__return, configRsp: {errMsg, configItemList}} = await DCacheOptPrx.addCacheConfigItem(option);
	console.log({__return, configItemList, errMsg});
	assert(__return === 0, errMsg);
	return configItemList;
};

Service.deleteConfig = async function ({id}) {
	let option = new DCacheOptStruct.CacheConfigReq();
	option.readFromObject({
		id,
	});
	let {__return, configRsp: {errMsg, configItemList}} = await DCacheOptPrx.deleteCacheConfigItem(option);
	console.log({__return, configItemList, errMsg});
	assert(__return === 0, errMsg);
	return configItemList;
};

Service.editConfig = async function ({id, remark, item, path, reload, period}) {
	let option = new DCacheOptStruct.CacheConfigReq();
	option.readFromObject({id, remark, item, path, reload, period});
	let {__return, configRsp: {errMsg, configItemList}} = await DCacheOptPrx.updateCacheConfigItem(option);
	console.log({__return, configItemList, errMsg});
	assert(__return === 0, errMsg);
	return configItemList;
};

Service.getServerConfigItemList = async function ({appName = "", moduleName = "", serverName = "", nodeName = "", itemId = "", configValue = "", configFlag = "", lastUser = "", indexId = "",}) {
	let option = new DCacheOptStruct.ServerConfigReq();
	option.readFromObject({
		appName,
		moduleName,
		serverName: serverName ? 'DCache.' + serverName : '',
		nodeName,
		itemId,
		configValue,
		configFlag,
		lastUser,
		indexId,
	});
	let {__return, configRsp: {errMsg, configItemList}} = await DCacheOptPrx.getServerConfigItemList(option);
	console.log({__return, configItemList, errMsg});
	assert(__return === 0, errMsg);
	return configItemList;
};


Service.getServerNodeConfigItemList = async function ({appName = "", moduleName = "", serverName = "", nodeName = "", itemId = "", configValue = "", configFlag = "", lastUser = "", indexId = "",}) {
	let option = new DCacheOptStruct.ServerConfigReq();
	option.readFromObject({
		appName,
		moduleName,
		serverName: serverName ? 'DCache.' + serverName : '',
		nodeName,
		itemId,
		configValue,
		configFlag,
		lastUser,
		indexId,
	});
	let {__return, configRsp: {errMsg, configItemList}} = await DCacheOptPrx.getServerNodeConfigItemList(option);
	console.log({__return, configItemList, errMsg});
	assert(__return === 0, errMsg);
	return configItemList;
};

Service.addServerConfigItem = async function ({appName = "", moduleName = "", serverName = "", nodeName = "", itemId = "", configValue = "", configFlag = "0", lastUser = "system", indexId = "",}) {
	let option = new DCacheOptStruct.ServerConfigReq();
	option.readFromObject({
		appName,
		moduleName,
		serverName: serverName ? 'DCache.' + serverName : '',
		nodeName,
		itemId,
		configValue,
		configFlag,
		lastUser,
		indexId,
	});
	try {
		let {__return, configRsp: {errMsg, configItemList}, ...other} = await DCacheOptPrx.addServerConfigItem(option);
		console.log('addServerConfigItem', {__return, configItemList, errMsg, other});
		assert(__return === 0, errMsg);
		return configItemList;
	} catch (err) {
		console.error(err);
	}
};


Service.deleteServerConfigItem = async function ({appName = "", moduleName = "", serverName = "", nodeName = "", itemId = "", configValue = "", configFlag = "0", lastUser = "system", indexId = "",}) {
	let option = new DCacheOptStruct.ServerConfigReq();
	option.readFromObject({
		appName,
		moduleName,
		serverName: serverName ? 'DCache.' + serverName : '',
		nodeName,
		itemId,
		configValue,
		configFlag,
		lastUser,
		indexId,
	});
	let {__return, configRsp: {errMsg, configItemList}} = await DCacheOptPrx.deleteServerConfigItem(option);
	console.log({__return, configItemList, errMsg});
	assert(__return === 0, errMsg);
	return configItemList;
};


Service.updateServerConfigItem = async function ({appName = "", moduleName = "", serverName = "", nodeName = "", itemId = "", configValue = "", configFlag = "0", lastUser = "system", indexId = "",}) {
	let option = new DCacheOptStruct.ServerConfigReq();
	option.readFromObject({
		appName,
		moduleName,
		serverName: serverName ? 'DCache.' + serverName : '',
		nodeName,
		itemId,
		configValue,
		configFlag,
		lastUser,
		indexId,
	});
	let {__return, configRsp: {errMsg, configItemList}} = await DCacheOptPrx.updateServerConfigItem(option);
	console.log({__return, configItemList, errMsg});
	assert(__return === 0, errMsg);
	return configItemList;
};

Service.updateServerConfigItemBatch = async function ({serverConfigList}) {
	let defaultOption = {
		appName: '',
		moduleName: '',
		serverName: '',
		nodeName: '',
		itemId: '',
		configValue: '',
		configFlag: '0',
		lastUser: 'system',
		indexId: '',
	};
	let ServerConfigReqOption = new TarsStream.List(DCacheOptStruct.ServerConfigReq);
	let array = [];
	serverConfigList.forEach(item => {
		let option = new DCacheOptStruct.ServerConfigReq();
		item = Object.assign({}, defaultOption, item);
		let {appName, moduleName, serverName, nodeName, itemId, configValue, configFlag, lastUser, indexId} = item;
		option.readFromObject({
			appName,
			moduleName,
			serverName: serverName ? 'DCache.' + serverName : '',
			nodeName,
			itemId,
			configValue,
			configFlag,
			lastUser,
			indexId
		});
		array.push(option);
	});
	ServerConfigReqOption.readFromObject(array);
	let {__return, configRsp: {errMsg, configItemList}} = await DCacheOptPrx.updateServerConfigItemBatch(ServerConfigReqOption);
	console.log({__return, configItemList, errMsg});
	assert(__return === 0, errMsg);
	return configItemList;
};


Service.deleteServerConfigItemBatch = async function ({serverConfigList}) {
	let defaultOption = {
		appName: '',
		moduleName: '',
		serverName: '',
		nodeName: '',
		itemId: '',
		configValue: '',
		configFlag: '0',
		lastUser: 'system',
		indexId: '',
	};
	let ServerConfigReqOption = new TarsStream.List(DCacheOptStruct.ServerConfigReq);
	let array = [];
	serverConfigList.forEach(item => {
		let option = new DCacheOptStruct.ServerConfigReq();
		item = Object.assign({}, defaultOption, item);
		let {appName, moduleName, serverName, nodeName, itemId, configValue, configFlag, lastUser, indexId} = item;
		option.readFromObject({
			appName,
			moduleName,
			serverName: serverName ? 'DCache.' + serverName : '',
			nodeName,
			itemId,
			configValue,
			configFlag,
			lastUser,
			indexId
		});
		array.push(option);
	});
	ServerConfigReqOption.readFromObject(array);
	let {__return, configRsp: {errMsg, configItemList}} = await DCacheOptPrx.deleteServerConfigItemBatch(ServerConfigReqOption);
	console.log({__return, configItemList, errMsg});
	assert(__return === 0, errMsg);
	return configItemList;
};



