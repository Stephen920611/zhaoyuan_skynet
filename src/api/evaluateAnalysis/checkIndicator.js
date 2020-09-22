import request from '@/utils/request'

/**
 * 获取菜单树
 * @param data
 */
export function getSysPathTree(data) {
    return request({
        url: '/appraiseOperation/tree',
        method: 'post',
        data
    })
}

/**
 * 获取菜单详情
 * @param data
 */
export function getSysPathDetail(data) {
    return request({
        url: '/appraiseOperation/list-operation',
        method: 'post',
        data
    })
}

/**
 * 新增修改菜单
 * @param data
 */
export function saveSysPath(data) {
    return request({
        url: '/appraiseOperation/saveOrUpdate',
        method: 'post',
        data
    })
}

/**
 * 菜单删除
 * @param data
 */
export function deleteSysPath(data) {
    return request({
        url: '/appraiseOperation/delete',
        method: 'post',
        data
    })
}

/**
 * 获取角色权限
 * @param data
 */
export function getRoleList(data) {
    return request({
        url: '/sysPath/list-by-role',
        method: 'post',
        data
    })
}

/**
 * 保存角色权限
 * @param data
 */
export function saveRolePower(data) {
    return request({
        url: '/role/save-power',
        method: 'post',
        data
    })
}