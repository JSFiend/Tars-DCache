
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('t_apply_app_proxy_conf', {
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
        idc_area: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        template_file: {
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
        tableName: 't_apply_app_proxy_conf',
        timestamps: false
    });
};
