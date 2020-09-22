import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// 您不需要`import app from './modules/app'`
// 它将自动需要来自模块文件的所有vuex模块
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})

const store = new Vuex.Store({
    plugins: [createPersistedState({
            storage: window.sessionStorage,
            reducer(data) {
                return {
                    // 设置只储存state中的myData
                    app: data.app,
                    'courseMonitor/handingProcess': data['courseMonitor/handingProcess'],
                    'courseMonitor/alarmSynthesis': data['courseMonitor/alarmSynthesis'],
                    video: data.video,   //存储视频有关的state变量
                    map: data.map,   //存储地图有关的state变量
                    importExport: data.importExport,   //存储进出口综合核验有关的state变量
                    'industryInfo/baseInfo/restrictedRoad': data['industryInfo/baseInfo/restrictedRoad'],//行业信息-基础信息的限行路线
                    'industryInfo/enterpriseManagement/vehicleInfo': data['industryInfo/enterpriseManagement/vehicleInfo'],//行业信息-企业综合管理的车辆基本信息
                    evaluateAnalysis: data.evaluateAnalysis,   //存储评价分析有关的state变量
                    emergencyManagement: data.emergencyManagement,   //存储应急管理有关的state变量
                }
            }
            })],
    modules,
    getters,
});

export default store
