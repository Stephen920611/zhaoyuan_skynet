import request from '@/utils/request'

/**
 * 登录
 * @param data
 */
export function login(data) {
  /* return request({
        url: '/vue-element-admin/user/login',
        method: 'post',
        data
    })*/
  return request({
    url: '/auth/web-login',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 * @param data
 */
export function updatePassword(data) {
    return request({
        url: '/auth/updatePassword',
        method: 'post',
        data
    })
}

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

/**
 * 获取验证码
 */
export function getVerify(params) {
  return request({
    url: '/auth/getVertify',
    method: 'get',
    query: params
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

/**
 * 登录获取角色菜单权限
 */
export function getRoleMenuAuth(data) {
    return request({
        url: '/power/menu-power',
        method: 'post',
        data
    })
}

