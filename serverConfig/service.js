const serverConfigDao = require('./dao.js');

const ServerConfigService = {};

ServerConfigService.addServerConfig = async function (option) {
	return await serverConfigDao.add(option);
};

ServerConfigService.getServerConfigInfo = async function ({moduleId}) {
	return serverConfigDao.findOne({where: {module_id: moduleId}})
};

ServerConfigService.getCacheServerList = async function ({moduleName, attributes = [], queryBase = [], queryModule = []}) {
	return serverConfigDao.findAll({where: {module_name: moduleName}, attributes, queryBase, queryModule})

};
ServerConfigService.removeServer = async function ({server_name}) {
	return serverConfigDao.destroy({where: {server_name}})
};

ServerConfigService.findByApplyId = async function ({applyId}) {
	return await serverConfigDao.findOne({where: {apply_id: applyId}});
};


module.exports = ServerConfigService;