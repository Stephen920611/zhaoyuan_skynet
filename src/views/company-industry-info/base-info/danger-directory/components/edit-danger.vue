<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" :rules="rules" ref="ruleForm" :inline="true" label-width="125px" :model="ruleForm">
                    <el-form-item label="危化品名称:" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="危化品英文名称:" prop="enName">
                        <el-input v-model="ruleForm.enName"></el-input>
                    </el-form-item>
                    <el-form-item label="联合国编号:" prop="unCode">
                        <el-input v-model="ruleForm.unCode"></el-input>
                    </el-form-item>
                    <el-form-item label="危险号:" prop="dangerCode">
                        <el-input v-model="ruleForm.dangerCode"></el-input>
                    </el-form-item>
                    <el-form-item label="溶解性:">
                        <el-input v-model="ruleForm.solubility"></el-input>
                    </el-form-item>
                    <el-form-item label="熔点(℃):">
                        <el-input v-model="ruleForm.melting"></el-input>
                    </el-form-item>
                    <el-form-item label="沸点(℃):">
                        <el-input v-model="ruleForm.boiling"></el-input>
                    </el-form-item>
                    <el-form-item label="相对密度:">
                        <el-input v-model="ruleForm.relativeDensity"></el-input>
                    </el-form-item>
                    <el-form-item label="闪点(℃):">
                        <el-input v-model="ruleForm.flashing"></el-input>
                    </el-form-item>
                    <el-form-item label="临界温度(℃):">
                        <el-input v-model="ruleForm.criticalTemperature"></el-input>
                    </el-form-item>
                    <el-form-item label="临界压力(MPa):">
                        <el-input v-model="ruleForm.criticalPressure"></el-input>
                    </el-form-item>
                    <el-form-item label="组成与性状:" class="text-area">
                        <div-editable v-model='ruleForm.constitute'></div-editable>
                       <!-- <div
                            class="el-textarea__inner" contenteditable
                            :autosize="{ minRows: 2, maxRows: 4}"
                            type="textarea"
                            placeholder="请输入内容"
                            v-html="ruleForm.constitute">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="运输信息:" class="text-area">
                        <div-editable v-model='ruleForm.transport'></div-editable>
                        <!--<div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.transport">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="储运事项:" class="text-area">
                        <div-editable v-model='ruleForm.storage'></div-editable>
                        <!--<div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.storage">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="健康危害:" class="text-area">
                        <div-editable v-model='ruleForm.health'></div-editable>
                       <!-- <div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.health">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="急救措施:" class="text-area">
                        <div-editable v-model='ruleForm.emergency'></div-editable>
                       <!-- <div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.emergency">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="燃爆特性:" class="text-area">
                        <div-editable v-model='ruleForm.bomb'></div-editable>
                       <!-- <div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.bomb">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="泄漏处理:" class="text-area">
                        <div-editable v-model='ruleForm.leakage'></div-editable>
                       <!-- <div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.leakage">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="防护措施:" class="text-area">
                        <div-editable v-model='ruleForm.shelter'></div-editable>
                        <!--<div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.shelter">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="反应活性:" class="text-area">
                        <div-editable v-model='ruleForm.reactivity'></div-editable>
                       <!-- <div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.reactivity">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="毒性:" class="text-area">
                        <div-editable v-model='ruleForm.virulence'></div-editable>
                        <!--<div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.virulence">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="环境影响:" class="text-area">
                        <div-editable v-model='ruleForm.environment'></div-editable>
                       <!-- <div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.environment">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="废弃处理:" class="text-area">
                        <div-editable v-model='ruleForm.scrap'></div-editable>
                        <!--<div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.scrap">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="法规信息:" class="text-area">
                        <div-editable v-model='ruleForm.law'></div-editable>
                     <!--   <div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.law">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="燃烧性:">
                        <el-input v-model="ruleForm.combustibility"></el-input>
                    </el-form-item>
                    <el-form-item label="引燃温度(℃):">
                        <el-input v-model="ruleForm.ignitionTemperature"></el-input>
                    </el-form-item>
                    <el-form-item label="灭火方法:" class="text-area">
                        <div-editable v-model='ruleForm.outfire'></div-editable>
                       <!-- <div
                            class="el-textarea__inner" contenteditable
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.outfire">
                        </div>-->
                    </el-form-item>
                    <el-form-item label="别名:">
                        <div  class="el-input__inner" contenteditable v-html="ruleForm.alias"></div>
                    </el-form-item>
                    <el-form-item label="危险类别:">
                        <div  class="el-input__inner" contenteditable v-html="ruleForm.levelType"></div>
                    </el-form-item>
                    <el-form-item label="状态:">
                        <div  class="el-input__inner" contenteditable v-html="ruleForm.status"></div>
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
    import DivEditable from './divEditable'
    export default {
        components: {DivEditable, CommonSubtitle},
        name: 'edit-danger',
        props: ['editParamsInfo'],
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
        created() {
            this.ruleForm=this.editParamsInfo;
        },
        watch:{
            'editParamsInfo':{
                handler(newValue){
                    this.ruleForm=newValue
                }
            }
        },
        methods: {
            handleInput($event){
                console.log($event,"@@@@@@@");
                this.ruleForm.solubility= $event.target.innerText;
                console.log(this.ruleForm.solubility,'this.content')
            },
            submitForm(formName) {
                let self=this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        chemicalsSaveOrUpdate(this.ruleForm).then(res => {
                            this.$message({
                                showClose: true,
                                message: '编辑成功！',
                                type: 'success'
                            });
                            self.$emit('showHiddenEdit', false, true);
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
