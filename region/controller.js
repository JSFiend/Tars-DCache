/**
 * Tencent is pleased to support the open source community by making Tars available.
 *
 * Copyright (C) 2016THL A29 Limited, a Tencent company. All rights reserved.
 *
 * Licensed under the BSD 3-Clause License (the "License"); you may not use this file except 
 * in compliance with the License. You may obtain a copy of the License at
 *
 * https://opensource.org/licenses/BSD-3-Clause
 *
 * Unless required by applicable law or agreed to in writing, software distributed 
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR 
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the 
 * specific language governing permissions and limitations under the License.
 */

let cwd = process.cwd()
let path = require('path')

const logger = require(path.join(cwd, './app/logger'));
const util = require(path.join(cwd, './app/tools/util'));
const RegionService = require('./service');

const RegionController = {
	getRegionList: async (ctx) => {
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
	getServerNodeList: async (ctx) => {
		try {
			const tree_node_id = ctx.paramsObj.tree_node_id;
			const rs = await util.jsonRequest.getTars('server_list', {
				tree_node_id: tree_node_id
			})
			ctx.makeResObj(200, '', rs.body.data);
		} catch (e) {
			logger.error('[getServerNodeList]:', e);
			ctx.makeErrResObj();
		}
	},
	getServerNotifysList: async (ctx) => {
		try {
			const params = ctx.paramsObj;
			const rs = await util.jsonRequest.getTars('server_notify_list', params);
			ctx.makeResObj(200, '', rs.body.data);
		} catch (e) {
			logger.error('[getServerNotifysList]:', e);
			ctx.makeErrResObj();
		}
	}
}

module.exports = RegionController;
