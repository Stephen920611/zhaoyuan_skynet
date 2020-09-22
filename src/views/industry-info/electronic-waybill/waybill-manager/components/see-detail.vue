<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <CommonSubtitle :title="wayBillNoTitle" :isBold="true"></CommonSubtitle>
                <el-steps :active="ruleForm.wayBillStatus" align-center>
                    <el-step title="运单填报" :description="ruleForm.createTime"></el-step>
                    <el-step title="等待装车" :description="ruleForm.waitLoadTime"></el-step>
                    <el-step title="运输途中" :description="ruleForm.transportTime"></el-step>
                    <el-step title="等待卸车" :description="ruleForm.waitUnloadTime"></el-step>
                    <el-step title="运输完成" :description="ruleForm.transportCompleteTime"></el-step>
                </el-steps>
            </div>
            <div class="info-wrap">
                <el-form label-position="right" ref="ruleForm" :inline="true" label-width="125px">
                    <!-------------------------运单发起----------------------------------->
                    <CommonSubtitle title="基本信息" :isBold="true"></CommonSubtitle>
                    <el-row>
                        <el-form-item label="托运方企业名称:" prop="consignorCompanyName" style="margin-right: 20px">
                            <el-input v-model="ruleForm.consignorCompanyName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="托运方联系电话:" style="margin-right: 20px">
                            <el-input v-model="ruleForm.consignorTelephone" disabled></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="装货方企业名称:" prop="loadCompanyName" style="margin-right: 20px">
                            <el-input v-model="ruleForm.loadCompanyName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="装货方联系电话:" style="margin-right: 20px">
                            <el-input v-model="ruleForm.loadTelephone" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="装货地址:" prop="loadPlace" style="margin-right: 20px">
                            <el-input v-model="ruleForm.loadPlace" disabled></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="收货方企业名称:" prop="receiverCompanyName" style="margin-right: 20px">
                            <el-input v-model="ruleForm.receiverCompanyName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="收货方联系电话:" style="margin-right: 20px">
                            <el-input v-model="ruleForm.receiverTelephone" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="卸货地址:" prop="unloadPlace" style="margin-right: 20px">
                            <el-input v-model="ruleForm.unloadPlace" disabled></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="装货日期:" prop="loadDate" style="margin-right: 20px">
                            <el-input v-model="ruleForm.loadDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="预计到达日期:" prop="expectedArrivalDate" style="margin-right: 20px">
                            <el-input v-model="ruleForm.expectedArrivalDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="城市配送:" style="margin-right: 20px" prop="cityDistribution">
                            <el-radio v-model="ruleForm.cityDistribution" label="1" disabled>是</el-radio>
                            <el-radio v-model="ruleForm.cityDistribution" label="0" disabled>否</el-radio>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="承运方单位名称:" prop="carrierCompanyName" style="margin-right: 20px">
                            <el-input v-model="ruleForm.carrierCompanyName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="经营许可证号:" prop="carrierCompanyLicenseNo" style="margin-right: 20px">
                            <el-input v-model="ruleForm.carrierCompanyLicenseNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话:" prop="carrierCompanyTelephone" style="margin-right: 20px">
                            <el-input v-model="ruleForm.carrierCompanyTelephone" disabled></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="应急联系电话:" prop="emergencyTelephone" style="margin-right: 20px">
                            <el-input v-model="ruleForm.emergencyTelephone" disabled></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="储运要求:" style="margin-right: 20px" class="long-form-item">
                                <el-input v-model="ruleForm.storeRequirement" type="textarea" :rows="2" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="急救措施:" style="margin-right: 20px" class="long-form-item">
                                <el-input v-model="ruleForm.aidMeasure" type="textarea" :rows="2" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-------------------------运输货物----------------------------------->
                    <CommonSubtitle title="运输货物" :isBold="true"></CommonSubtitle>
                    <el-row class="padding-lr-20 margin-d-20">
                        <el-table
                                :data="ruleForm.chemicalList"
                                border
                                fit
                                class="table-info">
                            <el-table-column label="货物名称" header-align="center" align="center" min-width="80">
                                <template slot-scope="{row}">
                                    <div class="input-box">
                                        <el-input size="small" v-model="row.goodsName" disabled></el-input>
                                        <!--<el-input size="small" v-model="row.goodsName" @focus="showChemicalGoodDialog=true">
                                            <el-button slot="append" icon="el-icon-search" @click="showChemicalGoodDialog=true"></el-button>
                                        </el-input>-->
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="类/项别" header-align="center" align="center" min-width="40">
                                <template slot-scope="{row}">
                                    <div class="input-box">
                                        <el-input size="small" v-model="row.className" disabled></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="包装类别" header-align="center" align="center" min-width="40">
                                <template slot-scope="{row}">
                                    <div class="input-box">
                                        <el-input size="small" v-model="row.packageInfo" disabled></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="单位" header-align="center" align="center" min-width="40">
                                <template slot-scope="{row}">
                                    <div class="input-box">
                                        <el-input size="small" v-model="row.unit" disabled></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="数量" header-align="center" align="center" min-width="40">
                                <template slot-scope="{row}">
                                    <div class="input-box">
                                        <el-input size="small" v-model="row.number" type="number" disabled></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="货物重量(吨)" header-align="center" align="center" min-width="40">
                                <template slot-scope="{row}">
                                    <div class="input-box">
                                        <el-input size="small" v-model="row.weight" disabled></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <!-------------------------车辆人员----------------------------------->
                    <CommonSubtitle title="车辆人员" :isBold="true"></CommonSubtitle>
                    <el-row>
                        <el-form-item label="拖车车牌号码:" prop="carNo" style="margin-right: 20px">
                            <el-input v-model="ruleForm.carNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="道路运输证号:" prop="carTransportLicenseNo" style="margin-right: 20px">
                            <el-input v-model="ruleForm.carTransportLicenseNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="车辆类型:" prop="carType" style="margin-right: 20px">
                            <el-select v-model="ruleForm.carType" placeholder="" disabled>
                                <el-option
                                        v-for="item in carTypeOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="罐体编号:" style="margin-right: 20px" prop="tankBodyCode">
                            <el-input v-model="ruleForm.tankBodyCode" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="罐体容积(m³):" style="margin-right: 20px" prop="tankBodyVolume">
                            <el-input v-model="ruleForm.tankBodyVolume" disabled></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="挂车车牌号码:" prop="trailerNo" style="margin-right: 20px">
                            <el-input v-model="ruleForm.trailerNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="道路运输证号:" prop="trailerTransportLicenseNo" style="margin-right: 20px">
                            <el-input v-model="ruleForm.trailerTransportLicenseNo" disabled></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <!--<template v-for="(item, index) in driver">
                            <create-driver
                                    ref="driver"
                                    :driverArray="driverArray"
                                    :driverData="item"
                                    :indexNum="index"
                                    @delDriver="delDriver"
                                    @addDriver="addDriver">
                            </create-driver>
                        </template>-->
                        <template v-for="(item, index) in ruleForm.driverInfo">
                            <el-form-item label="驾驶员姓名:" prop="driverName" style="margin-right: 20px">
                                <el-input v-model="item.name" disabled></el-input>
                            </el-form-item>
                            <!--<el-form-item label="驾驶员身份证号:" prop="driveridCardNo" style="margin-right: 20px">
                                <el-input v-model="item.personNum" disabled></el-input>
                            </el-form-item>-->
                            <el-form-item label="从业资格证:" prop="driverLicenseNo" style="margin-right: 20px">
                                <el-input v-model="item.workerDriveLicenseDTO[0] && item.workerDriveLicenseDTO[0].licenceCode" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话:" prop="driverTelephone" style="margin-right: 20px">
                                <el-input v-model="item.phoneNum" disabled></el-input>
                            </el-form-item>
                        </template>
                    </el-row>
                    <el-row>
                        <el-form-item label="押运员姓名:" prop="escortName" style="margin-right: 20px">
                            <el-input v-model="ruleForm.escortName" disabled></el-input>
                        </el-form-item>
                        <!--<el-form-item label="押运员身份证号:" prop="escoridCardNo" style="margin-right: 20px">
                            <el-input v-model="ruleForm.escoridCardNo" disabled></el-input>
                        </el-form-item>-->
                        <el-form-item label="从业资格证:" prop="escorLicenseNo" style="margin-right: 20px">
                            <el-input v-model="ruleForm.escorLicenseNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话:" prop="escorTelephone" style="margin-right: 20px">
                            <el-input v-model="ruleForm.escorTelephone" disabled></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
            </div>
            <div class="info-wrap padding-lr-20" v-show="false">
                <el-tabs v-model="activeTab">
                    <el-tab-pane label="装车核验信息" name="1">
                        <div class="check-info">
                            <el-row><el-col class="padding-lr-10 margin-td-20 font-bold font-size-18"><span class="line"></span>车辆核验</el-col></el-row>
                            <el-row :span="24" class="margin-td-20">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验结论：</el-col>
                                <el-col :span="6" class="text-left font-bold"></el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验人：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.loadCarCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.loadCarCheckTime}}</el-col>
                            </el-row>
                            <el-row :span="24" class="margin-td-40">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验说明：</el-col>
                                <el-col :span="22" class="text-left font-bold"></el-col>
                            </el-row>
                        </div>
                        <div class="check-info">
                            <el-row><el-col class="padding-lr-10 margin-td-20 font-bold font-size-18"><span class="line"></span>人员核验</el-col></el-row>
                            <el-row :span="24" class="margin-td-20">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验结论：</el-col>
                                <el-col :span="6" class="text-left font-bold"></el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验人：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.loadWorkerCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.loadWorkerCheckTime}}</el-col>
                            </el-row>
                            <el-row :span="24" class="margin-td-40">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验说明：</el-col>
                                <el-col :span="22" class="text-left font-bold"></el-col>
                            </el-row>
                        </div>
                        <div class="check-info">
                            <el-row><el-col class="padding-lr-10 margin-td-20 font-bold font-size-18"><span class="line"></span>电子运单核验</el-col></el-row>
                            <el-row :span="24" class="margin-td-20">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验结论：</el-col>
                                <el-col :span="6" class="text-left font-bold"></el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验人：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.loadWaybillCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.loadWaybillCheckTime}}</el-col>
                            </el-row>
                            <el-row :span="24" class="margin-td-40">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验说明：</el-col>
                                <el-col :span="22" class="text-left font-bold"></el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="卸车核验信息" name="2">
                        <div class="check-info">
                            <el-row><el-col class="padding-lr-10 margin-td-20 font-bold font-size-18"><span class="line"></span>车辆核验</el-col></el-row>
                            <el-row :span="24" class="margin-td-20">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验结论：</el-col>
                                <el-col :span="6" class="text-left font-bold"></el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验人：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.unloadCarCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.unloadCarCheckTime}}</el-col>
                            </el-row>
                            <el-row :span="24" class="margin-td-40">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验说明：</el-col>
                                <el-col :span="22" class="text-left font-bold"></el-col>
                            </el-row>
                        </div>
                        <div class="check-info">
                            <el-row><el-col class="padding-lr-10 margin-td-20 font-bold font-size-18"><span class="line"></span>人员核验</el-col></el-row>
                            <el-row :span="24" class="margin-td-20">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验结论：</el-col>
                                <el-col :span="6" class="text-left font-bold"></el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验人：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.unloadWorkerCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.unloadWorkerCheckTime}}</el-col>
                            </el-row>
                            <el-row :span="24" class="margin-td-40">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验说明：</el-col>
                                <el-col :span="22" class="text-left font-bold"></el-col>
                            </el-row>
                        </div>
                        <div class="check-info">
                            <el-row><el-col class="padding-lr-10 margin-td-20 font-bold font-size-18"><span class="line"></span>电子运单核验</el-col></el-row>
                            <el-row :span="24" class="margin-td-20">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验结论：</el-col>
                                <el-col :span="6" class="text-left font-bold"></el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验人：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.unloadWaybillCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{ruleForm.unloadWaybillCheckTime}}</el-col>
                            </el-row>
                            <el-row :span="24" class="margin-td-40">
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验说明：</el-col>
                                <el-col :span="22" class="text-left font-bold"></el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {getByCode} from '@/api/industry'
    export default {
        components: {CommonSubtitle},
        name: 'see-detail',
        props: ['editParamsInfo'],
        data(){
            return {
                wayBillNoTitle:"",
                ruleForm:null,
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                activeTab:'1',
                noData:'',
                carTypeOptions:[],  //车辆类型列表
            }
        },
        created() {
            let self = this;
            this.dictionary();
            //默认执行
            this.setBtns();
            window.onresize = function () {
                self.setBtns();
            };
            this.wayBillNoTitle = "运单编号：" + this.editParamsInfo.wayBillNo
            this.ruleForm = this.editParamsInfo
        },
        watch:{
            'editParamsInfo':{
                handler(newValue){
                    this.wayBillNoTitle = "运单编号："+newValue.wayBillNo
                    this.ruleForm = newValue;
                    this.ruleForm.carType = this.ruleForm.carType + '';
                    this.ruleForm.cityDistribution = this.ruleForm.cityDistribution + '';
                },
                immediate:true,
                deep:true
            }
        },
        methods:{
            dictionary(){
                //车辆类型
                getByCode({code: 'CAR_TYPE', enable: 1}).then(res => {
                    this.carTypeOptions = [];
                    res.data.list.map(item => {
                        this.carTypeOptions.push(item);
                    })
                });
            },
            //设置按钮样式
            setBtns() {
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },
        }
    }
</script>
<style lang="scss" scoped>
    /deep/ .el-tabs__item{
        font-size: 16px;
    }
    .check-info{
        .el-col{
            height: 15px;
        }
        .line{
            width: 6px;
            height: 22px;
            display: inline-block;
            background-color: #2794e7;
            float: left;
            margin: -4px 10px 0 0;
        }
    }
    /deep/ .el-form-item {
        width: 325px;
    }
    .el-form-item /deep/.el-input,.el-input__inner {
        width: 200px;
    }

    .long-form-item{
        width: calc(100% - 20px);
        /deep/ .el-form-item__content{
            width: calc(100% - 240px);
        }
    }
    .input-box{
        /deep/ .el-input{
            width: 100%;
        }
    }
</style>
<style lang="scss" scoped>
    @import '../../waybill-manager/styles/waybillManager';
</style>
