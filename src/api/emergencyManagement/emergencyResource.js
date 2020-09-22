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
 * 【应急储备点】-分页
 * @param data
 */
export function fetchEmergencyStoragePage(data) {
    return request({
        url: '/emergencyStorage/page',
        method: 'post',
        data
    })
}

/**
 * 【应急储备点】-编辑保存
 * @param data
 */
export function emergencyStorageSaveOrUpdate(data) {
    return request({
        url: '/emergencyStorage/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 【应急储备点】-详情
 * @param data
 */
export function fetchEmergencyStorage(data) {
    return request({
        url: '/emergencyStorage/get',
        method: 'post',
        data
    })
}
/**
 * 【应急储备点】-更新位置
 * @param data
 */
export function emergencyStorageSaveOrUpdateBounds(data) {
    return request({
        url: '/emergencyStorage/saveOrUpdate-bounds',
        method: 'post',
        data
    })
}

/**
 * 【应急队伍】-删除
 * @param data
 */
export function delEmergencyStorage(data) {
    return request({
        url: '/emergencyStorage/delete',
        method: 'post',
        data
    })
}


/**
 * 应急队伍分页查询
 * @param data
 */
export function emergencyTroopsPage(data) {
    return request({
        url: '/emergencyTroops/page',
        method: 'post',
        data
    })
}
/**
 * 【应急队伍】-编辑保存
 * @param data
 */
export function emergencyTroopsSaveOrUpdate(data) {
    return request({
        url: '/emergencyTroops/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 【应急队伍】-详情
 * @param data
 */
export function fetchEmergencyTroops(data) {
    return request({
        url: '/emergencyTroops/get',
        method: 'post',
        data
    })
}
/**
 * 【应急队伍】-删除
 * @param data
 */
export function delEmergencyTroops(data) {
    return request({
        url: '/emergencyTroops/delete',
        method: 'post',
        data
    })
}

/**
 * 【应急队伍】-更新位置
 * @param data
 */
export function emergencyTroopsSaveOrUpdateBounds(data) {
    return request({
        url: '/emergencyTroops/saveOrUpdate-bounds',
        method: 'post',
        data
    })
}

/**
 * 【应急人员】-分页
 * @param data
 */
export function fetchEmergencyPersonPage(data) {
    return request({
        url: '/emergencyPerson/page',
        method: 'post',
        data
    })
}

/**
 * 【应急人员】-删除
 * @param data
 */
export function delEmergencyPerson(data) {
    return request({
        url: '/emergencyPerson/delete',
        method: 'post',
        data
    })
}
/**
 * 【应急人员】-详情
 * @param data
 */
export function fetchEmergencyPerson(data) {
    return request({
        url: '/emergencyPerson/get',
        method: 'post',
        data
    })
}
//
/**
 * 【应急人员】-编辑保存
 * @param data
 */
export function emergencyPersonSaveOrUpdate(data) {
    return request({
        url: '/emergencyPerson/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 【应急物资】-分页
 * @param data
 */
export function fetchEmergencyMaterialPage(data) {
    return request({
        url: '/emergencyMaterial/page',
        method: 'post',
        data
    })
}
/**
 * 【应急物资】-删除
 * @param data
 */
export function delEmergencyMaterial(data) {
    return request({
        url: '/emergencyMaterial/delete',
        method: 'post',
        data
    })
}
/**
 * 【应急物资】-储备点列表
 * @param data
 */
export function fetchEmergencyStoragList(data) {
    return request({
        url: '/emergencyStorage/list',
        method: 'post',
        data
    })
}
/**
 * 【应急物资】-类型数组
 * @param data
 */
export function fetchEmergencyMaterialType(data) {
    return request({
        url: '/emergencyMaterialType/list',
        method: 'post',
        data
    })
}
/**
 * 【应急物资】-详情
 * @param data
 */
export function fetchEmergencyMaterial(data) {
    return request({
        url: '/emergencyMaterial/get',
        method: 'post',
        data
    })
}

/**
 * 【应急物资】-编辑保存
 * @param data
 */
export function emergencyMaterialSaveOrUpdate(data) {
    return request({
        url: '/emergencyMaterial/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 【应急物资】-更新位置
 * @param data
 */
export function emergencyMaterialSaveOrUpdateBounds(data) {
    return request({
        url: '/emergencyMaterial/saveOrUpdate-bounds',
        method: 'post',
        data
    })
}