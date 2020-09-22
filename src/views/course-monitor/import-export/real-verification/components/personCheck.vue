<template>
    <div>
        <!--<common-subtitle title="贫困户满意度"></common-subtitle>-->
        <el-form v-loading="loading" label-position="right" label-width="120px" :model="form">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="font-bold">驾驶员资质情况</span>
                </div>
                <div>
                    <el-row>
                        <el-col :span="14">
                            <div class="driver-content">
                                <el-image
                                        style="width:150px; height: 200px"
                                        :src="require('@/assets/image/login_bg.png')"
                                >
                                </el-image>
                                <div class="driver-content-title">
                                    <el-form-item label="驾驶员姓名：">
                                        <el-input v-model="form.name" placeholder="驾驶员姓名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="身份证号：">
                                        <el-input v-model="form.idCard" placeholder="身份证号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="道路运输驾驶员从业资格证编号:" class="two-label">
                                        <el-input v-model="form.driverCode" placeholder="道路运输驾驶员从业资格证编号"></el-input>
                                    </el-form-item>
                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="是否黑名单人员:">
                                                <el-radio-group v-model="form.blacklist">
                                                    <el-radio label="1">是</el-radio>
                                                    <el-radio label="0">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="资质是否过期:">
                                                <el-radio-group v-model="form.overdue">
                                                    <el-radio label="1">是</el-radio>
                                                    <el-radio label="0">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>


                        </el-col>
                        <el-col :span="10" style="text-align: center">
                            <el-image
                                    style="width:400px; height: 240px"
                                    :src="require('@/assets/image/login_bg.png')"
                            >
                            </el-image>

                        </el-col>
                    </el-row>

                </div>
                <div class="tab-groups">
                    <template>
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane label="所属运输公司信息" name="company">
                                <!--所属运输公司信息-->
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
                            <!--驾驶证信息-->
                            <el-tab-pane label="驾驶证信息" name="driver">
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="驾驶证号：">
                                            <el-input v-model="form.driverId" placeholder="驾驶证号"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="准驾车型：">
                                            <el-input v-model="form.drivingType" placeholder="准驾车型"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="初次领证日期：">
                                            <el-input v-model="form.licenseDate" placeholder="初次领证日期"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="证件有效期：">
                                            <el-input v-model="form.drivingValidity" placeholder="证件有效期"></el-input>
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

                            <!--押运员信息-->
                            <el-tab-pane label="押运员信息" name="escort">
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="押运人员姓名：">
                                            <el-input v-model="form.escortName" placeholder="押运人员姓名"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="身份证号：">
                                            <el-input v-model="form.escortId" placeholder="身份证号"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="道路运输驾驶员从业资格证编号：" class="two-label">
                                            <el-input v-model="form.escortNumber"
                                                      placeholder="道路运输驾驶员从业资格证编号"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="资质是否过期：">
                                            <el-radio-group v-model="form.escortDate">
                                                <el-radio label="1">正常</el-radio>
                                                <el-radio label="0">不正常</el-radio>
                                            </el-radio-group>
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

                    driverId: '',//驾驶证号
                    drivingType: '',//准驾车型
                    licenseDate: '',//初次领证日期
                    drivingValidity: '',//证件有效期
                    drivingConclusion: '1',//结论
                    drivingExplanation: '',//说明

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
            width: calc(100% - 170px);
            .el-form-item {
                margin-bottom: 15px
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
