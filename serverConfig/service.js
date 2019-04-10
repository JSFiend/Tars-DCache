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

const serverConfigDao = require('./dao.js');

const ServerConfigService = {};

let model = {
  area: '',
  apply_id: '',
  module_name: '',
  group_name: '',
  server_name: '',
  server_ip: '',
  server_type: '',
  memory: '',
  shmKey: '',
  idc_area: '',
  status: '',
  modify_person: 'adminUser',
  modify_time: '',
  is_docker: ''
}
ServerConfigService.addServerConfig = async function (option = []) {
	return await serverConfigDao.add(option);
};

ServerConfigService.addExpandServer = async function (expandServer) {
  let option = expandServer.map(item => {
    return  {
      area: item.area,
      apply_id: item.apply_id,
      module_name: item.module_name,
      group_name: item.group_name,
      server_name: item.server_name,
      server_ip: item.server_ip,
      server_type: item.server_type,
      memory: item.memory,
      shmKey: item.shmKey,
      idc_area: item.idc_area,
      status: 0,
      modify_person: item.modify_person,
      modify_time: item.modify_time,
      is_docker: item.is_docker,
    }
  });
  return await serverConfigDao.add(option);
};

ServerConfigService.getServerConfigInfo = async function ({moduleId}) {
	return serverConfigDao.findOne({where: {module_id: moduleId}})
};

ServerConfigService.getCacheServerList = async function ({moduleName, attributes = [], queryBase = [], queryModule = []}) {
	return serverConfigDao.findAll({where: {module_name: moduleName}, attributes, queryBase, queryModule})

};
ServerConfigService.removeServer = async function ({server_name}) {
	return serverConfigDao.destroy({where: {server_name}})
};

ServerConfigService.findByApplyId = async function ({applyId}) {
	return await serverConfigDao.findOne({where: {apply_id: applyId}});
};

ServerConfigService.findOne = async function ({where}) {
  return await serverConfigDao.findOne({where});
};

ServerConfigService.update = async function ({where = {}, values = {}}) {
  return await serverConfigDao.update({where, values});
};


module.exports = ServerConfigService;
