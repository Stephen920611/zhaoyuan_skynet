const state = {
    formStatus: {},//判断form表单是新建还是编辑
    tableCurrentRow: {},//点击表格的信息
}

const mutations = {
    SET_FORM_STATUS: (state, formStatus) => {
        state.formStatus = formStatus
    },
    SET_TABLE_CURRENT_ROW: (state, tableCurrentRow) => {
        state.tableCurrentRow = tableCurrentRow
    },
}

const actions = {
    
    setFormStatus({commit, state}, {formStatus}) {
        commit('SET_FORM_STATUS', formStatus)
    },
    setTableCurrentRow({commit, state}, {tableCurrentRow}){
        commit('SET_TABLE_CURRENT_ROW', tableCurrentRow)
    }
    
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
