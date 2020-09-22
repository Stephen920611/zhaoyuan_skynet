import request from '@/utils/request'

/**
 * 专家库：分页
 * @param data
 */
export function serviceExpertPage(data) {
    return request({
        url: '/serviceExpert/page',
        method: 'post',
        data
    })
}

/**
 * 专家库：详情
 * @param data
 */
export function getServiceExpert(data) {
    return request({
        url: '/serviceExpert/get',
        method: 'post',
        data
    })
}

/**
 * 专家库：删除
 * @param data
 */
export function deleteServiceExpert(data) {
    return request({
        url: '/serviceExpert/delete',
        method: 'post',
        data
    })
}

/**
 * 专家库：编辑保存
 * @param data
 */
export function saveServiceExpert(data) {
    return request({
        url: '/serviceExpert/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 外部资源：分页
 * @param data
 */
export function emergencyExtResourcesPage(data) {
    return request({
        url: '/emergencyExtResources/page',
        method: 'post',
        data
    })
}

/**
 * 外部资源：详情
 * @param data
 */
export function getEmergencyExtResources(data) {
    return request({
        url: '/emergencyExtResources/get',
        method: 'post',
        data
    })
}

/**
 * 外部资源：编辑保存
 * @param data
 */
export function saveEmergencyExtResources(data) {
    return request({
        url: '/emergencyExtResources/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 外部资源：更新位置
 * @param data
 */
export function updateBoundsEmergencyExtResources(data) {
    return request({
        url: '/emergencyExtResources/saveOrUpdate-bounds',
        method: 'post',
        data
    })
}

/**
 * 外部资源：删除
 * @param data
 */
export function deleteEmergencyExtResources(data) {
    return request({
        url: '/emergencyExtResources/delete',
        method: 'post',
        data
    })
}