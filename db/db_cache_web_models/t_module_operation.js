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
	return sequelize.define('t_module_operation', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		type: {
			type: DataTypes.STRING(50),  //  expand 是扩容
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING(50),   //  0  是 成功，  1、是开始， 2是进行中，
			allowNull: false,
		},
		appName: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		moduleName: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		cache_version: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: 0
		},

		// Timestamps
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	}, {
		tableName: 't_module_operation',
		timestamps: true
	});
};
