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