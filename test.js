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

var crypto = require('crypto');
var key = '12345670';
des = {
	algorithm: {ecb: 'des-ecb', cbc: 'des-cbc'},
	encrypt: function (plaintext, iv) {
		try {
			var key = new Buffer(key);
		} catch (err) {
			console.log(err)
		}
		var iv = new Buffer(iv ? iv : 0);
		var cipher = crypto.createCipheriv(this.algorithm.ecb, key, iv);
		cipher.setAutoPadding(true) //default true
		var ciph = cipher.update(plaintext, 'utf8', 'base64');
		ciph += cipher.final('base64');
		return ciph;
	},
	decrypt: function (encrypt_text, iv) {
		var key = new Buffer(key);
		var iv = new Buffer(iv ? iv : 0);
		var decipher = crypto.createDecipheriv(this.algorithm.ecb, key, iv);
		decipher.setAutoPadding(true);
		var txt = decipher.update(encrypt_text, 'base64', 'utf8');
		txt += decipher.final('utf8');
		return txt;
	}

};

var str = "/upload/image/201602120012.jpg";
var encrypt_text = des.encrypt(str, 0);
var decrypt_text = des.decrypt(encrypt_text, 0);
console.log(encrypt_text);
console.log(decrypt_text);