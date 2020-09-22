const state = {
    tableType: {},//判断应急管理资源表格的类型
    tableCurrentData: {},//点击表格的信息
}

const mutations = {
    SET_TABLE_CURRENT_DATA: (state, {tableType,tableCurrentData}) => {
        console.log('tableType',tableType)
        console.log('tableCurrentData',tableCurrentData)
        state.tableCurrentData = tableCurrentData;
        state.tableType = tableType
    },
}

const actions = {
    setTableCurrentData({commit, state}, {tableType,tableCurrentData}){
        console.log('tableCurrentData111111111',tableCurrentData)
        commit('SET_TABLE_CURRENT_DATA', {tableType,tableCurrentData})
    }
    
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
