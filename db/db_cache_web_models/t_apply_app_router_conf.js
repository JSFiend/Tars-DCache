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

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('t_apply_app_router_conf', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		apply_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		server_name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		server_ip: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		template_file: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		router_db_name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		router_db_ip: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		router_db_port: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		router_db_user: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		router_db_pass: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},

		create_person: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		modify_time: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	}, {
		tableName: 't_apply_app_router_conf',
		timestamps: false
	});
};
