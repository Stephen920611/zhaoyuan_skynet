<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 10px;" class="input-top">
                <el-row :gutter="20">
                    <el-col :span="6">
                        托运方：
                        <el-input
                                placeholder="请输入托运方"
                                v-model="form.shipper">
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        承运方：
                        <el-input
                                placeholder="请输入承运方"
                                v-model="form.carrier">
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        收货方：
                        <el-input
                                placeholder="请输入收货方"
                                v-model="form.receiving">
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        危险货物名称：
                        <el-input
                                style="width: calc(100% - 150px)"
                                placeholder="请输入危险货物名称"
                                v-model="form.dangerous">
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
                            <car-check></car-check>
                        </el-tab-pane>
                        <!--人员核验-->
                        <el-tab-pane name="second" >
                             <span slot="label">
                                <el-button type="primary" icon="el-icon-s-check">人员核验</el-button>
                            </span>
                            <person-check></person-check>
                        </el-tab-pane>
                        <!--电子运单核验-->
                        <el-tab-pane name="third" >
                            <span slot="label">
                                <el-button type="primary" icon="el-icon-s-check">电子运单核验</el-button>
                            </span>
                            <waybill-check></waybill-check>

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
    export default {
        name: 'cMImportAndExportRealVerificationIndex',
        components: {CarCheck,PersonCheck,WaybillCheck},
        data() {
            return {
                form:{
                    shipper:'',//托运方
                    carrier:'',//承运方
                    receiving:'',//收货方
                    dangerous:'',//危险物品
                },
                tabValue: 'first',//tab键
            }
        },
        computed: {},
        watch: {},
        created() {
        },
        methods: {
            // tab键改变触发
            changeTab: function (tab, event) {
                this.tabValue = tab.name
            },
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
    }

</style>
