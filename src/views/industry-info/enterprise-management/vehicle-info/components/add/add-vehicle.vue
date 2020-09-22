<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <CommonSubtitle title="基本信息" :isBold="true" style="line-height: 10px"></CommonSubtitle>
                <div class="add-form">
                    <el-form label-position="right" ref="ruleForm" :inline="true" label-width="120px" :model="ruleForm"
                             :rules="rules">
                        <el-form-item label="车牌号码:" prop="carNum">
                            <el-input v-model="ruleForm.carNum" placeholder="请输入车牌号码"></el-input>
                        </el-form-item>
                        <el-form-item label="所属企业:" prop="companyName">
                            <el-input v-model="ruleForm.companyName" disabled placeholder="请输入所属企业"></el-input>
                        </el-form-item>
                        <el-form-item label="管辖区域:" prop="areaName">
                            <el-input v-model="ruleForm.areaName" disabled placeholder="请输入管辖区域"></el-input>
                        </el-form-item>
                        <el-form-item label="车籍地:" prop="vehicleOrigin">
                            <el-input v-model="ruleForm.vehicleOrigin" placeholder="请输入车籍地"></el-input>
                        </el-form-item>
                        <el-form-item label="车辆类型:" prop="carType">
                            <el-select v-model="ruleForm.carType" placeholder="请选择车辆类型">
                                <el-option
                                        v-for="item in carTypeOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <!--<el-input v-model="ruleForm.carType" placeholder="请输入车辆类型"></el-input>-->
                        </el-form-item>
                        <el-form-item label="注册日期:" prop="registDate">
                            <el-date-picker type="date" placeholder="请选择注册日期" v-model="ruleForm.registDate"
                                            style="width: 100%;"></el-date-picker>
                            <!--<el-input v-model="ruleForm.registDate" placeholder="请选择注册日期" ></el-input>-->
                        </el-form-item>
                        <el-form-item label="车辆状态:" prop="workingStatus">
                            <el-select v-model="ruleForm.workingStatus" placeholder="请选择车辆状态">
                                <el-option
                                        v-for="item in carWorkingStatusOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <!--<el-input v-model="ruleForm.workingStatus" placeholder="请选择车辆状态"></el-input>-->
                        </el-form-item>
                        <el-form-item label="运输证状态:" prop="transportStatus">
                            <el-select v-model="ruleForm.transportStatus" placeholder="请选择运输证状态">
                                <el-option
                                        v-for="item in licenceStatusOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <!--<el-input v-model="ruleForm.transportStatus" placeholder="请选择运输证状态" ></el-input>-->
                        </el-form-item>
                        <el-form-item label="车身颜色:" prop="bodyColor">
                            <el-input v-model="ruleForm.bodyColor" placeholder="请输入车身颜色"></el-input>
                        </el-form-item>
                        <el-form-item label="车辆尺寸:" prop="tankSize">
                            <el-input v-model="ruleForm.tankSize" placeholder="请输入车辆尺寸"></el-input>
                        </el-form-item>
                        <el-form-item label="定位终端:" prop="positionTerminal">
                            <el-input v-model="ruleForm.positionTerminal" placeholder="请输入定位终端"></el-input>
                        </el-form-item>
                        <el-form-item label="定位平台:" prop="positionPlat">
                            <el-input v-model="ruleForm.positionPlat" placeholder="请输入定位平台"></el-input>
                        </el-form-item>
                        <el-form-item class="other-form-item two-label" prop="maxFilling" style="line-height: 18px">
                            <span slot="label">
                                <el-row style="float: right;line-height: 22px">
                                    <label>最大充装量：</label>
                                </el-row>
                                <el-row style="float: right;line-height: 12px">
                                    <label>(m3:常压或承压)</label>
                                </el-row>
                            </span>
                            <el-input v-model="ruleForm.maxFilling" type="number" placeholder="请输入最大充装量"></el-input>
                        </el-form-item>

                        <el-form-item class="other-form-item two-label" prop="checkLoad" label="道路运输证核定载重(吨):">
                            <!--<span slot="label" class="font-bold" style="display: inline-block;line-height: 12px" >
                                道路运输证核定载重(吨):
                            </span>-->
                            <el-input v-model="ruleForm.checkLoad" type="number" placeholder="请输入道路运输证核定载重"></el-input>
                        </el-form-item>
                        <el-form-item label="危险货物品名:" class="text-area" prop="chemicalId">
                            <el-select
                                    type="textarea"
                                    v-model="ruleForm.chemicalId"
                                    multiple
                                    filterable
                                    placeholder="请选择危险货物品名">
                                <el-option
                                        v-for="item in chemicalOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>


                        <el-form-item class="margin-td-10" style="text-align:end; width: 100%;">
                            <el-button @click="resetForm('ruleForm')">重 置</el-button>
                            <el-button type='primary' @click="checkRules">添 加</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="add-img">
                    <upload-image ref="upload" :limit="1" @setFileUrl="getFileUrl" ></upload-image>
                </div>
                <div class="info-wrap padding-lr-20" style="clear: both;padding-top: 20px;padding-right: 0">
                    <el-tabs v-model="tabActive" type="border-card">
                        <el-tab-pane label="运输资质信息" name="1">
                            <transport-qualification :isDisabled="false" :carInfo="ruleForm" ></transport-qualification>
                        </el-tab-pane>
                        <el-tab-pane label="行驶证信息" name="2">
                            <driver-license  :isDisabled="false" :carInfo="ruleForm" ></driver-license>
                        </el-tab-pane>
                        <el-tab-pane label="液化气体罐车使用证" name="3">
                            <use-certificate  :isDisabled="false" :carInfo="ruleForm" ></use-certificate>
                        </el-tab-pane>
                        <el-tab-pane label="压力容器(罐体)检测记录" name="4">
                            <test-record  :isDisabled="false" :carInfo="ruleForm" ></test-record>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TransportQualification from "./transport-qualification";
    import DriverLicense from "./driver-license";
    import UseCertificate from "./use-certificate";
    import TestRecord from "./test-record";
    import CommonSubtitle from '@/components/CommonSubtitle'
    import UploadImage from '../upload-image.vue';
    import {getByCode, basicChemicalsList, carSaveOrUpdate} from '@/api/industryInfo/vehicleInfo'
    import {mapGetters} from 'vuex'
    import passParam from '@/utils/ext.passParam'


    export default {
        name: "AddVehicle",
        components: {TestRecord, UseCertificate, DriverLicense, TransportQualification, CommonSubtitle, UploadImage},
        props: ['carTypeOptions', 'carWorkingStatusOptions', 'licenceStatusOptions', 'treeData'],
        data() {
            return {
                ruleForm: {
                    id: null,
                    companyName: '',//所属企业
                    companyId: null,//所属企业
                    carNum: '',//车牌号码
                    areaName: '',//区域名字
                    areaId: '',//区域id
                    vehicleOrigin: '',//管辖区域
//                    vehicleOrigin: '',//车籍地
                    carType: '',//车辆类型
                    registDate: '',//注册日期
                    workingStatus: '',//车辆状态
                    transportStatus: '',//运输证状态
                    bodyColor: '',//车身颜色
                    tankSize: '',//车辆尺寸
                    positionTerminal: '',//定位终端
                    positionPlat: '',//定位平台
                    maxFilling: '',//最大充装量
                    checkLoad: '',//核定载重
                    chemicalId: '',//危化品
                    url: '',//车辆图片地址
                },
                tabActive: '1',  //tab页的激活状态
                chemicalOptions: [],//危险货物品名列表项
                rules: {
                    /*companyName: [
                        {required: true, message: '请输入所属企业', trigger: 'blur'}
                    ],*/
                    carNum: [
                        {required: true, message: '请输入车牌号码', trigger: 'change'},
                    ],
                    /*areaName: [
                        {required: true, message: '请输入管辖区域', trigger: 'blur'},
                    ],*/
                    vehicleOrigin: [
                        {required: true, message: '请输入车籍地', trigger: 'blur'},
                    ],
                    carType: [
                        {required: true, message: '请选择车辆类型', trigger: 'change'},
                    ],
                    registDate: [
                        {required: true, message: '请选择注册日期', trigger: 'change'},
                    ],
                    workingStatus: [
                        {required: true, message: '请选择车辆状态', trigger: 'change'},
                    ],
                    transportStatus: [
                        {required: true, message: '请选择运输证状态', trigger: 'change'},
                    ],
                    bodyColor: [
                        {required: true, message: '请输入车身颜色', trigger: 'blur'},
                    ],
                    tankSize: [
                        {required: true, message: '请输入车辆尺寸', trigger: 'blur'},
                    ],
                    positionTerminal: [
                        {required: true, message: '请输入定位终端', trigger: 'blur'},
                    ],
                    /*enterpriseLegalPersonTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],*/
                    positionPlat: [
                        {required: true, message: '请输入定位平台', trigger: 'blur'},
                    ],
                    maxFilling: [
                        {required: true, message: '请输入最大充装量', trigger: 'blur'},
                    ],
                    /*safetySupervisorName: [
                        { required: true, message: '请输入安全主管姓名', trigger: 'blur' },
                    ],
                    safetySupervisorTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                    faxNumber: [
                        { required: true, message: '请输入工作传真号码', trigger: 'change' },
                    ],*/
                    checkLoad: [
                        {required: true, message: '请输入道路运输证核定载重（吨）', trigger: 'change'},
                    ],
                    chemicalId: [
                        {required: true, message: '请选择危险货物品名', trigger: 'blur'},
                    ],
                },
            }
        },
        computed: {
            ...mapGetters([
                'companyDetail',
            ])
        },
        created() {
            //获取危化品列表项
            this.getChemicalList();
        },
        mounted() {
            this.ruleForm.companyId = this.companyDetail.id;
            this.ruleForm.companyName = this.companyDetail.text;
            //管辖区域
            if (this.treeData.length > 0) {
                this.changeTreeData(this.treeData);
            }
            /*passParam.$on('fileUrls', (url) => {
//                this.ruleForm.url = url;
                this.ruleForm.url = url.join(',');
            })*/
        },
        methods: {
            //递归获取区域
            changeTreeData(data) {
                if(data){
                    data.map((item, index) => {
                        if (item.code === this.companyDetail.parent && item.type !=='company' ) {
                            this.ruleForm.areaName = item.text;
                            this.ruleForm.areaId = item.id;
                            return;

                        } else if (item.hasOwnProperty("nodes")) {
                            this.changeTreeData(item.nodes);
                        }

                    });
                }

            },
            //获取危化品列表项
            getChemicalList() {
                basicChemicalsList({}).then(res => {
                    res.data.map(item => {
                        this.chemicalOptions.push({
                            name: item.name,
                            value: item.id + ''
                        })
                    })
                })
            },

            //核验条件
            checkRules() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        this.submitForm()
                    } else {
                        this.$message.warning('请填完所有项再提交');
                        return false;
                    }
                });

            },
            //保存基本信息
            submitForm() {
                if (this.$refs.upload.filePath.length > 0) {
                    let params = {...this.ruleForm};
                    params.chemicalId = this.ruleForm.chemicalId.join(',');
                    carSaveOrUpdate(params).then(res => {
                        this.ruleForm.id = res.data;
                        this.$message({
                            showClose: true,
                            message: '保存成功！',
                            type: 'success'
                        });
                    }).catch((err) => {
                    })

                } else {
                    this.$message.warning('请上传基本信息照片后再提交');
                    return false;
                }

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.ruleForm.companyId = this.companyDetail.id;
                this.ruleForm.companyName = this.companyDetail.text;
                //管辖区域
                if (this.treeData.length > 0) {
                    this.changeTreeData(this.treeData);
                }
                //清除上传的图片
                this.$refs.upload.clearFiles();//清空已上传的文件列表
            },
            //上传图片
            getFileUrl(url){
                this.ruleForm.url = url.join(',');
            }
        }
    }
