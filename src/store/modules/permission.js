import {asyncRoutes, constantRoutes} from '@/router'
import {getStorage} from '@/utils/storage'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */

/*修改后的版本--如果有权限,返回true，否则返回false，（权限过滤）*/
function hasPermission(roles, route) {
    if (route.meta && route.meta.fullPath) {
        return roles.some(role => route.meta.fullPath === role)
    } else if (route.path === '/') {
        return true
    } else {
        return false
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []
    
    routes.forEach(route => {
        const tmp = {...route}
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })
    return res
}

/*重新编写路由*/
function filterRedirect(routes) {
    //根路由的重定向是为了找出最后一级含isNeedReWriteRedirect并且为true的子节点的fullPath
    if(routes.meta.hasOwnProperty('isNeedReWriteRedirect') && routes.meta.isNeedReWriteRedirect && routes.children.length > 0){
        return filterRedirect(routes.children[0])
    }else {
        return routes.meta.fullPath;
    }
}

//动态重新造路由的方法
function rewriteRedirect(routes) {
    let res = [];
    routes.map(item => {
        if(item.path === '/'){
            item.redirect = routes[0].redirect;
            res.push(item)
        }else {
            if(item.meta.hasOwnProperty('isNeedReWriteRedirect') && item.meta.isNeedReWriteRedirect && item.children.length > 0){
                item.redirect = item.meta.fullPath + '/' + item.children[0].path;
                item.children = rewriteRedirect(item.children)
            }
            res.push(item)
        }
    });
    return res;
}



const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes;
        state.routes = constantRoutes.concat(routes)
    }
};

const actions = {
    //过滤权限
    generateRoutes({commit}, roles) {
        return new Promise(resolve => {
            let accessedRoutes;
            //TODO 严格按照权限来控制，之前是admin也能看到所有的
            accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
            let userInfo = getStorage('userInfo');
            
            // let dealRoutes = rewriteRedirect(accessedRoutes);
            
            //根据路由权限修改重定向，防止重定向会根据路由权限产生丢失
            accessedRoutes.map(item => {
                if(item.path === '/'){
                    item.redirect = accessedRoutes[0].redirect
                }else {
                    //判断是否有子节点，有子节点才重新写重定向
                    item.redirect = item.children.length > 0 ? filterRedirect(item.children[0]) : item.redirect;
                }
            });
            
            // console.log(accessedRoutes, '修改后的');
            commit('SET_ROUTES', accessedRoutes);
            resolve(accessedRoutes)
        })
    },
    
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
