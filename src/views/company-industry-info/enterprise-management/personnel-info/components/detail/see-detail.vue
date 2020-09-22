<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <div class="add-form">
                    <el-form label-position="right" ref="ruleForm" :inline="true" label-width="85px" :model="ruleForm">
                        <el-form-item label="姓名:">
                            <el-input v-model="ruleForm.name" :disabled="isDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="所属企业:">
                            <el-input v-model="ruleForm.companyName" :disabled="isDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="性别:">
                            <el-select v-model="ruleForm.gender" placeholder="请选择" :disabled="isDisabled">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="身份证号:">
                            <el-input v-model="ruleForm.personNum" :disabled="isDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="资格类型:">
                            <el-select v-model="ruleForm.type" placeholder="请选择" :disabled="isDisabled">
                                <el-option
                                    v-for="item in optionsType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="联系方式:">
                            <el-input v-model="ruleForm.phoneNum" :disabled="isDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="备注:" class="text-area">
                            <el-input
                                type="textarea"
                                v-model="ruleForm.remarks"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                :disabled="isDisabled">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="add-img">
                    <el-image :src="ruleForm.url" height="130" width="100%" :preview-src-list="[ruleForm.url]"
                     >
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                </div>
                <div class="info-wrap padding-lr-20" style="clear: both;">
                    <el-tabs v-model="activeTab" type="border-card">
                        <el-tab-pane label="所属企业" name="1">
                            <belong-company :isDisabled="true" :companyData="companyData"></belong-company>
                        </el-tab-pane>
                        <el-tab-pane label="驾驶证信息" name="2" v-if="ruleForm.type==1">
                            <driver-license :isDisabled="true" :workerId="workerId" :workerName="workerName" :driverData="driverData"></driver-license>
                        </el-tab-pane>
                        <el-tab-pane label="押运证信息" name="3" v-else>
                            <escort-certificate  :isDisabled="true" :workerId="workerId" :workerName="workerName" :escortData="escortData"></escort-certificate>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {WorkerSaveOrUpdate,workerDriveLicense,workerQualificatLicense,basicCompanyGet} from '@/api/industry'
    import elDragDialog from '@/directive/el-drag-dialog'
    import BelongCompany from "./belong-company";
    import DriverLicense from "./driver-license";
    import EscortCertificate from "./escort-certificate";
    import UploadImage from '../../../enterprise-info/components/upload-image'
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    export default {
        components: {EscortCertificate, DriverLicense, CommonSubtitle,UploadImage,ElImageViewer,BelongCompany},
        name: 'SeeDetail',
        props: ['editParamsInfo'],
        directives: {elDragDialog},
        data() {
            return {
                ruleForm: {
                    name: '',
                    companyId:'',
                    companyName: '',
                    gender: '',
                    personNum:'',
                    type:'',
                    phoneNum:'',
                    remarks:'',
                    url :'',
                },
                activeTab:'1',
                options:[{
                    value: 1,
                    label: '男'
                },{
                    value: 2,
                    label: '女'
                }],
                optionsType:[{
                    value: 1,
                    label: '驾驶员 '
                },{
                    value: 2,
                    label: '押运员'
                }],
                workerId:null,  //保存企业基本信息时，产生的workerId
                workerName:null,  //保存企业基本信息时，产生的workerName
                driverData:[],  //保存驾驶证信息
                escortData:[],  //保存押运证信息
                companyData:{}, //公司信息
                url:null,
                showViewer: false, // 显示查看器
                isDisabled:true,
            };
        },
        created(){
            //获取用户信息,自动填充所属公司
            let userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            this.ruleForm.companyName=userInfo.companyName;
            this.ruleForm.companyId=userInfo.companyId;
            const keys = Object.keys(this.ruleForm);
            for(let key of keys){
                this.ruleForm[key] = this.editParamsInfo[key];
            }
            this.workerName = this.editParamsInfo.name;
            this.workerId = this.editParamsInfo.id;
            this.url=this.editParamsInfo.url;
            this.getDriverInfo();
            this.getEscortInfo();
            this.getCompanyInfo();
        },
        watch:{
            'editParamsInfo':{
                handler(newValue){
                    console.log(newValue,"newValue");
                    const keys = Object.keys(this.ruleForm);
                    for(let key of keys){
                        this.ruleForm[key] = newValue[key];
                    }
                    this.workerName = newValue.name;
                    this.workerId = newValue.id;
                    this.getDriverInfo();
                    this.getEscortInfo();
                    this.getCompanyInfo();
                    this.activeTab='1';
                }
            }
        },
        methods: {
            onPreview() {
                this.showViewer = true
            },
            // 关闭查看器
            closeViewer() {
                this.showViewer = false
            },
            //获取该员工公司信息
            getCompanyInfo() {
                basicCompanyGet({id: this.ruleForm.companyId}).then(res => {
                    this.companyData = res.data;
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            //获取该员工押运证证信息
            getEscortInfo() {
                let obj = {
                    workerId: this.editParamsInfo.id,
                };
                workerQualificatLicense(obj).then(res => {
                    this.escortData= res.data.list;
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            //获取该员工驾驶证信息
            getDriverInfo() {
                let obj = {
                    workerId: this.editParamsInfo.id,
                };
                workerDriveLicense(obj).then(res => {
                    this.driverData= res.data.list;
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        WorkerSaveOrUpdate(this.ruleForm).then(res => {
                            this.$message({
                                showClose: true,
                                message: '新增成功！',
                                type: 'success'
                            });
                            this.$emit('showHiddenAdd', true, true);
                        }).catch((err) => {
                            // 公共方法有，所以不需要加提示了
                            // this.$message.error(err.msg)
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-form-item {
        width: calc(33% - 20px);
    }
    /deep/ .el-select {
        display: inline-block;
        position: relative;
        width: 100%;
    }
    /deep/ .el-form-item--medium .el-form-item__content {
        width: calc(100% - 110px);
    }
    .text-area{
        width: 100%;
        /deep/ .el-form-item__content {
            width: calc(100% - 151px)!important;
        }
    }
    .add-form{
        width: 80%;
        float: left;
    }
    .add-img{
        width: 20%;
        float: left;
        margin-left: -25px;
    }
    /deep/ .el-upload-dragger {
        width: 255px;
        height: 170px;
    }
    /deep/ .el-image {
        width: 100%;
        height: 170px!important;
    }
    /deep/ .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: #f5f7fa;
        color: #909399;
        font-size: 30px;
    }
</style>
