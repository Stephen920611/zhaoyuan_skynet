import request from '@/utils/request'

/**
 * 左侧资源树：获取自定义树列表
 * @param data
 */
export function queryTreeListByRole(data) {
    return request({
        url: '/customCameraTree/list-by-role',
        method: 'post',
        data
    })
}

/**
 * 左侧资源树：获取树结构
 * @param data
 */
export function queryDepartTree(data) {
    return request({
        url: '/customCameraTree/depart-list',
        method: 'post',
        data
    })
}

/**
 * 左侧资源树：查询摄像机在线、离线数
 * @param data
 */
export function queryCamCount(data) {
    return request({
        url: '/customCameraTree/list-cam-count',
        method: 'post',
        data
    })
}

/**
 * 左侧资源树：获取节点摄像机数组
 * @param data
 */
export function queryCameraList(data) {
    return request({
        url: '/customCameraTree/list-camera',
        method: 'post',
        data
    })
}


/**
 * 查询录像
 * @param data
 */
export function doGetVideotape(data) {
    return request({
        url: '/video/doGetVideotape',
        method: 'post',
        data
    })
}

/**
 * 检查用户摄像机操作权限
 * @param data
 */
export function checkUserCameraPower(data) {
    return request({
        url: 'power/check-camera-power',
        method: 'post',
        data
    })
}

/**
 * 新增根节点
 * @param data
 */
export function newGroupRoot(data) {
    return request({
        url: '/groupMain/new-group-root',
        method: 'post',
        data
    })
}
/**
 * 获取分组树
 * @param data
 */
export function listGroupTree(data) {
    return request({
        url: '/groupMain/list-group-tree',
        method: 'post',
        data
    })
}
/**
 * 新增分组子节点
 * @param data
 */
export function newGroupNode(data) {
    return request({
        url: '/groupMain/new-group-node',
        method: 'post',
        data
    })
}
/**
 * 根节点、子节点重命名
 * @param data
 */
export function updateGroupNode(data) {
    return request({
        url: '/groupMain/update-group-node',
        method: 'post',
        data
    })
}
/**
 * 【分组】-删除节点
 * @param data
 */
export function delNode(data) {
    return request({
        url: '/groupMain/del-node',
        method: 'post',
        data
    })
}
/**
 * 节点添加摄像机
 * @param data
 */
export function addCam(data) {
    return request({
        url: '/groupMain/add-cam',
        method: 'post',
        data
    })
}
/**
 * 节点查询摄像机
 * @param data
 */
export function listNodeCam(data) {
    return request({
        url: '/groupMain/list-node-cam',
        method: 'post',
        data
    })
}
/**
 * 节点查询摄像机
 * @param data
 */
export function delCam(data) {
    return request({
        url: '/groupMain/del-cam',
        method: 'post',
        data
    })
}
/**
 * 分组搜索
 * @param data
 */
export function searchNodes(data) {
    return request({
        url: '/groupMain/search-nodes',
        method: 'post',
        data
    })
}
