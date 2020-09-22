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
 * 装卸过程监测-作业过程追溯分页查询
 * @param data
 */
export function fetchLadeProcessDetailInfo(data) {
    return request({
        url: '/ladeProcess/getLadeProcessDetailInfo',
        method: 'post',
        data
    })
}

/**
 * 历史报警-历史报警分页查询接口
 * @param data
 */
export function fetchHistoricalAlarmQueryCompanyList(data) {
  return request({
    url: '/basicCompany/ladeProcessQuery',
    method: 'post',
    data
  })
}

/**
 * 历史报警-根据公司报警列表查询接口
 * @param data
 */
export function fetchCompanyAlarmList(data) {
    return request({
        url: '/ladeStep/queryAlarm',
        method: 'post',
        data
    })
}

/**
 * 历史报警-根据公司报警列表查询接口
 * @param data
 */
export function fetchAlarmType(data) {
    return request({
        url: '/ladeAlarm/page',
        method: 'post',
        data
    })
}

/**
 * 历史报警查询-报警列表-视频追溯查询
 * @param data
 */
export function fetchVideoTrackType(data) {
    return request({
        url: '/ladeStep/querySevenStep',
        method: 'post',
        data
    })
}