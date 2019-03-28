const {tApplyAppBase, tApplyAppRouterConf, tApplyAppProxyConf} = require('./../db').db_cache_web;

const applyDao = {};

applyDao.findAll = async function ({
	                                   where = {},
	                                   raw = true,
	                                   queryRouter = [],
	                                   queryProxy = [],
	                                   attributes = ['id', 'status', 'idc_area', 'set_area', 'admin', 'name', 'create_person'],
	                                   include = []
                                   }) {
	if (queryRouter.length > 0) {
		let routerModelItem = {
			model: tApplyAppRouterConf,
			attributes: queryRouter,
			as: 'Router',
			raw: true
		};
		include.push(routerModelItem)
	}
	if (queryProxy.length > 0) {
		let proxyModelItem = {
			model: tApplyAppProxyConf,
			attributes: queryProxy,
			as: 'Proxy',
			raw: true
		};
		include.push(proxyModelItem)
	}
	// 一般来说，查找的都是安装成功的、即status=2
	if (!where.status) where.status = 2;
	console.log('wherer', where);
	let data = await tApplyAppBase.findAll({
		where,
		raw,
		attributes,
		include
	});
	return data
};

applyDao.findOne = async function ({
	                                   where = {},
	                                   attributes = ['id', 'status', 'idc_area', 'set_area', 'admin', 'name', 'create_person'],
	                                   queryRouter = [],
	                                   queryProxy = [],
	                                   include = []
                                   }) {
	if (queryRouter.length > 0) {
		let routerModelItem = {
			model: tApplyAppRouterConf,
			attributes: queryRouter,
			as: 'Router'
		};
		include.push(routerModelItem)
	}
	if (queryProxy.length > 0) {
		let proxyModelItem = {
			model: tApplyAppProxyConf,
			attributes: queryProxy,
			as: 'Proxy'
		};
		include.push(proxyModelItem)
	}

	let data = await tApplyAppBase.findOne({where, attributes, include});
	return data
};

applyDao.addApply = async function ({idc_area, set_area, admin, name, create_person}) {
	// 1 创建过程中， 2 已安装，可以在资源树展示
	return await tApplyAppBase.create({
		status: 1,
		idc_area,
		set_area,
		admin,
		name,
		create_person
	})
};

/**
 * Performs an "upsert" - That is, does an update if a matching record already exists, otherwise does an insert
 *
 * @param whereProperties Names of the properties to use in the WHERE clause for matching  []
 * @param params Hash of parameters to use in the INSERT or UPDATE
 */
applyDao.createOrUpdate = async function (whereProperties, params) {
	try {
		let self = tApplyAppBase,
			where = {};
		whereProperties.forEach(function (key) {
			where[key] = params[key];
		});
		let record = await self.find({where: where});
		if (!record) {
			record = await self.create(params)
		} else {
			record.updateAttributes(params);
		}
		return record
	} catch (err) {
		throw new Error(err)
	}
};

applyDao.destroy = async function (option) {
	return await tApplyAppBase.destroy(option)
}

module.exports = applyDao;