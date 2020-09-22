<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" ref="ruleForm" :model="form" :inline="true" label-width="170px">
                    <CommonSubtitle :title="titleContent" :isBold="true" style="margin-bottom: 10px;text-align: center;"></CommonSubtitle>
                    <el-row>
                        <el-col :span="14">
                            <el-form-item label="演习企业：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="演习类型：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="演习时间：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="演习地点：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="14">
                            <el-form-item label="参演机构：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="参演人数：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="演练流程或内容：">
                                <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 30}"
                                    placeholder="请输入内容"
                                    v-html="form.sideName"
                                    :disabled='disableFlag'>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="培训资料：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    export default {
        components: {CommonSubtitle},
        name: 'SeeDetail',
        props: ['materialsInfo'],
        data(){
            return {
                form:{
                    sideName:''
                },
                disableFlag:true,
                titleContent:null
            }
        },
        created() {
        },
        watch: {
            materialsInfo: {
                deep: true, //深度监听设置为 true
                handler: function (newV, oldV) {
                    console.log(newV,'newV');
                    this.form.sideName = newV.sideName;
                    this.titleContent=newV.startTime+newV.sideName
                },
                immediate: true
            },
        },
        methods:{
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    }
</script>
<style lang="scss" scoped>
    .text-area{
        width: 99%!important;
        /deep/ .el-form-item__content {
            width: calc(100% - 245px)!important;
        }
    }
    /deep/ .common-subtitle-i{
        display: none;
    }
</style>
