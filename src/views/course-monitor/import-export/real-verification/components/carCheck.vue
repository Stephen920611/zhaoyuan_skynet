<template>
    <div>
        <el-form v-loading="loading" label-position="right" label-width="150px" :model="form" >
            <el-card class="box-card" >
                <div slot="header" class="clearfix">
                    <span class="font-bold">车辆情况</span>
                </div>
                <div>
                    <el-row>
                        <el-col :span="14">
                            <div class="driver-content">
                                <div class="driver-content-title">
                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="主车牌号：">
                                                <el-input v-model="form.mainCarNum" placeholder="主车牌号"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="挂车牌号：">
                                                <el-input v-model="form.carNum" placeholder="挂车牌号"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="道路运输证核定载重（吨）：" class="two-label">
                                                <el-input v-model="form.load" placeholder="道路运输证核定载重（吨）"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="道路运输证编号：">
                                                <el-input v-model="form.roadNum" placeholder="道路运输证编号"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="最大充装量（m3:常压或承压）：" class="two-label">
                                                <el-input v-model="form.amount"
                                                          placeholder="最大充装量（m3:常压或承压）"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="液化气体罐车使用编号：" class="two-label">
                                                <el-input v-model="form.carNumber" placeholder="液化气体罐车使用编号"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="GPS定位系统情况:">
                                                <el-radio-group v-model="form.gps">
                                                    <el-radio label="1">正常</el-radio>
                                                    <el-radio label="0">不正常</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="压力容器（罐体）检测有效期：" class="two-label">
                                                <el-input v-model="form.containerValidity"
                                                          placeholder="压力容器（罐体）检测有效期"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="车辆及罐体是否与行驶证照片一致:" class="two-label">
                                                <el-radio-group v-model="form.isSame">
                                                    <el-radio label="1">正常</el-radio>
                                                    <el-radio label="0">不正常</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>


                        </el-col>
                        <el-col :span="10" style="text-align: center">
                            <el-image
                                    style="width:400px; height:240px"
                                    :src="require('@/assets/image/login_bg.png')"
                            >
                            </el-image>

                        </el-col>
                    </el-row>

                </div>
                <div class="tab-groups">
                    <template>
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                            <!--所属运输公司信息-->
                            <el-tab-pane label="所属运输公司信息" name="company">
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="公司名称：">
                                            <el-input v-model="form.companyName" placeholder="公司名称"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="发证日期：">
                                            <el-input v-model="form.openDate" placeholder="发证日期"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="证件编号：">
                                            <el-input v-model="form.code" placeholder="证件编号"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="证件有效期：">
                                            <el-input v-model="form.validity" placeholder="证件有效期"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="发证机关：">
                                            <el-input v-model="form.organ" placeholder="发证机关"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="数据来源：">
                                            <el-input v-model="form.dataSource" placeholder="数据来源"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="状态：">
                                            <el-input v-model="form.state" placeholder="状态"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="备案日期：">
                                            <el-input v-model="form.recordDate" placeholder="备案日期"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-divider></el-divider>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="结论：">
                                            <el-radio-group v-model="form.conclusion">
                                                <el-radio label="1">正常</el-radio>
                                                <el-radio label="0">不正常</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24" class="margin-t-10">
                                        <el-form-item label="说明：">
                                            <el-input type="textarea" v-model="form.explanation"
                                                      placeholder="说明"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>

                            <!--车辆行驶证信息-->
                            <el-tab-pane label="车辆行驶证信息" name="driver">
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="行驶证编号：">
                                            <el-input v-model="form.driverId" placeholder="行驶证编号"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="检验有效期：">
                                            <el-input v-model="form.drivingValidity" placeholder="检验有效期"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="备案日期：">
                                            <el-input v-model="form.drivingRecordDate" placeholder="备案日期"></el-input>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="发证日期：">
                                            <el-input v-model="form.drivingLicenseDate" placeholder="发证日期"></el-input>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                                <el-divider></el-divider>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="结论：">
                                            <el-radio-group v-model="form.drivingConclusion">
                                                <el-radio label="1">正常</el-radio>
                                                <el-radio label="0">不正常</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24" class="margin-t-10">
                                        <el-form-item label="说明：">
                                            <el-input type="textarea" v-model="form.drivingExplanation"
                                                      placeholder="说明"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                            </el-tab-pane>

                            <!--车辆安全配置-->
                            <el-tab-pane label="车辆安全配置" name="safety">
                                <el-row :gutter="20">
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="三角顶灯：">
                                            <el-radio-group v-model="form.light">
                                                <el-radio label="1">有</el-radio>
                                                <el-radio label="0">无</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="压力表：">
                                            <el-radio-group v-model="form.pressure">
                                                <el-radio label="1">有</el-radio>
                                                <el-radio label="0">无</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="矩形标牌：">
                                            <el-radio-group v-model="form.rectangle">
                                                <el-radio label="1">有</el-radio>
                                                <el-radio label="0">无</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="液体位：">
                                            <el-radio-group v-model="form.liquid">
                                                <el-radio label="1">有</el-radio>
                                                <el-radio label="0">无</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="导静电带：">
                                            <el-radio-group v-model="form.light1">
                                                <el-radio label="1">有</el-radio>
                                                <el-radio label="0">无</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="防波板：">
                                            <el-radio-group v-model="form.pressure1">
                                                <el-radio label="1">有</el-radio>
                                                <el-radio label="0">无</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="毒爆腐标志：">
                                            <el-radio-group v-model="form.rectangle1">
                                                <el-radio label="1">有</el-radio>
                                                <el-radio label="0">无</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="速断阀：">
                                            <el-radio-group v-model="form.liquid1">
                                                <el-radio label="1">有</el-radio>
                                                <el-radio label="0">无</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="应急器材：">
                                            <el-radio-group v-model="form.light2">
                                                <el-radio label="1">有</el-radio>
                                                <el-radio label="0">无</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>


                                <el-divider></el-divider>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="结论：">
                                            <el-radio-group v-model="form.safetyConclusion">
                                                <el-radio label="1">正常</el-radio>
                                                <el-radio label="0">不正常</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24" class="margin-t-10">
                                        <el-form-item label="说明：">
                                            <el-input type="textarea" v-model="form.safetyExplanation"
                                                      placeholder="说明"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>

                            <!--装车情况-->
                            <el-tab-pane label="装车情况" name="loading">
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="装运产品：">
                                            <el-input v-model="form.escortName" placeholder="装运产品"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="装车数量（吨）：">
                                            <el-input v-model="form.escortId" placeholder="装车数量（吨）"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="系固情况：">
                                            <el-input v-model="form.escortNumber" placeholder="系固情况"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="钢瓶瓶帽、方阵圈是否齐全：" class="two-label">
                                            <el-input v-model="form.escortDate" placeholder="钢瓶瓶帽、方阵圈是否齐全"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-divider></el-divider>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="结论：">
                                            <el-radio-group v-model="form.escortConclusion">
                                                <el-radio label="1">正常</el-radio>
                                                <el-radio label="0">不正常</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24" class="margin-t-10">
                                        <el-form-item label="说明：">
                                            <el-input type="textarea" v-model="form.escortExplanation"
                                                      placeholder="说明"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </div>
            </el-card>

            <!--<div class="btn-content">
                <el-button block type="primary" @click="onSubmit">
                    提交修改
                </el-button>
            </div>-->

        </el-form>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {} from '@/api/issueList'
    import {getStorage} from '@/utils/storage'

    export default {
        components: {},
        props: [],
        data() {
            return {
                // form表单的值
                form: {
                    mainCarNum: '',//主车牌号
                    carNum: '',//挂车牌号
                    load: '',//道路运输证核定载重（吨）
                    roadNum: '',//道路运输证编号
                    amount: '',//最大充装量
                    carNumber: '',//液化气体罐车使用编号
                    gps: '',//GPS定位系统情况
                    containerValidity: '',//压力容器（罐体）检测有效期
                    isSame: '',//车辆及罐体是否与行驶证照片一致

                    /*所属运输公司信息*/
                    companyName: '',//公司名称
                    openDate: '',//发证日期
                    code: '',//证件编号
                    validity: '',//证件有效期
                    organ: '',//发证机关
                    dataSource: '',//数据来源
                    state: '',//状态
                    recordDate: '',//备案日期
                    conclusion: '1',//结论
                    explanation: '',//说明

                    /*车辆行驶证信息*/
                    driverId: '',//行驶证编号
                    drivingValidity: '',//检验有效期
                    drivingRecordDate: '',//备案日期
                    drivingLicenseDate: '',//发证日期
                    drivingConclusion: '1',//结论
                    drivingExplanation: '',//说明

                    /*车辆安全配置*/
                    light: '1',//三角顶灯
                    pressure: '1',//压力
                    rectangle: '1',
                    liquid: '1',
                    light1: '1',//三角顶灯
                    pressure1: '1',//压力
                    rectangle1: '1',
                    liquid1: '1',
                    light2: '1',//三角顶灯
                    safetyConclusion: '1',//结论
                    safetyExplanation: '1',//说明

                    //装车情况
                    escortName: '',//押运员姓名
                    escortId: '',//押运员身份证号
                    escortNumber: '',//道路运输驾驶员从业资格证编号
                    escortDate: '',//资质是否过期
                    escortConclusion: '1',//结论
                    escortExplanation: '',//说明


                },
                activeName: 'company',//子tab键
                loading: false,
            }
        },
        mounted() {
        },
        methods: {
            // 获取基本信息
            getData() {
            },

            //保存
            onSubmit() {

            },


            // tab键改变触发
            handleClick: function (tab, event) {
                this.tabValue = tab.name
            },

        }
    }
</script>
<style lang="scss" scoped type="text/scss">
    //驾驶员资质情况
    .driver-content {
        display: flex;
        justify-content: space-between;
        .driver-content-title {
            margin-left: 20px;
            width: 100%;
            .el-form-item {
                margin-bottom: 15px
            }
            /deep/ .el-input {
                width: 100%;
            }

        }

    }

    .two-label {
        /deep/ .el-form-item__label {
            line-height: 18px !important;
        }
    }

    //下部tab样式
    .tab-groups {
        /deep/ .el-tabs__item {
            font-weight: bold;
            font-size: 15px;
        }
        margin-top: 20px;
        //tab键
        /deep/ .el-tabs__nav-wrap::after {
            height: 2px !important;
        }

        /deep/ .el-tabs__active-bar {
            height: 2px !important;
        }
        /deep/ .el-tabs__item.is-active {
            /deep/ .el-button--primary {
                background: #1890ff !important

            }
        }
        .el-input {
            width: 100% !important;
        }
    }

    //.el-divider--horizontal
    .el-divider--horizontal {
        margin: 12px 0;
    }

    .btn-content {
        width: 100%;
        text-align: center;
        margin: 30px 0;
        box-sizing: border-box;
    }

</style>
