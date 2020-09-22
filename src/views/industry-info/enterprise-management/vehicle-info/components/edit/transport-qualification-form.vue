<template>
    <div>
        <div class="form-container">
            <el-form label-position="right" ref="ruleForm" :inline="true" label-width="120px" :model="ruleForm"
                     :rules="rules" class="padding-t-10">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="道路运输证号:" prop="licenceCode">
                            <el-input v-model="ruleForm.licenceCode" :disabled="isLate"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发证机构:" prop="licenceAuthor">
                            <el-input v-model="ruleForm.licenceAuthor" :disabled="isLate"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发证日期:" prop="givingTime">
                            <el-date-picker
                                    v-model="ruleForm.givingTime"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    :disabled="isLate"
                            >
                            </el-date-picker>
                            <!--<el-input v-model="ruleForm.givingTime" :disabled="isDisabled"></el-input>-->
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="有效期起:" prop="startUseTime">
                            <el-date-picker
                                    v-model="ruleForm.startUseTime"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    :picker-options="timeForm.pickerTimeBeg"
                                    :disabled="isLate"
                            >
                            </el-date-picker>
                            <!--<el-input v-model="ruleForm.startUseTime" :disabled="isDisabled"></el-input>-->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="有效期止:" prop="endUseTime">
                            <el-date-picker
                                    v-model="ruleForm.endUseTime"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    :picker-options="timeForm.pickerTimeEnd"
                                    :disabled="isLate"
                            >
                            </el-date-picker>
                            <!--<el-input v-model="ruleForm.endUseTime" :disabled="isDisabled"></el-input>-->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="经营范围:" class="text-area" prop="businessScope">
                            <el-input
                                    type="textarea"
                                    v-model="ruleForm.businessScope"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    :disabled="isLate"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">

                        <el-form-item label="证件照片:" prop="urlList" class="text-area">
                            <el-row>
                                <div class="file-item upload-item">
                                    <upload-image ref="upload" @setFileUrl="getFileUrl" :isLate="isLate"></upload-image>
                                </div>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <div class="margin-td-10" style="text-align: center; width: 100%;" v-show="!isLate">
                        <el-button @click="resetForm('ruleForm')">重 置</el-button>
                        <el-button type='primary' @click="submitForm('ruleForm')">保 存</el-button>
                    </div>
                </el-row>
            </el-form>
            <el-tag :type="!isLate?'success':'danger'" class="tag-wrap" v-show="role=='edit'">{{!isLate==1?'正常':'过期'}}</el-tag>
        </div>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import UploadImage from '../upload-image.vue';
    import passParam from '@/utils/ext.passParam'
    import {batchSaveOrUpdate} from '@/api/industryInfo/vehicleInfo'

    export default {
        name: "TransportQualificationForm",
        props: ['isDisabled', 'carInfo','data','role'],
        components: {ElImageViewer, UploadImage},
        data() {
            return {
                ruleForm: {
                    id: null,
//                    companyId: '',//公司Id
//                    companyName: '',//公司名称
                    licenceCode: '',//运输证号
                    licenceAuthor: '',//发证机构
                    givingTime: '',//发证日期
                    startUseTime: '',//有效期起
                    endUseTime: '',//有效期止
                    businessScope: '',//经营范围
                    urlList: [],//图片地址
                },
                isLate:false,  //是否过期，true为过期
                rules: {
                    licenceCode: [
                        {required: true, message: '请填写道路运输证号', trigger: 'blur'},
                    ],
                    licenceAuthor: [
                        {required: true, message: '请填写发证机构', trigger: 'blur'},
                    ],
                    givingTime: [
                        {required: true, message: '请选择发证日期', trigger: 'change'},
                    ],
                    startUseTime: [
                        {required: true, message: '请选择有效期起', trigger: 'change'},
                    ],
                    endUseTime: [
                        {required: true, message: '请选择有效期止', trigger: 'change'},
                    ],
                    businessScope: [
                        {required: true, message: '请填写经营范围', trigger: 'blur'},
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
            }
        },
        watch: {
            carInfo: {
                deep: true, //深度监听设置为 true
                handler: function (newV, oldV) {
                    this.ruleForm.carId = this.carInfo.id;
                },
                immediate: true
            },
            'data':{
                handler(value){
                    //判断数据是否为空对象
                    if(value && JSON.stringify(value) != "{}"){
                        const keys = Object.keys(this.ruleForm);
                        for(let key of keys){
                            if(value[key] == null){
                                value[key] = '';
                            }
                            this.ruleForm[key] = value[key];
                        }
                        this.isLate = (value.status == 1)?false:true;
                        if(this.role == 'edit'){
                            //给组件赋值
                            this.initData();
                        }

                    }

                }
            }
        },
        mounted() {
            /*passParam.$on('fileUrls', (url) => {
                this.ruleForm.urlList = url;
            });*/

            //判断数据是否为空对象
            if(this.data && JSON.stringify(this.data) != "{}"){
                const keys = Object.keys(this.ruleForm);
                for(let key of keys){
                    if(this.data[key] == null){
                        this.data[key] = '';
                    }
                    this.ruleForm[key] = this.data[key];
                }
                this.isLate = (this.data.status == 1)?false:true;
                if(this.role == 'edit'){
                    //给组件赋值
                    this.initData();
                }

            }


        },
        methods: {
            //保存
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        batchSaveOrUpdate(this.ruleForm).then(res => {
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



            },
            //重置：清除表单数据
            /*resetForm(){
                for(let i=0;i<this.qualifys.length;i++){
                    this.$refs['form_'+i][0].resetForm('ruleForm');
                }
            }*/
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$refs.upload.clearFiles();//清空已上传的文件列表
            },
            //编辑初始化数据
            initData(){
                //图片处理
                if(this.data.hasOwnProperty('urlList')){
                    let urlList =[];
                    this.data.urlList.map((item)=>{
                        let imgInfo = {
                            url: item,
                            name:item.substring(item.lastIndexOf('/')+1,item.lastIndexOf('.'))+'.jpg',
                        };
                        urlList.push(imgInfo);

                    });
                    this.$refs.upload.filePath = urlList
                }
            },
            //上传图片;图片地址赋值
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
