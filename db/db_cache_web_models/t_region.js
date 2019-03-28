module.exports = function (sequelize, DataTypes) {
	return sequelize.define('t_region', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		region: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true
		},
		label: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true
		}
	}, {
		tableName: 't_region',
		timestamps: false
	});
};
