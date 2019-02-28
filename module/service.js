const moduleDao = require('./dao.js');

const ModuleService = {};

ModuleService.addModuleConfig = async function (option) {
    let {
        name,
        admin,
        idcArea,
        key_type,
        module_name,
        cache_module_type,
        cache_type,
        db_data_count,
        per_record_avg,
        total_record,
        max_read_flow,
        max_write_flow,
        module_remark,
        setArea,
        create_person
    } = option;
};

ModuleService.addModuleBaseInfo = async function ({apply_id, follower, cache_version, mkcache_struct, create_person}) {
    return moduleDao.addModuleBaseInfo({apply_id, follower, cache_version, mkcache_struct, create_person});
};

ModuleService.getModuleInfo = async function ({id}) {
    return moduleDao.findOne({where: {id}})
};



module.exports = ModuleService;