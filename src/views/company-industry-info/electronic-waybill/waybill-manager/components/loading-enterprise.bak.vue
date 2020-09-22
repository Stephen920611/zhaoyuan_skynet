<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <CommonSubtitle :title="wayBillNoTitle" :isBold="true" v-show="false"></CommonSubtitle>
            <el-steps :space="200" :active="2" finish-status="success" v-show="false">
                <el-step title="运单发起"></el-step>
                <el-step title="任务分配"></el-step>
                <el-step title="已装车"></el-step>
                <el-step title="运输途中"></el-step>
                <el-step title="已卸车"></el-step>
                <el-step title="运输完成"></el-step>
            </el-steps>
            <div class="info-wrap">
                <CommonSubtitle title="装车信息" :isBold="true"></CommonSubtitle>
                <el-form label-position="right" :rules="rules" ref="ruleForm" :inline="true" label-width="125px" :model="ruleForm">
                    <el-form-item label="进厂时间:" prop="loadToPortDate" style="margin-right: 40px">
                        <el-date-picker
                            v-model="ruleForm.loadToPortDate"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="进厂称重:" prop="loadToPortWeight" style="margin-right: 40px">
                        <el-input v-model="ruleForm.loadToPortWeight"></el-input>
                    </el-form-item>
                    <el-form-item label="联合国编号:" prop="cargoUniCode" style="margin-right: 40px">
                        <el-input v-model="ruleForm.cargoUniCode"></el-input>
                    </el-form-item>
                    <el-form-item label="危险货物名称:" prop="cargoName" style="margin-right: 40px">
                        <el-input v-model="ruleForm.cargoName"></el-input>
                    </el-form-item>
                    <el-form-item label="类/项别:" prop="cargoType" style="margin-right: 40px">
                        <el-input v-model="ruleForm.cargoType"></el-input>
                    </el-form-item>
                    <el-form-item label="包装类别:" prop="cargoPackingType" style="margin-right: 40px">
                        <el-input v-model="ruleForm.cargoPackingType"></el-input>
                    </el-form-item>
                    <el-form-item label="规格:" prop="cargoSpecs" style="margin-right: 40px">
                        <el-input v-model="ruleForm.cargoSpecs"></el-input>
                    </el-form-item>
                    <el-form-item label="数量(吨/立方):" prop="cargoNum" style="margin-right: 40px">
                        <el-input v-model="ruleForm.cargoNum"></el-input>
                    </el-form-item>
                    <el-form-item label="危险货物特性:" prop="dangerFeatures" class="text-area">
                        <el-input type="textarea" v-model="ruleForm.dangerFeatures" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="急救措施:" prop="aidMeasures" class="text-area">
                        <el-input type="textarea" v-model="ruleForm.aidMeasures" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="消防措施:" prop="fireFightingMeasures" class="text-area">
                        <el-input type="textarea" v-model="ruleForm.fireFightingMeasures" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="泄露应急措施:" prop="leakageMeasures" class="text-area">
                        <el-input type="textarea" v-model="ruleForm.leakageMeasures" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="次生环境污染处理措施:" prop="pollutionMeasures" class="text-area">
                        <el-input type="textarea" v-model="ruleForm.pollutionMeasures" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="运输注意事项:" prop="transportPrecautions" class="text-area">
                        <el-input type="textarea" v-model="ruleForm.transportPrecautions" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="出厂时间:" prop="loadDepartPortDate" style="margin-right: 40px">
                        <el-date-picker
                            v-model="ruleForm.loadDepartPortDate"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="出厂称重:" prop="loadDepartPortWeight" style="margin-right: 40px">
                        <el-input v-model="ruleForm.loadDepartPortWeight"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button  @click="showHiddenLoading">取 消</el-button>
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
                    loadToPortDate: '',
                    loadToPortWeight: '',
                    cargoUniCode: '',
                    cargoName: '',
                    cargoType: '',
                    cargoPackingType: '',
                    cargoSpecs: '',
                    cargoNum: '',
                    dangerFeatures: '',
                    aidMeasures: '',
                    fireFightingMeasures: '',
                    leakageMeasures: '',
                    pollutionMeasures: '',
                    transportPrecautions: '',
                    loadDepartPortDate: '',
                    loadDepartPortWeight: '',
                },
                rules: {
                    loadToPortDate: [
                        { required: true, message: '请选择进厂时间', trigger: 'blur'},
                    ],
                    loadToPortWeight: [
                        { required: true, message: '请输入进厂称重', trigger: 'blur'},
                    ],
                    cargoUniCode: [
                        { required: true, message: '请输入联合国编码', trigger: 'blur'},
                    ],
                    cargoName: [
                        { required: true, message: '请输入危险货物名称', trigger: 'blur'},
                    ],
                    cargoType: [
                        { required: true, message: '请输入类/项别', trigger: 'blur'},
                    ],
                    cargoPackingType: [
                        { required: true, message: '请输入包装类别', trigger: 'blur'},
                    ],
                    cargoSpecs: [
                        { required: true, message: '请输入规格', trigger: 'blur'},
                    ],
                    cargoNum: [
                        { required: true, message: '请输入数量(吨/立方)', trigger: 'blur'},
                    ],
                    dangerFeatures: [
                        { required: false, message: '请输入危险货物特征', trigger: 'blur'},
                    ],
                    aidMeasures: [
                        { required: true, message: '请输入急救措施', trigger: 'blur'},
                    ],
                    fireFightingMeasures: [
                        { required: false, message: '请输入消防措施', trigger: 'blur'},
                    ],
                    leakageMeasures: [
                        { required: false, message: '请输入泄露应急措施', trigger: 'blur'},
                    ],
                    pollutionMeasures: [
                        { required: false, message: '请输入次生环境污染措施', trigger: 'blur'},
                    ],
                    transportPrecautions: [
                        { required: false, message: '请输入运输注意事项', trigger: 'blur'},
                    ],
                    loadDepartPortDate: [
                        { required: true, message: '请选择出产时间', trigger: 'blur'},
                    ],
                    loadDepartPortWeight: [
                        { required: true, message: '请输入出厂称重', trigger: 'blur'},
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
                        this.ruleForm.wayBillStatus=3;
                        saveOrUpdate(this.ruleForm).then(res => {
                            this.$message({
                                showClose: true,
                                message: '处理成功！',
                                type: 'success'
                            })
                            self.$emit('showHiddenLoading', false, true)
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //      关闭新增界面并刷新？不刷新
            showHiddenLoading: function () {
                let self = this;
                self.$emit('showHiddenLoading', false, false)
            },
        }
    }
</script>

<style lang="scss" scoped>
    .text-area {
        margin-right: 40px;
        width: 100%!important;
        /deep/ .el-form-item__content {
            width: 80%!important;
        }
    }
    /deep/ .el-form-item {
        width: 325px;
    }
    /deep/.el-input,.el-input__inner {
        width: 200px;
    }
</style>
