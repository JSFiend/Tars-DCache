const ProxyDao = require('./dao');

const ProxyService = {};

ProxyService.createProxy = async function ({apply_id, server_name, server_ip, template_file, idc_area, create_person}) {
	return await ProxyDao.createProxy({apply_id, server_name, server_ip, template_file, idc_area, create_person})
};
ProxyService.createOrUpdate = async function (whereProperties, {apply_id, server_name, server_ip, template_file, idc_area, create_person}) {
	return await ProxyDao.createOrUpdate(whereProperties, {
		apply_id,
		server_name,
		server_ip,
		template_file,
		idc_area,
		create_person
	})
};


ProxyService.update = async function (Proxy) {
	return await ProxyDao.update(Proxy)
};

ProxyService.removeProxy = async function ({server_name}) {
	return ProxyDao.destroy({where: {server_name}})
};

ProxyService.findByServerName = async function ({serverName}) {
	return await ProxyDao.findOne({where: {server_name: serverName}});
};

module.exports = ProxyService;
