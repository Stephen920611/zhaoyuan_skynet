import request from '@/utils/request'

/**
 * 重大危险源--分页查询
 * @param data
 */
export function queryHazardSourceList(data) {
    return request({
        url: '/hazardDetail/page',
        method: 'post',
        data
    })
}

/**
 * 重大危险源--详情查询
 * @param data
 */
export function getHazardSourceDetail(data) {
    return request({
        url: '/hazardDetail/get',
        method: 'post',
        data
    })
}

/**
 * 重大危险源--编辑、保存基本信息
 * @param data
 */
export function saveOrUpdateHazardSource(data) {
    return request({
        url: '/hazardDetail/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 重大危险源--更新边界
 * @param data
 */
export function updateBoundsHazardSource(data) {
    return request({
        url: '/hazardDetail/saveOrUpdate-bounds',
        method: 'post',
        data
    })
}

/**
 * 重大危险源--删除
 * @param data
 */
export function deleteHazardSource(data) {
    return request({
        url: '/hazardDetail/delete',
        method: 'post',
        data
    })
}

/**
 * 储罐--分页查询
 * @param data
 */
export function queryTankList(data) {
    return request({
        url: '/basicTank/page',
        method: 'post',
        data
    })
}

/**
 * 储罐--详情
 * @param data
 */
export function basicTankDetail(data) {
    return request({
        url: '/basicTank/get',
        method: 'post',
        data
    })
}
/**
 * 储罐--编辑、保存基本信息
 * @param data
 */
export function basicTankSaveOrUpdate(data) {
    return request({
        url: '/basicTank/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 储罐--删除
 * @param data
 */
export function basicTankDelete(data) {
    return request({
        url: '/basicTank/delete',
        method: 'post',
        data
    })
}
/**
 * 储罐--更新边界
 * @param data
 */
export function saveOrUpdateBounds(data) {
    return request({
        url: '/basicTank/saveOrUpdate-bounds',
        method: 'post',
        data
    })
}
