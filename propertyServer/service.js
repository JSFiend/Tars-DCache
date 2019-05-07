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

const cwd = process.cwd();
const path = require('path');
const Config = require('@tars/utils').Config;

const ConfigService = require(path.join(cwd, './app/service/config/ConfigService.js'));
const Service = {};

Service.getMonitorData = async function () {
  const configParser = new Config();
  const option = {
    server_name: 'Dcache.propertyServer',
  };
  const configs = await ConfigService.getServerConfigFile(option);
  const PropertyServer = configs.find(config => config.filename === 'PropertyServer.conf');
  configParser.parseText(PropertyServer.config);
  return configParser.data;
};

module.exports = Service;
