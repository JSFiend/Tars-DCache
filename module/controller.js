let cwd = process.cwd();
let path = require('path');
let assert = require('assert');

const logger = require(path.join(cwd, './app/logger'));
const util = require(path.join(cwd, './app/tools/util'));
const {DCacheOptPrx, DCacheOptStruct, client} = require(path.join(cwd, './app/service/util/rpcClient'));

const ModuleService = require('./service.js');


const ModuleController = {
	async addModuleBaseInfo(ctx) {
		try {
			let {follower, cache_version, mkcache_struct, apply_id} = ctx.paramsObj;
			let create_person = 'adminUser';
			let item = await ModuleService.addModuleBaseInfo({
				apply_id,
				follower,
				cache_version,
				mkcache_struct,
				create_person
			});
			ctx.makeResObj(200, '', item)
		} catch (err) {
			logger.error('[addModuleBaseInfo]:', err);
			ctx.makeErrResObj();
		}
	},
	async getModuleInfo(ctx) {
		try {
			let {moduleId} = ctx.paramsObj;
			let item = await ModuleService.getModuleInfo({id: moduleId});
			ctx.makeResObj(200, '', item)
		} catch (err) {
			logger.error('[getModuleInfo]:', err);
			ctx.makeErrResObj();
		}
	},
	/**
	 * 获取模块信息
	 * @returns {Promise.<void>}
	 */
	async getModuleStruct (ctx) {
		try {
			let {appName, moduleName} = ctx.paramsObj;
			let option = new DCacheOptStruct.ModuleStructReq();
			option.readFromObject({
				appName,
				moduleName,
			})
			let args = await DCacheOptPrx.getModuleStruct(option);
			let {__return, rsp, rsp: {errMsg, serverInfo, cacheType, idc, nodeNum, totalMemSize, avgMemSize}} = args;
			assert(__return === 0, errMsg);
			ctx.makeResObj(200, '', rsp)
		} catch (err) {
			logger.error('[getModuleStruct]:', err);
			ctx.makeResObj(500, err.message);
		}
	}

};

module.exports = ModuleController;