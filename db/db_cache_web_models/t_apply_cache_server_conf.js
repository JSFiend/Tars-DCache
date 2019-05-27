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
  return sequelize.define('t_apply_cache_server_conf', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    area: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: '',
    },
    apply_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      unique: 'applyModule',
    },
    module_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: 'applyModule',
      defaultValue: '',
    },
    group_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: 'applyModule',
      defaultValue: '',
    },
    server_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: 'applyModule',
      defaultValue: '',
    },
    server_ip: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: '',
    },
    server_type: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 0,
    },
    memory: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 0,
    },
    shmKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: '',
    },
    idc_area: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: '',
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 0,
    },
    modify_person: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
    },
    template_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
    },
    modify_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_docker: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 't_apply_cache_server_conf',
    timestamps: false,
  });
};
