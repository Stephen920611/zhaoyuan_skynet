<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" ref="ruleForm" :model="form" :inline="true" label-width="150px">
                    <CommonSubtitle title="生产安全事故综合应急预案" :isBold="true" style="margin-bottom: 10px;text-align: center;"></CommonSubtitle>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="培训企业：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="培训时间：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="培训地点：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="培训机构：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="培训机构：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="培训类别：">
                                <el-input v-html="form.sideName" :disabled='disableFlag'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="培训内容：">
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
        name: 'AddExercise',
        props: ['materialsInfo'],
        data(){
            return {
                form:{
                    sideName:''
                },
                disableFlag:true
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
            width: calc(100% - 214px)!important;
        }
    }
    /deep/ .common-subtitle-i{
       display: none;
    }
</style>
