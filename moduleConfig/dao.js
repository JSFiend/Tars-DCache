const {tApplyCacheModuleConf, tApplyCacheServerConf, tApplyCacheModuleBase, tApplyAppBase} = require('./../db').db_cache_web;

const moduleConf = {};


moduleConf.add= async function (option) {
    return await tApplyCacheModuleConf.create(option)
};

moduleConf.destroy = async function (option) {
    return await tApplyCacheModuleConf.destroy(option)
}

moduleConf.findOne = async function ({
                                         where = {},
                                         attributes = ['id', 'module_id', 'apply_id', 'module_name', 'status', 'area', 'idc_area', 'set_area', 'admin', 'cache_module_type', 'per_record_avg', 'total_record', 'max_read_flow', 'key_type', 'max_write_flow', 'module_remark'],
                                         queryModuleBase = [],
                                         queryServerConf = [],
                                         queryAppBase = [],
                                         include = []
                                     }) {
    if (queryModuleBase.length > 0) {
        let moduleBaseModelItem = {
            model: tApplyCacheModuleBase,
            attributes: queryModuleBase,
            as: 'ModuleBase'
        };
        include.push(moduleBaseModelItem)
    }
    if (queryServerConf.length > 0) {
        let serverConfModelItem = {
            model: tApplyCacheServerConf,
            attributes: queryServerConf,
            as: 'ServerConf'
        };
        include.push(serverConfModelItem)
    }
    if (queryAppBase.length > 0) {
        let serverConfModelItem = {
            model: tApplyAppBase,
            attributes: queryAppBase,
            as: 'AppBase'
        };
        include.push(serverConfModelItem)
    }
    return await tApplyCacheModuleConf.findOne({where, attributes, include});
};

moduleConf.findAll = async function ({
                                         where = {},
                                         attributes = ['id', 'module_id', 'apply_id', 'module_name', 'status', 'area', 'idc_area', 'set_area', 'admin', 'cache_module_type', 'per_record_avg', 'total_record', 'max_read_flow', 'key_type', 'max_write_flow', 'module_remark'],
                                         queryModuleBase = [],
                                         queryServerConf = [],
                                         queryAppBase = [],
                                         include = []
                                     }) {
    if (queryModuleBase.length > 0) {
        let moduleBaseModelItem = {
            model: tApplyCacheModuleBase,
            attributes: queryModuleBase,
            as: 'ModuleBase',
        };
        include.push(moduleBaseModelItem)
    }
    if (queryServerConf.length > 0) {
        let serverConfModelItem = {
            model: tApplyCacheServerConf,
            attributes: queryServerConf,
            as: 'ServerConf'
        };
        include.push(serverConfModelItem)
    }
    if (queryAppBase.length > 0) {
        let serverConfModelItem = {
            model: tApplyAppBase,
            attributes: queryAppBase,
            as: 'AppBase'
        };
        include.push(serverConfModelItem)
    }

    return await tApplyCacheModuleConf.findAll({where, attributes, include});
};

module.exports = moduleConf;