<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" ref="ruleForm" :model="form" :inline="true" label-width="160px">
                    <!-------------------------基础信息----------------------------------->
                    <CommonSubtitle title="基础信息" :isBold="true" style="margin-bottom: 10px"></CommonSubtitle>
                    <el-form-item label="培训名称:">
                        <el-input v-model="form.name" placeholder="请输入培训名称"></el-input>
                    </el-form-item>
                    <el-form-item label="培训人数(人):">
                        <el-input v-model="form.name" placeholder="请输入培训人数(人)"></el-input>
                    </el-form-item>
                    <el-form-item label="培训开始日期:">
                        <el-input v-model="form.name" placeholder="请输入培训开始日期"></el-input>
                    </el-form-item>
                    <el-form-item label="组织单位:">
                        <el-input v-model="form.name" placeholder="请输入组织单位"></el-input>
                    </el-form-item>
                    <el-form-item label="培训结束日期:">
                        <el-input v-model="form.name" placeholder="请输入培训结束日期"></el-input>
                    </el-form-item>
                    <el-form-item label="培训类别:">
                        <el-radio label="1" border>证书培训</el-radio>
                        <el-radio label="2" border>非证书培训</el-radio>
                    </el-form-item>
                    <el-form-item label="培训地点:">
                        <el-input v-model="form.name" placeholder="请输入培训地点"></el-input>
                    </el-form-item>
                    <el-form-item label="培训机构:">
                        <el-input v-model="form.name" placeholder="请输入培训机构"></el-input>
                    </el-form-item>
                    <el-form-item label="培训学时:">
                        <el-input v-model="form.name" placeholder="请输入培训学时"></el-input>
                    </el-form-item>
                    <el-form-item label="培训内容:" class="text-area">
                        <el-input type="textarea" v-model="form.name" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入培训内容"></el-input>
                    </el-form-item>
                  <!--  <el-form-item label="培训资料:">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>-->
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button  @click="resetForm('ruleForm')">重 置</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">添 加</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    export default {
        components: {CommonSubtitle},
        name: 'AddExercise',
        data(){
            return {
                form:{
                    name:''
                }
            }
        },
        created() {
        },
        watch:{
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
    /deep/ .el-form-item__content {
        width: 265px;
    }
    .text-area{
        width: 99%!important;
        /deep/ .el-form-item__content {
            width: calc(100% - 245px)!important;
        }
    }
    /deep/ .el-radio {
        margin-right: 0;
    }
</style>