</script>

<style lang="scss" scoped type="text/scss">

    .two-label {
        /deep/ .el-form-item__label {
            line-height: 18px !important;
        }
    }
    .info-wrap{
        padding-right: 20px;
    }

    .el-select {
        width: 100%;
    }

    /deep/ .el-form-item {
        width: calc(50% - 20px);
    }

    /deep/ .el-form-item__content {
        width: calc(100% - 120px);
    }

    .add-form {
        width: 60%;
        float: left;
    }

    .add-img {
        width: 40%;
        float: left;
    }

    .add-form, .add-img {
        margin-top: 20px;
    }

    /deep/ .el-upload-dragger {
        width: 500px;
        height: 265px;
    }

    .text-area {
        width: 100%;
        /deep/ .el-form-item__content {
            width: calc(100% - 120px);
        }
        /deep/ .el-textarea, .el-select {
            width: 96%;
        }
    }

    .other-form-item {
        .label-item {
            width: 150px;
            padding-right: 12px;
            display: inline-block;
        }
        .inp-item {
            width: 185px;
            float: right;
            display: inline-block;
        }
    }

    .add-img{
        width: 30%;
        float: left;
        /*<!--margin-left: -25px;-->*/
        margin-left:5%;
        /deep/ .upload-demo{
            position: relative;
        }
        /deep/ .el-upload-list--picture .el-upload-list__item {
            height: 100%;
            position: absolute;
            top: -10px;
            left: 0;
            width: 100%;
            display: -webkit-box;
            display: -moz-box;
            -webkit-box-align:center;
            -moz-box-align:center;
            box-align:center;
            -webkit-box-pack:center;
            -moz-box-pack:center;
            box-pack:center;
            padding:16px
        }
        /deep/ .el-upload-list--picture .el-upload-list__item-thumbnail {
            width: 100%;
            height: 100%;
            margin-left: 0;
        }
        /deep/ .el-upload-list__item-name {
            line-height: 70px;
            margin-top: 0;
            /*display: none;*/
            margin-right: 0;
            position: absolute;
            top: 15px;
            left: 15px;
            width: calc(100% - 30px);
            height: calc(100% - 30px);
            z-index: 100;
            text-indent:-9999px
        }
    }
    /deep/ .el-upload-dragger {
        width: 255px;
        height: 170px;
    }
    //隐藏数字按钮上下
    /deep/ input::-webkit-outer-spin-button,
    /deep/ input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
     /deep/input[type="number"]{
        -moz-appearance: textfield;
    }

</style>
