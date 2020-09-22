<template>
    <div>
        <!--<common-subtitle title="贫困户满意度"></common-subtitle>-->
        <el-form v-loading="loading" label-position="right" label-width="120px" :model="form">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="font-bold">驾驶员资质情况</span>
                </div>
                <div class="driver-tabs" v-if="driverInfo.length > 0">
                    <el-tabs v-model="driverTabActiveName" tab-position="top">
                        <el-tab-pane v-for="(item,index) in driverInfo" :name="index+''">
                            <span slot="label">
                                <el-button type="primary"><i class="icon iconfont iconjiashiyuanxinxi" style="margin-right: 3px"></i>{{item.name}}</el-button>
                            </span>
                            <driver-check v-if="index+'' === driverTabActiveName" :form="form" :driverInfo="driverInfo[index]" :driveLicense = driveLicense :workerQualificatLicenseDTO="workerQualificatLicenseDTO"></driver-check>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div v-if="driverInfo.length === 0" class="no-data">
                    <div>暂无驾驶员资质情况数据</div>
                </div>
                <div class="tab-groups">
                    <template>
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane label="所属运输公司信息" name="company">
                                <div v-if="activeName==='company'">
                                    <!--所属运输公司信息-->
                                    <el-row :gutter="20">
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="公司名称：">
                                                <el-input :disabled="isEdit" v-model="companyLicence.companyName"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="发证日期：">
                                                <el-input :disabled="isEdit" v-model="companyLicence.givingTime"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="证件编号：">
                                                <el-input :disabled="isEdit" v-model="companyLicence.licenceCode"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20">
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="证件有效期：">
                                                <el-input :disabled="isEdit" v-model="companyLicence.endUseTime"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="发证机关：">
                                                <el-input :disabled="isEdit" v-model="companyLicence.licenceAuthor"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="数据来源：">
                                                <el-input :disabled="isEdit" v-model="companyLicence.source"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20">
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="状态：">
                                                <el-select :disabled="isEdit" v-model="companyLicence.status"
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
                                                <el-input :disabled="isEdit" v-model="companyLicence.recordTime"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-divider></el-divider>
                                    <el-row :gutter="20">
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="结论：">
                                                <el-radio-group :disabled="isEdit"
                                                                v-model="form.workerCheck">
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
                                                          v-model="form.workerDesc"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20">
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="核验人：">
                                                <el-input :disabled="isEdit" v-model="form.workerCheckPerson"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="核验时间：">
                                                <el-input :disabled="isEdit" v-model="form.workerCheckTime"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-tab-pane>
                            <!--驾驶证信息-->
                            <!--<el-tab-pane label="驾驶证信息" name="driver">
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="驾驶证号：">
                                            <el-input :disabled="isEdit" v-model="driveLicense.licenceCode"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="准驾车型：">
                                            <el-input :disabled="isEdit" v-model="driveLicense.allowType"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="初次领证日期：">
                                            <el-input :disabled="isEdit" v-model="driveLicense.givingTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="证件有效期：">
                                            <el-input :disabled="isEdit" v-model="driveLicense.endUseTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-divider></el-divider>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="结论：">
                                            <el-radio-group :disabled="isEdit" v-model="form.workerCheck">
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
                                                      v-model="form.workerDesc"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="核验人：">
                                            <el-input :disabled="isEdit" v-model="form.workerCheckPerson"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" class="margin-t-10">
                                        <el-form-item label="核验时间：">
                                            <el-input :disabled="isEdit" v-model="form.workerCheckTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                            </el-tab-pane>-->

                            <!--押运员信息-->
                            <el-tab-pane label="押运员信息" name="escort">
                                <div v-if="activeName==='escort'">
                                    <template v-if="escortInfo.length > 0">
                                        <el-row :gutter="20" v-for="(item,index) in escortInfo" >
                                            <el-col :span="6" class="margin-t-10">
                                                <el-form-item label="押运人员姓名：">
                                                    <el-input :disabled="isEdit" v-model="item.name"
                                                              placeholder=""></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6" class="margin-t-10">
                                                <el-form-item label="身份证号：">
                                                    <el-input :disabled="isEdit" v-model="item.personNum"
                                                              placeholder=""></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6" class="margin-t-10">
                                                <el-form-item label="道路运输驾驶员从业资格证编号：" class="two-label">
                                                    <!--<el-input :disabled="isEdit" v-model="item.workerQualificatLicenseDTO[0].licenceCode"
                                                              placeholder=""></el-input>-->
                                                    <el-input v-if="item.workerQualificatLicenseDTO.length>0" :disabled="isEdit" v-model="item.workerQualificatLicenseDTO[0].licenceCode"
                                                              placeholder=""></el-input>
                                                    <el-input v-if="item.workerQualificatLicenseDTO.length === 0" :disabled="isEdit"
                                                              placeholder=""></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6" class="margin-t-10">
                                                <el-form-item label="资质是否过期：">
                                                    <el-radio-group :disabled="isEdit"
                                                                    v-model="item.qualificationExpired">
                                                        <el-radio :label="1">否</el-radio>
                                                        <el-radio :label="0">是</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </template>
                                    <div v-if="escortInfo.length === 0" class="no-data">
                                        <div>暂无押运员信息数据</div>
                                    </div>
                                    <el-divider></el-divider>
                                    <el-row :gutter="20">
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="结论：">
                                                <el-radio-group :disabled="isEdit" v-model="form.workerCheck">
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
                                                          v-model="form.workerDesc"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20">
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="核验人：">
                                                <el-input :disabled="isEdit" v-model="form.workerCheckPerson"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8" class="margin-t-10">
                                            <el-form-item label="核验时间：">
                                                <el-input :disabled="isEdit" v-model="form.workerCheckTime"
                                                          placeholder=""></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
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
    import {fetchWorkerCheckInfo} from '@/api/courseMonitor/importExport'
    import DriverCheck from './driverCheck'
    import {mapState, mapGetters} from 'vuex'

    export default {
        components: {DriverCheck},
        props: [],
        data() {
            return {
                isEdit: true,//s是否可编辑，true为不可编辑，false为可编辑
                // form表单的值
                form: {

                    //驾驶员资质
                    workerDriverQualificationExpired: '',//驾驶员资质是否过期 0是，1否
                    workerDriverBlackList: '',//驾驶员是否黑名单 0是，1否
                    driverName: '',//驾驶员姓名
                    driveridCardNo: '',//驾驶员身份证号码
                    driverLicenseNo: '',//驾驶员从业资格证号

                    //车辆所属运输公司
//                    carCompanyCheck: '',//车辆所属运输公司是否正常 0不正常 1正常
//                    carCompanyDesc: '',//车辆所属运输公司是否正常说明
                    workerCheck: null,//结论
                    workerDesc: '',//说明

                    //驾驶证信息
//                    workerCompanyDesc: '',//人员所属公司是否正常说明
//                    workerDriverLicenseCheck: '',//驾驶员驾驶证是否正常  0不正常 1正常

                    //押运员信息
//                    workerEscortCheck: '',//押运员信息是否正常  0不正常 1正常
//                    workerEscortDesc: '',//押运员信息是否正常说明

//                    workerDriverUrl: '',//驾驶员照片
//                    workerDriverCaptureUrl: '',//驾驶员抓拍照片

                    workerCheckPerson: '',//人员审核审核人
                    workerCheckTime: '',//人员审核审核时间


                },
                //所属公司信息
                companyLicence: {
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
                //驾驶证信息
                driveLicense: {
                    allowType: '',//准驾车型
                    licenceCode: '',//驾驶证编号
                    givingTime: '',//发证日期
                    endUseTime: '',//有效日期止
                },
                //驾驶员资质情况信息
                driverInfo:[],
                //押运员信息
                escortInfo:[],


                driverTabActiveName: '0',//默认选中的驾驶员资质
                //押运员信息
                eleWayBill: {},
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
                loading: false,
                //驾驶员从业资格证
                workerQualificatLicenseDTO:{
                    licenceCode: ""
                }
            }
        },
        computed: {
            ...mapGetters([
                'checkDetailInfo',
                'eleWaybillDetail',
            ])
        },
        watch: {
            'driverTabActiveName': {
                handler(value) {
                    this.initData();
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
            //初始化数据
            this.initData();
        },
        methods: {
            //初始化数据
            initData(){

                //驾驶员资质信息
                this.driverInfo = this.checkDetailInfo.hasOwnProperty('driverInfo') && this.checkDetailInfo.driverInfo !== null?this.checkDetailInfo.driverInfo : [];

                //当前电子运单的相关信息
                if(this.checkDetailInfo.hasOwnProperty('eleWaybillCheck')){
                    this.checkDetailInfo.eleWaybillCheck.map((item)=>{
                        if(item.waybillPurpose === this.eleWaybillDetail.waybillPurpose){
                            this.form = item;
                        }
                    })
                }

                if( this.driverInfo.length > 0){
                    //驾驶证相关信息
                    this.driveLicense = this.driverInfo[this.driverTabActiveName].workerDriveLicenseDTO.length >0 ? this.driverInfo[this.driverTabActiveName].workerDriveLicenseDTO[0] : {};
                    //驾驶员从业资格证
                    this.workerQualificatLicenseDTO = this.driverInfo[this.driverTabActiveName].workerQualificatLicenseDTO.length >0 ? this.driverInfo[this.driverTabActiveName].workerQualificatLicenseDTO[0] : {};
                    //所属运行公司信息
                    this.companyLicence = this.driverInfo[this.driverTabActiveName].companyLicence.length >0 ? this.driverInfo[this.driverTabActiveName].companyLicence[0]:{};
                }
                //押运员信息
                this.escortInfo = this.checkDetailInfo.hasOwnProperty('escortInfo') && this.checkDetailInfo.escortInfo !== null ? this.checkDetailInfo.escortInfo:[];

            },








            // 获取基本信息（最初的代码，暂时不用）
            getData() {
                let self = this;
                let params = {
                    wayBillNo: this.form.hasOwnProperty('wayBillNo') ? this.form.wayBillNo : ''
                };
                self.loading = true;
                fetchWorkerCheckInfo(params).then(res => {
                    self.loading = false;
                    if (res.data.length > 0) {
                        self.driveLicense = res.data[0].hasOwnProperty('driveLicense') && res.data[0].driveLicense !== null ? res.data[0].driveLicense : {};
                        self.companyLicence = res.data[0].hasOwnProperty('companyLicence') && res.data[0].companyLicence !== null ? res.data[0].companyLicence : {};
                        self.eleWayBill = res.data[0].hasOwnProperty('eleWayBill') && res.data[0].eleWayBill !== null ? res.data[0].eleWayBill : {};
                    }
                }).catch(err => {
                    self.loading = false;
                });

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
    .driver-tabs {
        /deep/ .el-tabs__nav-wrap::after {
            height: 0;
        }
        /deep/ .el-tabs__active-bar {
            height: 0;
        }
        /deep/ .el-tabs__item.is-active {
            /deep/ .el-button--primary {
                background: #0E58B6

            }
        }
        /deep/ .el-tabs__item.is-top:last-child {
            padding-left: 0;
        }
        .el-button--medium {
            padding: 8px 15px;
        }
        /deep/ .el-tabs__item.is-top:nth-child(2) {
            padding-right: 0;
        }
        /deep/ .el-tabs__item {
            margin-right: 15px;
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
        /deep/ .el-tabs__item.is-top:last-child {
            padding-left: 20px !important;
        }
        .el-select {
            width: 100%;
        }
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
