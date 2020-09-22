<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 10px;" class="input-top">
                <el-form v-loading="loading" :model="form" :rules="rules" ref="form" class="plan-form-inline"
                         label-position="right" label-width="150px">
                    <el-card class="box-card">
                        <!--基本信息-->
                        <CommonSubtitle title="编辑应急预案" :isBold="true" style="width: 100%;line-height: 20px;margin-bottom: 20px"></CommonSubtitle>
                        <!---------------------------应急预案基础信息----------------------------->
                        <div>
                            <el-button type="primary" class="title-btn">应急预案基础信息</el-button>
                            <el-row :gutter="20">
                                <el-col :span="12" class="margin-t-10">
                                    <el-form-item label="应急预案名称：" prop="cargoName">
                                        <el-input :disabled="isDisabled" v-model="form.cargoName"
                                                  placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" class="margin-t-10">
                                    <el-form-item label="应急预案编制单位：" prop="consignorCompanyName">
                                        <el-input :disabled="isDisabled" v-model="form.consignorCompanyName"
                                                  placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12" class="margin-t-10">
                                    <el-form-item label="应急预案归属：" prop="attribution" style="margin-bottom: 12px">
                                        <el-radio-group v-model="form.attribution">
                                            <el-radio :label="item.value" border
                                                      v-for="(item, index) in attributionOptions" :key="item.value"
                                                      style="margin-right: 10px;float:left;margin-bottom: 10px">
                                                {{item.name}}
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" class="margin-t-10">
                                    <el-form-item label="应急预案类型：" prop="attribution">
                                        <el-radio-group v-model="form.planType">
                                            <el-radio :label="item.value" v-for="(item, index) in planTypeOptions"
                                                      :key="item.value"
                                                      style="margin-right: 10px;float:left;">{{item.name}}
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24" class="margin-t-10">
                                    <el-form-item label="应急预案级别：" prop="eventLevel" style="margin-bottom: 12px">
                                        <el-radio-group v-model="form.eventLevel">
                                            <el-radio :label="item.value" border
                                                      v-for="(item, index) in eventLevelOptions" :key="item.value"
                                                      style="margin-right: 10px;float:left;margin-bottom: 10px">
                                                {{item.name}}
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24" class="margin-t-10">
                                    <el-form-item label="应急预案事件类型：" prop="eventType" style="margin-bottom: 12px">
                                        <el-radio-group v-model="form.eventType">
                                            <el-radio :label="item.value" border
                                                      v-for="(item, index) in eventTypeOptions" :key="item.value"
                                                      style="margin-right: 10px;float:left;margin-bottom: 10px">
                                                {{item.name}}
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24" class="margin-t-10">
                                    <el-form-item label="应急预案说明：" prop="des">
                                        <el-input type="textarea" v-model="form.des"
                                                  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                        </div>
                        <!---------------------------应急预案处理详情----------------------------->
                        <div style="margin-bottom: 20px">
                            <el-button type="primary" class="title-btn">应急预案处理详情</el-button>
                                <el-tabs type="border-card">
                                    <!--<el-tab-pane label="应急领导小组">
                                        <processing-details-form ref="groupForm" :isDisabled="isDisabled"
                                                                 ></processing-details-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="应急领导办公室">
                                        <processing-details-form ref="officeForm" :isDisabled="isDisabled"
                                                                 ></processing-details-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="应急工作处置组">
                                        <processing-details-form ref="handleForm" :isDisabled="isDisabled"
                                                                 ></processing-details-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="抢险救援突击组">
                                        <processing-details-form ref="assaultForm" :isDisabled="isDisabled"
                                                                 ></processing-details-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="技术支持组">
                                        <processing-details-form ref="technologyForm" :isDisabled="isDisabled"
                                                                 ></processing-details-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="安全警戒组">
                                        <processing-details-form ref="safetyForm" :isDisabled="isDisabled"
                                                                 ></processing-details-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="后勤保障组">
                                        <processing-details-form ref="logisticsForm" :isDisabled="isDisabled"
                                                                 ></processing-details-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="其他">
                                        <processing-details-form ref="otherForm" :isDisabled="isDisabled"
                                                                 ></processing-details-form>
                                    </el-tab-pane>-->
                                    <el-tab-pane v-for="(item,index) in tabTypes" :label="item.name" :key="index">
                                        <processing-details-form :ref="item.key" :isDisabled="isDisabled"></processing-details-form>
                                    </el-tab-pane>
                                </el-tabs>
                        </div>

                        <!---------------------------应急关联资源----------------------------->
                        <div class="plan-add-link">
                            <el-button type="primary" class="title-btn">应急关联资源</el-button>
                            <associated-resources-tabs ref="resources"></associated-resources-tabs>
                        </div>
                        <!---------------------------上传附件----------------------------->
                        <el-row>
                            <el-col :span="24">

                                <el-form-item label="附件资料:" prop="urlList" class="text-area">
                                    <el-row>
                                        <div class="file-item upload-item">
                                            <upload-image ref="upload" @setFileUrl="getFileUrl" :isLate="false"></upload-image>
                                        </div>
                                    </el-row>
                                </el-form-item>
                            </el-col>
                        </el-row>



                        <el-row>
                            <div class="margin-td-10" style="text-align: center; width: 100%;">
                                <el-button @click="resetForm">重 置</el-button>
                                <el-button type='primary' @click="submitForm('form')">保 存</el-button>
                            </div>
                        </el-row>
                    </el-card>
                </el-form>

            </el-main>

        </el-container>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import ProcessingDetailsForm from './components/processing-details-form.vue'
    import AssociatedResourcesTabs from './components/associated-resources-tabs.vue'
    import UploadImage from './components/upload-image.vue';

    import {fetchAreaTree} from '@/api/courseMonitor/alarmSynthesis';

    import D from '@/utils/DFDZ';

    export default {
        name: 'EMPlanAdd',
        components: {Pagination, CommonSubtitle, ProcessingDetailsForm,AssociatedResourcesTabs,UploadImage},
        data() {
            return {
                form: {
                    cargoName: '',//托运方单位名称
                    consignorCompanyName: '',//装货地点
                    des: '',//装货地点
                    planType: '',//应急预案类型
                    eventLevel: '',//应急预案事件类型
                    attribution: '',//应急预案归属
                    urlList:[],//上传文件列表
                },
                rules: {
                    cargoName: [
                        {required: true, message: '请输入', trigger: 'change'}
                    ],
                    consignorCompanyName: [
                        {required: true, message: '请输入', trigger: 'change'}
                    ],
                    planType: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    eventLevel: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    attribution: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    eventType: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ]

                },
                isDisabled: false,//是否可编辑
                loading: false,
                //事件等级
                planTypeOptions: [
                    {
                        name: '综合预案',
                        value: 0,
                    },
                    {
                        name: '专项预案',
                        value: 1,
                    },
                ],
                //事件等级
                eventLevelOptions: [
                    {
                        name: '全部',
                        value: 0,
                    },
                    {
                        name: '省级',
                        value: 1,
                    },
                    {
                        name: '市级',
                        value: 2,
                    },
                    {
                        name: '县级',
                        value: 3,
                    },
                    {
                        name: '企业级',
                        value: 4,
                    },
                    {
                        name: '其他',
                        value: 5,
                    },
                ],
                //应急预案归属
                attributionOptions: [
                    {
                        name: '港航管理局',
                        value: 0,
                    },
                    {
                        name: '港口经营人',
                        value: 1,
                    },
                    {
                        name: '其他',
                        value: 2,
                    },],
                //应急预案事件类型
                eventTypeOptions: [
                    {
                        name: '生产安全事故',
                        value: 0,
                    },
                    {
                        name: '危险货物事故',
                        value: 1,
                    },
                    {
                        name: '自然灾害',
                        value: 2,
                    },
                    {
                        name: '人员疏散',
                        value: 3,
                    },
                    {
                        name: '社会安全',
                        value: 4,
                    },
                    {
                        name: '其他',
                        value: 5,
                    },
                ],
                tabTypes: [{
                    name: '应急领导小组',
                    key: 'groupForm'
                    },
                    {
                        name: '应急领导办公室',
                        key: 'officeForm'
                    },
                    {
                        name: '应急工作处置组',
                        key: 'handleForm'
                    },
                    {
                        name: '抢险救援突击组',
                        key: 'assaultForm'
                    },
                    {
                        name: '技术支持组',
                        key: 'technologyForm'
                    },
                    {
                        name: '安全警戒组',
                        key: 'safetyForm'
                    },
                    {
                        name: '后勤保障组',
                        key: 'logisticsForm'
                    },
                    {
                        name: '其他',
                        key: 'otherForm'
                    },
                ],
                detailVisible:true,
                resourcesVisible:true,

            }
        },
        watch: {},
        created() {

        },
        mounted() {

        },
        methods: {
            //保存
            submitForm(formName) {
                //处理应急预案处理详情数据
                let paramsForm = {};
                this.tabTypes.map((val,idx)=>{
                    let rowOtherData = this.$refs[val.key][0].rowOtherData;
                    rowOtherData.unshift(this.$refs[val.key][0].ruleForm);
                    //将数据拼成对象，组件ref名称：{报警电话等可添加的：[],剩余表单项}
                    paramsForm[val.key] = {
                        group:rowOtherData,
                        ...this.$refs[val.key][0].ruleForm
                    }
                })
                //应急关联资源
                const resourcesParams = this.$refs['resources'].submitTab();

                console.log('222222222222222',paramsForm,resourcesParams);

                /*this.$refs[formName].validate((valid) => {
                    if (valid) {
                        carDrivingLicenseSaveOrUpdate(this.ruleForm).then(res => {
                            this.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                        }).catch((err) => {

                        });
                    } else {
                        this.$message.warning('请填完所有项再提交');
                        return false;
                    }
                });*/


            },
            //重置：清除表单数据
            resetForm() {
                //重置应急预案基本信息
                this.$refs['form'].resetFields();
//                this.$refs.upload.clearFiles();//清空已上传的文件列表
                //重置应急预案处理详情，tab里的内容是for循环，所以要遍历
                this.tabTypes.map((item)=>{
                    this.$refs[item.key][0].resetForm();
                });
                //重置关联资源
                this.$refs['resources'].resetTab();
            },
            //上传图片;图片地址赋值
            getFileUrl(url){
                this.form.urlList = url;
            }



        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .plan-form-inline {
        .el-radio.is-bordered + .el-radio.is-bordered {
            margin-left: 0;
        }
        .el-radio:after {
            clear: both;
            content: '';
        }
        .title-btn {
            margin-bottom: 20px;
            background-color: #0E58B6;
            border-color:#0E58B6;
        }
        //关联资源
        .plan-add-link{
            /deep/.el-tabs__item .el-icon-close:before{
                transform: rotate(45deg)
            }
            /deep/.el-tabs__new-tab{
                display: none;
            }
        }
        //上传图片样式
        .text-area {
            width: 100%;
            /deep/ .el-form-item__content {
                width: calc(100% - 150px);
            }
        }
        .file-item {
            padding-right: 10px;
        }
        /*上传附件的样式*/
        .upload-item {
            width: 100%;
            margin-right: 0!important;
            .container{
                padding: 0;
            }
        }
    }


</style>