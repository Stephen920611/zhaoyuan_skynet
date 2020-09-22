const state = {
    ladeProcessInfo:{},//装卸过程 视频追溯
    searchCompanyInfo: {}, //查看报警列表的公司
    historicalAlarmQueryVideoTrackInfo: {}, //历史报警查询-具体某个装载位的视频追溯的信息
}

const mutations = {
    //作业过程追溯-装卸位视频追溯
    SET_LADE_PROCESS_INFO:(state, ladeProcessInfo)=>{
        state.ladeProcessInfo = ladeProcessInfo
    },
    //更改查看报警列表的公司
    CHANGE_SEARCH_COMPANY_INFO:(state, searchCompanyInfo)=>{
        state.searchCompanyInfo = searchCompanyInfo
    },
    
    //历史报警查询-具体某个装载位的视频追溯的信息
    CHANGE_HAQ_VIDEO_TRACK_INFO:(state, historicalAlarmQueryVideoTrackInfo)=>{
        state.historicalAlarmQueryVideoTrackInfo = historicalAlarmQueryVideoTrackInfo
    },
}

const actions = {
    //作业过程追溯-装卸位视频追溯
    setLadeProcessInfo({commit}, data) {
        commit('SET_LADE_PROCESS_INFO', data)
    },
    //更改查看报警列表的公司
    changeSearchCompanyInfo({commit}, data) {
        commit('CHANGE_SEARCH_COMPANY_INFO', data)
    },
    
    //历史报警查询-具体某个装载位的视频追溯的信息
    changeHistoricalAlarmQueryVideoTrackInfo({commit}, data) {
        commit('CHANGE_HAQ_VIDEO_TRACK_INFO', data)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
