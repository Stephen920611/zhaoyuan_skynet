<template>
    <div>
        <!--<common-subtitle title="贫困户满意度"></common-subtitle>-->
        <el-form v-loading="loading" :model="form" class="demo-form-inline" label-position="right" label-width="150px">
            <!--<el-row>
                <el-col :span="8" class="margin-t-10 waybill-number">
                    <div>运单编号:</div>
                    <el-input v-model="form.driverId" placeholder="运单编号"></el-input>
                </el-col>
            </el-row>-->
            <el-card class="box-card">

                <!--基本信息-->
                <div class="font-bold">基本信息</div>
                <el-divider></el-divider>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="危险货物名称：">
                                <el-input :disabled="isEdit" v-model="form.cargoName" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="托运方单位名称：">
                                <el-input :disabled="isEdit" v-model="form.consignorCompanyName"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="收货方单位名称：">
                                <el-input :disabled="isEdit" v-model="form.receiverCompanyName"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="装货方单位名称：">
                                <el-input :disabled="isEdit" v-model="form.loadCompanyName"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20">

                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="数量（吨/立方）：" class="two-label">
                                <el-input :disabled="isEdit" v-model="form.cargoNum"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="托运方联系电话：">
                                <el-input :disabled="isEdit" v-model="form.consignorTelephone"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="收货方联系电话：">
                                <el-input :disabled="isEdit" v-model="form.receiverTelephone"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="装货方联系电话：">
                                <el-input :disabled="isEdit" v-model="form.loadTelephone"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row :gutter="20">
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="运输目的地：">
                                <el-input :disabled="isEdit" v-model="form.transportDestination"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                </div>

                <!--承运方信息-->
                <div class="font-bold">运输信息</div>
                <el-divider></el-divider>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="承运方单位名称：">
                                <el-input :disabled="isEdit" v-model="form.carrierCompanyName"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="经营许可证号：">
                                <el-input :disabled="isEdit" v-model="form.carrierCompanyLicenseNo"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="联系电话：">
                                <el-input :disabled="isEdit" v-model="form.carrierCompanyTelephone"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="应急联系方式：">
                                <el-input :disabled="isEdit" v-model="form.emergencyTelephone"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="拖车车牌号码：">
                                <el-input :disabled="isEdit" v-model="form.carNo" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="道路运输证号：">
                                <el-input :disabled="isEdit" v-model="form.carTransportLicenseNo"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="挂车车牌号码：">
                                <el-input :disabled="isEdit" v-model="form.trailerNo" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="道路运输证号：">
                                <el-input :disabled="isEdit" v-model="form.trailerTransportLicenseNo"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row :gutter="20">
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="身份证号：">
                                <el-input :disabled="isEdit" v-model="form.driveridCardNo"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="从业资格证号：">
                                <el-input :disabled="isEdit" v-model="form.driverLicenseNo"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="联系电话：">
                                <el-input :disabled="isEdit" v-model="form.driverTelephone"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="押运员姓名：">
                                <el-input :disabled="isEdit" v-model="form.escortName" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="身份证号：">
                                <el-input :disabled="isEdit" v-model="form.escoridCardNo" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="从业资格证号：">
                                <el-input :disabled="isEdit" v-model="form.escorLicenseNo"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="联系电话：">
                                <el-input :disabled="isEdit" v-model="form.escorTelephone"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                      <el-row :gutter="20">
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="装货日期：">
                                <el-input :disabled="isEdit" v-model="form.loadDate" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="margin-t-10">
                            <el-form-item label="预计到达日期：">
                                <el-input :disabled="isEdit" v-model="form.expectedArrivalDate"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="font-bold">人员信息</div>
                <el-divider></el-divider>
                <div v-if="!(driverInfo.length === 0 && escortInfo.length ===0)">
                    <template v-for="(item,index) in driverInfo">
                        <el-row :gutter="20">
                            <el-col :span="6" class="margin-t-10">
                                <el-form-item label="驾驶员姓名：">
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
                                <el-form-item label="从业资格证号：">
                                    <el-input v-if="item.workerQualificatLicenseDTO.length>0" :disabled="isEdit" v-model="item.workerQualificatLicenseDTO[0].licenceCode"
                                              placeholder=""></el-input>
                                    <el-input v-if="item.workerQualificatLicenseDTO.length === 0" :disabled="isEdit"
                                              placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" class="margin-t-10">
                                <el-form-item label="联系电话：">
                                    <el-input :disabled="isEdit" v-model="item.phoneNum"
                                              placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <template v-for="(item,index) in escortInfo">
                        <el-row :gutter="20">
                            <el-col :span="6" class="margin-t-10">
                                <el-form-item label="押运员姓名：">
                                    <el-input :disabled="isEdit" v-model="item.name" placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" class="margin-t-10">
                                <el-form-item label="身份证号：">
                                    <el-input :disabled="isEdit" v-model="item.personNum" placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" class="margin-t-10">
                                <el-form-item label="从业资格证号：">
                                    <el-input v-if="item.workerQualificatLicenseDTO.length>0" :disabled="isEdit" v-model="item.workerQualificatLicenseDTO[0].licenceCode"
                                              placeholder=""></el-input>
                                    <el-input v-if="item.workerQualificatLicenseDTO.length === 0" :disabled="isEdit"
                                              placeholder=""></el-input>

                                </el-form-item>
                            </el-col>
                            <el-col :span="6" class="margin-t-10">
                                <el-form-item label="联系电话：">
                                    <el-input :disabled="isEdit" v-model="item.phoneNum"
                                              placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </div>
                <div v-if="driverInfo.length ===0 && escortInfo.length ===0" class="no-data">
                    <div>暂无人员信息数据</div>
                </div>

                <!--货物状况-->
               <!-- <div class="font-bold">货物状况</div>
                <el-divider></el-divider>-->
                <div>
                    <!--<el-row :gutter="20">
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="联合国编号：">
                                <el-input :disabled="isEdit" v-model="form.cargoUniCode" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="类/项别：" class="two-label">
                                <el-input :disabled="isEdit" v-model="form.cargoType"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="包装类别：">
                                <el-input :disabled="isEdit" v-model="form.cargoPackingType"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="规格：">
                                <el-input :disabled="isEdit" v-model="form.cargoSpecs" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="数量（吨/立方）：" class="two-label">
                                <el-input :disabled="isEdit" v-model="form.cargoNum"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <el-divider></el-divider>
                    <el-row :gutter="20">
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="进出目的：" >
                                <el-radio-group v-model="eleWaybillCheck.waybillPurpose" :disabled="isEdit">
                                    <el-radio :label="1" border>装车</el-radio>
                                    <el-radio :label="0" border>卸车</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="进厂时间：">
                                <el-input :disabled="isEdit"
                                          v-model="eleWaybillCheck.toPortDate"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="进厂称重：">
                                <el-input :disabled="isEdit"
                                          v-model="eleWaybillCheck.toPortWeight"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="出厂时间：">
                                <el-input :disabled="isEdit"
                                          v-model="eleWaybillCheck.departPortDate"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="出厂称重：">
                                <el-input :disabled="isEdit"
                                          v-model="eleWaybillCheck.departPortWeight"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="货物实际数量（吨/立方）：" class="two-label">
                                <el-input :disabled="isEdit" v-model="form.cargoNum"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="结论：">
                                <el-radio-group v-model="eleWaybillCheck.waybillCheck">
                                    <el-radio :label="1">正常</el-radio>
                                    <el-radio :label="0">不正常</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24" class="margin-t-10">
                            <el-form-item label="说明：">
                                <el-input :disabled="isEdit" type="textarea" v-model="eleWaybillCheck.waybillDesc"
                                          placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="核验人：">
                                <el-input  :disabled="isEdit" v-model="form.waybillCheckPerson" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="margin-t-10">
                            <el-form-item label="核验时间：">
                                <el-input :disabled="isEdit" v-model="form.waybillCheckTime" placeholder=""></el-input>
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
    import {getStorage} from '@/utils/storage'
    import {mapState, mapGetters} from 'vuex'


    export default {
        components: {},
        props: [],
        data() {
            return {
                isEdit: true,//s是否可编辑，true为不可编辑，false为可编辑
                // form表单的值
                form: {
                    consignorCompanyName: '',//托运方单位名称
                    loadPlace: '',//装货地点
                    transportDestination: '',//运输目的地
                    receiverTelephone: '',//收货方联系电话
                    receiverCompanyName: '',//收货方单位名称
                    consignorTelephone: '',//托运方联系电话
                    loadDate: '',//装货日期
                    expectedArrivalDate: '',//预计到达日期
                    loadCompanyName: '',//装货方单位名称

                    carrierCompanyName: '',//承运单位名称
                    carrierCompanyTelephone: '',//承运企业联系电话
                    carrierCompanyLicenseNo: '',//承运企业经营许可证号
                    emergencyTelephone: '',//应急联系电话
                    carNo: '',//车牌号码
                    carTransportLicenseNo:'',//拖车车牌道路许可证
                    trailerTransportLicenseNo: '',//挂车道路运输证号
                    trailerNo: '',//挂车车牌号码
                    driverName: '',//驾驶员姓名
                    driveridCardNo: '',//驾驶员身份证号码
                    driverLicenseNo: '',//驾驶员从业资格证号
                    driverTelephone: '',//驾驶员联系电话
                    escortName: '',//押运员姓名
                    escortLicenseNo: '',//押运员从业资格证号
                    escoridCardNo: '',//押运员身份证号码
                    escorTelephone: '',//驾驶员联系电话

                    cargoUniCode: '',//危险品联合国编号
                    cargoName: '',//危险货物名称
                    cargoType: '',//危险货物类别或项别
                    cargoPackingType: '',//危险货物包装类别
                    cargoSpecs: '',//危险货物规格
                    cargoNum: '',//危险货物数量
                    toPortDate: '',//入场时间
                    toPortWeight: '',//入场称重
//                    departPortDate: '',//出场时间
//                    departPortWeight: '',//出厂称重

                    loadToPortDate: '',//装车入场时间
                    loadToPortWeight: '',//装车入场称重
                    loadDepartPortDate: '',//装车出厂时间
                    loadDepartPortWeight: '',//装车出厂称重
                    unloadToPortDate: '',//卸车入场时间
                    unloadToPortWeight: '',//卸车入场称重
                    unloadDepartPortDate: '',//卸车出厂时间
                    unloadDepartPortWeight: '',//卸车出厂称重




                },
                activeName: 'company',//子tab键
                loading: false,
                eleWaybillCheck:{
                    waybillPurpose: '',//进出目的 1装车 2卸车
                    waybillCheck: '',//电子运单核验结论 0不正常 1正常
                    waybillDesc: '',//电子运单核验说明
                    waybillCheckPerson:'',//电子运单审核人
                    waybillCheckTime:'',//电子运单审核时间
                },
                driverInfo:[],//驾驶员信息
                escortInfo:[],//押运员信息


        }
        },
        computed: {
            ...mapGetters([
                'checkDetailInfo',
                'eleWaybillDetail',
            ])
        },
        watch: {
            'checkDetailInfo': {
                handler(value) {
                    this.initData();
                },
                immediate: true, // immediate选项可以开启首次赋值监听
            },
        },
        mounted() {
            //初始化数据
            this.initData()
        },
        methods: {

            //初始化数据
            initData(){
                //驾驶员信息
                this.driverInfo = this.checkDetailInfo.hasOwnProperty('driverInfo') && this.checkDetailInfo.driverInfo !== null?this.checkDetailInfo.driverInfo : [];
                //押运员信息
                this.escortInfo = this.checkDetailInfo.hasOwnProperty('escortInfo') && this.checkDetailInfo.escortInfo !== null ? this.checkDetailInfo.escortInfo:[];
                //电子运单信息
                this.form = this.checkDetailInfo;

                //处理核验信息
                if(this.checkDetailInfo.hasOwnProperty('eleWaybillCheck')){
                    this.checkDetailInfo.eleWaybillCheck.map((item)=>{
                        if(item.waybillPurpose === this.eleWaybillDetail.waybillPurpose){
                            this.eleWaybillCheck = item;
                        }
                    })
                }
            },

            //保存
            onSubmit() {

            },

            //保存成功后 跳转
            saveInfo(data) {
            },

        }
    }
</script>
<style lang="scss" scoped type="text/scss">
    .el-input {
        width: 100% !important;
    }
    /deep/ .el-form-item__label{
        font-size: 15px ;
    }

    .waybill-number {
        display: flex;
        justify-content: flex-start;
        font-size: 15px;
        & > > > div {
            width: 100px;
            line-height: 36px;
            font-weight: bold;
        }
        margin-bottom: 20px;
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
