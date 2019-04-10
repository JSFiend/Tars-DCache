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

const PatchService = require(path.join(cwd, './app/service/patch/PatchService'));
const TreeService = require(path.join(cwd, './app/service/server/TreeService'));

const {DCacheOptPrx, DCacheOptStruct, client} = require(path.join(cwd, './app/service/util/rpcClient'));

const ApplyService = require('./service');

const {getPublishSuccessModuleConfig, removeModuleConfig} = require('./../moduleConfig/service');

var TarsStream = require("@tars/stream");

const ApplyController = {
	dtree: async (ctx) => {
		try {
			// 获取 Dcache 的三个服务
			let tarsDcache = await TreeService.getTreeNodes(ctx.uid, '', ['DCache.DCacheOptServer', 'DCache.ConfigServer', 'DCache.PropertyServer']);

			console.log('tarsDcachetarsDcache', tarsDcache.length)
			let serverList = [];
			let treeNodeMap = {};
			let rootNode = [];

			// 获取 dache 的router、proxy 服务
			let applys = await ApplyService.getApplyList({
				queryRouter: ['server_name'],
				queryProxy: ['server_name'],
				raw: false
			});
			applys.forEach(async (item) => {
				let {
					id,
					status,
					idc_area,
					set_area,
					admin,
					name,
					create_person
				} = item.dataValues;
				let RouterServer_name = item.get('Router') ? item.get('Router').get('server_name') : '';
				let ProxyServer_name = item.get('Proxy')[0] ? item.get('Proxy')[0].get('server_name') : '';

				// 如果没有 proxy、router 删除该应用
				if (!RouterServer_name && !ProxyServer_name) {
					return await ApplyService.removeApply({id})
				}

				let applyServer = [];
				if (RouterServer_name) applyServer.push({
					name: RouterServer_name,
					id: '1DCache.5' + RouterServer_name,
					pid: '1' + name,
					is_parent: false,
					open: false,
					children: [],
					serverType: 'router'
				});
				if (ProxyServer_name) applyServer.push({
					name: ProxyServer_name,
					id: '1DCache.5' + ProxyServer_name,
					pid: '1' + name,
					is_parent: false,
					open: false,
					children: [],
					serverType: 'proxy'
				});
				serverList = serverList.concat(applyServer);
			});
			serverList.forEach(server => {
				// treeNodeMap[id] = server;
				TreeService.parents(treeNodeMap, server, rootNode);
			});

			// 获取 cache 服务
			let cacheServers = await getPublishSuccessModuleConfig();
			cacheServers.forEach(cacheServer => {
				cacheServer = cacheServer.get({plain: true});
				// console.log(cacheServer.server_name)
				// 看看存不存在该应用， 不存在就返回
				let applyNode = rootNode.find(node => node.name === cacheServer.AppBase.name);
				if (!applyNode) return false;

				// 如果模块服务全部下线了， 删除该模块基本信息  删除表信息  t_apply_cache_module_conf、t_apply_cache_module_base(预留先不删) 的信息
				if (cacheServer.ServerConf.length === 0) {
					// 不需要等 await 返回
					removeModuleConfig(cacheServer);
				}

				// 把 cache 节点附加上目录树节点
				cacheServer.ServerConf.forEach(server => {
					let cacheNode = {
						name: server.server_name,
						id: `1Dcache.5${server.server_name}`,
						pid: `1${cacheServer.AppBase.name}`,
						is_parent: false,
						open: false,
						children: [],
						serverType: 'dcache'
						// moduleName: server.module_name
					};

					// 看看该应用是否已经有了存放 cahce 的模块的节点
					let moduleNode = applyNode.children.find(item => item.name === server.module_name);
					if (!moduleNode) {
						moduleNode = {
							name: server.module_name,
							id: `1Dcache.5${server.module_name}`,
							pid: `1${cacheServer.AppBase.name}`,
							is_parent: false,
							open: false,
							children: [],
							moduleName: server.module_name
						};
						applyNode.children.push(moduleNode)
					}
					moduleNode.children.push(cacheNode)
				})
			});


			tarsDcache = tarsDcache.concat(rootNode);


			ctx.makeResObj(200, '', tarsDcache)
		} catch (e) {
			logger.error('[dtree]', e, ctx);
			ctx.makeResObj(500, e.message, {});
		}
	},
	async getPublishSuccessModuleConfig (ctx) {
    ctx.makeResObj(200, '', await getPublishSuccessModuleConfig())
  },
	getApplyList: async (ctx) => {
		try {
			let applys = await ApplyService.getApplyList();
			ctx.makeResObj(200, '', applys)
		} catch (err) {
			logger.error('[getApplyList]:', err);
			ctx.makeErrResObj();
		}
	},
	addApply: async (ctx) => {
		try {
			let {admin, name, idcArea, setArea} = ctx.paramsObj;
			let create_person = 'adminUser';
			// 创建应用
			let data = await ApplyService.addApply({idc_area: idcArea, set_area: setArea, admin, name, create_person});

			ctx.makeResObj(200, '', data)
		} catch (err) {
			logger.error('[addApply]:', err);
			ctx.makeResObj(500, err.message);
		}
	},
	installAndPublish: async (ctx) => {
		try {
			let {applyId} = ctx.paramsObj;
			let queryRouter = ['id', 'apply_id', 'server_name', 'server_ip', 'template_file', 'router_db_name', 'router_db_ip', 'router_db_port', 'router_db_user', 'router_db_pass', 'create_person'];
			let queryProxy = ['id', 'apply_id', 'server_name', 'server_ip', 'template_file', 'idc_area', 'create_person'];
			let apply = await ApplyService.getApply({applyId, queryRouter, queryProxy});
			let {name, Router, Proxy} = apply;
			let serverIp = [];
			Proxy.forEach(function (proxy) {
				// idc_area:"sz"
				// server_ip:""
				proxy.server_ip.split(';').forEach(function (ip) {
					if (ip) serverIp.push({
						ip: ip,
						idcArea: proxy.idc_area,
					},)
				})
			});
			let option = new DCacheOptStruct.InstallAppReq();
			option.readFromObject({
				appName: name,
				routerParam: {
					installRouter: true,
					serverName: 'DCache.' + Router.server_name,
					appName: name,
					serverIp: Router.server_ip.split(';'),
					templateFile: Router.template_file,
					dbName: Router.router_db_name,
					dbIp: Router.router_db_ip,
					dbPort: Router.router_db_port,
					dbUser: Router.router_db_user,
					dbPwd: Router.router_db_pass,
					remark: "",
				},
				proxyParam: {
					installProxy: true,
					serverName: 'DCache.' + Proxy[0].server_name,
					appName: name,
					serverIp: serverIp,
					templateFile: Proxy[0].template_file,
				},
				version: "1.0",
				replace: apply.status === 2
			});
			let args = await DCacheOptPrx.installApp(option);
			logger.info('[DCacheOptPrx.installApp]:', args);
			// {"__return":0,"instalRsp":{"errMsg":""}}
			let {__return, instalRsp} = args;
			if (__return === 0) {
				//  安装成功， 应用进入目录树
				await apply.update({'status': 2});

				// 先获取发布包id
				let defaultProxyPackage = await PatchService.find({
					where: {
						server: 'DCache.ProxyServer',
						default_version: 1
					}
				});
				if (!defaultProxyPackage) throw new Error('#apply.noDefaultProxyPackage#');
				let defaultRouterPackage = await PatchService.find({
					where: {
						server: 'DCache.RouterServer',
						default_version: 1
					}
				});
				if (!defaultRouterPackage) throw new Error('#apply.noDefaultRouterPackage#');
				// 发布流程

				// 先发布 proxy
				let releaseInfoOption = new TarsStream.List(DCacheOptStruct.ReleaseInfo);
				let releaseArr = [];
				Proxy.forEach(function (proxy) {
					let releaseInfo = new DCacheOptStruct.ReleaseInfo();
					releaseInfo.readFromObject({
						appName: 'DCache',
						serverName: proxy.server_name,
						nodeName: proxy.server_ip,
						groupName: "ProxyServer",
						version: '' + defaultProxyPackage.id,
						user: "adminUser",
						md5: "",
						status: 0,
						error: "",
						ostype: "",
					});
					releaseArr.push(releaseInfo);
				});
				releaseInfoOption.readFromObject(releaseArr);
				console.log(releaseInfoOption);
				let argsProxy = await DCacheOptPrx.releaseServer(releaseInfoOption);
				// {"__return":0,"releaseRsp":{"releaseId":1,"errMsg":"sucess to release server"}}
				logger.info('[DCacheOptPrx.publishApp] argsProxy:', argsProxy);
				let {__return, releaseRsp} = argsProxy;
				if (__return !== 0) {
					throw new Error(releaseRsp.errMsg)
				}

				// 发布 router
				releaseInfoOption = new TarsStream.List(DCacheOptStruct.ReleaseInfo);
				let releaseInfo = new DCacheOptStruct.ReleaseInfo();
				releaseArr = [];
				releaseInfo.readFromObject({
					appName: 'DCache',
					serverName: Router.server_name,
					nodeName: Router.server_ip,
					groupName: "RouterServer",
					version: '' + defaultRouterPackage.id,
					user: "adminUser",
					md5: "",
					status: 0,
					error: "",
					ostype: "",
				});
				releaseArr.push(releaseInfo);
				releaseInfoOption.readFromObject(releaseArr);
				let argsRouter = await DCacheOptPrx.releaseServer(releaseInfoOption);
				logger.info('[DCacheOptPrx.publishApp] argsRouter:', argsRouter);
				// {"__return":0,"releaseRsp":{"releaseId":1,"errMsg":"sucess to release server"}}
				if (argsRouter.__return !== 0) {
					// 发布失败
					throw new Error(argsRouter.releaseRsp.errMsg)
				}
				ctx.makeResObj(200, '', {
					proxy: argsProxy.releaseRsp,
					router: argsRouter.releaseRsp
				});

			} else {
				// 安装失败
				throw new Error(instalRsp.errMsg)
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
			let {proxyReleaseId, routerReleaseId} = ctx.paramsObj;
			let ProxyReleaseProgressReq = new DCacheOptStruct.ReleaseProgressReq();
			let RouterReleaseProgressReq = new DCacheOptStruct.ReleaseProgressReq();
			ProxyReleaseProgressReq.readFromObject({releaseId: proxyReleaseId});
			RouterReleaseProgressReq.readFromObject({releaseId: routerReleaseId});
			let proxyProgressRsp = await DCacheOptPrx.getReleaseProgress(ProxyReleaseProgressReq);
			let routerProgressRsp = await DCacheOptPrx.getReleaseProgress(RouterReleaseProgressReq);
			if (proxyProgressRsp.__return !== 0 || routerProgressRsp.__return !== 0) {
				// 获取进度失败
				throw new Error(proxyProgressRsp.progressRsp.errMsg)
			}
			let progress = [];
			progress.push({
				module: "ProxyServer",
				releaseId: proxyProgressRsp.progressRsp.releaseId,
				percent: proxyProgressRsp.progressRsp.percent
			});
			progress.push({
				module: "RouterServer",
				releaseId: routerProgressRsp.progressRsp.releaseId,
				percent: routerProgressRsp.progressRsp.percent
			});
			//ctx.makeResObj(200, '', {proxyProgressRsp, routerProgressRsp});
			ctx.makeResObj(200, '', {progress});
		} catch (err) {
			logger.error('[getReleaseProgress]:', err);
			ctx.makeResObj(500, err.message);
		}
	},
	getApplyAndRouterAndProxy: async (ctx) => {
		try {
			let {applyId} = ctx.paramsObj;
			let queryRouter = ['id', 'apply_id', 'server_name', 'server_ip', 'template_file', 'router_db_name', 'router_db_ip', 'router_db_port', 'router_db_user', 'router_db_pass', 'create_person'];
			let queryProxy = ['id', 'apply_id', 'server_name', 'server_ip', 'template_file', 'idc_area', 'create_person'];
			let data = await ApplyService.getApply({applyId, queryRouter, queryProxy});
			ctx.makeResObj(200, '', data)
		} catch (err) {
			logger.error('[getApplyAndRouterAndProxy]:', err);
			ctx.makeResObj(500, err.message);
		}
	},
	saveRouterProxy: async (ctx) => {
		try {
			let {Proxy, Router} = ctx.paramsObj;
			let data = await ApplyService.saveRouterProxy({Proxy, Router});
			ctx.makeResObj(200, '', {})
		} catch (err) {
			logger.error('[saveRouterProxy]:', err);
			ctx.makeResObj(500, err.message);
		}
	},
	hasModule: async (ctx) => {
		try {
			let {serverType, serverName} = ctx.paramsObj;
			let hasModule = await ApplyService.hasModule({serverType, serverName})
			ctx.makeResObj(200, '', hasModule)
		} catch (err) {
			logger.error('[hasModule]:', err);
			ctx.makeResObj(500, err.message);
		}
	}
};

module.exports = ApplyController;
