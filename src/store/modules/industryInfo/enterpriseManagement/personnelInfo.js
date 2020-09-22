const state = {
    personnelCompanyDetail: {},//树节点选中的公司信息
};

const mutations = {
    SET_COMPANY_DETAIL: (state, personnelCompanyDetail) => {
        state.personnelCompanyDetail = personnelCompanyDetail
    },
};

const actions = {
    setCompanyDetail({commit, state}, {personnelCompanyDetail}) {
        commit('SET_COMPANY_DETAIL', personnelCompanyDetail)
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
