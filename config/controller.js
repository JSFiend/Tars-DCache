let cwd = process.cwd();
let path = require('path');

const logger = require(path.join(cwd, './app/logger'));
const util = require(path.join(cwd, './app/tools/util'));

const assert = require('assert');

const {
	getConfig,
	addConfig,
	deleteConfig,
	editConfig,
	getServerConfigItemList,
	getServerNodeConfigItemList,
	addServerConfigItem,
	deleteServerConfigItem,
	updateServerConfigItem,
	updateServerConfigItemBatch,
	deleteServerConfigItemBatch
} = require('./service.js');

const {getModuleConfigByName} = require('./../moduleConfig/service.js');


const controller = {};

controller.getConfig = async function (ctx) {
	try {
		let configList = await getConfig();
		ctx.makeResObj(200, '', configList);
	} catch (err) {
		console.error('[getConfig]: ', err);
		logger.error('[getConfig]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
};

controller.addConfig = async function (ctx) {
	try {
		let {remark, item, path, reload, period} = ctx.paramsObj;
		let res = await addConfig({remark, item, path, reload, period});
		ctx.makeResObj(200, '', res);
	} catch (err) {
		console.error('[addConfig]: ', err);
		logger.error('[addConfig]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
}

controller.deleteConfig = async function (ctx) {
	try {
		let {id} = ctx.paramsObj;
		let res = await deleteConfig({id});
		ctx.makeResObj(200, '', res);
	} catch (err) {
		console.error('[deleteConfig]: ', err);
		logger.error('[deleteConfig]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
}

controller.editConfig = async function (ctx) {
	try {
		let {id, remark, item, path, reload, period} = ctx.paramsObj;
		let res = await editConfig({id, remark, item, path, reload, period});
		ctx.makeResObj(200, '', res);
	} catch (err) {
		console.error('[deleteConfig]: ', err);
		logger.error('[deleteConfig]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
}

controller.getModuleConfig = async function (ctx) {
	try {
		let {moduleName} = ctx.paramsObj;
		let moduleInfo = await getModuleConfigByName({moduleName, queryAppBase: ['name', 'set_area']});
		assert(moduleInfo, '#cache.config.noModuleExist#');
		let appName = moduleInfo.AppBase.name;
		let res = await getServerConfigItemList({appName, moduleName});
		ctx.makeResObj(200, '', res);
	} catch (err) {
		console.error('[getModuleConfig]: ', err);
		logger.error('[getModuleConfig]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
};

controller.getServerConfig = async function (ctx) {
	try {
		let {moduleName, serverName, nodeName} = ctx.paramsObj;
		let moduleInfo = await getModuleConfigByName({moduleName, queryAppBase: ['name', 'set_area']});
		assert(moduleInfo, '#cache.config.noModuleExist#');
		let appName = moduleInfo.AppBase.name;
		let res = await getServerConfigItemList({appName, moduleName, serverName, nodeName});
		ctx.makeResObj(200, '', res);
	} catch (err) {
		console.error('[getServerConfig]: ', err);
		logger.error('[getServerConfig]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
};

controller.getServerNodeConfig = async function (ctx) {
	try {
		let {serverName, nodeName} = ctx.paramsObj;
		let res = await getServerNodeConfigItemList({serverName, nodeName});
		ctx.makeResObj(200, '', res);
	} catch (err) {
		console.error('[getServerNodeConfigItemList]: ', err);
		logger.error('[getServerNodeConfigItemList]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
};

controller.addServerConfigItem = async function (ctx) {
	try {
		let {appName, moduleName, serverName, nodeName, configValue, itemId} = ctx.paramsObj;
		// 有moduleName 的是模块添加配置，  只有 serverName 和 nodeName 的是服务添加配置
		if (moduleName) {
			let moduleInfo = await getModuleConfigByName({moduleName, queryAppBase: ['name', 'set_area']});
			assert(moduleInfo, '#cache.config.noModuleExist#');
			appName = moduleInfo.AppBase.name;
			nodeName = "";
			serverName = "";
		}
		let res = await addServerConfigItem({appName, moduleName, serverName, nodeName, configValue, itemId});
		ctx.makeResObj(200, '', res);
	} catch (err) {
		console.error('[getServerNodeConfigItemList]: ', err);
		logger.error('[getServerNodeConfigItemList]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
};

controller.deleteServerConfigItem = async function (ctx) {
	try {
		let {id} = ctx.paramsObj;
		let res = await deleteServerConfigItem({indexId: id});
		ctx.makeResObj(200, '', res);
	} catch (err) {
		console.error('[deleteServerConfigItem]: ', err);
		logger.error('[deleteServerConfigItem]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
};


controller.updateServerConfigItem = async function (ctx) {
	try {
		let {id, configValue} = ctx.paramsObj;
		let res = await updateServerConfigItem({indexId: id, configValue});
		ctx.makeResObj(200, '', res);
	} catch (err) {
		console.error('[updateServerConfigItem]: ', err);
		logger.error('[updateServerConfigItem]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
};

controller.updateServerConfigItemBatch = async function (ctx) {
	try {
		let {serverConfigList} = ctx.paramsObj;
		let res = await updateServerConfigItemBatch({serverConfigList});
		ctx.makeResObj(200, '', res);
	} catch (err) {
		console.error('[updateServerConfigItemBatch]: ', err);
		logger.error('[updateServerConfigItemBatch]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
};

controller.deleteServerConfigItemBatch = async function (ctx) {
	try {
		let {serverConfigList} = ctx.paramsObj;
		let res = await deleteServerConfigItemBatch({serverConfigList});
		ctx.makeResObj(200, '', res);
	} catch (err) {
		console.error('[deleteServerConfigItemBatch]: ', err);
		logger.error('[deleteServerConfigItemBatch]: ', err);
		ctx.makeResObj(500, err.message, {});
	}
};


module.exports = controller;
