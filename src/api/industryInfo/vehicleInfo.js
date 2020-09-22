import request from '@/utils/request'
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
 * 查询区域树接口
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
 * 自定义企业车辆查询
 * @param data
 */
export function getCar(data) {
    return request({
        url: '/companyCar/page',
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
 * 车辆基本信息-删除接口
 * @param data
 */
export function deleteCompanyCar(data) {
    return request({
        url: '/companyCar/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 车辆基本信息-车辆信息新增、编辑
 * @param data
 */
export function carSaveOrUpdate(data) {
    return request({
        url: '/companyCar/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 车辆基本信息-车辆信息查询
 * @param data
 */
export function fetchCompanyCarInfo(data) {
    return request({
        url: '/companyCar/get',
        method: 'post',
        data
    })
}

/**
 * 车辆资质信息-新增/编辑接口
 * @param data
 */
export function batchSaveOrUpdate(data) {
    return request({
        url: '/carTransportLicense/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 车辆资质信息-查询接口
 * @param data
 */
export function fetchCarTransportLicense(data) {
    return request({
        url: '/carTransportLicense/list',
        method: 'post',
        data
    })
}
/**
 * 车辆资质信息-删除接口
 * @param data
 */
export function deleteCarTransportLicense(data) {
    return request({
        url: '/carTransportLicense/delete',
        method: 'post',
        data
    })
}


/**
 * 行驶证信息新增/编辑接口
 * @param data
 */
export function carDrivingLicenseSaveOrUpdate(data) {
    return request({
        url: '/carDrivingLicense/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 车辆资质信息-查询接口
 * @param data
 */
export function fetchCarDrivingLicense(data) {
    return request({
        url: '/carDrivingLicense/list',
        method: 'post',
        data
    })
}
/**
 * 车辆资质信息-删除接口
 * @param data
 */
export function deleteCarDrivingLicense(data) {
    return request({
        url: '/carDrivingLicense/delete',
        method: 'post',
        data
    })
}


/**
 * 车辆液化气体罐车使用证信息新增/编辑接口
 * @param data
 */
export function carLiquidGaxLicenseSaveOrUpdate(data) {
    return request({
        url: '/carLiquidGaxLicense/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 车辆液化气体罐车使用证-查询接口
 * @param data
 */
export function fetchCarLiquidGaxLicense(data) {
    return request({
        url: '/carLiquidGaxLicense/list',
        method: 'post',
        data
    })
}
/**
 * 车辆液化气体罐车使用证信息-删除接口
 * @param data
 */
export function deleteCarLiquidGaxLicense(data) {
    return request({
        url: '/carLiquidGaxLicense/delete',
        method: 'post',
        data
    })
}

/**
 * 压力容器检测记录信息新增/编辑接口
 * @param data
 */
export function carPressureRecordSaveOrUpdate(data) {
    return request({
        url: '/carPressureRecord/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 压力容器检测记录-查询接口
 * @param data
 */
export function fetchCarPressureRecord(data) {
    return request({
        url: '/carPressureRecord/list',
        method: 'post',
        data
    })
}
/**
 * 压力容器检测记录信息新增/编辑接口
 * @param data
 */
export function deleteCarPressureRecord(data) {
    return request({
        url: '/carPressureRecord/delete',
        method: 'post',
        data
    })
}

/**
 * 所属企业信息信息-查询接口
 * @param data
 */
export function fetchBasicCompany(data) {
    return request({
        url: '/basicCompany/get',
        method: 'post',
        data
    })
}



















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
export function eleWaybill(data) {
    return request({
        url: '/eleWaybill/page',
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
