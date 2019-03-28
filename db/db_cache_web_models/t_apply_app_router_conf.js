module.exports = function (sequelize, DataTypes) {
	return sequelize.define('t_apply_app_router_conf', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		apply_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		server_name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		server_ip: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		template_file: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		router_db_name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		router_db_ip: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		router_db_port: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		router_db_user: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		router_db_pass: {
			type: DataTypes.STRING(50),
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
		tableName: 't_apply_app_router_conf',
		timestamps: false
	});
};
