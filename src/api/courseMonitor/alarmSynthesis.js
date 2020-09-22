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
 * 装卸过程报警-报警级别
 * @param data
 */
export function fetchAlarmClass(data) {
    return request({
        url: '/dict/getByCode',
        method: 'post',
        data
    })
}

/**
 * 装卸过程报警-进出目的
 * @param data
 */
export function fetchAlarmName(data) {
    return request({
        url: '/ladeAlarm/page',
        method: 'post',
        data
    })
}

/**
 * 装卸过程报警-装卸位
 * @param data
 */
export function fetchLadeSite(data) {
    return request({
        url: '/ladeSite/getLadeSite',
        method: 'post',
        data
    })
}


/**
 * 装卸过程报警-列表
 * @param data
 */
export function fetchtQueryAlarmList(data) {
    return request({
        url: '/ladeStep/queryAlarm',
        method: 'post',
        data
    })
}

/**
 * 车辆违规报警-列表
 * @param data
 */
export function fetchtCarAlarmList(data) {
    return request({
        url: '/carAlarm/getCarAlarm',
        method: 'post',
        data
    })
}


