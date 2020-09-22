<template>
    <div>
        <div class="form-container">
            <el-form label-position="right" :rules="rules"  ref="ruleForm" :inline="true" label-width="120px" :model="ruleForm">
                <el-form-item label="证件编号:" prop="licenceCode">
                    <el-input v-model="ruleForm.licenceCode" :disabled="isDisabled"></el-input>
                </el-form-item>
                <el-form-item label="初次发证日期:" prop="licenceCode">
                    <el-date-picker
                        v-model="ruleForm.givingTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :disabled="isDisabled"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="发证机关:" prop="licenceCode">
                    <el-input v-model="ruleForm.licenceAuthor" :disabled="isDisabled"></el-input>
                </el-form-item>
                <el-form-item label="发证日期:" prop="licenceCode">
                    <el-date-picker
                        v-model="ruleForm.registTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :disabled="isDisabled"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="有效期起:" prop="licenceCode">
                    <el-date-picker
                        v-model="ruleForm.startUseTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :picker-options="timeForm.pickerTimeBeg"
                        :disabled="isDisabled"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="有效期止:" prop="licenceCode">
                    <el-date-picker
                        v-model="ruleForm.endUseTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :picker-options="timeForm.pickerTimeEnd"
                        :disabled="isDisabled"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备案日期:" prop="licenceCode">
                    <el-date-picker
                        v-model="ruleForm.recordTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :disabled="isDisabled"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="证件照片:" class="text-area" prop="url">
                    <el-row>
                        <div class="file-item upload-item">
                            <upload-image ref="upload" @setFileUrl="getFileUrl"></upload-image>
                        </div>
                    </el-row>
                </el-form-item>
            </el-form>
            <el-row>
                <div class="margin-td-10" style="text-align: center; width: 100%;" v-if="!isDisabled">
                    <el-button @click="resetForm('ruleForm')">重 置</el-button>
                    <el-button type='primary' @click="submitForm('ruleForm')">添 加</el-button>
                </div>
            </el-row>
        </div>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import UploadImage from '../upload-image.vue';
    import passParam from '@/utils/ext.passParam'
    import {qualificatLicenseBatchSaveOrUpdate} from '@/api/industry'
    export default {
        name: "escort-certificate-form",
        props:['isDisabled','workerId','workerName'],
        components: { ElImageViewer,UploadImage },
        data() {
            return {
                ruleForm:{
                    licenceCode:'',
                    givingTime:'',
                    licenceAuthor :'',
                    registTime :'',
                    startUseTime :'',
                    endUseTime :'',
                    recordTime:'',
                    url :'',
                    workerId:this.workerId,
                    workerName:this.workerName,
                },
                rules:{
                    licenceCode: [
                        { required: true, message: '请填写证件编号', trigger: 'blur' },
                    ],
                    givingTime: [
                        { required: true, message: '请选择初次领证日期', trigger: 'change' },
                    ],
                    licenceAuthor: [
                        { required: true, message: '请填写发证机关', trigger: 'blur' },
                    ],
                    registTime: [
                        { required: true, message: '请选择发证日期', trigger: 'change' },
                    ],
                    startUseTime: [
                        { required: true, message: '请选择有效期起', trigger: 'change' },
                    ],
                    endUseTime: [
                        { required: true, message: '请选择有效期止', trigger: 'change' },
                    ],
                    recordTime: [
                        { required: true, message: '请选择备案日期', trigger: 'change' },
                    ],
                    url: [
                        { required: true , message: '请上传证件照片', trigger: 'change'},
                    ],
                },
                timeForm: {
                    pickerTimeBeg: { //限制开始时间
                        disabledDate: (time) => {
                            if (this.ruleForm.endUseTime != '' && this.ruleForm.endUseTime) {
                                let timeStr = new Date(this.ruleForm.endUseTime.replace(/-/g, '/'));
                                return time.getTime() > timeStr;
                            } else {
                                return ''
                            }
                        }
                    },
                    pickerTimeEnd: { //限制结束时间
                        disabledDate: (time) => {
                            if (this.ruleForm.startUseTime != '' && this.ruleForm.startUseTime) {
                                let timeStr = new Date(this.ruleForm.startUseTime.replace(/-/g, '/'));
                                return time.getTime() < timeStr;
                            } else {
                                return ''
                            }
                        }
                    }
                },
                showViewer: false, // 显示查看器
                options:[],//车辆类型
            }
        },
        watch:{
            'workerId':{
                handler(value){
                    this.ruleForm.workerId = value;
                }
            },
            'workerName':{
                handler(value){
                    this.ruleForm.workerName = value;
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        qualificatLicenseBatchSaveOrUpdate([this.ruleForm]).then(res => {
                            this.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                        }).catch((err) => {
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$refs.upload.clearFiles();//清空已上传的文件列表
            },
            getFileUrl(url){
                this.ruleForm.url = url;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        padding: 10px;
        position: relative;
        .qualify-item{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .tag-wrap{
            position: absolute;
            top:0;
            right: 0;
        }
        .text-area{
            width: 100%!important;
            /deep/ .el-form-item__content{
                width: calc(100% - 150px);
            }
        }
        /deep/ .el-select,.el-date-editor {
            display: inline-block;
            position: relative;
            width: 100%;
        }
        /deep/ .el-textarea{
            width: 97%;
        }
        .file-item{
            display: inline-block;
            float: left;
            margin-right: 15px;
        }
        /*上传附件的样式*/
        .upload-item{
            width: 98%;
        }
    }
    /deep/ .el-form-item--medium .el-form-item__content {
        width: calc(100% - 120px)!important;
    }
</style>
