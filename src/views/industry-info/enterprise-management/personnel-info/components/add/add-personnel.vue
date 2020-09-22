<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <div class="add-form">
                    <el-form label-position="right" :rules="rules" ref="ruleForm" :inline="true" label-width="85px" :model="ruleForm">
                        <el-form-item label="姓名:" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="所属企业:" prop="companyName">
                            <el-input v-model="ruleForm.companyName" :disabled=true></el-input>
                        </el-form-item>
                        <el-form-item label="性别:" prop="gender">
                            <el-select v-model="ruleForm.gender" placeholder="请选择性别">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="身份证号:" prop="personNum">
                            <el-input v-model="ruleForm.personNum"></el-input>
                        </el-form-item>
                        <el-form-item label="资格类型:" prop="type">
                            <el-select v-model="ruleForm.type" placeholder="请选择资格类型" @change="selectChange">
                                <el-option
                                    v-for="item in optionsType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="联系方式:" prop="phoneNum">
                            <el-input v-model="ruleForm.phoneNum"></el-input>
                        </el-form-item>
                        <el-form-item label="备注:" prop="remarks" class="text-area">
                            <el-input
                                type="textarea"
                                v-model="ruleForm.remarks"
                                :autosize="{ minRows: 2, maxRows: 4}">
                            </el-input>
                        </el-form-item>
                        <el-form-item class="margin-td-10" style="text-align: center; width: 100%;">
                            <el-button @click="resetForm('ruleForm')">重 置</el-button>
                            <el-button type='primary' @click="submitForm('ruleForm')">添 加</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="add-img">
                    <upload-image ref="upload" @setFileUrl="getFileUrl"></upload-image>
                </div>
                <div class="info-wrap padding-lr-20" style="clear: both;">
                    <el-tabs v-model="activeTab" type="border-card">
                        <el-tab-pane label="驾驶证信息" name="1" v-if="ruleForm.type==1">
                            <driver-license :isDisabled="false" :workerId="workerId" :workerName="workerName"></driver-license>
                        </el-tab-pane>
                        <el-tab-pane label="押运证信息" name="2" v-else>
                            <escort-certificate :isDisabled="false" :workerId="workerId" :workerName="workerName"></escort-certificate>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {WorkerSaveOrUpdate} from '@/api/industry'
    import elDragDialog from '@/directive/el-drag-dialog'
    import DriverLicense from "./driver-license";
    import EscortCertificate from "./escort-certificate";
    import UploadImage from '../upload-image'
    import {mapGetters} from 'vuex'
    export default {
        components: {DriverLicense, CommonSubtitle,UploadImage,EscortCertificate},
        name: 'AddCompany',
        directives: {elDragDialog},
        data() {
            let validateNumber = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入联系人电话'));
                } else{
                    let regPone = null;
                    let mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //最新16手机正则
                    let tel = /^(0[0-9]{2,3}\-)([2-9][0-9]{4,7})+(\-[0-9]{1,4})?$/; //座机
                    if (value.charAt(0) == 0) {    // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
                        regPone = tel;
                    } else {
                        regPone = mobile;
                    }
                    if (!regPone.test(value) && regPone==tel) {
                        return callback(
                            new Error("格式错误(座机'区号-座机号码')")
                        );
                    }else if (!regPone.test(value) && regPone==mobile) {
                        return callback(
                            new Error("错误输入，请重新输入")
                        );
                    } else{
                        callback();
                    }
                }
            };
            let idCardPatter= /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
            let idCard=(rule, value, callback)=> {
                if(!value){
                    callback(new Error('请输入身份证号码'))
                }else if (value && (!idCardPatter.test(value))) {
                    callback(new Error('身份证号码不符合规范'))
                } else {
                    callback()
                }
            };
            return {
                ruleForm: {
                    name: '',
                    companyId:'',
                    companyName: '',
                    gender: '',
                    personNum:'',
                    type:'1',
                    phoneNum:'',
                    remarks:'',
                    url :'',
                },
                rules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                    companyName: [
                        { required: true, message: '请输入企业名称', trigger: 'blur' }
                    ],
                    gender: [
                        { required: true, message: '请输入性别', trigger: 'change' },
                    ],
                    personNum: [
                        { required: true, validator:idCard, trigger: 'blur' },
                    ],
                    type: [
                        { required: true, message: '请输入选择类型', trigger: 'change' },
                    ],
                    phoneNum: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                },
                activeTab:'1',
                options:[{
                    value: '1',
                    label: '男'
                },{
                    value: '2',
                    label: '女'
                }],
                optionsType:[{
                    value: '1',
                    label: '驾驶员 '
                },{
                    value: '2',
                    label: '押运员'
                }],
                workerId:null,  //保存企业基本信息时，产生的workerId
                workerName:null,  //保存企业基本信息时，产生的workerName
            };
        },
        computed: {
            ...mapGetters([
                'personnelCompanyDetail',
            ])
        },
        created(){
            this.ruleForm.companyId = this.personnelCompanyDetail.id;
            this.ruleForm.companyName = this.personnelCompanyDetail.text;
        },
        methods: {
            selectChange(value){
                this.activeTab=value;
            },
            getFileUrl(url){
                this.ruleForm.url = url;
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
                            this.workerName = this.ruleForm.name;
                            this.workerId = res.data;
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
                //清除上传的图片
                this.$refs.upload.clearFiles();//清空已上传的文件列表
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
        /deep/ .el-upload-list--picture .el-upload-list__item {
            height: 180px;
            position: absolute;
            top: -10px;
            width: 260px;
            display: -webkit-box;
            display: -moz-box;
            -webkit-box-align:center;
            -moz-box-align:center;
            box-align:center;
            -webkit-box-pack:center;
            -moz-box-pack:center;
            box-pack:center;
        }
        /deep/ .el-upload-list--picture .el-upload-list__item-thumbnail {
            width: 150px;
            height: 160px;
        }
        /deep/ .el-upload-list__item-name {
            line-height: 70px;
            margin-top: 0;
            display: none;
        }
    }
    /deep/ .el-upload-dragger {
        width: 255px;
        height: 170px;
    }
</style>
