console.log('tars-dcache')
console.log('__dirname', __dirname)
console.log('cwd', process.cwd())
console.log('__filename', __filename)

let cwd = process.cwd()
let path = require('path')

const RegionController = require('./region/controller.js');
const ApplyController = require('./apply/controller.js');
const ModuleController = require('./module/controller.js');
const ModuleConfigController = require('./moduleConfig/controller.js');
const ServerConfigController = require('./serverConfig/controller.js');
const ProxyController = require('./proxy/controller.js');
const RouterController = require('./router/controller.js');
const ModuleOperation = require('./moduleOperation/controller');

const {
	getConfig,
	addConfig,
	deleteConfig,
	editConfig,
	getModuleConfig,
	getServerConfig,
	getServerNodeConfig,
	addServerConfigItem,
	deleteServerConfigItem,
	updateServerConfigItem,
	updateServerConfigItemBatch,
	deleteServerConfigItemBatch
} = require('./config/controller.js');


let {pageConf, apiConf} = require(path.join(cwd, './app/router/routerConf.js'));

let dcachePageConf = [
	['get', '/dcache', async (ctx) => await ctx.redirect('/dcache.html')],
]
let dcacheApiConf = [
	['post', '/set_patch_package_default', async (ctx) => await ctx.makeResObj(200, '', 'aaaaaa')],

	// 地区
	['get', '/get_region_list', RegionController.getRegionList],
	['post', '/add_region', RegionController.addRegion],
	['get', '/delete_region', RegionController.deleteRegion],
	['post', '/update_region', RegionController.updateRegion],

	// 应用
	['post', '/add_apply', ApplyController.addApply],
	['get', '/get_apply_and_router_and_proxy', ApplyController.getApplyAndRouterAndProxy],
	['post', '/save_router_proxy', ApplyController.saveRouterProxy],
	['get', '/get_apply_list', ApplyController.getApplyList],
	['get', '/install_and_publish', ApplyController.installAndPublish],
	['get', '/get_release_progress', ApplyController.getReleaseProgress],
	['get', '/cache/hasModule', ApplyController.hasModule],

	// proxy
	['post', '/cache/removeProxy', ProxyController.removeProxy],

	// router
	['post', '/cache/removeRouter', RouterController.removeRouter],

	// 模块
	['post', '/add_module_base_info', ModuleController.addModuleBaseInfo],
	['get', '/get_module_info', ModuleController.getModuleInfo],
	['get', '/get_module_config_info', ModuleConfigController.getModuleConfigInfo],
	['get', '/get_module_full_info', ModuleConfigController.getModuleConfigAndServerInfo],
	['post', '/add_module_config', ModuleConfigController.addModuleConfig],
	['post', '/add_server_config', ServerConfigController.addServerConfig],
	['get', '/module_install_and_publish', ModuleConfigController.installAndPublish],
	['get', '/get_module_release_progress', ModuleConfigController.getReleaseProgress],
	['get', '/get_cache_server_list', ServerConfigController.getCacheServerList],
	['post', '/cache/removeServer', ServerConfigController.removeServer],
	['get', '/cache/getModuleStruct', ModuleController.getModuleStruct],
	['get', '/cache/getReleaseProgress', ModuleConfigController.getReleaseProgress],

	// 模块操作
	['post', '/cache/expandModule', ModuleOperation.expandDCache],

	// cache 配置中心
	['get', '/cache/getConfig', getConfig],
	['post', '/cache/addConfig', addConfig, {
		item: 'notEmpty',
		path: 'notEmpty',
		period: 'notEmpty',
		reload: 'notEmpty',
		remark: 'notEmpty'
	}],
	['get', '/cache/deleteConfig', deleteConfig, {id: 'notEmpty'}],
	['post', '/cache/editConfig', editConfig, {
		id: 'notEmpty',
		item: 'notEmpty',
		path: 'notEmpty',
		period: 'notEmpty',
		reload: 'notEmpty',
		remark: 'notEmpty'
	}],
	['get', '/cache/getModuleConfig', getModuleConfig, {moduleName: 'notEmpty'}],
	['get', '/cache/getServerConfig', getServerConfig, {
		moduleName: 'notEmpty',
		serverName: 'notEmpty',
		nodeName: 'notEmpty',
	}],
	['get', '/cache/getServerNodeConfig', getServerNodeConfig, {serverName: 'notEmpty', nodeName: 'notEmpty',}],
	['post', '/cache/addServerConfigItem', addServerConfigItem, {itemId: 'notEmpty', configValue: 'notEmpty'}],
	['get', '/cache/deleteServerConfigItem', deleteServerConfigItem, {id: 'notEmpty'}],
	['get', '/cache/updateServerConfigItem', updateServerConfigItem, {id: 'notEmpty', configValue: 'notEmpty'}],
	['post', '/cache/updateServerConfigItemBatch', updateServerConfigItemBatch, {serverConfigList: 'notEmpty'}],
	['post', '/cache/deleteServerConfigItemBatch', deleteServerConfigItemBatch, {serverConfigList: 'notEmpty'}],
	// 业务树
	['get', '/dtree', ApplyController.dtree],

]

dcachePageConf.forEach(conf => pageConf.push(conf))
dcacheApiConf.forEach(conf => apiConf.push(conf))
