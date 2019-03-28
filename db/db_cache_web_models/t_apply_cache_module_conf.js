const _ = require('lodash');
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('t_apply_cache_module_conf', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		module_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
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
			defaultValue: ''
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: 0,
		},
		area: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		idc_area: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		set_area: {
			type: DataTypes.STRING(100),
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
		cache_module_type: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: 0
		},
		per_record_avg: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		total_record: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		max_read_flow: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		max_write_flow: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		key_type: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: 0
		},
		module_remark: {
			type: DataTypes.TEXT,
			allowNull: true
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
		tableName: 't_apply_cache_module_conf',
		timestamps: false
	});
};
