process.chdir('E:/git/TarsCloud/web');
var assert = require('assert');
var service = require('./service.js');
describe('config service test', function () {
    // describe('getConfig', function () {
    //     it('getConfig 应该返回长度大于一的数组', async function () {
    //         let config = await service.getConfig();
    //         assert(config.length > 0, '配置长度应该大于 0')
    //     })
    // });
    describe('getServerNodeConfigItemList', function () {
        it('getServerNodeConfigItemList 应该返回长度大于一的数组', async function () {
            let config = await service.getServerNodeConfigItemList({serverName: 'cache0114KVCacheServer1-1', nodeName: '100.117.137.106'});
            console.log(config);
            assert(config.length > 0, '配置长度应该大于 0')
        })
    });

});



