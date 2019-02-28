let cwd = process.cwd()
let path = require('path')

const logger = require(path.join(cwd, './app/logger'));
const util = require(path.join(cwd, './app/tools/util'));
const RegionService = require('./service');

const RegionController = {
    getRegionList: async(ctx) => {
        try {
            let data = await RegionService.getRegionList();
            ctx.makeResObj(200, '', data)
        } catch (err) {
            logger.error('[getRegionList]:', err);
            ctx.makeErrResObj();
        }
    },
    addRegion: async (ctx) => {
        try {
            let {region, label} = ctx.paramsObj;
            let data = await RegionService.addRegion({region, label});
            ctx.makeResObj(200, '', data)
        } catch (err) {
            logger.error('[addRegion]:', err);
            ctx.makeErrResObj(err);
        }
    },
    deleteRegion: async (ctx) => {
        try {
            let {id} = ctx.paramsObj;
            let data = await RegionService.deleteRegion({id});
            ctx.makeResObj(200, '', data)
        } catch (err) {
            logger.error('[deleteRegion]:', err);
            ctx.makeErrResObj(err);
        }
    },
    updateRegion: async (ctx) => {
        try {
            let {id, region, label} = ctx.paramsObj;
            let data = await RegionService.updateRegion({id, region, label});
            ctx.makeResObj(200, '', data)
        } catch (err) {
            logger.error('[deleteRegion]:', err);
            ctx.makeErrResObj(err);
        }
    },
    getServerNodeList : async(ctx) => {
        try{
            const tree_node_id = ctx.paramsObj.tree_node_id;
            const rs = await util.jsonRequest.getTars('server_list', {
                tree_node_id : tree_node_id
            })
            ctx.makeResObj(200,'',rs.body.data);
        }catch(e){
            logger.error('[getServerNodeList]:', e);
            ctx.makeErrResObj();
        }
    },
    getServerNotifysList : async(ctx) => {
        try{
            const params = ctx.paramsObj;
            const rs = await util.jsonRequest.getTars('server_notify_list', params);
            ctx.makeResObj(200,'',rs.body.data);
        }catch(e) {
            logger.error('[getServerNotifysList]:', e);
            ctx.makeErrResObj();
        }
    }
}

module.exports = RegionController;
