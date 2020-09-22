import request from '@/utils/request'

/**
 * 查询区域列表
 * @param data
 */
export function queryAreaList(data) {
    return request({
        url: '/basicArea/getAreaList',
        method: 'post',
        data
    })
}

/**
 * 查询公司点位
 * @param data
 */
export function queryCompanyPoints(data) {
    return request({
        url: '/basicCompany/getCompanyDetail',
        method: 'post',
        data
    })
}

/**
 * 查询摄像机点位
 * @param data
 */
export function queryCameraPoints(data) {
    return request({
        url: '/camBasic/list-position',
        method: 'post',
        data
    })
}

/**
 * 查询行驶线路信息
 * @param data
 */
export function queryBasicLine(data) {
    return request({
        url: '/basicLine/page',
        method: 'post',
        data
    })
}

/**
 * 查询行驶线路坐标
 * @param data
 */
export function queryLinePoints(data) {
    return request({
        url: '/basicLine/list-point',
        method: 'post',
        data
    })
}

/**
 * 查询进出卡口点位
 * @param data
 */
export function queryBayonetPoints(data) {
    return request({
        url: '/basicBayonet/getBayonet',
        method: 'post',
        data
    })
}

/**
 * 查询停车场点位
 * @param data
 */
export function queryParkingPoints(data) {
    return request({
        url: '/basicParking/getParking',
        method: 'post',
        data
    })
}

/**
 * 查询装卸区点位
 * @param data
 */
export function queryLadeSiteArea(data) {
    return request({
        url: '/ladeArea/getLadeArea',
        method: 'post',
        data
    })
}

/**
 * 查询装卸位点位
 * @param data
 */
export function queryLadeSitePoints(data) {
    return request({
        url: '/ladeSite/getLadeSite',
        method: 'post',
        data
    })
}

/**
 * 查询桥梁点位
 * @param data
 */
export function queryBridgePoints(data) {
    return request({
        url: '/basicBridge/getBridge',
        method: 'post',
        data
    })
}

/**
 * 查询隧道点位
 * @param data
 */
export function queryTunnelPoints(data) {
    return request({
        url: '/basicTunnel/getTunnel',
        method: 'post',
        data
    })
}

/**
 * 查询区域企业树
 * @param data
 */
export function queryAreaTree(data) {
    return request({
        url: '/basicArea/getAreaTree',
        method: 'post',
        data
    })
}

/**
 * 查询区域企业下的车辆
 * @param data
 */
export function queryCompanyCar(data) {
    return request({
        url: '/companyCar/getCar',
        method: 'post',
        data
    })
}

/**
 * 查询区域下的重大危险源
 * @param data
 */
export function queryDangerSource(data) {
    return request({
        url: '/hazardDetail/list-area',
        method: 'post',
        data
    })
}