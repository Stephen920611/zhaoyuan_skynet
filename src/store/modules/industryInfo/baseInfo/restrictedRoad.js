const state = {
    routeDetailVisible: false,//行业信息-基础信息-限行路线-添加弹窗的显示与隐藏
    editRouteDetail: true,//行业信息-基础信息-限行路线-弹窗是新建还是编辑
}

const mutations = {
    TOGGLE_ROUTE_DETAIL_VISIBLE: (state, routeDetailVisible) => {
        state.routeDetailVisible = routeDetailVisible
    },
    EDIT_ROUTE_DETAIL: (state, editRouteDetail) => {
        state.editRouteDetail = editRouteDetail
    }
}

const actions = {
    toggleRouteDetailVisible({commit, state}, {routeDetailVisible}) {
        commit('TOGGLE_ROUTE_DETAIL_VISIBLE', routeDetailVisible)
    },
    editRouteDetail({commit, state}, {editRouteDetail}) {
        commit('EDIT_ROUTE_DETAIL', editRouteDetail)
    },
    
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
