<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" :rules="rules" ref="ruleForm" :inline="true" label-width="125px" :model="ruleForm">
                    <el-form-item label="危化品名称:" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="危化品英文名称:" prop="enName">
                        <el-input v-model="ruleForm.enName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="联合国编号:" prop="unCode">
                        <el-input v-model="ruleForm.unCode" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="危险号:" prop="dangerCode">
                        <el-input v-model="ruleForm.dangerCode" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="溶解性:">
                        <el-input v-model="ruleForm.solubility" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="熔点(℃):">
                        <el-input v-model="ruleForm.melting" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="沸点(℃):">
                        <el-input v-model="ruleForm.boiling" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="相对密度:">
                        <el-input v-model="ruleForm.relativeDensity" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="闪点(℃):">
                        <el-input v-model="ruleForm.flashing" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="临界温度(℃):">
                        <el-input v-model="ruleForm.criticalTemperature" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="临界压力(MPa):">
                        <el-input v-model="ruleForm.criticalPressure" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="组成与性状:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.constitute">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="运输信息:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.transport">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="储运事项:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.storage">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="健康危害:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.health">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="急救措施:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.emergency">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="燃爆特性:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.bomb">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="泄漏处理:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.leakage">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="防护措施:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.shelter">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="反应活性:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.reactivity">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="毒性:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.virulence">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="环境影响:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.environment">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="废弃处理:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.scrap">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="法规信息:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.law">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="燃烧性:">
                        <el-input v-model="ruleForm.combustibility" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="引燃温度(℃):">
                        <el-input v-model="ruleForm.ignitionTemperature" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="灭火方法:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.outfire">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="别名:">
                        <el-input v-model="ruleForm.alias" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="危险类别:">
                        <el-input v-model="ruleForm.levelType" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="状态:">
                        <el-input v-model="ruleForm.status" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button type='primary' @click="submitForm('ruleForm')">确 定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {chemicalsSaveOrUpdate} from '@/api/industry'
    export default {
        components: {CommonSubtitle},
        name: 'add-waybill',
        data() {
            return {
                ruleForm: {
                    name:'',
                    enName:'',
                    unCode:'',
                    dangerCode:'',
                    solubility:'',
                    melting:'',
                    boiling:'',
                    relativeDensity:'',
                    flashing:'',
                    criticalTemperature:'',
                    criticalPressure:'',
                    constitute:'',
                    transport:'',
                    storage:'',
                    health:'',
                    emergency:'',
                    bomb:'',
                    leakage:'',
                    shelter:'',
                    reactivity:'',
                    virulence:'',
                    environment:'',
                    scrap:'',
                    law:'',
                    combustibility:'',
                    ignitionTemperature:'',
                    outfire:'',
                    alias:'',
                    levelType:'',
                    status:'',
                },
                rules: {
                    name: [
                        { required: true, message: '请输入危化品名称', trigger: 'blur' }
                    ],
                    enName: [
                        { required: true, message: '请输入危化品英文名称', trigger: 'blur' },
                    ],
                    unCode: [
                        { required: true, message: '请输入联合国编号', trigger: 'blur' },
                    ],
                    dangerCode: [
                        { required: true, message: '请输入危险号', trigger: 'blur' },
                    ],
                },
            };
        },
        methods: {
            submitForm(formName) {
                let self=this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        chemicalsSaveOrUpdate(this.ruleForm).then(res => {
                            this.$message({
                                showClose: true,
                                message: '新增成功！',
                                type: 'success'
                            });
                            self.$emit('showHiddenAdd', false, true);
                            this.$refs[formName].resetFields();
                        }).catch((err) => {
                            // 公共方法有，所以不需要加提示了
                            // this.$message.error(err.msg)
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

<style lang="less" scoped>
    .el-form--inline .el-form-item {
        margin-left: 3%;
        margin-right: 4%;
    }
    /deep/ .el-form-item--medium .el-form-item__content {
        width: 260px;
    }
    .text-area{
        width: 100%;
        /deep/ el-form-item__content {
            width: calc(100% - 185px)!important;
        }
    }
    /deep/ .text-area .el-form-item__content {
        width: calc(100% - 185px)!important;
    }

</style>
