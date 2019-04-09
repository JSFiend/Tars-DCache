let cwd = process.cwd();
let path = require('path');
const assert = require('assert');

const {DCacheOptPrx, DCacheOptStruct, client} = require(path.join(cwd, './app/service/util/rpcClient'));
const moduleConfigDao = require('./dao.js');
const moduleDao = require('./../module/dao.js');
const serverConfigDao = require('./../serverConfig/dao.js');
// const serverConfigDao = require(path.join(cwd, './app/dao/serverConfigDao.js'));
const ModuleConfigService = {};

ModuleConfigService.addModuleConfig = async function (option) {
	let {module_name} = option;
	let item = await moduleConfigDao.findOne({where: {module_name}});
	if (item && item.status === 2) {
		// 如果是安装成功的， 提醒模块存在
		throw new Error('#module.hasExist#');
	} else if (item) {
		// 如果模块已存在但没安装成功，删除原有模块记录
		await moduleConfigDao.destroy({where: {module_name}, force: true})
		await moduleDao.destroy({where: {id: item.module_id}, force: true})
		await serverConfigDao.destroy({where: {module_name}, force: true})
	}
	console.log(option);
	return await moduleConfigDao.add(option);
};

ModuleConfigService.getModuleConfigInfo = async function ({moduleId, queryModuleBase, queryServerConf}) {
	return moduleConfigDao.findOne({where: {module_id: +moduleId}, queryModuleBase, queryServerConf});
};

ModuleConfigService.getPublishSuccessModuleConfig = async function () {
	let queryAppBase = ['name', 'set_area'];
	let queryServerConf = ['id', 'area', 'apply_id', 'module_name', 'group_name', 'server_name', 'server_ip', 'server_type', 'memory', 'shmKey', 'status', 'is_docker'];
	return moduleConfigDao.findAll({where: {status: 2}, queryAppBase, queryServerConf});
};

ModuleConfigService.getModuleConfigByName = async function ({moduleName, queryAppBase = ['name', 'set_area']}) {
	return moduleConfigDao.findOne({where: {module_name: moduleName}, queryAppBase});
};

ModuleConfigService.removeModuleConfig = async function ({module_name, module_id}) {
	moduleConfigDao.destroy({where: {module_name}, force: true})
	moduleDao.destroy({where: {id: module_id}, force: true})
	serverConfigDao.destroy({where: {module_name}, force: true})
};

ModuleConfigService.findOne = async function ({...where}) {
	return moduleConfigDao.findOne({where: {status: 2, ...where}});
};

ModuleConfigService.getReleaseProgress = async function (releaseId) {
	let moduleReleaseProgressReq = new DCacheOptStruct.ReleaseProgressReq();
	moduleReleaseProgressReq.readFromObject({releaseId});
	let {__return, progressRsp, progressRsp: {errMsg}} = await DCacheOptPrx.getReleaseProgress(moduleReleaseProgressReq);
	assert(__return === 0, errMsg);
	let progress = [];
	let percent = progressRsp.percent;
	progressRsp.releaseInfo.forEach(item => {
		progress.push({
			serverName: item.serverName,
			nodeName: item.nodeName,
			releaseId: progressRsp.releaseId,
			percent
		});
	});
	return {progress, percent};
};

module.exports = ModuleConfigService;