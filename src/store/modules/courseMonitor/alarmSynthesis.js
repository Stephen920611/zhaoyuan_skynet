const state = {
    alarmInfo:{},//车辆违规报警-报警详情
    searchCompanyInfo: {}, //查看报警列表的公司
    historicalAlarmQueryVideoTrackInfo: {}, //历史报警查询-具体某个装载位的视频追溯的信息
}

const mutations = {
    
    //更改查看报警列表的公司
    CHANGE_SEARCH_COMPANY_INFO:(state, searchCompanyInfo)=>{
        state.searchCompanyInfo = searchCompanyInfo
    },
    
    //车辆违规报警-报警详情
    CHANGE_ALARM_INFO:(state, alarmInfo)=>{
        state.alarmInfo = alarmInfo
    },
    
    //历史报警查询-具体某个装载位的视频追溯的信息
    CHANGE_HAQ_VIDEO_TRACK_INFO:(state, historicalAlarmQueryVideoTrackInfo)=>{
        state.historicalAlarmQueryVideoTrackInfo = historicalAlarmQueryVideoTrackInfo
    },
}

const actions = {
    //更改查看报警列表的公司
    changeSearchCompanyInfo({commit}, data) {
        commit('CHANGE_SEARCH_COMPANY_INFO', data)
    },
    
    //车辆违规报警-报警详情
    changeAlarmInfo({commit}, data) {
        commit('CHANGE_ALARM_INFO', data)
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
