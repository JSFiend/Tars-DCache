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

const { tExpandServer } = require('./../db').db_cache_web;

const Dao = {};


Dao.add = function ({
  area, operation_id, app_name, module_name, group_name, server_name, server_ip, server_type, memory, shmKey, idc_area, status, modify_person, modify_time, is_docker, patch_version,
}) {
  return tExpandServer.create({
    area, operation_id, app_name, module_name, group_name, server_name, server_ip, server_type, memory, shmKey, idc_area, status, modify_person, modify_time, is_docker, patch_version,
  });
};

Dao.destroy = async function ({ where = { appName: '', moduleName: '', type: '' } }) {
  Dao.destroy({
    where,
  });
};

Dao.addList = function (option) {
  return tExpandServer.bulkCreate(option);
};

Dao.findOne = function ({ where = {}, attributes = [] }) {
  const option = {
    where,
  };
  if (attributes.length) option.attributes = attributes;
  return tExpandServer.findOne(option);
};

Dao.destroy = function (option) {
  return tExpandServer.destroy(option);
};

module.exports = Dao;
