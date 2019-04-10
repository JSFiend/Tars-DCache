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

const {tModuleOperation, tExpandServer} = require('./../db').db_cache_web;
const Dao = {};


Dao.add = async function ({type, status, appName, moduleName, cache_version}) {
  return await tModuleOperation.create({type, status, appName, moduleName, cache_version})
};

Dao.findOne = async function ({where = {}, attributes = [], queryServers = true, include = []}) {

  if (queryServers) {
    let queryServersItem = {
      model: tExpandServer,
      as: 'expandServers',
      raw: true
    };
    include.push(queryServersItem)
  }
  let option = {
    where,
    include,
  };
  if (attributes.length) option.attributes = attributes;
  return await tModuleOperation.findOne(option);
};

Dao.update = async function ({where, values}) {
  return await tModuleOperation.update(values, {where})
};

Dao.findAll = async function ({where = {}, attributes = [], queryServers = true, include = []}) {

  if (queryServers) {
    let queryServersItem = {
      model: tExpandServer,
      as: 'expandServers',
      raw: true
    };
    include.push(queryServersItem)
  }
  let option = {
    where,
    include,
  };
  if (attributes.length) option.attributes = attributes;
  return await tModuleOperation.findAll(option);
};

Dao.destroy = async function (option) {
  return await tModuleOperation.destroy(option)
};

module.exports = Dao;