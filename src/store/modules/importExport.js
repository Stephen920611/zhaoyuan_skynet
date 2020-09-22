const state = {
    checkDetailInfo: {},//核验信息
    eleWaybillDetail:{}//列表选择的电子运单信息
}

const mutations = {
    SET_CHECK_DETAIL_INFO: (state, checkDetailInfo) => {
        state.checkDetailInfo = checkDetailInfo
    },
    SET_ELEWAYBILL_DETAIL_INFO: (state, eleWaybillDetail) => {
        state.eleWaybillDetail = eleWaybillDetail
    }
}

const actions = {
    
    setCheckDetailInfo({commit, state}, {checkDetailInfo}) {
        commit('SET_CHECK_DETAIL_INFO', checkDetailInfo)
    },
    setEleWaybillDetailInfo({commit, state}, {eleWaybillDetail}) {
        commit('SET_ELEWAYBILL_DETAIL_INFO', eleWaybillDetail)
    },
    
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
