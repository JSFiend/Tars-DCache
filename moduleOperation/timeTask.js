let schedule = require('node-schedule');
let moduleOperationService = require('./service');
const {Op} = require('sequelize');

/**
 * 同步操作
 */
let syncOperation = async function () {
  try {
    console.log('scheduleCronstyle:' + new Date());
    let processOperation = await moduleOperationService.findAll({status: {[Op.not]: "0"}});
    if (processOperation.length === 0) return false;

    // 同步每一次记录
    processOperation.forEach(item => {
      let {appName, moduleName, type, id} = item.get({plain: true});
      let typeTransfer = {
        'expand': '1',
        'shrinkage': '2',
        'migration': '0'
      }
      moduleOperationService.syncOperation({appName, moduleName, type: typeTransfer[type], id})
    })
  } catch (err) {
    console.error(err)
  }
}

schedule.scheduleJob('0 * * * * *', syncOperation);






