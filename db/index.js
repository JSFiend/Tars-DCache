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
const path = require('path');

const cwd = process.cwd();

const Sequelize = require('sequelize');

const Mysql = require('mysql');

const fs = require('fs-extra');

const _ = require('lodash');

const dbConf = require(path.join(cwd, './config/webConf')).dbConf;

const logger = require(path.join(cwd, './app/logger'));

let Db = {};

let databases = ['db_cache_web'];

databases.forEach((database) => {
	let {
		host,
		port,
		user,
		password,
		charset,
		pool,
	} = dbConf;

	//初始化sequelize
	const sequelize = new Sequelize(database, user, password, {
		host,
		port,
		dialect: 'mysql',
		dialectOptions: {
			charset: charset
		},
		logging(sqlText){
			console.log(sqlText);
			logger.sql(sqlText);
		},
		pool: {
			max: pool.max || 10,
			min: pool.min || 0,
			idle: pool.idle || 10000
		},
		timezone: (() => {
			let timezone = String(0 - new Date().getTimezoneOffset() / 60);
			return '+' + (timezone.length < 2 ? ('0' + timezone) : timezone) + ':00';
		})()  //获取当前时区并做转换
	});

	// 测试是否连接成功
	(async function () {
		try {
			let connect = await sequelize.authenticate();
			console.log('Mysql connection has been established successfully.');

		} catch (err) {
			console.error('Mysql connection err', err)
		}
	})();

	let tableObj = {};
	let dbModelsPath = __dirname + '/' + database + '_models';
	let dbModels = fs.readdirSync(dbModelsPath);
	dbModels.forEach(function (dbModel) {
		let tableName = dbModel.replace(/\.js$/g, '');
		tableObj[_.camelCase(tableName)] = sequelize.import(dbModelsPath + '/' + tableName);
		// sync 无表创建表， alter 新增字段
		console.log('tableName', tableName);
		tableObj[_.camelCase(tableName)].sync({alter:true});
		tableObj[_.camelCase(tableName)].sync();
	});
	Db[database] = tableObj;
	Db[database].sequelize = sequelize;
	sequelize.sync()
});

let tApplyAppBase = Db['db_cache_web']['tApplyAppBase'];
let tApplyAppRouterConf = Db['db_cache_web']['tApplyAppRouterConf'];
let tApplyAppProxyConf = Db['db_cache_web']['tApplyAppProxyConf'];
tApplyAppBase.hasOne(tApplyAppRouterConf, {
	foreignKey: 'apply_id',
	as: 'Router'
});
tApplyAppBase.hasMany(tApplyAppProxyConf, {
	foreignKey: 'apply_id',
	as: 'Proxy'
});

let tApplyCacheModuleBase = Db['db_cache_web']['tApplyCacheModuleBase'];
let tApplyCacheModuleConf = Db['db_cache_web']['tApplyCacheModuleConf'];
let tApplyCacheServerConf = Db['db_cache_web']['tApplyCacheServerConf'];

tApplyCacheModuleConf.belongsTo(tApplyAppBase, {
	foreignKey: "apply_id",
	as: 'AppBase'
});

tApplyCacheModuleConf.belongsTo(tApplyCacheModuleBase, {
	foreignKey: "module_id",
	as: 'ModuleBase'
});
tApplyCacheModuleConf.hasMany(tApplyCacheServerConf, {
	foreignKey: 'module_name',
	sourceKey: 'module_name',
	as: 'ServerConf'
});

tApplyCacheServerConf.belongsTo(tApplyAppBase, {
	foreignKey: "apply_id",
	as: 'applyBase'
});
tApplyCacheServerConf.belongsTo(tApplyCacheModuleConf, {
	foreignKey: "module_name",
	targetKey: 'module_name',
	as: 'moduleBase'
});

let tModuleOperation = Db['db_cache_web']['tModuleOperation'];
let tExpandServer = Db['db_cache_web']['tExpandServer'];

tModuleOperation.hasMany(tExpandServer, {
	foreignKey: 'operation_id',
	as: 'expandServers'
});

module.exports = Db;
