const {tModuleOperation, tExpandServer} = require('./../db').db_cache_web;
const Dao = {};


Dao.add = async function ({type, status, appName, moduleName, cache_version}) {
	return await tModuleOperation.create({type, status, appName, moduleName, cache_version})
};

Dao.findOne = async function ({where = {}, attributes = [], queryServers = true, include = []}) {

	if (queryServers) {
		let queryServersItem = {
			model: tExpandServer,
			as: 'expandServers',
			raw: true
		};
		include.push(queryServersItem)
	}
	let option = {
		where,
		include,
	};
	if (attributes.length) option.attributes = attributes;
	return await tModuleOperation.findOne(option);
};

Dao.destroy = async function (option) {
	return await tModuleOperation.destroy(option)
};

module.exports = Dao;