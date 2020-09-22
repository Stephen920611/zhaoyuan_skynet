const state = {
    routeDetailVisible: false,//行业信息-基础信息-限行路线-添加弹窗的显示与隐藏
    companyDetail: {},//树节点选中的公司信息
    carDetail: {},//表格选中的车辆信息
}

const mutations = {
    TOGGLE_ROUTE_DETAIL_VISIBLE: (state, routeDetailVisible) => {
        state.routeDetailVisible = routeDetailVisible
    },
    SET_COMPANY_DETAIL: (state, companyDetail) => {
        state.companyDetail = companyDetail
    },
    SET_CAR_DETAIL: (state, carDetail) => {
        state.carDetail = carDetail
    }
}

const actions = {
    toggleRouteDetailVisible({commit, state}, {routeDetailVisible}) {
        commit('TOGGLE_ROUTE_DETAIL_VISIBLE', routeDetailVisible)
    },
    setCompanyDetail({commit, state}, {companyDetail}) {
        commit('SET_COMPANY_DETAIL', companyDetail)
    },
    setCarDetail({commit, state}, {carDetail}) {
        commit('SET_CAR_DETAIL', carDetail)
    },
    
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
