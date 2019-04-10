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