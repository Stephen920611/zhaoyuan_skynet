<template>
    <div>
        <div class="form-container padding-20">
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
                                <div class="file-item" v-if="ruleForm.urlList.length > 0" v-for="(item,index) in ruleForm.urlList">
                                   <!-- <el-image
                                        @click="handleImgClick(index)"
                                        :src="item"
                                        height="90" width="130"
                                    />
                                    <el-image-viewer
                                        v-if="showViewer"
                                        :on-close="closeViewer"
                                        :url-list="viewerImgList"
                                    />-->
                                    <el-image
                                            :src="item"
                                            height="90" width="130"
                                            :preview-src-list ="ruleForm.urlList"
                                    />
                                </div>
                                <div v-if="ruleForm.urlList.length === 0" class="no-data" style="width: 100%;height: 30px">
                                    <div>暂无照片</div>
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
            </el-form>
            <el-tag :type="!isLate?'success':'danger'" class="tag-wrap">{{!isLate==1?'正常':'过期'}}</el-tag>
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
        props: ['isDisabled', 'carInfo','data','role'],
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
                },
                isLate:false,  //是否过期,true为过期
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
                viewerImgList:[],
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
//                    this.ruleForm.carId = 323;
//                    this.ruleForm.companyId = this.carInfo.companyId;
//                    this.ruleForm.companyName = this.carInfo.companyName;
                },
                immediate: true

            },
            'data':{
                handler(value){
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
        },
        mounted() {
           /* passParam.$on('fileUrls', (url) => {
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
            }
        },
        methods: {
            // 点击缩略图的方法
            handleImgClick(index) {
                this.showViewer = true;
                let tempImgList = [...this.ruleForm.urlList];//所有图片地址
                let temp = [];
                for (let i = 0; i < index; i++) {
                    //shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
                    temp.push(tempImgList.shift());
                }
                this.viewerImgList = tempImgList.concat(temp);//将当前图片调整成点击缩略图的那张图片
            },
            onPreview() {
                this.showViewer = true
            },
            // 关闭查看器
            closeViewer() {
                this.showViewer = false
            },
            //上传图片
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
            /deep/ .el-image {
                width: 130px;
                height: 90px;
            }
        }
        /*上传附件的样式*/
        .upload-item {
            width: 98%;
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
