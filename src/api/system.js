import request from '@/utils/request'
/**
 * 报警配置查询
 * @param data
 */
export function ladeAlarm(data) {
    return request({
        url: '/ladeAlarm/page',
        method: 'post',
        data
    })
}
/**
 * 报警配置新/增编辑
 * @param data
 */
export function saveOrUpdate(data) {
    return request({
        url: '/ladeAlarm/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 报警配置删除
 * @param data
 */
export function deleteAlarmate(data) {
    return request({
        url: '/ladeAlarm/delete',
        method: 'post',
        data
    })
}
/**
 * 全局参数分页查询
 * @param data
 */
export function dict(data) {
    return request({
        url: '/dict/page',
        method: 'post',
        data
    })
}
/**
 * 全局参数分页查询
 * @param data
 */
export function dictSaveOrUpdate(data) {
    return request({
        url: '/dict/saveOrUpdate',
        method: 'post',
        data
    })
}
/**
 * 全局参数删除
 * @param data
 */
export function deleteParameter(data) {
    return request({
        url: '/dict/delete',
        method: 'post',
        data
    })
}
