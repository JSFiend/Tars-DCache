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