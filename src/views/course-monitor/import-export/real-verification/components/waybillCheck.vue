<template>
    <div>
        <!--<common-subtitle title="贫困户满意度"></common-subtitle>-->
        <el-form v-loading="loading" :model="form" class="demo-form-inline" label-position="right" label-width="180px">
            <el-row>
                <el-col :span="8" class="margin-t-10 waybill-number">
                    <div>运单编号:</div>
                        <el-input v-model="form.driverId" placeholder="运单编号"></el-input>
                </el-col>
            </el-row>
            <el-card class="box-card">

                    <!--基本信息-->
                    <div class="font-bold">基本信息</div>
                    <el-divider></el-divider>
                    <div>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="托运方单位名称：">
                                    <el-input v-model="form.validity" placeholder="托运方单位名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="收货方单位名称：">
                                    <el-input v-model="form.organ" placeholder="收货方单位名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="托运方联系电话：">
                                    <el-input v-model="form.dataSource" placeholder="托运方联系电话"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="收货方联系电话：">
                                    <el-input v-model="form.companyName" placeholder="收货方联系电话"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="装货地点：">
                                    <el-input v-model="form.openDate" placeholder="装货地点"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="运输目的地：">
                                    <el-input v-model="form.code" placeholder="运输目的地"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="装货日期：">
                                    <el-input v-model="form.state" placeholder="装货日期"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="预计到达日期：">
                                    <el-input v-model="form.recordDate" placeholder="预计到达日期"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>


                    </div>

                    <!--承运方信息-->
                    <div class="font-bold">承运方信息</div>
                    <el-divider></el-divider>
                    <div>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="单位名称：">
                                    <el-input v-model="form.driverId" placeholder="单位名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="联系电话：">
                                    <el-input v-model="form.drivingType" placeholder="联系电话"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="经营许可证号：">
                                    <el-input v-model="form.licenseDate"
                                              placeholder="经营许可证号"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="应急联系方式：">
                                    <el-input v-model="form.driverId" placeholder="应急联系方式"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="车牌号码：">
                                    <el-input v-model="form.drivingType" placeholder="车牌号码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="道路运输证号：">
                                    <el-input v-model="form.licenseDate"
                                              placeholder="道路运输证号"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="挂车车牌号码：">
                                    <el-input v-model="form.driverId" placeholder="挂车车牌号码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="道路运输证号：">
                                    <el-input v-model="form.drivingType" placeholder="道路运输证号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="驾驶员姓名：">
                                    <el-input v-model="form.licenseDate"
                                              placeholder="驾驶员姓名"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="身份证号：">
                                    <el-input v-model="form.driverId" placeholder="身份证号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="从业资格证号：">
                                    <el-input v-model="form.drivingType" placeholder="从业资格证号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="联系电话：">
                                    <el-input v-model="form.licenseDate"
                                              placeholder="联系电话"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="驾驶员姓名：">
                                    <el-input v-model="form.driverId" placeholder="驾驶员姓名"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="身份证号：">
                                    <el-input v-model="form.drivingType" placeholder="身份证号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="从业资格证号：">
                                    <el-input v-model="form.licenseDate"
                                              placeholder="从业资格证号"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="联系电话：">
                                    <el-input v-model="form.driverId" placeholder="联系电话"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>

                    <!--货物状况-->
                    <div class="font-bold">货物状况</div>
                    <el-divider></el-divider>
                    <div>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="联合国编号：">
                                    <el-input v-model="form.escortName" placeholder="联合国编号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="危险货物名称：">
                                    <el-input v-model="form.escortId" placeholder="危险货物名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="类/项别：" class="two-label">
                                    <el-input v-model="form.escortNumber"
                                              placeholder="类/项别"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="包装类别：">
                                    <el-input v-model="form.escortName" placeholder="包装类别"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="规格：">
                                    <el-input v-model="form.escortId" placeholder="规格"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="数量（吨/立方）：" class="two-label">
                                    <el-input v-model="form.escortNumber"
                                              placeholder="数量（吨/立方）"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-divider></el-divider>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="进出目的：">
                                    <el-radio-group v-model="form.escortConclusion">
                                        <el-radio label="1" border >装车</el-radio>
                                        <el-radio label="0" border >卸车</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="进厂时间：">
                                    <el-input v-model="form.escortName" placeholder="进厂时间"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="进厂称重：">
                                    <el-input v-model="form.escortId" placeholder="进厂称重"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="出厂时间：">
                                    <el-input v-model="form.escortName" placeholder="出厂时间"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="出厂称重：">
                                    <el-input v-model="form.escortId" placeholder="出厂称重"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8" class="margin-t-10">
                                <el-form-item label="结论：">
                                    <el-radio-group v-model="form.escortConclusion">
                                        <el-radio label="1" >正常</el-radio>
                                        <el-radio label="0" >不正常</el-radio>
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

                    driverId: '',//驾驶证号
                    drivingType: '',//准驾车型
                    licenseDate: '',//初次领证日期

                    escortName: '',//押运员姓名
                    escortId: '',//押运员身份证号
                    escortNumber: '',//道路运输驾驶员从业资格证编号
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


        }
    }
</script>
<style lang="scss" scoped type="text/scss">
    .el-input {
        width: 100% !important;
    }
    .waybill-number{
        display: flex;
        justify-content: flex-start;
        font-size: 15px;
        &>>>div{
            width: 100px;
            line-height: 36px;
            font-weight: bold;
        }
        margin-bottom: 20px;
    }

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
