<template>
    <div class="mask-add-edit-manage demo-form-inline-input" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scroll-bar>
        <el-form label-position="right" ref="ruleForm" :inline="true" label-width="130px" :model="ruleForm"
                 :rules="rules">
            <CommonSubtitle title="基本信息" :isBold="true" style="line-height: 10px;margin-bottom: 15px"></CommonSubtitle>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="专家姓名:" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入专家姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="专家性别:" prop="sex">
                        <el-select v-model="ruleForm.sex" placeholder="请选择性别">
                            <el-option
                                    v-for="item in sexes"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="办公电话:" prop="phone">
                        <el-input v-model="ruleForm.phone" placeholder="请输入办公电话"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系电话:" prop="mobile">
                        <el-input v-model="ruleForm.mobile" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="专业领域方向:" prop="major">
                        <el-select v-model="ruleForm.major" placeholder="请选择专业领域方向">
                            <el-option
                                    v-for="item in expertMajors"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="职称/职位:" prop="job">
                        <el-input v-model="ruleForm.job" placeholder="请输入职称/职位"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="工作单位:" prop="company">
                        <el-input v-model="ruleForm.company" placeholder="请输入工作单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="地址:" prop="address">
                        <el-input v-model="ruleForm.address" placeholder="请输入地址"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="电子邮箱:" prop="email">
                        <el-input v-model="ruleForm.email" placeholder="请输入电子邮箱"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="个人简介：" prop="individualResume">
                        <el-input type="textarea" v-model="ruleForm.individualResume"
                                  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写个人简介"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <CommonSubtitle title="应急经验" :isBold="true" style="line-height: 10px;margin-bottom: 15px"></CommonSubtitle>
            <div class="form-add-container" v-for="(item,index) in experienceList" :key="index">
                <div class="add-container">
                    <el-row :gutter="20" >
                        <el-col :span="12">
                            <el-form-item label="事件发生时间:" prop="startTime">
                                <el-date-picker
                                        v-model="item.startTime"
                                        type="datetime"
                                        value-format="yyyy-MM-dd hh:mm:ss"
                                        placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="事件发生地点:" prop="loc">
                                <el-input v-model="item.loc" :disabled="isDisabled" placeholder="请输入事件发生地点"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="经验描述：" prop="experience">
                                <el-input type="textarea" v-model="item.experience"
                                          :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写经验"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="add-icon">
                    <i class="el-icon-circle-plus-outline" style="cursor: pointer;" @click="addExperience" v-if="index == 0"></i>
                    <i class="el-icon-remove-outline" style="cursor: pointer;" @click="reduceExperience" v-else></i>
                </div>
            </div>
            <el-form-item class="margin-td-10" style="text-align:center; width: 100%;">
                <el-button @click="resetForm('ruleForm')">重 置</el-button>
                <el-button type='primary' @click="submitForm('ruleForm')">保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {getByCode} from '@/api/industry'
    import {saveServiceExpert} from '@/api/emergency'

    export default {
        name: "AddMaterialReserve",
        components: {CommonSubtitle},
        props: [],
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
            let validateTelephone = (rule, value, callback) => {
                if (value != '') {
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
                }else{
                    callback();
                }
            };
            return {
                ruleForm: {
                    name: '',
                    sex: '',
                    sexName: '',
                    phone: '',
                    mobile: '',
                    email: '',
                    major: null,
                    job: null,
                    individualResume:'',
                    experienceList:[],
                    company:'',
                    address:'',
                    insertId:'',
                },
                experienceList:[
                    {
                        startTime:'',
                        loc:'',
                        experience:''
                    }
                ],
                rules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'change'},
                    ],
                    mobile: [
                        {required: true, validator:validateNumber, trigger: 'blur'},
                    ],
                    job: [
                        {required: true, message: '请输入职称', trigger: 'blur'},
                    ],
                    major: [
                        {required: true, message: '请选择专业领域方向', trigger: 'change'},
                    ],
                    company: [
                        {required: true, message: '请输入工作单位', trigger: 'blur'},
                    ],
                    address: [
                        {required: true, message: '请输入地址', trigger: 'blur'},
                    ],
                    phone: [
                        { validator: validateTelephone, trigger: 'blur' },
                    ],
                },
                rowOtherData: [],//增添条件数组
                rowOtherDataTotal: 1,
                isDisabled:false,
                sexes:[],
                expertMajors:[],
                userInfo:null,
            }
        },
        created() {
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            this.dictionary();
        },
        mounted() {
        },
        methods: {
            dictionary(){
                //性别
                getByCode({code: 'SEX', enable: 1}).then(res=>{
                    this.sexes = [];
                    res.data.list.map(item=>{
                        this.sexes.push(item);
                    })
                });
                //专业领域
                getByCode({code: 'EXPERT_MAJOR', enable: 1}).then(res=>{
                    this.expertMajors = [];
                    res.data.list.map(item=>{
                        this.expertMajors.push(item);
                    })
                })
            },
            //条件检索 - 增加一行
            addExperience(e) {
                this.experienceList.push({
                    startTime:'',
                    loc:'',
                    experience:''
                })

            },
            //条件检索 - 减少一行
            reduceExperience(e,index) {
                //如果是第一行，带加号的
                this.experienceList.splice(index,1);
            },
            //保存基本信息
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.experienceList = this.experienceList;
                        this.sexes.map(item=>{
                            if(item.value == this.ruleForm.sex.toString()){
                                this.ruleForm.sexName = item.name;
                            }
                        })
                        this.ruleForm.insertId = this.userInfo.id;
                        saveServiceExpert(this.ruleForm).then(res=>{
                            this.$message({message:'添加成功！',type:'success'});
                            this.$emit('close',false);
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs['ruleForm'].resetFields();
                 //重置添加的行的内容
                this.rowOtherData=[];
                this.rowOtherDataTotal=1;
            },
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .demo-form-inline-input {
        /deep/ .el-input,.el-select {
            width: 100% !important;
        }
        /deep/ .el-form-item{
            width: calc(100% - 10px);
            margin-right: 0;
        }
        /deep/ .el-form-item__content{
            width: calc(100% - 200px);
        }

        /deep/ .el-textarea{
            width: 100%;
        }
    }
    .form-add-container{
        display: flex;
        justify-content: space-between;
        /deep/ .el-form-item__content{
            width: calc(100% - 130px);
        }
        .add-container{
            width: 94%;
        }
        .add-icon{
            width: 50px;
            text-align: center;
            line-height:90px
        }
    }
  /*  .form-add-container{
        display: flex;
        justify-content: space-between;
        /deep/ .el-form-item__content{
            width: calc(100% - 130px);
        }
        .add-icon{
            text-align: center;
            line-height:36px
        }
    }*/
</style>
