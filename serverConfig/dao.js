const { tApplyAppBase, tApplyCacheServerConf, tApplyCacheModuleConf} = require('./../db').db_cache_web;

const serverConf = {};


serverConf.add = async function (option) {
	return await tApplyCacheServerConf.bulkCreate(option)
};

serverConf.destroy = async function (option) {
	return await tApplyCacheServerConf.destroy(option)
}

serverConf.findOne = async function ({where = {}, attributes = []}) {
	let option = {
		where
	};
	if (attributes.length) option.attributes = attributes;
	return await tApplyCacheServerConf.findOne(option);
};

serverConf.findAll = async function ({where = {}, attributes = [], queryBase = [], include = [], queryModule = []}) {
	if (queryBase.length > 0) {
		let item = {
			model: tApplyAppBase,
			attributes: queryBase,
			as: 'applyBase',
			raw: true
		};
		include.push(item)
	}
	if (queryModule.length > 0) {
		let item = {
			model: tApplyCacheModuleConf,
			attributes: queryModule,
			as: 'moduleBase',
			raw: true
		};
		include.push(item)
	}

	let option = {
		where,
		include
	};
	if (attributes.length) option.attributes = attributes;
	return await tApplyCacheServerConf.findAll(option);
};

module.exports = serverConf;