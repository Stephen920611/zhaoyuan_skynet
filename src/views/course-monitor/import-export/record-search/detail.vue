<template>
    <div class="app-container" v-loading="listLoading">
        <el-container>
            <el-main style="padding: 10px;" class="input-top">
                <el-row :gutter="20">
                    <el-col :span="5" style="width: 20%">
                        运单编号：
                        <el-input
                                :title="form.wayBillNo"
                                :disabled="isEdit"
                                placeholder=""
                                v-model="form.wayBillNo">
                        </el-input>
                    </el-col>
                    <el-col :span="5" style="width: 20%">
                        托运方：
                        <el-input
                                :title="form.consignorCompanyName"
                                :disabled="isEdit"
                                placeholder=""
                                v-model="form.consignorCompanyName">
                        </el-input>
                    </el-col>
                    <el-col :span="5" style="width: 20%">
                        承运方：
                        <el-input
                                :title="form.carrierCompanyName"
                                :disabled="isEdit"
                                placeholder=""
                                v-model="form.carrierCompanyName">
                        </el-input>
                    </el-col>
                    <el-col :span="5" style="width: 20%">
                        收货方：
                        <el-input
                                :title="form.receiverCompanyName"
                                :disabled="isEdit"
                                placeholder=""
                                v-model="form.receiverCompanyName">
                        </el-input>
                    </el-col>
                    <el-col :span="5" style="width: 20%">
                        危险货物名称：
                        <el-input :disabled="isEdit"
                                  :title="form.cargoName"
                                  style="width: calc(100% - 150px)"
                                  placeholder=""
                                  v-model="form.cargoName">
                        </el-input>
                    </el-col>
                </el-row>

                <!--车辆核验、人员核验、电子运单核验-->
                <div class="tab-main">
                    <el-tabs v-model="tabValue" @tab-click="changeTab">
                        <!--车辆核验-->
                        <el-tab-pane name="first" >
                            <span slot="label">
                                <el-button type="primary" icon="el-icon-s-check">车辆核验</el-button>
                            </span>
                            <car-check v-if="tabValue==='first'" ></car-check>
                        </el-tab-pane>
                        <!--人员核验-->
                        <el-tab-pane name="second" >
                             <span slot="label">
                                <el-button type="primary" icon="el-icon-s-check">人员核验</el-button>
                            </span>
                            <person-check v-if="tabValue==='second'"></person-check>
                        </el-tab-pane>
                        <!--电子运单核验-->
                        <el-tab-pane name="third" >
                            <span slot="label">
                                <el-button type="primary" icon="el-icon-s-check">电子运单核验</el-button>
                            </span>
                            <waybill-check v-if="tabValue==='third'"></waybill-check>

                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-main>
        </el-container>

    </div>
</template>
<script>
    import CarCheck from './components/carCheck'
    import PersonCheck from './components/personCheck'
    import WaybillCheck from './components/waybillCheck'
    import {mapState, mapGetters} from 'vuex'
    import {fetchAreaTree,fetchCheckDetailInfo,fetchEleEaybillDetail} from '@/api/courseMonitor/importExport'

    export default {
        name: 'cMVerificationRecordSearchDetail',
        components: {CarCheck,PersonCheck,WaybillCheck},
        data() {
            return {
                isEdit:true,//s是否可编辑，true为不可编辑，false为可编辑
                form:{
                    wayBillNo:'',//运单编号
                    consignorCompanyName:'',//托运方
                    carrierCompanyName:'',//承运方
                    receiverCompanyName:'',//收货方
                    cargoName:'',//危险物品
                },
                tabValue: 'first',//tab键
                listLoading:false,
            }
        },
        computed: {
            ...mapGetters([
                'eleWaybillDetail',
            ])
        },
        watch: {},
        created() {
        },
        mounted(){
            //获取电子运单。车辆核验、人员核验、电子运单核验详情
            this.fetchEleEaybillDetail();
        },
        methods: {
            // tab键改变触发
            changeTab: function (tab, event) {
                this.tabValue = tab.name
            },
            //获取详情
            fetchEleEaybillDetail:function () {
                this.listLoading = true;
                //请求接口
                let self = this;
                let params={
                    "wayBillNo": this.eleWaybillDetail.wayBillNo,
//                    "waybillPurpose": this.eleWaybillDetail.waybillPurpose,//进出目的
                };
                fetchEleEaybillDetail(params).then(res => {
                    this.form = res.data;
                    //checkDetailInfo 保存返回的核验信息
                    this.$store.dispatch("importExport/setCheckDetailInfo",{checkDetailInfo:res.data});
                    self.listLoading = false;
                }).catch(err => {
                    self.listLoading = false;

                });

            }
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .input-top{
        /deep/.el-input{
            width: calc(100% - 100px);
        }
    }
    .tab-main{
        margin-top:30px;
        /deep/.el-tabs__nav-wrap::after{
            height: 0;
        }
        /deep/.el-tabs__active-bar{
            height: 0;
        }
        /deep/.el-tabs__item.is-active{
            /deep/ .el-button--primary{
                background:#0E58B6

            }
        }
        /deep/.el-tabs__item.is-top:last-child{
            padding-left: 0;
        }
        .el-button--medium{
            padding: 10px 40px;
        }
        /deep/.el-tabs__item.is-top:nth-child(2){
            padding-right: 0;
        }
    }

</style>
