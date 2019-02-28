const {tApplyAppProxyConf} = require('./../db').db_cache_web;

const ProxyDao = {};

let modelDesc = {
    id: 'id',
    apply_id: '应用id',
    server_name: '服务名',
    server_ip: '服务ip， 例如：10.56.15.13;100.97.13.10;9.24.153.19',
    template_file: '服务模版',
    idc_area: '异地镜像 例如: [sz, bj]',
    create_person: '创建人'
}

ProxyDao.createProxy = async function ({apply_id, server_name, server_ip, template_file, idc_area, create_person}) {
    return await tApplyAppProxyConf.create({
        apply_id,
        server_name,
        server_ip,
        template_file,
        idc_area,
        create_person
    })
};
ProxyDao.createOrUpdate = async function (whereProperties, params) {
    try {
        let self = tApplyAppProxyConf,
            where = {};
        whereProperties.forEach(function (key) {
            where[key] = params[key];
        });
        let record = await self.find({ where: where });
        if (!record) {
            record = await self.create(params)
        } else {
            record.updateAttributes(params);
        }
        return record
    } catch (err) {
        throw new Error(err)
    }
};

ProxyDao.update = async function ({apply_id, server_name, server_ip, template_file, idc_area, create_person, id}) {
    return await tApplyAppProxyConf.update({apply_id, server_name, server_ip, template_file, idc_area, create_person}, {where: {id}})
};

ProxyDao.destroy = async function (option) {
    return await tApplyAppProxyConf.destroy(option)
}

ProxyDao.findOne = async function ({where}) {
    return  await tApplyAppProxyConf.findOne({where});
}


module.exports = ProxyDao;
