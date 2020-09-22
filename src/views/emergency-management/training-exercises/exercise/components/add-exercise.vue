<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" ref="ruleForm" :model="form" :inline="true" label-width="170px">
                    <!-------------------------基础信息----------------------------------->
                    <CommonSubtitle title="基础信息" :isBold="true" style="margin-bottom: 10px"></CommonSubtitle>
                    <el-form-item label="演习名称:">
                        <el-input v-model="form.name" placeholder="请输入演习名称"></el-input>
                    </el-form-item>
                    <el-form-item label="组织单位:">
                        <el-input v-model="form.name" placeholder="请输入组织单位"></el-input>
                    </el-form-item>
                    <el-form-item label="演习开始时间:">
                        <el-input v-model="form.name" placeholder="请输入演习开始时间"></el-input>
                    </el-form-item>
                    <el-form-item label="参演机构名称:">
                        <el-input v-model="form.name" placeholder="请输入参演机构名称"></el-input>
                    </el-form-item>
                    <el-form-item label="演习结束时间:">
                        <el-input v-model="form.name" placeholder="请输入演习结束时间"></el-input>
                    </el-form-item>
                    <el-form-item label="演习类型:">
                        <el-radio label="1" border>综合演练</el-radio>
                        <el-radio label="2" border>专项演练</el-radio>
                    </el-form-item>
                    <el-form-item label="专项演习类型细类:" class="text-area">
                        <el-radio label="1" border>自然货物事故</el-radio>
                        <el-radio label="2" border>自然灾害</el-radio>
                        <el-radio label="3" border>人员疏散</el-radio>
                        <el-radio label="4" border>社会安全</el-radio>
                        <el-radio label="5" border>其他</el-radio>
                    </el-form-item>
                    <el-form-item label="演习地点:">
                        <el-input v-model="form.name" placeholder="请输入演习地点"></el-input>
                    </el-form-item>
                    <el-form-item label="演习组织机构:">
                        <el-input v-model="form.name" placeholder="请输入演习组织机构"></el-input>
                    </el-form-item>
                    <el-form-item label="演练流程及内容描述:" class="text-area">
                        <el-input type="textarea" v-model="form.name" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入演练流程及内容描述"></el-input>
                    </el-form-item>
                    <el-form-item label="演练方案内容:" class="text-area">
                        <el-input type="textarea" v-model="form.name" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入演练方案内容"></el-input>
                    </el-form-item>
                  <!--  <el-form-item label="培训资料:">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>-->
                    <el-form-item label="演习资料：" class="text-area">
                        <tinymce v-model="form.name" :height="200" />
                    </el-form-item>
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
    import Tinymce from '@/components/Tinymce'
    export default {
        components: {CommonSubtitle,Tinymce},
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
        width: 238px;
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
