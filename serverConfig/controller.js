let cwd = process.cwd();
let path = require('path');

const logger = require(path.join(cwd, './app/logger'));
const util = require(path.join(cwd, './app/tools/util'));
const ServerService = require(path.join(cwd, './app/service/server/ServerService'));
const ServerConfigService = require('./service.js');

const serverConfStruct = {
	id: '',
	application: '',
	server_name: '',
	node_name: '',
	server_type: '',
	enable_set: {
		formatter: (value) => {
			return value == 'Y' ? true : false;
		}
	},
	set_name: '',
	set_area: '',
	set_group: '',
	setting_state: '',
	present_state: '',
	bak_flag: {
		formatter: (value) => {
			return value == 0 ? false : true;
		}
	},
	template_name: '',
	profile: '',
	async_thread_num: '',
	base_path: '',
	exe_path: '',
	start_script_path: '',
	stop_script_path: '',
	monitor_script_path: '',
	patch_time: {formatter: util.formatTimeStamp},
	patch_version: "",
	process_id: '',
	posttime: {formatter: util.formatTimeStamp},
};

// 额外添加 cache 的字段
Object.assign(serverConfStruct, {
	dcache_server_type: '',
	group_name: '',
	module_name: '',
	app_name: '',
	area: '',
	memory: '',
	shmKey: '',
	cache_version: '',
	apply_id: '',
});

const ServerConfigController = {
	getCacheServerList: async (ctx) => {
		try {
			let {tree_node_id} = ctx.paramsObj;
			let cacheServerList = await ServerConfigService.getCacheServerList({
				moduleName: tree_node_id,
				attributes: ['apply_id', 'area', 'module_name', 'group_name', 'server_name', 'server_type', 'memory', 'shmKey', 'idc_area' ],
				queryBase: ['name'],
				queryModule: ['cache_module_type']
			});

			let serverNameList = cacheServerList.map(server => `Dcache.${server.server_name}`);
			//用 cache 的服务名去读 tars 的服务
			let serverList = await ServerService.getServerNameList({applicationList: '', serverNameList, allAttr: true});
			// console.log(serverList)
			// return ctx.makeResObj(200, '', {
			// 	serverList,
			// 	serverNameList
			// })
			// 添加 cache 的服务类型， 是主机、备机还是镜像呢
			serverList.forEach(server => {
				let server_name = server.get('server_name');
				let cacheServer = cacheServerList.find(server => server.server_name === server_name);
				let app_name = cacheServer.get('applyBase').get('name');
				let cache_version = cacheServer.get('moduleBase').get('cache_module_type');
				server.setDataValue('area', cacheServer.get('area'));
				server.setDataValue('module_name', tree_node_id);
				server.setDataValue('group_name', cacheServer.get('group_name'));
				server.setDataValue('server_name', cacheServer.get('server_name'));
				server.setDataValue('server_type', cacheServer.get('server_type'));
				server.setDataValue('memory', cacheServer.get('memory'));
				server.setDataValue('shmKey', cacheServer.get('shmKey'));
				server.setDataValue('idc_area', cacheServer.get('idc_area'));
				server.setDataValue('apply_id', cacheServer.get('apply_id'));
				server.setDataValue('app_name', app_name);
				server.setDataValue('cache_version', cache_version);
			});

			ctx.makeResObj(200, '', util.viewFilter(serverList, serverConfStruct))
		} catch (err) {
			logger.error('[getCacheServerList]:', err);
			ctx.makeResObj(500, err.message);
		}
	},
	addServerConfig: async (ctx) => {
		try {
			let options = [];
			for (obj in ctx.paramsObj) {
				let {
					area,
					apply_id,
					module_name,
					group_name,
					server_name,
					server_ip,
					server_type,
					memory,
					shmKey,
					idc_area,
					status,
					modify_time,
					is_docker
				} = ctx.paramsObj[obj];
				let modify_person = 'adminUser';
				let option = {
					area,
					apply_id,
					module_name,
					group_name,
					server_name,
					server_ip,
					server_type,
					memory,
					shmKey: shmKey.toString(),
					idc_area,
					status,
					modify_person,
					modify_time,
					is_docker
				};
				options.push(option);
			}
			let item = await ServerConfigService.addServerConfig(options);
			ctx.makeResObj(200, '', item)
		} catch (err) {
			logger.error('[addServerConfig]:', err);
			ctx.makeResObj(500, err.message);
		}
	},
	getServerfigInfo: async (ctx) => {
		try {
			let {moduleId} = ctx.paramsObj;
			let item = await ServerConfigService.getServerConfigInfo({moduleId});
			ctx.makeResObj(200, '', item)
		} catch (err) {
			logger.error('[getServerConfigInfo]:', err);
			ctx.makeResObj(500, err.message);
		}
	},
	removeServer: async (ctx) => {
		try {
			let {server_name} = ctx.paramsObj;
			let item = await ServerConfigService.removeServer({server_name})
			ctx.makeResObj(200, '', item)
		} catch (err) {
			logger.error('[removeServer]:', err);
			ctx.makeResObj(500, err.message);
		} finally {

		}
	}
};

module.exports = ServerConfigController;