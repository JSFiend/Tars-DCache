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

let cwd = process.cwd();
let path = require('path');

const logger = require(path.join(cwd, './app/logger'));
const util = require(path.join(cwd, './app/tools/util'));

const service = require('./service');

const Controller = {
	removeRouter: async (ctx) => {
		try {
			let {server_name} = ctx.paramsObj;
			let item = await service.removeRouter({server_name})
			ctx.makeResObj(200, '', item)
		} catch (err) {
			logger.error('[removeRouter]:', err);
			ctx.makeResObj(500, err.message);
		} finally {

		}
	}
};

module.exports = Controller;