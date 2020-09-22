
const state = {
    loadedJs:false,  //加载离线地图的js是否完成
    openWaybillDialog:false,  //打开电子运单的dialog弹窗
    openCarDialog:false,  //打开车辆的dialog弹窗
}

const mutations = {
    COMPLETE_LOADED:(state, flag)=>{
        state.loadedJs = flag
    },
    OPEN_WAYBILL_DIALOG:(state, flag)=>{
        state.openWaybillDialog = flag
    },
    OPEN_CAR_DIALOG:(state, flag)=>{
        state.openCarDialog = flag
    },
}

const actions = {
    completeLoaded({commit}, data){
        commit('COMPLETE_LOADED', data)
    },
    
    openDialogOfWaybill({commit}, data) {
        commit('OPEN_WAYBILL_DIALOG', data)
    },
    openDialogOfCar({commit}, data) {
        commit('OPEN_CAR_DIALOG', data)
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
