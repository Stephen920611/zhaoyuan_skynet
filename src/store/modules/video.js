
const state = {
    isFullScreen:false,  //监听是否全屏显示
}

const mutations = {
    LISTENER_FULL_SCREEN:(state, status)=>{
        state.isFullScreen = status
    },
}

const actions = {
    //监听视频窗口是否为全屏显示
    videoIsFullScreen({commit}, data) {
        commit('LISTENER_FULL_SCREEN', data)
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
