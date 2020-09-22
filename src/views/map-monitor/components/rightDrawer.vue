<!--右侧抽屉-->
<template>
    <div class="drawer-container">
      <transition name="slide-fade">
        <div class="detail-box" >
            <el-tabs tab-position="left" class="tabs-container" v-model="activeName" @tab-click="handleTabClick">
                <!--<el-tab-pane label="报警展示" name="alarm">
                    <alarm-show v-if="tabRefresh.alarm"></alarm-show>
                </el-tab-pane>-->
                <!--<el-tab-pane label="行驶线路" name="line">
                    <running-route v-if="tabRefresh.line" :map="map"></running-route>
                </el-tab-pane>-->
                <el-tab-pane label="企业点位" name="company">
                    <company-tree v-if="tabRefresh.company"></company-tree>
                </el-tab-pane>
                <el-tab-pane label="厂区监控" name="camera">
                    <around-monitor v-if="tabRefresh.camera"></around-monitor>
                </el-tab-pane>
                <el-tab-pane label="装卸区"  name="siteLade">
                    <loading-place ref="loadingPlace" :region="region" :areaId="areaId" :map="map" :companyList="options" v-if="tabRefresh.siteLade"></loading-place>
                </el-tab-pane>
                <el-tab-pane label="进出卡口" name="bayonet">
                    <turnover-bayonet ref="bayonet" :region="region" :areaId="areaId" :map="map" :companyList="options" v-if="tabRefresh.bayonet"></turnover-bayonet>
                </el-tab-pane>
                <el-tab-pane label="重大危险源" name="dangerSource">
                    <danger-source ref="dangerSource" :region="region" :areaId="areaId" :map="map" :companyList="options" v-if="tabRefresh.dangerSource"></danger-source>
                </el-tab-pane>
                <!--<el-tab-pane label="停车场" name="park">
                    <parking-lot :region="region" :areaId="areaId" :map="map" :companyList="options" v-if="tabRefresh.park"></parking-lot>
                </el-tab-pane>-->
                <el-tab-pane label="桥梁" name="bridge">
                    <bridge :region="region" :areaId="areaId" :map="map" v-if="tabRefresh.bridge"></bridge>
                </el-tab-pane>
                <el-tab-pane label="隧道" name="tunnel">
                    <tunnel :region="region" :areaId="areaId" :map="map" v-if="tabRefresh.tunnel"></tunnel>
                </el-tab-pane>
            </el-tabs>
        </div>
      </transition>
    </div>
</template>
<script>
    import runningRoute from './runningRoute.vue'
    import companyTree from './companyTree.vue'
    import turnoverBayonet from './turnoverBayonet.vue'
    import dangerSource from './dangerSource.vue'
    import loadingPlace from './loadingPlace.vue'
    import parkingLot from './parkingLot.vue'
    import bridge from './bridge.vue'
    import tunnel from './tunnel.vue'
    import aroundMonitor from './aroundMonitor.vue'
    import alarmShow from './alarmShow.vue'
    import {getBasicCompanyList} from '@/api/industry'
    export default {
        inject:['updateDefaultSelectSwitch','defaultSelectSwitch'],  //注入参数
        props:{
            region:{
                type:Array,
                default:function () {
                    return []
                }
            },
            areaId:{
              type:String
            },
            map:{
                type:Object
            }
        },
        data(){
          return{
              activeName: "company",
              tabRefresh: {
                  alarm: false,
                  line: false,
                  company: true,
                  camera: false,
                  siteLade: false,
                  bayonet: false,
                  dangerSource: false,
                  park: false,
                  bridge: false,
                  tunnel: false,
              },
              options:[],  //企业列表
          }
        },
        components:{
            runningRoute,
            companyTree,
            turnoverBayonet,
            dangerSource,
            loadingPlace,
            parkingLot,
            bridge,
            tunnel,
            aroundMonitor,
            alarmShow
        },
        mounted(){
          this.getAllCompanys();
        },
        methods:{
            getAllCompanys(){
                //获取所有的企业
                getBasicCompanyList({}).then(res => {
                    this.options = res.data.list
                });
            },
            handleTabClick(){
                for (let [key, value] of Object.entries(this.tabRefresh)) {
                    if (key == this.activeName) {
                        this.tabRefresh[key] = true
                    } else {
                        this.tabRefresh[key] = false
                    }
                    //判断开关是否打开，若处于关闭状态则开启
                    const flag = this.defaultSelectSwitch().indexOf(this.activeName)>-1;
                    if(!flag){
                        //调用主页面的方法，打开企业显隐开关
                        this.updateDefaultSelectSwitch(this.activeName);
                    }
                }
            },
        }
    }
</script>
<style lang="less">
    @import "../style/style.right-drawer.less";
</style>
