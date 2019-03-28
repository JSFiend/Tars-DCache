const ApplyDao = require('./dao');
const RouterService = require('../router/service');
const ProxyService = require('../proxy/service');
const serverConfigService = require('../serverConfig/service');
const ModuleConfigService = require('../moduleConfig/service');

const ApplyService = {};

ApplyService.addApply = async function ({idc_area, set_area, admin, name, create_person}) {
	let item = await ApplyDao.findOne({where: {name}});
	if (item && item.status === 2) {
		// 如果是安装成功的， 提醒应用存在
		throw new Error('#apply.hasExist#');
	} else {
		// 如果注册过，但是没有安装成功， 就覆盖掉
		let data = await ApplyDao.createOrUpdate(['name'], {idc_area, set_area, admin, name, create_person, status: 1});
		// 创建应用 RouterService
		let routerOption = {
			apply_id: data.id,
			server_name: data.name + 'RouterServer',
			server_ip: '',
			template_file: '',
			router_db_name: '',
			router_db_ip: '',
			router_db_port: '',
			router_db_user: '',
			router_db_pass: '',
			create_person,
			status: 1
		};
		let routerData = await RouterService.createOrUpdate(['apply_id'], routerOption);

		// 创建 idc_area ProxyService
		let proxyOption = {
			apply_id: data.id,
			server_name: data.name + 'ProxyServer',
			server_ip: '',
			template_file: '',
			idc_area: data.idc_area,
			create_person,
			status: 1
		};
		let proxyData = await ProxyService.createOrUpdate(['apply_id', 'idc_area'], proxyOption);
		//创建 set_area ProxyService
		for (let i = 0; i < set_area.length; i++) {
			let proxyOption = {
				apply_id: data.id,
				server_name: data.name + 'ProxyServer',
				server_ip: '',
				template_file: '',
				idc_area: set_area[i],
				create_person,
				status: 1
			};
			let proxyData = await ProxyService.createOrUpdate(['apply_id', 'idc_area'], proxyOption);
		}
		return data;
	}

};

ApplyService.getApply = async function ({applyId, queryRouter, queryProxy}) {
	return await ApplyDao.findOne({where: {id: +applyId}, queryRouter, queryProxy});
};

ApplyService.getApplyList = async function (options = {}) {
	return await ApplyDao.findAll(options)
};

ApplyService.saveRouterProxy = async function ({Proxy, Router}) {
	for (let i = 0; i < Proxy.length; i++) {
		await ProxyService.update(Proxy[i]);
	}
	await RouterService.update(Router);
	return {}
};

ApplyService.removeApply = async function ({id}) {
	return ApplyDao.destroy({where: {id}})
};

ApplyService.hasModule = async function ({serverType, serverName}) {

	// RouterService
	// ProxyService
	let applyId = null;
	if (serverType === 'router') {
		let routerServer = await RouterService.findByServerName({serverName});
		if (routerServer) applyId = routerServer.get('apply_id');
	} else if (serverType === 'proxy') {
		let proxyServer = await ProxyService.findByServerName({serverName});
		if (proxyServer) applyId = proxyServer.get('apply_id');
	}
	if (!applyId) throw new Error('不存在该应用')


	let moduleServer = await ModuleConfigService.findOne({apply_id: applyId});
	// let moduleServer = await serverConfigService.findByApplyId({applyId});
	console.log('moduleServer', moduleServer);
	return !!moduleServer

};


module.exports = ApplyService;

