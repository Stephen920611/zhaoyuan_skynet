<template>
    <div>
        <div class="form-container fa-border padding-20">
            <el-form label-position="right" ref="ruleForm" :inline="true" label-width="120px" :model="ruleForm" class="padding-10">
                <el-form-item label="驾驶证编码:" prop="licenceCode">
                    <el-input v-model="ruleForm.licenceCode" :disabled="isDisabled"></el-input>
                </el-form-item>
                <el-form-item label="准驾车型:" prop="allowType">
                    <el-select v-model="ruleForm.allowType" filterable placeholder="请选择车辆类型" :disabled="isDisabled">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发证机关:" prop="licenceAuthor">
                    <el-input v-model="ruleForm.licenceAuthor " :disabled="isDisabled"></el-input>
                </el-form-item>
                <el-form-item label="发证日期:" prop="registTime">
                    <el-date-picker
                        v-model="ruleForm.registTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :disabled="isDisabled"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="初次领证日期:" prop="givingTime">
                    <el-date-picker
                        v-model="ruleForm.givingTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :disabled="isDisabled"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="有效期起:" prop="startUseTime">
                    <el-date-picker
                        v-model="ruleForm.startUseTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :picker-options="timeForm.pickerTimeBeg"
                        :disabled="isDisabled"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="有效期止:" prop="endUseTime">
                    <el-date-picker
                        v-model="ruleForm.endUseTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :picker-options="timeForm.pickerTimeEnd"
                        :disabled="isDisabled"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="证件照片:" class="text-area" prop="url">
                    <el-row>
                        <div class="file-item" v-for="(item,index) in ruleForm.workerDriveLicenseImage" :key="index">
                            <!--<el-image
                                @click="handleImgClick(index)"
                                :src="item.url"
                                height="90" width="130"
                            />
                            <el-image-viewer
                                v-if="showViewer"
                                :on-close="closeViewer"
                                :url-list="viewerImgList"
                            />-->
                            <el-image
                                    @click="handleImgClick(index)"
                                    :src="item.url"
                                    height="90" width="130"
                                    :preview-src-list ="viewerImgList"
                            />
                        </div>
                    </el-row>
                </el-form-item>
            </el-form>
        </div>
        <el-tag :type="!isLate?'success':'danger'" class="tag-wrap">{{!isLate?'正常':'过期'}}</el-tag>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import UploadImage from '../../../enterprise-info/components/upload-image.vue';
    import passParam from '@/utils/ext.passParam'
    import {getByCode,licenseBatchSaveOrUpdate} from '@/api/industry'
    export default {
        name: "driver-license-form",
        props:['isDisabled','workerId','workerName','driverData'],
        components: { ElImageViewer,UploadImage },
        data() {
            return {
                ruleForm:{
                    licenceCode:'',
                    allowType:'',
                    licenceAuthor :'',
                    registTime :'',
                    givingTime :'',
                    startUseTime :'',
                    endUseTime :'',
                    url :'',
                    workerDriveLicenseImage:'',
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
                url:'http://localhost:9527/static/img/qualify.27e02f59.jpg',
                isValid:false,
                options:[],//车辆类型
                viewerImgList:[],//放大图片列表
                isLate:false,  //是否过期,true为过期
            }
        },
        mounted(){
            this.ruleForm.workerId=this.workerId;
            this.ruleForm.workerName=this.workerName;
            passParam.$on('fileUrls',(url)=>{
                this.ruleForm.url = url;
            });
            if(this.driverData && JSON.stringify(this.driverData) != "{}"){
                const keys = Object.keys(this.ruleForm);
                for(let key of keys){
                    this.ruleForm[key] = this.driverData[key];
                }
                this.ruleForm.allowType=this.ruleForm.allowType+''
                this.isLate = (this.driverData.status == 1)?false:true;
            }
        },
        created() {
            /* this.ruleForm=this.driverData;
             this.ruleForm.workerId=this.workerId;
             this.ruleForm.workerName=this.workerName;*/
            this.getCarType("CAR_TYPE");
        },
        watch:{
            'driverData':{
                handler(value){
                    const keys = Object.keys(this.ruleForm);
                    for(let key of keys){
                        this.ruleForm[key] = value[key];
                    }
                    this.ruleForm.allowType=this.ruleForm.allowType+'';
                    this.isLate = (value.status == 1)?false:true;
                }
            }
        },
        methods: {
            // 点击缩略图的方法
            handleImgClick(index) {
                this.showViewer = true;
                let tempImgList = [];//所有图片地址
                this.ruleForm.workerDriveLicenseImage.map(item=>{
                    tempImgList.push(item.url);
                });
                /*let temp = [];
                for (let i = 0; i < index; i++) {
                    //shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
                    temp.push(tempImgList.shift());
                }
                this.viewerImgList = tempImgList.concat(temp);//将当前图片调整成点击缩略图的那张图片*/
                this.viewerImgList = tempImgList;
            },
            onPreview() {
                this.showViewer = true
            },
            // 关闭查看器
            closeViewer() {
                this.showViewer = false
            },
            //获取车辆类型
            getCarType(type) {
                let obj={
                    code: type,
                    enable: 1,
                };
                getByCode(obj).then(res => {
                    this.options=res.data.list;
                    console.log("this.options",this.options)
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        licenseBatchSaveOrUpdate([this.ruleForm]).then(res => {
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
            //重置：清除表单数据
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$refs.upload.clearFiles();//清空已上传的文件列表
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
            top:10px;
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
            /deep/ .el-image {
                width: 130px;
                height: 90px!important;
            }
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
