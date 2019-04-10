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

const {tApplyAppBase, tApplyCacheServerConf, tApplyCacheModuleConf} = require('./../db').db_cache_web;

const serverConf = {};


serverConf.add = async function (option) {
  return await tApplyCacheServerConf.bulkCreate(option)
};

// Task.update(
// 	{ status: 'inactive' }, /* set attributes' value */
// 	{ where: { subject: 'programming' }} /* where criteria */
// )
serverConf.update = async function ({where, values}) {
  return await tApplyCacheServerConf.update(values, {where})
};

serverConf.destroy = async function (option) {
  return await tApplyCacheServerConf.destroy(option)
}

serverConf.findOne = async function ({where = {}, attributes = []}) {
  let option = {
    where
  };
  if (attributes.length) option.attributes = attributes;
  return await tApplyCacheServerConf.findOne(option);
};

serverConf.findAll = async function ({where = {}, attributes = [], queryBase = [], include = [], queryModule = []}) {
  if (queryBase.length > 0) {
    let item = {
      model: tApplyAppBase,
      attributes: queryBase,
      as: 'applyBase',
      raw: true
    };
    include.push(item)
  }
  if (queryModule.length > 0) {
    let item = {
      model: tApplyCacheModuleConf,
      attributes: queryModule,
      as: 'moduleBase',
      raw: true
    };
    include.push(item)
  }

  let option = {
    where,
    include
  };
  if (attributes.length) option.attributes = attributes;
  return await tApplyCacheServerConf.findAll(option);
};

module.exports = serverConf;
