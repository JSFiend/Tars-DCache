const _ = require('lodash');
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('t_apply_app_base', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: 1,
		},
		idc_area: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		set_area: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: '',
			get () {
				return _.compact(this.getDataValue('set_area').split(','))
			},
			set (val) {
				return this.setDataValue('set_area', val.join(','))
			}
		},
		admin: {
			type: DataTypes.STRING(255),
			allowNull: false,
			defaultValue: ''
		},
		name: {
			type: DataTypes.STRING(100),
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
		tableName: 't_apply_app_base',
		timestamps: false
	});
};
