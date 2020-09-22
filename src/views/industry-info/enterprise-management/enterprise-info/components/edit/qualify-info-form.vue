<template>
    <div>
        <div class="form-container padding-t-20">
            <el-form label-position="right"  ref="ruleForm" :inline="true" label-width="150px" :model="ruleForm" :rules="rules">
                <!--<el-form-item label="许可证字:" prop="companyName">
                    <el-input v-model="item.xkz"></el-input>
                </el-form-item>-->
                <el-form-item label="许可证号:" prop="licenceCode">
                    <el-input v-model="ruleForm.licenceCode" :disabled="isLate"></el-input>
                </el-form-item>
                <el-form-item label="发证机关:" prop="licenceAuthor">
                    <el-input v-model="ruleForm.licenceAuthor" :disabled="isLate"></el-input>
                </el-form-item>
                <el-form-item label="发证日期:" prop="givingTime">
                    <el-date-picker
                            v-model="ruleForm.givingTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            :disabled="isLate"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="有效期起:" prop="startUseTime">
                    <el-date-picker
                            v-model="ruleForm.startUseTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            :picker-options="timeForm.pickerTimeBeg"
                            :disabled="isLate"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="有效期止:" prop="endUseTime">
                    <el-date-picker
                            v-model="ruleForm.endUseTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            :picker-options="timeForm.pickerTimeEnd"
                            :disabled="isLate"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="经营范围:" prop="businessScope" class="text-area">
                    <el-input
                            type="textarea"
                            v-model="ruleForm.businessScope"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            :disabled="isLate"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="证件照片:" prop="url" class="text-area">
                    <el-row>
                        <div class="file-item upload-item">
                            <upload-image ref="upload" @setFileUrl="getFileUrl" :isLate="isLate"></upload-image>
                        </div>
                    </el-row>
                </el-form-item>
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
    import {batchSaveOrUpdate} from '@/api/industry'
    export default {
        name: "qualifyInfoForm",
        props:['companyId','companyName','data','role'],
        components: { ElImageViewer,UploadImage },
        data() {
            return {
                ruleForm:{
                    id:null,
                    companyId:this.companyId,
                    companyName:this.companyName,
                    licenceCode :'',
                    licenceAuthor :'',
                    givingTime :'',
                    startUseTime :'',
                    endUseTime :'',
                    businessScope :'',
                    url :'',
                },
                isLate:false,  //是否过期
                rules:{
                    licenceCode: [
                        { required: true, message: '请填写许可证号', trigger: 'blur' },
                    ],
                    licenceAuthor: [
                        { required: true, message: '请填写发证机关', trigger: 'blur' },
                    ],
                    givingTime: [
                        { required: true, message: '请选择发证日期', trigger: 'change' },
                    ],
                    startUseTime: [
                        { required: true, message: '请选择有效期起', trigger: 'change' },
                    ],
                    endUseTime: [
                        { required: true, message: '请选择有效期止', trigger: 'change' },
                    ],
                    businessScope: [
                        { required: true, message: '请填写经营范围', trigger: 'blur' },
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
            }
        },
        watch:{
            'data':{
                handler(value){
                    const keys = Object.keys(this.ruleForm);
                    for(let key of keys){
                        if(value[key] == null){
                            value[key] = '';
                        }
                        this.ruleForm[key] = value[key];
                    }
                    if(this.role == 'edit'){
                        value.companyLicenceImageList.map(item=>{
                            item.name=item.url.substring(item.url.lastIndexOf('/')+1,item.url.lastIndexOf('.'))+'.jpg';
                        })
                        this.$refs.upload.filePath = value.companyLicenceImageList
                        this.isLate = (value.status == 1)?false:true;
                    }else{
                        this.$refs.upload.filePath = [];
                    }

                }
            },
        },

        mounted(){
            this.ruleForm.companyId = this.companyId;
            this.ruleForm.companyName = this.companyName;
           /* passParam.$on('fileUrls',(url)=>{
                console.log("###",url)
                this.ruleForm.url = url;
                passParam.$off('fileUrls')
            });*/

            if(this.data && JSON.stringify(this.data) != "{}"){
                const keys = Object.keys(this.ruleForm);
                for(let key of keys){
                    if(this.data[key] == null){
                        this.data[key] = '';
                    }
                    this.ruleForm[key] = this.data[key];
                }
                if(this.role == 'edit'){
                    this.data.companyLicenceImageList.map(item=>{
                        item.name=item.url.substring(item.url.lastIndexOf('/')+1,item.url.lastIndexOf('.'))+'.jpg';
                    })
                    this.$refs.upload.filePath = this.data.companyLicenceImageList
                    this.isLate = (this.data.status == 1)?false:true;
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.role == 'add' || !this.ruleForm.id){
                            delete this.ruleForm.id
                        }
                        this.ruleForm.companyId = this.companyId;
                        this.ruleForm.companyName = this.companyName;
                        batchSaveOrUpdate([this.ruleForm]).then(res => {
                            this.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                        }).catch((err) => {

                        });
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
            width: 100%;
            /deep/ .el-form-item__content{
                width: calc(100% - 150px);
            }
        }
        /deep/ .el-select,.el-date-editor {
            display: inline-block;
            position: relative;
            width: 185px;
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

</style>
