<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <CommonSubtitle :title="wayBillNoTitle" :isBold="true" v-show="false"></CommonSubtitle>
            <el-steps :space="200" :active="1" finish-status="success" v-show="false">
                <el-step title="运单发起"></el-step>
                <el-step title="任务分配"></el-step>
                <el-step title="已装车"></el-step>
                <el-step title="运输途中"></el-step>
                <el-step title="已卸车"></el-step>
                <el-step title="运输完成"></el-step>
            </el-steps>
            <div class="info-wrap">
                <CommonSubtitle title="承运信息" :isBold="true"></CommonSubtitle>
                <el-form label-position="right" :rules="rules" ref="ruleForm" :inline="true" label-width="125px" :model="ruleForm">
                    <el-form-item label="车牌号码:" prop="carNo" style="margin-right: 40px">
                        <el-input v-model="ruleForm.carNo"></el-input>
                    </el-form-item>
                    <el-form-item label="道路运输证号:" prop="carTransportLicenseNo" style="margin-right: 40px">
                        <el-input v-model="ruleForm.carTransportLicenseNo"></el-input>
                    </el-form-item>
                    <el-form-item label="挂车车牌号码:" prop="trailerNo" style="margin-right: 40px">
                        <el-input v-model="ruleForm.trailerNo"></el-input>
                    </el-form-item>
                    <el-form-item label="道路运输证号:" prop="trailerTransportLicenseNo" style="margin-right: 40px">
                        <el-input v-model="ruleForm.trailerTransportLicenseNo"></el-input>
                    </el-form-item>
                    <el-form-item label="驾驶员姓名:" prop="driverName" style="margin-right: 40px">
                        <el-input v-model="ruleForm.driverName"></el-input>
                    </el-form-item>
                    <el-form-item label="驾驶员身份证号:" prop="driveridCardNo" style="margin-right: 40px">
                        <el-input v-model="ruleForm.driveridCardNo"></el-input>
                    </el-form-item>
                    <el-form-item label="从业资格证:" prop="driverLicenseNo" style="margin-right: 40px">
                        <el-input v-model="ruleForm.driverLicenseNo"></el-input>
                    </el-form-item>
                    <el-form-item label="驾驶员联系电话:" prop="driverTelephone" style="margin-right: 40px">
                        <el-input v-model="ruleForm.driverTelephone"></el-input>
                    </el-form-item>
                    <el-form-item label="押运员姓名:" prop="escortName" style="margin-right: 40px">
                        <el-input v-model="ruleForm.escortName"></el-input>
                    </el-form-item>
                    <el-form-item label="押运员身份证号:" prop="escoridCardNo" style="margin-right: 40px">
                        <el-input v-model="ruleForm.escoridCardNo"></el-input>
                    </el-form-item>
                    <el-form-item label="从业资格证:" prop="escorLicenseNo" style="margin-right: 40px">
                        <el-input v-model="ruleForm.escorLicenseNo"></el-input>
                    </el-form-item>
                    <el-form-item label="押运员联系电话:" prop="escorTelephone" style="margin-right: 40px">
                        <el-input v-model="ruleForm.escorTelephone"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button @click="showHiddenTask('ruleForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {saveOrUpdate} from '@/api/industry'
    export default {
        components: { CommonSubtitle },
        name: 'task-assignment',
        props: ['editParamsInfo'],
        data() {
            let validateNumber = (rules, value, callback) => {
                if (!value) {
                    callback(new Error('请输入联系人电话'));
                } else{
                    let regPone = null;
                    let mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //最新16手机正则
                    let tel = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
                   // let tel = /^(0[0-9]{2,3}\-)([2-9][0-9]{4,7})+(\-[0-9]{1,4})?$/; //座机
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
            return {
                wayBillNoTitle:"",
                rowData:{},
                ruleForm: {
                    carNo: '',
                    carTransportLicenseNo: '',
                    trailerNo: '',
                    trailerTransportLicenseNo: '',
                    driverName: '',
                    driveridCardNo: '',
                    driverLicenseNo: '',
                    driverTelephone:null,
                    escortName: '',
                    escoridCardNo: '',
                    escorLicenseNo: '',
                    escorTelephone: '',
                },
                rules: {
                    carNo: [
                        { required: true, message: '请输入车牌号码', trigger: 'blur' },
                    ],
                    carTransportLicenseNo: [
                        { required: true, message: '请输入道路运输证号', trigger: 'blur' },
                    ],
                    trailerNo: [
                        { required: true, message: '请输入挂车车牌号码', trigger: 'blur' },
                    ],
                    trailerTransportLicenseNo: [
                        { required: true, message: '请输入道路运输证号', trigger: 'blur' },
                    ],
                    driverName: [
                        { required: true, message: '请输入驾驶员姓名', trigger: 'blur' },
                    ],
                    driveridCardNo: [
                        { required: true, message: '请输入身份证号', trigger: 'blur' },
                    ],
                    driverLicenseNo: [
                        { required: true, message: '请输入从业资格证', trigger: 'blur' },
                    ],
                    driverTelephone: [
                        {required: true, validator:validateNumber, trigger:'blur' },
                    ],
                    escortName: [
                        { required: true, message: '请输入押运员姓名', trigger: 'blur' },
                    ],
                    escoridCardNo: [
                        { required: true, message: '请输入身份证号', trigger: 'blur' },
                    ],
                    escorLicenseNo: [
                        { required: true, message: '请输入从业资格证', trigger: 'blur' },
                    ],
                    escorTelephone: [
                        { required: true, validator:validateNumber, trigger:'blur' },
                    ],
                }
            };
        },
        created() {
            this.wayBillNoTitle="运单编号:"+this.editParamsInfo.wayBillNo
            this.ruleForm=this.editParamsInfo
            console.log(this.ruleForm,"this.ruleForm")
        },
        watch:{
            'editParamsInfo':{
                handler(newValue){
                    this.wayBillNoTitle="运单编号:"+newValue.wayBillNo
                    this.ruleForm=newValue
                }
            }
        },
        methods: {
            //      关闭新增界面并刷新？不刷新
            showHiddenTask: function (formName) {
                let self = this;
                this.$refs[formName].resetFields();
                self.$emit('showHiddenTask', false, false)
            },
            submitForm(formName) {
                let self=this
              /*  this.ruleForm.taskAssignmentTime=self.getNowFormatDate();*/
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.wayBillStatus=2;
                        saveOrUpdate(this.ruleForm).then(res => {
                            this.$message({
                                showClose: true,
                                message: '处理成功！',
                                type: 'success'
                            })
                            self.$emit('showHiddenTask', false, true)
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>
