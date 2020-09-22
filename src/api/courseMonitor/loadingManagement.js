import request from '@/utils/request'

/**
 * 查询区域树
 * @param data
 */
export function fetchAreaTree(data) {
    return request({
        url: '/basicArea/getAreaTree',
        method: 'post',
        data
    })
}

/**
 * 装卸位管理查询列表
 * @param data
 */
export function fetchLadeSitePage(data) {
    return request({
        url: '/ladeSite/page',
        method: 'post',
        data
    })
}

/**
 * 摄像机列表查询
 * @param data
 */
export function fetchListSiteCamera(data) {
    return request({
        url: '/ladeSite/list-site-camera',
        method: 'post',
        data
    })
}
/**
 * 摄像机列表查询(分页)
 * @param data
 */
export function fetchPageSiteCamera(data) {
    return request({
        url: '/ladeSite/page-site-camera',
        method: 'post',
        data
    })
}

/**
 * 企业摄像机列表查询
 * @param data
 */
export function fetchListUserCamera(data) {
    return request({
        url: '/ladeSite/list-user-camera',
        method: 'post',
        data
    })
}

/**
 * 新增、编辑装卸位
 * @param data
 */
export function saveLadeSite(data) {
     return request({
         url: '/ladeSite/saveOrUpdate',
         method: 'post',
         data
     })
}

/**
 * 装卸位详情查询
 * @param data
 */
export function fetchLadeSiteInfo(data) {
    return request({
        url: '/ladeSite/get',
        method: 'post',
        data
    })
}

/**
 * 删除装卸位接口
 * @param data
 */
export function deleteLadeSite(data) {
     return request({
         url: '/ladeSite/delete',
         method: 'post',
         data
     })
}












