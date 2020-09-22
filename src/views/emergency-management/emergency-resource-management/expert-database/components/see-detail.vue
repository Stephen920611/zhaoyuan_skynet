<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" ref="ruleForm" :model="form" :inline="true" label-width="150px">
                    <CommonSubtitle title="专家信息" :isBold="true" class="margin-d-10 text-center title"></CommonSubtitle>
                    <CommonSubtitle title="基本资料" :isBold="true" class="margin-d-10"></CommonSubtitle>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓名：">
                                <el-input v-model="form.name" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="专业领域：">
                                <el-input v-model="form.majorName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="性别：">
                                <el-input v-model="form.sexName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="职称/职位：">
                                <el-input v-model="form.job" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="办公电话：">
                                <el-input v-model="form.phone" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话：">
                                <el-input v-model="form.mobile" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="电子邮箱：">
                                <el-input v-model="form.email" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="工作单位：">
                                <el-input v-model="form.company" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="地址：" class="text-area">
                                <el-input type="textarea" v-model="form.address"
                                          :autosize="{ minRows: 2, maxRows: 4}" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <CommonSubtitle title="个人简介" :isBold="true" class="margin-d-10"></CommonSubtitle>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="个人简介：" class="text-area">
                                <el-input type="textarea" v-model="form.individualResume"
                                          :autosize="{ minRows: 2, maxRows: 4}" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<CommonSubtitle title="擅长的技术领域" :isBold="true" class="margin-d-10"></CommonSubtitle>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="擅长的技术领域：" class="text-area">
                                <el-input type="textarea" v-model="form.expertField"
                                          :autosize="{ minRows: 2, maxRows: 4}" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <CommonSubtitle title="应急经验" :isBold="true" class="margin-d-10"></CommonSubtitle>
                    <div v-for="(item,index) in form.experienceList">
                        <el-row :gutter="20" >
                            <el-col :span="12">
                                <el-form-item label="事件发生时间:" prop="startTime">
                                    <el-input v-model="item.startTime" disabled placeholder="请选择事件发生时间"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="事件发生地点:" prop="loc">
                                    <el-input v-model="item.loc" disabled placeholder="请输入事件发生地点"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="经验描述：" prop="experience">
                                    <el-input type="textarea" v-model="item.experience"
                                              :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写经验" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div v-if="form.experienceList==0">
                        <el-row class="padding-20">
                            暂无应急经验！
                        </el-row>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {getServiceExpert} from '@/api/emergency'

    export default {
        components: {CommonSubtitle},
        name: 'ExpertDetail',
        props:['expertId'],
        data(){
            return {
                form:{},
            }
        },
        created() {
            //获取详情信息
            this.getExpertDetail();
        },
        methods:{
            getExpertDetail(){
                getServiceExpert({id:this.expertId}).then(res=>{
                    if(res.code == 1000){
                        this.form = res.data;
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    /deep/ .el-form-item {
       width:calc(100% - 10px);
        margin-right: 0;
        /deep/ .el-form-item__content {
            width: calc(100% - 226px)!important;
        }
    }
    .text-area{
        width: 99%!important;
        /deep/ .el-form-item__content {
            width: calc(100% - 214px)!important;
        }
    }
    .title /deep/ .common-subtitle-i{
        display: none;
    }
</style>
