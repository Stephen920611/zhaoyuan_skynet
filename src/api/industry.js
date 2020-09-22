import request from '@/utils/request'

/**
 * 行政区域分页查询
 * @param data
 */
export function adminList(data) {
    return request({
        url: '/basicArea/page',
        method: 'post',
        data
    })
}
/**
 * 危化品分页查询
 * @param data
 */
export function dangerList(data) {
    return request({
        url: '/basicChemicals/page',
        method: 'post',
        data
    })
}
/**
 * 道路分页查询
 * @param data
 */
export function basicLine(data) {
    return request({
        url: '/basicLine/page',
        method: 'post',
        data
    })
}
/**
 * 公司运输资质分页查询
 * @param data
 */
export function companyQuality(data) {
    return request({
        url: '/companyLicence/page/custom',
        method: 'post',
        data
    })
}
/**
 * 车辆行驶证分页查询接口
 * @param data
 */
export function carDrivingLicense(data) {
    return request({
        url: '/carDrivingLicense/page/custom',
        method: 'post',
        data
    })
}
/**
 * 车辆驾驶证分页查询接口
 * @param data
 */
export function workerDriveLicense(data) {
    return request({
        url: '/workerDriveLicense/page/custom',
        method: 'post',
        data
    })
}
/**
 * 车辆道路运输证分页查询接口
 * @param data
 */
export function carTransportLicense(data) {
    return request({
        url: '/carTransportLicense/getTransportLicense',
        method: 'post',
        data
    })
}
/**
 * 从业资格证分页查询接口
 * @param data
 */
export function workerQualificatLicense(data) {
    return request({
        url: '/workerQualificatLicense/page/custom',
        method: 'post',
        data
    })
}
/**
 * 电子运单查询区域树接口
 * @param data
 */
export function basicArea(data) {
    return request({
        url: '/basicArea/getAreaTree',
        method: 'post',
        data
    })
}
/**
 * 电子运单查询区域树接口
 * @param data
 */
export function eleWaybill(data) {
    return request({
        url: '/eleWaybill/page',
        method: 'post',
        data
    })
}
/**
 * 电子运单新增/编辑
 * @param data
 */
