<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <CommonSubtitle :title="wayBillNoTitle" :isBold="true"></CommonSubtitle>
                <el-steps :active="rowData.wayBillStatus" align-center>
                    <el-step title="运单填报" :description="rowData.createTime"></el-step>
                    <el-step title="等待装车" :description="rowData.waitLoadTime"></el-step>
                    <el-step title="运输途中" :description="rowData.transportTime"></el-step>
                    <el-step title="等待卸车" :description="rowData.waitUnloadTime"></el-step>
                    <el-step title="运输完成" :description="rowData.transportCompleteTime"></el-step>
                </el-steps>
            </div>
            <div class="info-wrap">
                <el-form label-position="right" ref="ruleForm" :inline="true" label-width="125px">
                    <!-------------------------运单发起----------------------------------->
                    <CommonSubtitle title="基本信息" :isBold="true"></CommonSubtitle>
                    <el-form-item label="托运方单位名称:" prop="consignorCompanyName" style="margin-right: 20px">
                        <el-input v-model="rowData.consignorCompanyName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="装货方单位名称:" prop="loadCompanyName" style="margin-right: 20px">
                        <el-input v-model="rowData.loadCompanyName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="收货方单位名称:" prop="receiverCompanyName" style="margin-right: 20px">
                        <el-input v-model="rowData.receiverCompanyName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="危险货物名称:" prop="cargoName" style="margin-right: 20px">
                        <el-input v-model="rowData.cargoName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="托运方联系电话:" prop="consignorTelephone" style="margin-right: 20px">
                        <el-input v-model="rowData.consignorTelephone" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="装货方联系电话:" prop="loadTelephone" style="margin-right: 20px">
                        <el-input v-model="rowData.loadTelephone" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="收货方联系电话:" prop="receiverTelephone" style="margin-right: 20px">
                        <el-input v-model="rowData.receiverTelephone" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="数量(吨/立方):" prop="cargoNum" style="margin-right: 20px">
                        <el-input v-model="rowData.cargoNum" disabled></el-input>
                    </el-form-item>

                    <!-------------------------运输信息----------------------------------->
                    <CommonSubtitle title="运输信息" :isBold="true"></CommonSubtitle>
                    <el-form-item label="承运方单位名称:" prop="carrierCompanyName" style="margin-right: 20px">
                        <el-input v-model="rowData.carrierCompanyName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="经营许可证号:" prop="carrierCompanyLicenseNo" style="margin-right: 20px">
                        <el-input v-model="rowData.carrierCompanyLicenseNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话:" prop="carrierCompanyTelephone" style="margin-right: 20px">
                        <el-input v-model="rowData.carrierCompanyTelephone" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="应急联系方式:" prop="emergencyTelephone" style="margin-right: 20px">
                        <el-input v-model="rowData.emergencyTelephone" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="拖车车牌号码:" prop="carNo" style="margin-right: 20px">
                        <el-input v-model="rowData.carNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="道路运输证号:" prop="carTransportLicenseNo" style="margin-right: 20px">
                        <el-input v-model="rowData.carTransportLicenseNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="挂车车牌号码:" style="margin-right: 20px">
                        <el-input v-model="rowData.trailerNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="道路运输证号:"  style="margin-right: 20px">
                        <el-input v-model="rowData.trailerTransportLicenseNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="装货日期:" prop="loadDate" style="margin-right: 20px">
                        <el-input v-model="rowData.loadDate" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="预计到达日期:" prop="expectedArrivalDate" style="margin-right: 20px">
                        <el-input v-model="rowData.expectedArrivalDate" disabled></el-input>
                    </el-form-item>

                    <!-------------------------人员信息----------------------------------->
                    <CommonSubtitle title="人员信息" :isBold="true"></CommonSubtitle>
                    <template v-for="(item, index) in rowData.driverInfo">
                        <el-form-item label="驾驶员姓名:" prop="driverName" style="margin-right: 20px">
                            <el-input v-model="item.name" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="驾驶员身份证号:" prop="driveridCardNo" style="margin-right: 20px">
                            <el-input v-model="item.personNum" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="驾驶证:" prop="driverLicenseNo" style="margin-right: 20px">
                            <el-input v-model="item.workerDriveLicenseDTO[0] && item.workerDriveLicenseDTO[0].licenceCode" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="驾驶员联系电话:" prop="driverTelephone" style="margin-right: 20px">
                            <el-input v-model="item.phoneNum" disabled></el-input>
                        </el-form-item>
                    </template>
                    <el-form-item label="押运员姓名:" prop="escortName" style="margin-right: 20px">
                        <el-input v-model="rowData.escortName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="押运员身份证号:" prop="escoridCardNo" style="margin-right: 20px">
                        <el-input v-model="rowData.escoridCardNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="押运证:" prop="escorLicenseNo" style="margin-right: 20px">
                        <el-input v-model="rowData.escorLicenseNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="押运员联系电话:" prop="escorTelephone" style="margin-right: 20px">
                        <el-input v-model="rowData.escorTelephone" disabled></el-input>
                    </el-form-item>
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
                                <el-col :span="6" class="text-left font-bold">{{rowData.loadCarCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{rowData.loadCarCheckTime}}</el-col>
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
                                <el-col :span="6" class="text-left font-bold">{{rowData.loadWorkerCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{rowData.loadWorkerCheckTime}}</el-col>
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
                                <el-col :span="6" class="text-left font-bold">{{rowData.loadWaybillCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{rowData.loadWaybillCheckTime}}</el-col>
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
                                <el-col :span="6" class="text-left font-bold">{{rowData.unloadCarCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{rowData.unloadCarCheckTime}}</el-col>
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
                                <el-col :span="6" class="text-left font-bold">{{rowData.unloadWorkerCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{rowData.unloadWorkerCheckTime}}</el-col>
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
                                <el-col :span="6" class="text-left font-bold">{{rowData.unloadWaybillCheckPerson}}</el-col>
                                <el-col :span="2" class="text-right padding-lr-10 font-bold">核验时间：</el-col>
                                <el-col :span="6" class="text-left font-bold">{{rowData.unloadWaybillCheckTime}}</el-col>
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
    export default {
        components: {CommonSubtitle},
        name: 'see-detail',
        props: ['editParamsInfo'],
        data(){
            return {
                wayBillNoTitle:"",
                rowData:null,
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                activeTab:'1',
                noData:''
            }
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize = function () {
                self.setBtns();
            };
            this.wayBillNoTitle = "运单编号：" + this.editParamsInfo.wayBillNo
            this.rowData = this.editParamsInfo
        },
        watch:{
            'editParamsInfo':{
                handler(newValue){
                    console.log(newValue,"newValue");
                    this.wayBillNoTitle = "运单编号："+newValue.wayBillNo
                    this.rowData = newValue
                }
            }
        },
        methods:{
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
</style>
<style lang="scss" scoped>
    @import '../../waybill-manager/styles/waybillManager';
</style>
