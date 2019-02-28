
const RegionDao = require('./dao');

const RegionService = {};

RegionService.getRegion = async function () {
    return await RegionDao.getRegion({});
};

RegionService.getRegionList = async function () {
    return await RegionDao.getRegionList()
};

RegionService.addRegion = async function ({region, label}) {
    return await RegionDao.addRegion({region, label})
};

RegionService.deleteRegion = async function ({id}) {
    return await RegionDao.deleteRegion({id})
}

RegionService.updateRegion = async function ({id, region, label}) {
    return await RegionDao.updateRegion({id, region, label})
}



module.exports = RegionService;
