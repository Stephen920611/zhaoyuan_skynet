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
 * 核验记录查询列表
 * @param data
 */
export function fetchCheckDetailInfo(data) {
    return request({
        url: '/eleWaybillCheck/getCheckByPage',
        method: 'post',
        data
    })
}

/**
 * 车辆核验查询接口
 * @param data
 */
export function fetchCarCheckInfo(data) {
    /*return request({
        url: '/eleWaybillCheck/getCarCheckInfo',
        method: 'post',
        data
    })*/
}

/**
 * 人员核验查询接口
 * @param data
 */
export function fetchWorkerCheckInfo(data) {
   /* return request({
        url: '/eleWaybillCheck/getWorkerCheckInfo',
        method: 'post',
        data
    })*/
}

/**
 * 电子运单及核验信息联合查询接口
 * @param data
 */
export function fetchEleEaybillDetail(data) {
    return request({
        url: '/eleWaybill/getEleEaybillDetail',
        method: 'post',
        data
    })
}
//fetchWorkerCheckInfo

/**
 * 临时策略进出口核验分页查询接口
 * @param data
 */
export function getCheckByPage(data) {
    return request({
        url: '/eleWaybillCheck/getCheckByPage_',
        method: 'post',
        data
    })
}