export function saveOrUpdate(data) {
    return request({
        url: '/eleWaybill/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 删除电子运单
 * @param data
 */
export function eleWaybillDelete(data) {
    return request({
        url: '/eleWaybill/delete',
        method: 'post',
        data
    })
}
/**
 * 查询公司列表
 * @param data
 */
export function getCompanyDetail(data) {
    return request({
        url: '/basicCompany/getCompanyDetail',
        method: 'post',
        data
    })
}

/**
 * 查询公司列表(新)
 * @param data
 */
export function getCompanyList(data) {
    return request({
        url: '/basicCompany/page',
        method: 'post',
        data
    })
}
/**
 * 根据编码查询字典
 * @param data
 */
export function getByCode(data) {
    return request({
        url: '/dict/getByCode',
        method: 'post',
        data
    })
}
/**
 * 自定义企业人员查询
 * @param data
 */
export function getWorker(data) {
    return request({
        url: '/companyWorker/getWorker',
        method: 'post',
        data
    })
}
/**
 * 自定义企业车辆查询
 * @param data
 */
export function getCar(data) {
    return request({
        url: '/companyCar/getCar',
        method: 'post',
        data
    })
}
/**
 * 自定义企业车辆查询(分页)
 * @param data
 */
export function getCarByPage(data) {
    return request({
        url: '/companyCar/getCar',
        method: 'post',
        data
    })
}
/**
 * 空闲车辆信息查询
 * @param data
 */
export function getFreeCar(data) {
    return request({
        url: '/companyCar/getFreeCar',
        method: 'post',
        data
    })
}

/**
 * 危化品名称查询
 * @param data
 */
export function getCargos(data) {
    return request({
        url: '/basicChemicals/list',
        method: 'post',
        data
    })
}
/**
 * 判断权限
 * @param data
 */
export function checkUserOperation(data) {
    return request({
        url: '/power/check-user-operation',
        method: 'post',
        data
    })
}
/**
 * 隧道查询
 * @param data
 */
export function getTunnel(data) {
    return request({
        url: '/basicTunnel/getTunnel',
        method: 'post',
        data
    })
}
/**
 * 隧道查询
 * @param data
 */
export function basicTunnel(data) {
    return request({
        url: '/basicTunnel/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 桥梁查询
 * @param data
 */
export function getBridge(data) {
    return request({
        url: '/basicBridge/getBridge',
        method: 'post',
        data
    })
}
/**
 * 桥梁新增
 * @param data
 */
export function bridgeSaveOrUpdate(data) {
    return request({
        url: '/basicBridge/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 企业基本新增
 * @param data
 */
export function companySaveOrUpdate(data) {
    return request({
        url: '/basicCompany/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 企业基本删除
 * @param data
 */
export function companyDelete(data) {
    return request({
        url: '/basicCompany/delete',
        method: 'post',
        data
    })
}
/**
 * 危化品新增/编辑接口
 * @param data
 */
export function chemicalsSaveOrUpdate(data) {
    return request({
        url: '/basicChemicals/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 危化品删除
 * @param data
 */
export function chemicalsDelete(data) {
    return request({
        url: '/basicChemicals/delete',
        method: 'post',
        data
    })
}
/**
 * 企业信息新增/编辑接口
 * @param data
 */
export function licenceSaveOrUpdate(data) {
    return request({
        url: '/companyLicence/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 企业资质信息新增/编辑接口
 * @param data
 */
export function batchSaveOrUpdate(data) {
    return request({
        url: '/companyLicence/batchSaveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 企业资质信息删除接口
 * @param data
 */
export function deleteCompanyLincence(data) {
    return request({
        url: '/companyLicence/delete',
        method: 'post',
        data
    })
}
/**
 * 企业进出口摄像机息新增/编辑接口
 * @param data
 */
export function batchSaveOrUpdateCamera(data) {
    return request({
        url: '/companyCamera/batchSaveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 企业卡口抓拍设备删除接口
 * @param data
 */
export function deleteCompanyCamera(data) {
    return request({
        url: '/companyCamera/delete',
        method: 'post',
        data
    })
}
/**
 * 企业信息的详情查询
 * @param data
 */
export function getCompanyDetailInfo(data) {
    return request({
        url: '/basicCompany/get',
        method: 'post',
        data
    })
}

/**
 * 企业信息关联的摄像机设备的详情查询
 * @param data
 */
export function getCompanyDetailCamInfo(data) {
    return request({
        url: '/companyCamera/getCameras',
        method: 'post',
        data
    })
}
/**
 * 企业是否有有效资格证信息查询
 * @param data
 */
export function getValidLicence(data) {
    return request({
        url: '/companyLicence/getValidLicence',
        method: 'post',
        data
    })
}
/**
 * 危化品列表
 * @param data
 */
export function basicChemicalsList(data) {
    return request({
        url: '/basicChemicals/list',
        method: 'post',
        data
    })
}
/**
 * 企业运输资质删除
 * @param data
 */
export function companyLicenceDelete(data) {
    return request({
        url: '/companyLicence/delete',
        method: 'post',
        data
    })
}
/**
 * 查询公司列表（新）
 * @param data
 */
export function getBasicCompanyList(data) {
    return request({
        url: '/basicCompany/list',
        method: 'post',
        data
    })
}


/**
 * 企业人员新增/编辑接口
 * @param data
 */
export function WorkerSaveOrUpdate(data) {
    return request({
        url: '/companyWorker/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 企业人员新增/编辑接口/批量新增/编辑企业人员驾驶证
 * @param data
 */
export function licenseBatchSaveOrUpdate(data) {
    return request({
        url: '/workerDriveLicense/batchSaveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 企业人员新增/编辑接口/批量新增/编辑从业人员资格证
 * @param data
 */
export function qualificatLicenseBatchSaveOrUpdate(data) {
    return request({
        url: '/workerQualificatLicense/batchSaveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 企业人员新增/编辑接口/删除驾驶证
 * @param data
 */
export function workerDriveLicenseDelete(data) {
    return request({
        url: '/workerDriveLicense/delete',
        method: 'post',
        data
    })
}
/**
 * 企业人员新增/编辑接口/删除押运证
 * @param data
 */
export function workerQualificatLicenseDelete(data) {
    return request({
        url: '/workerQualificatLicense/delete',
        method: 'post',
        data
    })
}
/**
 * 企业人员查看公司
 * @param data
 */
export function basicCompanyGet(data) {
    return request({
        url: '/basicCompany/get',
        method: 'post',
        data
    })
}
/**
 * 空闲人员信息查询
 * @param data
 */
export function getFreeWorker(data) {
    return request({
        url: '/companyWorker/getFreeWorker',
        method: 'post',
        data
    })
}
/**
 * 自定义停车场查询
 * @param data
 */
export function getParking(data) {
    return request({
        url: '/basicParking/getParking',
        method: 'post',
        data
    })
}
/**
 * 自定义停车场新增
 * @param data
 */
export function basicParking(data) {
    return request({
        url: '/basicParking/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 自定义进出卡口查询
 * @param data
 */
export function getBayonet(data) {
    return request({
        url: '/basicBayonet/getBayonet',
        method: 'post',
        data
    })
}
/**
 * 自定义进出卡口新增
 * @param data
 */
export function basicBayonet(data) {
    return request({
        url: '/basicBayonet/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 自定义装卸位查询
 * @param data
 */
export function getLadeArea(data) {
    return request({
        url: '/ladeArea/getLadeArea',
        method: 'post',
        data
    })
}
/**
 * 装卸区新增/编辑接口
 * @param data
 */
export function ladeArea(data) {
    return request({
        url: '/ladeArea/saveOrUpdate',
        method: 'post',
        data
    })
}


/**
 * 企业危险品货物管理--分页查询
 * @param data
 */
export function companyChemicalPage(data) {
    return request({
        url: '/companyChemical/page',
        method: 'post',
        data
    })
}

/**
 * 企业危险品货物管理--新增编辑
 * @param data
 */
export function addOrEditChemical(data) {
    return request({
        url: '/companyChemical/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 企业危险品货物管理--删除
 * @param data
 */
export function deleteChemical(data) {
    return request({
        url: '/companyChemical/delete',
        method: 'post',
        data
    })
}

/**
 * 企业危险品货物管理--类型查询
 * @param data
 */
export function queryChemicalType(data) {
    return request({
        url: '/basicChemicals/list-type',
        method: 'post',
        data
    })
}
/**
 * 企业更新边界
 * @param data
 */
export function basicCompanyBounds(data) {
    return request({
        url: '/basicCompany/saveOrUpdate-bounds',
        method: 'post',
        data
    })
}
