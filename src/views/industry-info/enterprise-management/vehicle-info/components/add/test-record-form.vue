<template>
    <div>
        <div class="form-container">
            <el-form label-position="right" ref="ruleForm" :inline="true" label-width="120px" :model="ruleForm"
                     :rules="rules" class="padding-t-10">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="检测单位:" prop="licenceAuthor">
                            <el-input v-model="ruleForm.licenceAuthor" :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="报告编号:" prop="licenceCode">
                            <el-input v-model="ruleForm.licenceCode" :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="检测日期:" prop="checkDate">
                            <el-date-picker
                                    v-model="ruleForm.checkDate"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    :disabled="isDisabled"
                            >
                            </el-date-picker>
                            <!--<el-input v-model="ruleForm.givingTime" :disabled="isDisabled"></el-input>-->
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否合格:" prop="isAccredited">
                            <el-select v-model="ruleForm.isAccredited" :disabled="isDisabled" placeholder="请选择是否合格">
                                <el-option
                                        v-for="item in isAccreditedOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="下次检测日期:" prop="nextCheckDate">
                            <el-date-picker
                                    v-model="ruleForm.nextCheckDate"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    :disabled="isDisabled"
                            >
                            </el-date-picker>
                            <!--<el-input v-model="ruleForm.givingTime" :disabled="isDisabled"></el-input>-->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">

                        <el-form-item label="证件照片:" prop="urlList" class="text-area">
                            <el-row v-if="isDisabled">
                                <div class="file-item">
                                    <img src="../../image/qualify.jpg" height="90" width="130" @click="onPreview"/>
                                    <el-image-viewer
                                            v-if="showViewer"
                                            :on-close="closeViewer"
                                            :url-list="[url]"/>
                                </div>
                                <div class="file-item">
                                    <img src="../../image/qualify.jpg" height="90" width="130" @click="onPreview"/>
                                    <el-image-viewer
                                            v-if="showViewer"
                                            :on-close="closeViewer"
                                            :url-list="[url]"/>
                                </div>
                            </el-row>
                            <el-row v-else>
                                <div class="file-item upload-item">
                                    <upload-image ref="upload" @setFileUrl="getFileUrl" ></upload-image>
                                </div>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <div class="margin-td-10" style="text-align: center; width: 100%;">
                        <el-button @click="resetForm('ruleForm')">重 置</el-button>
                        <el-button type='primary' @click="submitForm('ruleForm')">添 加</el-button>
                    </div>
                </el-row>

            </el-form>
        </div>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import UploadImage from '../upload-image.vue';
    import passParam from '@/utils/ext.passParam'
    import {carPressureRecordSaveOrUpdate} from '@/api/industryInfo/vehicleInfo'

    export default {
        name: "TransportQualificationForm",
        props: ['isDisabled', 'carInfo'],
        components: {ElImageViewer, UploadImage},
        data() {
            return {
                ruleForm: {
                    id: null,
//                    companyId: '',//公司Id
//                    companyName: '',//公司名称
                    licenceCode: '',//编号
                    licenceAuthor: '',//检测单位
                    checkDate: '',//检测日期
                    isAccredited: null,//是否合格
                    nextCheckDate: '',//下次检测日期
                    urlList: [],//图片地址
                    carId:'',//车辆ID
                },
                rules: {
                    licenceCode: [
                        {required: true, message: '请填写道路运输证号', trigger: 'blur'},
                    ],
                    licenceAuthor: [
                        {required: true, message: '请填写发证机构', trigger: 'blur'},
                    ],
                    isAccredited: [
                        {required: true, message: '请选择是否合格', trigger: 'blur'},
                    ],
                    checkDate: [
                        {required: true, message: '请选择检测日期', trigger: 'change'},
                    ],
                    nextCheckDate: [
                        {required: true, message: '请选择下次检测日期', trigger: 'change'},
                    ],
                    urlList: [
                        {required: true, message: '请上传证件照片', trigger: 'change'},
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
                url: 'http://localhost:9527/static/img/qualify.27e02f59.jpg',
                isValid: false,
                isAccreditedOptions:[
                    {
                        label:'合格',
                        value:1
                    },
                    {
                        label:'不合格',
                        value:0
                    },
                ],//是否合格
            }
        },
        watch: {
            carInfo: {
                deep: true, //深度监听设置为 true
                handler: function (newV, oldV) {
                    this.ruleForm.carId = this.carInfo.id;
                },
                immediate: true
            }
        },
        mounted() {
            /*passParam.$on('fileUrls', (url) => {
                this.ruleForm.urlList = url;
            })*/
        },
        methods: {
            //保存
            submitForm(formName) {
                if(this.ruleForm.carId){
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            console.log('this.ruleForm',this.ruleForm);
                            carPressureRecordSaveOrUpdate(this.ruleForm).then(res => {
                                this.$message({
                                    showClose: true,
                                    message: '操作成功！',
                                    type: 'success'
                                });
                            }).catch((err) => {

                            });
                        } else {
                            this.$message.warning('请填完所有项再提交');
                            return false;
                        }
                    });
                }else{
                    this.$message.warning('请先保存基本信息');
                    return false;
                }




            },
            //重置：清除表单数据
            /*resetForm(){
                for(let i=0;i<this.qualifys.length;i++){
                    this.$refs['form_'+i][0].resetForm('ruleForm');
                }
            }*/
            //重置：清除表单数据
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$refs.upload.clearFiles();//清空已上传的文件列表
            },
            //上传图片；赋值
            getFileUrl(url){
                this.ruleForm.urlList = url;
            }

        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .container {
        padding: 10px;
        position: relative;
        .qualify-item {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .tag-wrap {
            position: absolute;
            top: 0;
            right: 0;
        }
        .text-area {
            width: 100%;
            /deep/ .el-form-item__content {
                width: calc(100% - 150px);
            }
        }
        /deep/ .el-select, .el-date-editor {
            display: inline-block;
            position: relative;
            width: 100%;
        }
        /deep/ .el-textarea {
            width: 97%;
        }
        .file-item {
            display: inline-block;
            float: left;
            margin-right: 15px;
        }
        /*上传附件的样式*/
        .upload-item {
            width: 100%;
            margin-right: 0!important;
            .container{
                padding: 0;
            }
        }

    }

    .form-container {
        /deep/ .el-form-item {
            width: 100% !important;
        }
        /deep/ .el-form-item__content {
            width: calc(100% - 120px) !important;
        }
    }

</style>
