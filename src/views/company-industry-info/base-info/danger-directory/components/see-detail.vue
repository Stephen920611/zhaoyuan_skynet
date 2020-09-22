<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" ref="ruleForm" :inline="true" label-width="125px" :model="ruleForm">
                    <el-form-item label="危化品名称:"  style="margin-right: 40px">
                        <el-input v-html="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="危化品英文名称:">
                        <el-input v-html="ruleForm.enName"></el-input>
                    </el-form-item>
                    <el-form-item label="联合国编号:">
                        <el-input v-html="ruleForm.unCode"></el-input>
                    </el-form-item>
                    <el-form-item label="危险号:">
                        <el-input v-html="ruleForm.dangerCode"></el-input>
                    </el-form-item>
                    <el-form-item label="溶解性:">
                        <el-input v-html="ruleForm.solubility"></el-input>
                    </el-form-item>
                    <el-form-item label="熔点(℃):">
                        <el-input v-html="ruleForm.melting"></el-input>
                    </el-form-item>
                    <el-form-item label="沸点(℃):">
                        <el-input v-html="ruleForm.boiling"></el-input>
                    </el-form-item>
                    <el-form-item label="相对密度:">
                        <el-input v-html="ruleForm.relativeDensity"></el-input>
                    </el-form-item>
                    <el-form-item label="闪点(℃):">
                        <el-input v-html="ruleForm.flashing"></el-input>
                    </el-form-item>
                    <el-form-item label="临界温度(℃):">
                        <el-input v-html="ruleForm.criticalTemperature"></el-input>
                    </el-form-item>
                    <el-form-item label="临界压力(MPa):">
                        <el-input v-html="ruleForm.criticalPressure"></el-input>
                    </el-form-item>
                    <el-form-item label="组成与性状:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.constitute">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="运输信息:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.transport">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="储运事项:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.storage">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="健康危害:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.health">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="急救措施:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.emergency">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="燃爆特性:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.bomb">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="泄漏处理:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.leakage">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="防护措施:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.shelter">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="反应活性:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.reactivity">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="毒性:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.virulence">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="环境影响:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.environment">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="废弃处理:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.scrap">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="法规信息:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.law">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="燃烧性:">
                        <el-input v-html="ruleForm.combustibility"></el-input>
                    </el-form-item>
                    <el-form-item label="引燃温度(℃):">
                        <el-input v-html="ruleForm.ignitionTemperature"></el-input>
                    </el-form-item>
                    <el-form-item label="灭火方法:" class="text-area">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-html="ruleForm.outfire">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="更新时间:">
                        <el-input v-html="ruleForm.updateTime"></el-input>
                    </el-form-item>
                    <el-form-item label="创建日期:">
                        <el-input v-html="ruleForm.createTime"></el-input>
                    </el-form-item>
                    <el-form-item label="别名:">
                        <el-input v-html="ruleForm.alias"></el-input>
                    </el-form-item>
                    <el-form-item label="危险类别:">
                        <el-input v-html="ruleForm.levelType"></el-input>
                    </el-form-item>
                    <el-form-item label="状态:">
                        <el-input v-html="ruleForm.status"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    export default {
        components: {CommonSubtitle},
        name: 'add-waybill',
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
                    updateTime:'',
                    createTime:'',
                },
            };
        },
        created() {
            this.ruleForm=this.editParamsInfo
        },
        watch:{
            'editParamsInfo':{
                handler(newValue){
                    this.ruleForm=newValue
                }
            }
        },
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
