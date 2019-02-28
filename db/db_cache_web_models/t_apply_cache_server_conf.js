const _ = require('lodash');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('t_apply_cache_server_conf', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        area: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
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
        group_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: 'applyModule',
            defaultValue: ''
        },
        server_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: 'applyModule',
            defaultValue: ''
        },
        server_ip: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ''
        },
        server_type: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            defaultValue: 0
        },
        memory: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            defaultValue: 0
        },
        shmKey: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ''
        },
        idc_area: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        status: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            defaultValue: 0,
        },

        modify_person: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        modify_time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        is_docker: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        tableName: 't_apply_cache_server_conf',
        timestamps: false
    });
};
