let cwd = process.cwd();
let path = require('path');

const logger = require(path.join(cwd, './app/logger'));
const util = require(path.join(cwd, './app/tools/util'));
const ModuleService = require('./service.js');

const ModuleController = {
    addModuleBaseInfo: async (ctx) => {
        try {
            let {follower, cache_version, mkcache_struct, apply_id} = ctx.paramsObj;
            let create_person = 'adminUser';
            let item = await ModuleService.addModuleBaseInfo({
                apply_id,
                follower,
                cache_version,
                mkcache_struct,
                create_person
            });
            ctx.makeResObj(200, '', item)
        } catch (err) {
            logger.error('[addModuleBaseInfo]:', err);
            ctx.makeErrResObj();
        }
    },
    getModuleInfo: async (ctx) => {
        try {
            let {moduleId} = ctx.paramsObj;
            let item = await ModuleService.getModuleInfo({id: moduleId});
            ctx.makeResObj(200, '', item)
        } catch (err) {
            logger.error('[getModuleInfo]:', err);
            ctx.makeErrResObj();
        }
    },
};

module.exports = ModuleController;