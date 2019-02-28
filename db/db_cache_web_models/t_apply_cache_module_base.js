
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('t_apply_cache_module_base', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            defaultValue: 0,
        },
        area: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: ''
        },
        apply_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        cache_version: {
            type: DataTypes.INTEGER(4),
            allowNull: true,
            defaultValue: 1
        },
        mkcache_struct: {
            type: DataTypes.INTEGER(4),
            allowNull: true,
            defaultValue: 0
        },
        follower: {
            type: DataTypes.STRING(255),
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
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 't_apply_cache_module_base',
        timestamps: false
    });
};
