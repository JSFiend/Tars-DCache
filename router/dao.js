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

const {tApplyAppRouterConf} = require('./../db').db_cache_web;

const routerDao = {};

let modelDesc = {
	id: 'router id',
	apply_id: '应用id',
	server_name: '服务名',
	server_ip: '服务ip',
	template_file: '服务模版名',
	router_db_name: '路由数据库名',
	router_db_ip: '路由数据库ip',
	router_db_port: '路由数据库端口',
	router_db_user: '数据库户名',
	router_db_pass: '数据库密码',
	create_person: '创建人'
}

routerDao.createRouter = async function ({apply_id, server_name, server_ip, template_file, router_db_name, router_db_ip, router_db_port, router_db_user, router_db_pass, create_person}) {
	return await tApplyAppRouterConf.create({
		apply_id,
		server_name,
		server_ip,
		template_file,
		router_db_name,
		router_db_ip,
		router_db_port,
		router_db_user,
		router_db_pass,
		create_person
	})
};
routerDao.createOrUpdate = async function (whereProperties, params) {
	try {
		let self = tApplyAppRouterConf,
			where = {};
		whereProperties.forEach(function (key) {
			where[key] = params[key];
		});
		let record = await self.find({where: where});
		if (!record) {
			record = await self.create(params)
		} else {
			record.updateAttributes(params);
		}
		return record
	} catch (err) {
		throw new Error(err)
	}
};

routerDao.update = async function ({id, apply_id, server_name, server_ip, template_file, router_db_name, router_db_ip, router_db_port, router_db_user, router_db_pass, create_person}) {
	return await tApplyAppRouterConf.update({
		apply_id,
		server_name,
		server_ip,
		template_file,
		router_db_name,
		router_db_ip,
		router_db_port,
		router_db_user,
		router_db_pass,
		create_person
	}, {where: {id}})
};

routerDao.destroy = async function (option) {
	return await tApplyAppRouterConf.destroy(option)
}

routerDao.findOne = async function ({where}) {
	return await tApplyAppRouterConf.findOne({where});
}

module.exports = routerDao;
