module.exports = function (sequelize, DataTypes) {
	return sequelize.define('t_module_operation', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		type: {
			type: DataTypes.STRING(50),  //  expand 是扩容
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING(50),   //  0  是 成功，  1、是开始， 2是进行中，
			allowNull: false,
		},
		appName: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		moduleName: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		cache_version: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: 0
		},

		// Timestamps
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	}, {
		tableName: 't_module_operation',
		timestamps: true
	});
};
