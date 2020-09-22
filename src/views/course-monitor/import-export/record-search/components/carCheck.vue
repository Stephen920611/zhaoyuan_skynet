<template>
    <div>
        <el-form v-loading="listLoading" label-position="right" label-width="150px" :model="form">
            <el-card class="box-card">
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
                                            <el-form-item label="拖车牌号：">
                                                <el-input :disabled="isEdit" v-model="form.carNo"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="挂车牌号：">
                                                <el-input :disabled="isEdit" v-model="form.trailerNo"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="道路运输证核定载重（吨）：" class="two-label">
                                                <el-input :disabled="isEdit" v-model="carTransportLicense.checkLoad"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="道路运输证编号：">
                                                <el-input :disabled="isEdit" v-model="form.carTransportLicenseNo"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="最大充装量（m3:常压或承压）：" class="two-label">
                                                <el-input :disabled="isEdit" v-model="carTransportLicense.maxFilling"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="液化气体罐车使用证编号：" class="two-label">
                                                <el-input :disabled="isEdit"
                                                          v-model="carTransportLicense.liquidGaxLicense"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="GPS定位系统情况:">
                                                <el-radio-group :disabled="isEdit" v-model="eleWaybillCheck.carGps">
                                                    <el-radio :label="1">正常</el-radio>
                                                    <el-radio :label="0">不正常</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="压力容器（罐体）检测有效期：" class="two-label">
                                                <el-input :disabled="isEdit"
                                                          v-model="carTransportLicense.pressureExpirationDate"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-form-item label="车辆及罐体是否与行驶证照片一致:" class="two-label">
                                                <el-radio-group :disabled="isEdit"
                                                                v-model="eleWaybillCheck.carSameLicense">
                                                    <el-radio :label="1">正常</el-radio>
                                                    <el-radio :label="0">不正常</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>


                        </el-col>
                        <el-col :span="10" style="text-align: center;padding-left: 20px" class="imageTabGroups">
                            <el-tabs v-model="imageActiveName" tab-position="top">
                                <el-tab-pane  name="0">
                                     <span slot="label">
                                        <el-button type="primary" >进厂抓拍</el-button>
                                     </span>
                                    <el-image
                                            v-if="imageActiveName==='0'"
                                            style="width:400px; height:240px"
                                            :src="captureUrl"
                                            :lazy='true'
                                            :preview-src-list="[captureUrl]"
                                    >
                                        <div slot="error" class="image-slot el-image__error">
                                            {{captureUrl === null || captureUrl === '' ? '暂无照片' : '加载失败'}}
                                        </div>
                                    </el-image>
                                </el-tab-pane>
                                <el-tab-pane name="1">
                                    <span slot="label">
                                        <el-button type="primary" >出厂抓拍</el-button>
                                     </span>
                                    <el-image
                                            v-if="imageActiveName==='1'"
                                            style="width:400px; height:240px"
                                            :src="captureUrl"
                                            :lazy='true'
                                            :preview-src-list="[captureUrl]"
                                    >
                                        <div slot="error" class="image-slot el-image__error">
                                            {{captureUrl === null || captureUrl === '' ? '暂无照片' : '加载失败'}}
                                        </div>
                                    </el-image>
                                </el-tab-pane>
                            </el-tabs>

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
                                            <el-input :disabled="isEdit" v-model="carTransportLicense.companyName"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="发证日期：">
                                            <el-input :disabled="isEdit" v-model="carTransportLicense.givingTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="证件编号：">
                                            <el-input :disabled="isEdit" v-model="carTransportLicense.licenceCode"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="证件有效期：">
                                            <el-input :disabled="isEdit" v-model="carTransportLicense.endUseTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="发证机关：">
                                            <el-input :disabled="isEdit" v-model="carTransportLicense.licenceAuthor"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="数据来源：">
                                            <el-input :disabled="isEdit" v-model="carTransportLicense.source"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="状态：">
                                            <el-select :disabled="isEdit" v-model="carTransportLicense.status"
                                                       placeholder="">
                                                <el-option
                                                        style="width: 100%"
                                                        v-for="item in statusOptions"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="备案日期：">
                                            <el-input :disabled="isEdit" v-model="carTransportLicense.recordTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-divider></el-divider>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="结论：">
                                            <el-radio-group :disabled="isEdit"
                                                            v-model="eleWaybillCheck.carCheck">
                                                <el-radio :label="1">正常</el-radio>
                                                <el-radio :label="0">不正常</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24" class="margin-t-10">
                                        <el-form-item label="说明：">
                                            <el-input :disabled="isEdit" type="textarea"
                                                      v-model="eleWaybillCheck.carDesc"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="核验人：">
                                            <el-input :disabled="isEdit" v-model="eleWaybillCheck.carCheckPerson"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="核验时间：">
                                            <el-input :disabled="isEdit" v-model="eleWaybillCheck.carCheckTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>

                            <!--车辆行驶证信息-->
                            <el-tab-pane label="车辆行驶证信息" name="driver">
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="行驶证编号：">
                                            <el-input :disabled="isEdit" v-model="carDrivingLicense.recordCode"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="检验有效期：">
                                            <el-input :disabled="isEdit" v-model="carDrivingLicense.endUseTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="备案日期：">
                                            <el-input :disabled="isEdit" v-model="carDrivingLicense.recordTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="发证日期：">
                                            <el-input :disabled="isEdit" v-model="carDrivingLicense.givingTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                                <el-divider></el-divider>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="结论：">
                                            <el-radio-group :disabled="isEdit" v-model="eleWaybillCheck.carCheck">
                                                <el-radio :label="1">正常</el-radio>
                                                <el-radio :label="0">不正常</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24" class="margin-t-10">
                                        <el-form-item label="说明：">
                                            <el-input :disabled="isEdit" type="textarea"
                                                      v-model="eleWaybillCheck.carDesc"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="核验人：">
                                            <el-input :disabled="isEdit" v-model="eleWaybillCheck.carCheckPerson"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="核验时间：">
                                            <el-input :disabled="isEdit" v-model="eleWaybillCheck.carCheckTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                            </el-tab-pane>

                            <!--车辆安全配置-->
                            <el-tab-pane label="车辆安全配置" name="safety">
                                <el-row :gutter="20">
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="三角顶灯：">
                                            <el-radio-group :disabled="isEdit"
                                                            v-model="eleWaybillCheck.carSaftyTriangle">
                                                <el-radio :label="1">有</el-radio>
                                                <el-radio :label="0">无</el-radio>
                                                <el-radio :label="2">不涉及</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="压力表：">
                                            <el-radio-group :disabled="isEdit"
                                                            v-model="eleWaybillCheck.carSaftyPressure">
                                                <el-radio :label="1">有</el-radio>
                                                <el-radio :label="0">无</el-radio>
                                                <el-radio :label="2">不涉及</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="矩形标牌：">
                                            <el-radio-group :disabled="isEdit"
                                                            v-model="eleWaybillCheck.carSaftyRectangle">
                                                <el-radio :label="1">有</el-radio>
                                                <el-radio :label="0">无</el-radio>
                                                <el-radio :label="2">不涉及</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="液体位：">
                                            <el-radio-group :disabled="isEdit" v-model="eleWaybillCheck.carSaftyLiquid">
                                                <el-radio :label="1">有</el-radio>
                                                <el-radio :label="0">无</el-radio>
                                                <el-radio :label="2">不涉及</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="导静电带：">
                                            <el-radio-group :disabled="isEdit"
                                                            v-model="eleWaybillCheck.carSaftyElebelt">
                                                <el-radio :label="1">有</el-radio>
                                                <el-radio :label="0">无</el-radio>
                                                <el-radio :label="2">不涉及</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="防波板：">
                                            <el-radio-group :disabled="isEdit" v-model="eleWaybillCheck.carSaftyWave">
                                                <el-radio :label="1">有</el-radio>
                                                <el-radio :label="0">无</el-radio>
                                                <el-radio :label="2">不涉及</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="毒爆腐标志：">
                                            <el-radio-group :disabled="isEdit"
                                                            v-model="eleWaybillCheck.carSaftyPoisonMark">
                                                <el-radio :label="1">有</el-radio>
                                                <el-radio :label="0">无</el-radio>
                                                <el-radio :label="2">不涉及</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="速断阀：">
                                            <el-radio-group :disabled="isEdit"
                                                            v-model="eleWaybillCheck.carSaftyQuickBreak">
                                                <el-radio :label="1">有</el-radio>
                                                <el-radio :label="0">无</el-radio>
                                                <el-radio :label="2">不涉及</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="6" class="margin-t-10">
                                        <el-form-item label="应急器材：">
                                            <el-radio-group :disabled="isEdit"
                                                            v-model="eleWaybillCheck.carSaftyEmergency">
                                                <el-radio :label="1">有</el-radio>
                                                <el-radio :label="0">无</el-radio>
                                                <el-radio :label="2">不涉及</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>


                                <el-divider></el-divider>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="结论：">
                                            <el-radio-group :disabled="isEdit" v-model="eleWaybillCheck.carCheck">
                                                <el-radio :label="1">正常</el-radio>
                                                <el-radio :label="0">不正常</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24" class="margin-t-10">
                                        <el-form-item label="说明：">
                                            <el-input :disabled="isEdit" type="textarea"
                                                      v-model="eleWaybillCheck.carDesc"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="核验人：">
                                            <el-input :disabled="isEdit" v-model="eleWaybillCheck.carCheckPerson"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="核验时间：">
                                            <el-input :disabled="isEdit" v-model="eleWaybillCheck.carCheckTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>

                            <!--装车情况-->
                            <el-tab-pane label="装车情况" name="loading">
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="装运产品：">
                                            <el-input :disabled="isEdit" v-model="form.cargoName"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="装车数量（吨）：">
                                            <el-input :disabled="isEdit" v-model="form.cargoNum"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="系固情况：">
                                            <el-input :disabled="isEdit" v-model="eleWaybillCheck.carLoadFixation"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="钢瓶瓶帽、方阵圈是否齐全：" class="two-label">
                                            <!-- <el-input :disabled="isEdit" v-model="form.carLoadSteelCylinder"
                                                       placeholder="钢瓶瓶帽、方阵圈是否齐全"></el-input>-->
                                            <el-radio-group :disabled="isEdit"
                                                            v-model="eleWaybillCheck.carLoadSteelCylinder">
                                                <el-radio :label="1">正常</el-radio>
                                                <el-radio :label="0">不正常</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-divider></el-divider>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="结论：">
                                            <el-radio-group :disabled="isEdit" v-model="eleWaybillCheck.carCheck">
                                                <el-radio :label="1">正常</el-radio>
                                                <el-radio :label="0">不正常</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24" class="margin-t-10">
                                        <el-form-item label="说明：">
                                            <el-input :disabled="isEdit" type="textarea"
                                                      v-model="eleWaybillCheck.carDesc"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="核验人：">
                                            <el-input :disabled="isEdit" v-model="eleWaybillCheck.carCheckPerson"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="核验时间：">
                                            <el-input :disabled="isEdit" v-model="eleWaybillCheck.carCheckTime"
                                                      placeholder=""></el-input>
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
    import {getStorage} from '@/utils/storage'
    import {fetchCarCheckInfo} from '@/api/courseMonitor/importExport'
    import {mapState, mapGetters} from 'vuex'


    export default {
        components: {},
        props: [],
        data() {
            return {
                isEdit: true,//s是否可编辑，true为不可编辑，false为可编辑
                // form表单的值
                form: {
                    carNo: '',//车牌号码
                    trailerNo: '',//挂车车牌号码
                    trailerTransportLicenseNo: '',//道路运输证编号
                    carTransportLicenseNo: '',//拖车道路运输证编号
//                    carGps: '',//GPS定位系统情况
//                    carSameLicense: '',//车证是否一致 0不正常 1正常
//                    carCheck:null,//结论
//                    carDesc:null,//说明

//                    carLicenseCheck: '',//车辆行驶证是否正常 0不正常 1正常
//                    carLicenseDesc: '',//车辆行驶证是否正常说明
//                    carCompanyCheck: '',//车辆所属运输公司是否正常 0不正常 1正常
//                    carCompanyDesc: '',//车辆所属运输公司是否正常说明


                    carSaftyCheck: '',//车辆安全配置是否正常 0不正常 1正常
                    carSaftyDesc: '',//车辆安全配置是否正常说明

//                    carLoadCheck: '',//装车情况是否正常 0不正常 1正常
//                    carLoadDesc: '',//装车情况是否正常说明
                    cargoName: '',//危险货物名称
                    cargoNum: '',//危险货物数量

//                    carCaptureUrl:'',//车辆抓拍照片
//                    carCheckPerson:'',//车辆审核人
//                    carCheckTime:'',//车辆审核时间

                },
                //所属运输公司信息
                carTransportLicense: {
                    checkLoad: '',//核定载重
                    maxFilling: '',//最大充装量
                    liquidGaxLicense: '',//液化气体罐车使用证编号
                    pressureExpirationDate: '',//压力容器（罐体）检测有效期
                    status: '',//状态，1有效，2无效
                    endUseTime: '',//有效日期止
                    recordTime: '',//备案日期
                    source: '',//来源
                    licenceCode: '',//证件编码
                    companyName: '',//公司名称
                    licenceAuthor: '',//发证机关
                    givingTime: '',//发证日期
                },

                //行驶证信息
                carDrivingLicense: {
                    recordCode: '',//档案编号
                    givingTime: '',//发证日期
                    endUseTime: '',//有效日期止
                    recordTime: '',//备案日期
                },//行驶证信息

                //车辆核验信息
                eleWaybillCheck: {
                    carCheckPerson: '',//车辆审核人
                    carCheckTime: '',//车辆审核时间
                    carCapture: [],
                    carCheck: null,//结论
                    carDesc: null,//说明
                    carGps: '',//GPS定位系统情况
                    carSameLicense: '',//车证是否一致 0不正常 1正常

                    carSaftyTriangle: '',//是否有三角顶灯 0无 1有  2不涉及
                    carSaftyPressure: '',//是否有压力表 0无 1有  2不涉及
                    carSaftyRectangle: '',//是否有矩形标牌 0无 1有  2不涉及
                    carSaftyLiquid: '',//是否有液位计 0无 1有 2不涉及
                    carSaftyElebelt: '',//是否有导静电带 0无 1有 2不涉及
                    carSaftyWave: '',//是否有防波板 0无 1有 2不涉及
                    carSaftyPoisonMark: '',//是否有毒腐标志 0无 1有 2不涉及
                    carSaftyQuickBreak: '',//是否有速断阀 0无 1有 2不涉及
                    carSaftyEmergency: '',//是否有应急器材 0无 1有 2不涉及

                    carLoadFixation: '',//装车系固是否正常0不正常1正常
                    carLoadSteelCylinder: '',//钢瓶瓶帽，防震圈是否正常，0不正常，1正常
                },
                captureUrl: '',//车辆抓拍照片


                companyLicence: {},//装车情况
                eleWayBill: {},//车辆安全配置
                statusOptions: [
                    {
                        value: 1,
                        label: '有效'
                    }, {
                        value: 2,
                        label: '无效'
                    }
                ],
                activeName: 'company',//子tab键
                imageActiveName: '0',
                listLoading: false,
            }
        },
        computed: {
            ...mapGetters([
                'checkDetailInfo',
                'eleWaybillDetail',
            ])
        },
        watch: {
            'imageActiveName': {
                handler(value) {
                    let self = this;
                    self.initCarImage(value);
                },
            },
            'checkDetailInfo': {
                handler(value) {
                    this.initData();
                },
                immediate: true, // immediate选项可以开启首次赋值监听
            },
        },
        mounted() {
            //处理数据
            this.initData();
        },
        methods: {
            //处理数据
            initData() {
                //处理车辆核验数据
                this.listLoading = true;
                this.form = this.checkDetailInfo;
                if (this.checkDetailInfo.hasOwnProperty('carInfo') && this.checkDetailInfo.carInfo !== null) {
                    //车辆的基本信息
                    let carInfo = this.checkDetailInfo.carInfo;
                    //车辆行驶证信息
                    this.carDrivingLicense = carInfo.hasOwnProperty('carDrivingLicense') && carInfo.carDrivingLicense !== null ? carInfo.carDrivingLicense : {};
                    //所属运输公司信息
                    this.carTransportLicense = carInfo.hasOwnProperty('carTransportLicense') && carInfo.carTransportLicense !== null ? carInfo.carTransportLicense : {};
                    //装车情况
                    this.companyLicence = carInfo.hasOwnProperty('companyLicence') && carInfo.companyLicence !== null ? carInfo.companyLicence : {};
                    //车辆安全配置
                    this.eleWayBill = carInfo.hasOwnProperty('eleWayBill') && carInfo.eleWayBill !== null ? carInfo.eleWayBill : {};
                }
                //处理核验信息
                if (this.checkDetailInfo.hasOwnProperty('eleWaybillCheck')) {
                    this.checkDetailInfo.eleWaybillCheck.map((item) => {
                        //装车/卸车电子运单都返回来，要显示与列表进出目的一致的电子运单信息
                        if (item.waybillPurpose === this.eleWaybillDetail.waybillPurpose) {
                            this.eleWaybillCheck = item;
                            //处理显示的照片
                            this.initCarImage('0');
                        }
                    })
                }
                this.listLoading = false;
            },
            //处理图片显示，判断是显示进厂抓拍还是出厂抓拍
            initCarImage(value) {
                let self = this;
                if (this.eleWaybillCheck.hasOwnProperty('carCapture')) {
                    this.eleWaybillCheck.carCapture.map((item) => {
                        if (value === item.directionType + '') {
                            self.captureUrl = item.captureUrl
                        }
                    })
                }
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

    //图片tab
    .imageTabGroups {
        /deep/ .el-tabs__item.is-top:nth-child(2) {
            padding-right: 10px !important;
        }

        /deep/ .el-tabs__item.is-top:last-child {
            padding-left: 10px !important;
        }
        /deep/ .el-tabs__item {
            height: 30px;
            line-height: 30px;
        }
        /deep/ .el-tabs__nav {
            float: none;
        }
        /deep/.el-button--medium{
            padding: 5px 15px;
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

    .el-select {
        width: 100%;
        /deep/ .el-input {
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
