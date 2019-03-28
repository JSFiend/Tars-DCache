const RouterDao = require('./dao');

const RouterService = {};


RouterService.createRouter = async function ({
	                                             apply_id,
	                                             server_name,
	                                             server_ip,
	                                             template_file,
	                                             router_db_name,
	                                             router_db_ip,
	                                             router_db_port,
	                                             router_db_user,
	                                             router_db_pass,
	                                             create_person

                                             }) {
	// return await RouterDao.createRouter({apply_id, server_name, server_ip, template_file, router_db_name, router_db_ip, router_db_port, router_db_user, router_db_pass, create_person})
	return await RouterDao.createRouter({
		apply_id,
		server_name,
		server_ip,
		template_file,
		router_db_name,
		router_db_ip,
		router_db_port,
		router_db_user,
		router_db_pass,
		create_person
	})
};

RouterService.createOrUpdate = async function (whereProperties, {
	apply_id,
	server_name,
	server_ip,
	template_file,
	router_db_name,
	router_db_ip,
	router_db_port,
	router_db_user,
	router_db_pass,
	create_person

}) {
	// return await RouterDao.createRouter({apply_id, server_name, server_ip, template_file, router_db_name, router_db_ip, router_db_port, router_db_user, router_db_pass, create_person})
	return await RouterDao.createOrUpdate(whereProperties, {
		apply_id,
		server_name,
		server_ip,
		template_file,
		router_db_name,
		router_db_ip,
		router_db_port,
		router_db_user,
		router_db_pass,
		create_person
	})
};


RouterService.update = async function (Router) {
	return await RouterDao.update(Router)
};

RouterService.removeRouter = async function ({server_name}) {
	return RouterDao.destroy({where: {server_name}})
};

RouterService.findByServerName = async function ({serverName}) {
	return await RouterDao.findOne({where: {server_name: serverName}});
};


module.exports = RouterService;
