<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <CommonSubtitle :title="wayBillNoTitle" :isBold="true" v-show="false"></CommonSubtitle>
            <el-steps :space="200" :active="4" finish-status="success" v-show="false">
                <el-step title="运单发起"></el-step>
                <el-step title="任务分配"></el-step>
                <el-step title="已装车"></el-step>
                <el-step title="运输途中"></el-step>
                <el-step title="已卸车"></el-step>
                <el-step title="运输完成"></el-step>
            </el-steps>
            <div class="info-wrap">
                <CommonSubtitle title="卸车信息" :isBold="true"></CommonSubtitle>
                <el-form label-position="right" :rules="rules" ref="ruleForm" :inline="true" label-width="125px" :model="ruleForm">
                    <el-form-item label="进厂时间:" prop="unloadToPortDate" style="margin-right: 40px">
                        <el-date-picker
                            v-model="ruleForm.unloadToPortDate"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="出厂称重:" prop="unloadToPortWeight" style="margin-right: 40px">
                        <el-input v-model="ruleForm.unloadToPortWeight"></el-input>
                    </el-form-item>
                    <el-form-item label="出厂时间:" prop="unloadDepartPortDate" style="margin-right: 40px">
                        <el-date-picker
                            v-model="ruleForm.unloadDepartPortDate"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="出厂称重:" prop="unloadDepartPortWeight" style="margin-right: 40px">
                        <el-input v-model="ruleForm.unloadDepartPortWeight"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button  @click="showHiddenDump">取 消</el-button>
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
        name: 'loading-enterprise',
        props: ['editParamsInfo'],
        data() {
            return {
                wayBillNoTitle:"",
                rowData:{},
                ruleForm: {
                    unloadToPortDate: '',
                    unloadToPortWeight: '',
                    unloadDepartPortDate: '',
                    unloadDepartPortWeight: '',
                },
                rules: {
                    unloadToPortDate: [
                        { required: true, message: '请输入活动名称', trigger: 'blur'},
                    ],
                    unloadToPortWeight: [
                        { required: true, message: '请输入活动名称', trigger: 'blur'},
                    ],
                    unloadDepartPortDate: [
                        { required: true, message: '请输入活动名称', trigger: 'blur'},
                    ],
                    unloadDepartPortWeight: [
                        { required: true, message: '请输入活动名称', trigger: 'blur'},
                    ],
                }
            };
        },
        created() {
            this.wayBillNoTitle="运单编号:"+this.editParamsInfo.wayBillNo
            this.ruleForm=this.editParamsInfo
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
            submitForm(formName) {
                let self=this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.wayBillStatus=5;
                        saveOrUpdate(this.ruleForm).then(res => {
                            this.$message({
                                showClose: true,
                                message: '处理成功！',
                                type: 'success'
                            })
                            self.$emit('showHiddenDump', false, true)
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //      关闭新增界面并刷新？不刷新
            showHiddenDump: function () {
                let self = this;
                self.$emit('showHiddenDump', false, false)
            },
        }
    }
</script>

<style lang="scss" scoped>
</style>
