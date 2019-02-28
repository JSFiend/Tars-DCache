const {tApplyCacheModuleBase} = require('./../db').db_cache_web;
const moduleDao = {};


moduleDao.addModuleBaseInfo = async function ({apply_id, follower, cache_version, mkcache_struct, create_person}) {
    return await tApplyCacheModuleBase.create({apply_id, follower, cache_version, mkcache_struct, create_person})
};

moduleDao.findOne = async function ({where = {}, attributes = []}) {
    let option = {
        where
    };
    if (attributes.length) option.attributes = attributes;
    return await tApplyCacheModuleBase.findOne(option);
};

moduleDao.destroy = async function (option) {
    return await tApplyCacheModuleBase.destroy(option)
}

module.exports = moduleDao;