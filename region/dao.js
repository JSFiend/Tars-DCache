const {tRegion} = require('./../db').db_cache_web;

const RegionDao = {};

RegionDao.getRegion = async function ({where = {}, attributes = ['id']}) {
    let data = await tRegion.findOne({where, attributes});
    if (!data) throw new Error('地区不存在');
    return data
};

RegionDao.getRegionList = async function () {
    return await tRegion.findAll()
};

RegionDao.addRegion = async function ({region, label}) {
    return await tRegion.create({region, label})
};

RegionDao.deleteRegion = async function ({id}) {
    return await tRegion.destroy({where: {id}})
};

RegionDao.updateRegion = async function ({id, region, label}) {
    return await tRegion.update({region, label}, {where: {id}})
};


module.exports = RegionDao;
