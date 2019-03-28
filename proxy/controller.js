let cwd = process.cwd();
let path = require('path');

const logger = require(path.join(cwd, './app/logger'));
const util = require(path.join(cwd, './app/tools/util'));

const service = require('./service');

const Controller = {
	removeProxy: async (ctx) => {
		try {
			let {server_name} = ctx.paramsObj;
			let item = await service.removeProxy({server_name})
			ctx.makeResObj(200, '', item)
		} catch (err) {
			logger.error('[removeServer]:', err);
			ctx.makeResObj(500, err.message);
		} finally {

		}
	}
};

module.exports = Controller;