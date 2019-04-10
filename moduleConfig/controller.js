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

const logger = require(path.join(cwd, './app/logger'));
const util = require(path.join(cwd, './app/tools/util'));
const ApplyService = require('./../apply/service.js');
const ModuleConfigService = require('./service.js');
const PatchService = require(path.join(cwd, './app/service/patch/PatchService'));
const {DCacheOptPrx, DCacheOptStruct, client} = require(path.join(cwd, './app/service/util/rpcClient'));
var TarsStream = require("@tars/stream");

const ModuleConfigController = {
	addModuleConfig: async (ctx) => {
		try {
			let {
				admin,
				cache_module_type,
				cache_type,
				db_data_count,
				idc_area,
				key_type,
				max_read_flow,
				max_write_flow,
				apply_id,
				module_id,
				module_name,
				module_remark,
				per_record_avg,
				set_area,
				total_record,
			}
				= ctx.paramsObj;
			let create_person = 'adminUser';
			let option = {
				admin,
				cache_module_type,
				cache_type,
				db_data_count,
				idc_area,
				key_type,
				max_read_flow,
				max_write_flow,
				apply_id,
				module_id,
				module_name,
				module_remark,
				per_record_avg,
				set_area,
				total_record,
				create_person
			};
			let item = await ModuleConfigService.addModuleConfig(option);
			ctx.makeResObj(200, '', item)
		} catch (err) {
			logger.error('[addModuleConfig]:', err);
			ctx.makeResObj(500, err.message);
		}
	},
	getModuleConfigInfo: async (ctx) => {
		try {
			let {moduleId} = ctx.paramsObj;
			let queryModuleBase = ['cache_version', 'mkcache_struct', 'follower'];
			let item = await ModuleConfigService.getModuleConfigInfo({moduleId, queryModuleBase});
			ctx.makeResObj(200, '', item)
		} catch (err) {
			logger.error('[getModuleConfigInfo]:', err);
			ctx.makeErrResObj();
		}
	},
	getModuleConfigAndServerInfo: async (ctx) => {
		try {
			let {moduleId} = ctx.paramsObj;
			let queryModuleBase = ['cache_version', 'mkcache_struct', 'follower'];
			let queryServerConf = ['id', 'area', 'apply_id', 'module_name', 'group_name', 'server_name', 'server_ip', 'server_type', 'memory', 'shmKey', 'status', 'is_docker'];
			let item = await ModuleConfigService.getModuleConfigInfo({moduleId, queryModuleBase, queryServerConf});
			ctx.makeResObj(200, '', item)
		} catch (err) {
			logger.error('[getModuleConfigAndServerInfo]:', err);
			ctx.makeErrResObj();
		}
	},
	// TODO: finish this function
	installAndPublish: async (ctx) => {
		try {
			let {moduleId, mkCache} = ctx.paramsObj;
			let queryModuleBase = ['cache_version', 'mkcache_struct', 'follower'];
			let queryServerConf = ['id', 'area', 'module_name', 'group_name', 'server_name', 'server_ip', 'server_type', 'memory', 'shmKey', 'status', 'is_docker'];
			let moduleInfo = await ModuleConfigService.getModuleConfigInfo({moduleId, queryModuleBase, queryServerConf});
			let {apply_id, module_name, ServerConf, per_record_avg, ModuleBase} = moduleInfo;
			let applyInfo = await ApplyService.getApply({applyId: apply_id});
			let isMKCache = ModuleBase.cache_version === 2;
			let CacheHost = [];
			let releaseInfoOption = new TarsStream.List(DCacheOptStruct.ReleaseInfo);
			let releaseArr = [];
			let args;
			mkCache = mkCache && JSON.parse(mkCache);

			// 先获取发布包id
			let defaultCachePackage = await PatchService.find({
				where: {
					package_type: ModuleBase.cache_version,
					server: 'DCache.DCacheServerGroup',
					default_version: 1
				}
			});
			if (!defaultCachePackage) throw new Error('#module.noDefaultCachePackage#');

			ServerConf.forEach((item, index) => {
				// for install use
				let host = new DCacheOptStruct.CacheHostParam();
				host.readFromObject({
					serverName: `DCache.${item.server_name}`,
					serverIp: item.server_ip,
					templateFile: 'tars.default',
					type: item.server_type ? 'S' : 'M',
					bakSrcServerName: item.server_type ? `DCache.${ServerConf[0].server_name}` : '',
					idc: item.area,
					priority: item.server_type ? '2' : '1',
					groupName: item.group_name,
					shmSize: item.memory.toString(),
					// 共享内存key?
					shmKey: item.shmKey,
					isContainer: item.is_docker.toString()
				});
				CacheHost.push(host);

				// for publish use
				let releaseInfo = new DCacheOptStruct.ReleaseInfo();
				releaseInfo.readFromObject({
					appName: 'DCache',
					serverName: item.server_name,
					nodeName: item.server_ip,
					groupName: 'DCacheServerGroup',
					version: defaultCachePackage.id.toString(),
					user: 'adminUser',
					md5: '',
					status: 0,
					error: '',
					ostype: '',
				});
				releaseArr.push(releaseInfo);
			});
			if (!isMKCache) {
				// 一期模块
				let kvCacheConf = new DCacheOptStruct.SingleKeyConfParam();
				kvCacheConf.readFromObject({
					avgDataSize: per_record_avg.toString(),
					readDbFlag: 'Y',
					enableErase: 'N',
					eraseRadio: '',
					saveOnlyKey: 'Y',
					dbFlag: 'N',
					dbAccessIntfaceType: '',
					dbAccessServant: '',
					startExpireThread: 'N',
					expireDb: 'N'
				});
				let option = new DCacheOptStruct.InstallKVCacheReq();
				console.log('moduleInfo', moduleInfo)
				console.log('moduleInfo.status', moduleInfo.status)
				option.readFromObject({
					appName: applyInfo.name,
					moduleName: module_name,
					kvCacheHost: CacheHost,
					kvCacheConf,
					version: ModuleBase.cache_version.toString(),
					replace: moduleInfo.status === 2
				});
				console.log(option.kvCacheConf);
				args = await DCacheOptPrx.installKVCacheModule(option);
			} else {
				// 二期模块
				let mkvCacheConf = new DCacheOptStruct.MultiKeyConfParam();
				mkvCacheConf.readFromObject({
					//mkSize: mkCache.mainKey[0].maxLen,
					avgDataSize: per_record_avg.toString(),
					readDbFlag: 'Y',
					enableErase: 'N',
					eraseRadio: '',
					saveOnlyKey: 'Y',
					dbFlag: 'N',
					//dbAccessIntfaceType: '',
					dbAccessServant: '',
					startExpireThread: 'N',
					expireDb: 'N',
					cacheType: mapCacheType(ModuleBase.mkcache_struct)
				});
				// map param vector<RecordParam> fieldParam
				let fieldParam = [];
				mkCache.mainKey.forEach(item => {
					let record = new DCacheOptStruct.RecordParam();
					record.readFromObject({
						fieldName: item.fieldName,
						keyType: item.keyType,
						dataType: item.dataType,
						property: item.property,
						defaultValue: item.defaultValue,
						maxLen: item.maxLen
					});
					fieldParam.push(record);
				});
				if (ModuleBase.mkcache_struct === 1) {
					mkCache.unionKey.forEach(item => {
						let record = new DCacheOptStruct.RecordParam();
						record.readFromObject({
							fieldName: item.fieldName,
							keyType: item.keyType,
							dataType: item.dataType,
							property: item.property,
							defaultValue: item.defaultValue,
							maxLen: item.maxLen
						});
						fieldParam.push(record);
					});
				}
				mkCache.value.forEach(item => {
					let record = new DCacheOptStruct.RecordParam();
					record.readFromObject({
						fieldName: item.fieldName,
						keyType: item.keyType,
						dataType: item.dataType,
						property: item.property,
						defaultValue: item.defaultValue,
						maxLen: item.maxLen
					});
					fieldParam.push(record);
				});
				let option = new DCacheOptStruct.InstallMKVCacheReq();
				option.readFromObject({
					appName: applyInfo.name,
					moduleName: module_name,
					mkvCacheHost: CacheHost,
					mkvCacheConf,
					fieldParam,
					version: ModuleBase.cache_version.toString(),
					replace: moduleInfo.status === 2
				});
				args = await DCacheOptPrx.installMKVCacheModule(option);
			}
			console.log('[DCacheOptPrx.installApp]:', args);
			// 安装成功， 进入发布
			if (args.__return === 0) {
				// 应用进入目录树
				await moduleInfo.update({'status': 2});

				releaseInfoOption.readFromObject(releaseArr);
				let argsPublish = await DCacheOptPrx.releaseServer(releaseInfoOption);
				logger.info('[DCacheOptPrx.publishApp]:', argsPublish);
				if (argsPublish.__return !== 0) {
					// 发布失败
					throw new Error(argsPublish.releaseRsp.errMsg)
				}
				ctx.makeResObj(200, '', {
					releaseRsp: argsPublish.releaseRsp
				});
			} else {
				// 安装失败
				throw new Error(args.mkvCacheRsp.errMsg)
			}
		} catch (err) {
			logger.error('[installAndPublish]:', err);
			ctx.makeResObj(500, err.message);
		}
	},
	/**
	 * 获取发布进度
	 * @param ctx
	 * @returns {Promise.<void>}
	 */
	getReleaseProgress: async (ctx) => {
		try {
			const {releaseId} = ctx.paramsObj;
			const {progress, percent} = await ModuleConfigService.getReleaseProgress(releaseId);
			ctx.makeResObj(200, '', {progress, percent});
		} catch (err) {
			logger.error('[getReleaseProgress]:', err);
			ctx.makeResObj(500, err.message);
		}
	}
};

mapKeyType = key => {
	if (key === 0) return 'string';
	else if (key === 1) return 'int';
	else return 'longlong';
};

mapCacheType = key => {
	if (key === 1) return 'hash';
	else if (key === 2) return 'list';
	else if (key === 3) return 'set';
	else return 'zset';
};

module.exports = ModuleConfigController;