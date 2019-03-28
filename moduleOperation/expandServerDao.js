const {tExpandServer} = require('./../db').db_cache_web;
const Dao = {};


Dao.add = async function ({area, operation_id, app_name, module_name, group_name, server_name, server_ip, server_type, memory, shmKey, idc_area, status, modify_person, modify_time, is_docker, patch_version}) {
	return await tExpandServer.create({area, operation_id, app_name, module_name, group_name, server_name, server_ip, server_type, memory, shmKey, idc_area, status, modify_person, modify_time, is_docker, patch_version})
};

Dao.addList = async function (option) {
	return await tExpandServer.bulkCreate(option)
};

Dao.findOne = async function ({where = {}, attributes = []}) {
	let option = {
		where
	};
	if (attributes.length) option.attributes = attributes;
	return await tExpandServer.findOne(option);
};

Dao.destroy = async function (option) {
	return await tExpandServer.destroy(option)
};

module.exports = Dao;