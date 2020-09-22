<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 10px;text-align: center" >
                <div style="text-align: right">
                    <el-button type="primary" @click="printForm">
                        打印
                    </el-button>
                </div>
                <div id="applicationForm">
                    <div class="form-title">
                        <div>质量信誉等级评定申请表</div>
                        <div>（
                            <div class="title-year" ><el-input :disabled="formStatus === 'view'" v-model="form.titleYear" ></el-input> </div>
                            年度）
                        </div>
                        <div>烟台市道路危险货物运输企业基本情况表</div>
                    </div>
                    <div class="form-time">时间：
                        <div class="title-year" style="width: 60px;">
                            <el-input v-model="form.titleTimeYear" :disabled="formStatus === 'view'" ></el-input>
                        </div>
                        年
                        <div class="title-year" style="width: 40px;">
                            <el-input v-model="form.titleTimeMonth" :disabled="formStatus === 'view'" ></el-input>
                        </div>
                        月
                        <div class="title-year" style="width: 40px;">
                            <el-input v-model="form.titleTimeDay" :disabled="formStatus === 'view'" ></el-input>
                        </div>
                        日
                    </div>
                    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition" style="width:100%;margin: 0 auto">
                        <table class="el-table__body" style="width: 100%">
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">企业名称（章）</div>
                                </td>
                                <td>
                                    <el-input v-model="form.companyName"
                                              type="textarea"
                                              autosize
                                              :disabled="formStatus === 'view'"
                                    ></el-input>
                                </td>
                                <td>
                                    <div class="cell">法定代表人</div>
                                </td>
                                <td>
                                    <el-input v-model="form.representative"
                                              type="textarea"
                                              autosize
                                              :disabled="formStatus === 'view'"
                                    ></el-input>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">许可证号</div>
                                </td>
                                <td>
                                    <el-input v-model="form.code"
                                              type="textarea"
                                              autosize
                                              :disabled="formStatus === 'view'"
                                    ></el-input>
                                </td>
                                <td>
                                    <div class="cell">联系电话</div>
                                </td>
                                <td>
                                    <el-input v-model="form.phoneNum"
                                              type="textarea"
                                              autosize
                                              :disabled="formStatus === 'view'"
                                    ></el-input>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">营业执照号</div>
                                </td>
                                <td>
                                    <el-input v-model="form.businessLicense"
                                              type="textarea"
                                              autosize
                                              :disabled="formStatus === 'view'"
                                    ></el-input>
                                </td>
                                <td>
                                    <div class="cell">经济类型</div>
                                </td>
                                <td>
                                    <el-input v-model="form.type"
                                              type="textarea"
                                              autosize
                                              :disabled="formStatus === 'view'"
                                    ></el-input>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">统一社会信用代码</div>
                                </td>
                                <td>
                                    <el-input v-model="form.creditCode"
                                              type="textarea"
                                              autosize
                                              :disabled="formStatus === 'view'"
                                    ></el-input>
                                </td>
                                <td>
                                    <div class="cell">上年度质量信誉等级</div>
                                </td>
                                <td>
                                    <el-input v-model="form.creditLevel"
                                              type="textarea"
                                              autosize
                                              :disabled="formStatus === 'view'"
                                    ></el-input>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">从业人员数</div>
                                </td>
                                <td colspan="3" class="col-3-td">
                                    <!--<el-input v-model="form.number"
                                              type="textarea"
                                              autosize ></el-input>-->
                                    <div class="indent-row mt-10" style="">
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="form.practitionersNum" :disabled="formStatus === 'view'"
                                             ></el-input>
                                        </div>
                                        <span>
                                        人（其中驾驶员、押运员、装卸管理人员数：
                                          <div class="title-year" style="width: 40px;">
                                            <el-input v-model="form.drivers" :disabled="formStatus === 'view'" ></el-input>
                                        </div>/
                                            <div class="title-year" style="width: 40px;">
                                            <el-input v-model="form.escorts" :disabled="formStatus === 'view'" ></el-input>
                                        </div>/
                                            <div class="title-year" style="width: 40px;">
                                            <el-input v-model="form.stevedores" :disabled="formStatus === 'view'"></el-input>
                                        </div>）
                                        </span>

                                    </div>
                                </td>
                            </tr>
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">车辆数</div>
                                </td>
                                <td colspan="3" class="col-3-td">
                                    <!--<el-input v-model="form.number"
                                              type="textarea"
                                              autosize ></el-input>-->
                                    <div class="indent-row mt-10" style="">
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="form.carNumber" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        <span>
                                        辆（其中牵引车、挂车、一体车数：
                                          <div class="title-year" style="width: 40px;">
                                            <el-input v-model="form.tractor" :disabled="formStatus === 'view'" ></el-input>
                                        </div>/
                                            <div class="title-year" style="width: 40px;">
                                            <el-input v-model="form.trailer" :disabled="formStatus === 'view'" ></el-input>
                                        </div>/
                                            <div class="title-year" style="width: 40px;">
                                            <el-input v-model="form.integrated" :disabled="formStatus === 'view'" ></el-input>
                                        </div>）
                                        </span>

                                    </div>
                                </td>
                            </tr>
                            <!----------------------------------- 企业自评意见 -------------------------------------->

                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">企业自评意见</div>
                                </td>
                                <td colspan="3" class="col-3-td">
                                    <div style="text-align: left" class="mt-10">
                                        经自评，本企业：
                                    </div>
                                    <div class="indent-row mt-10">
                                        <el-radio-group class="elRadio" v-model="preliminaryAssessmentForm.preliminaryAssessmentRadio" :disabled="formStatus === 'view'" >
                                            <el-radio label="1" style="margin-right: 0;">有</el-radio>
                                            <div class="title-year" style="width: 40px;">
                                                <el-input v-model="preliminaryAssessmentForm.vetoValue" :disabled="formStatus === 'view'" ></el-input>
                                            </div>
                                            类
                                            <el-radio label="2">无</el-radio>
                                            <span>
                                        否决项，
                                                 </span>
                                        </el-radio-group>


                                    </div>
                                    <div class="indent-row mt-10">
                                        基础管理得分
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="preliminaryAssessmentForm.basicManageValue" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        分，
                                        安全生产得分
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="preliminaryAssessmentForm.safeProductValue" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        分，
                                        经营行为得分
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="preliminaryAssessmentForm.operateValue" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        分，
                                        服务质量得分
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="preliminaryAssessmentForm.serviceQualityValue" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        分，
                                        社会责任得分
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="preliminaryAssessmentForm.socialResponsibilityValue" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        分，
                                        加分项目得分
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="preliminaryAssessmentForm.plusProjectValue" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        分，
                                        合计总分
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="preliminaryAssessmentForm.totalScoreValue" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        分。
                                    </div>
                                    <div class="mt-10" style="text-align: right; padding-right: 10%; ">
                                        企业主要负责人：
                                        <div class="title-year" style="width: 60px;">
                                            <el-input v-model="preliminaryAssessmentForm.checkPerson" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        （签字）
                                    </div>
                                    <div class="mt-10" style="text-align: right; padding-right: 10%;">
                                        <div class="title-year" style="width: 60px;">
                                            <el-input v-model="preliminaryAssessmentForm.preliminaryAssessmentYear" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        年
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="preliminaryAssessmentForm.preliminaryAssessmentMonth" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        月
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="preliminaryAssessmentForm.preliminaryAssessmentDay" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        日
                                    </div>
                                </td>
                            </tr>
                        </table>

                    </div>

                </div>
                <el-row class="submit-btn">
                    <el-button
                            v-if="formStatus !== 'view'"
                            type="primary"
                            style="margin-top: 20px;"
                            @click="submitList"
                    >
                        提交
                    </el-button>
                </el-row>

            </el-main>
        </el-container>

    </div>
</template>
<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import Pagination from '@/components/Pagination'
    import {mapGetters} from 'vuex'

    export default {
        name: 'EAEnterpriseSelfAssessmentApplicationForm',
        components: {Pagination, CommonSubtitle},
        data() {
            return {
                input: '',
                form:{
                    titleYear: '',  //年度
                    titleTimeYear: '',       //年
                    titleTimeMonth: '',      //月
                    titleTimeDay: '',        //日
                    companyName:'',//公司名称
                    representative:'',//法定代表人
                    code:'',//许可证号
                    phoneNum:'',//联系电话
                    businessLicense:'',//营业执照
                    type:'',//经济类型
                    creditCode:'',//统一社会信用代码
                    creditLevel:'',//上年度质量信誉等级
                    carNumber:'',//车辆数

                    reviewRadio:'',//
                    practitionersNum:'',//从业人员数
                    drivers:'',//驾驶员
                    escorts:'',//押运员
                    stevedores:'',//装卸管理人员

                    tractor:'',//牵引车
                    trailer:'',//挂车
                    integrated:'',//一体车
                },
                //初评
                preliminaryAssessmentForm: {
                    preliminaryAssessmentRadio: '',     //初评的有无否决项, 1为是，2为否
                    vetoValue: '',          //否决项几类
                    basicManageValue: '',   //基础管理
                    safeProductValue: '',   //安全生产
                    operateValue: '',   //经营行为
                    serviceQualityValue: '',   //服务质量
                    socialResponsibilityValue: '',   //社会责任
                    plusProjectValue: '',   //加分项目
                    totalScoreValue: '',   //合计总分
                    checkPerson: '',    //考核负责人
                    preliminaryAssessmentYear: '',  //年
                    preliminaryAssessmentMonth: '',  //月
                    preliminaryAssessmentDay: '',  //日
                },
            }
        },
        computed: {
            ...mapGetters([
                'formStatus'
            ]),},
        watch: {},
        created() {
        },
        mounted() {
            //如果是查看，要获取分数信息，计算分数
            if (this.formStatus === 'view') {
                this.initData();
            }

        },
        methods: {
            //初始化数据
            initData(){
                //请求接口，赋值

            },
            //打印
            printForm(){
                this.$nextTick(() => {
                    this.getPdf('#applicationForm');//在main中导入，所以可以直接使用
                })
            },
            //提交功能
            submitList() {
                console.log();
            },
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .table {
        display: table;
        border: 1px solid #cccccc;
        margin: 5px;
        /*display: table时padding会失效*/
    }

    .row {
        display: table-row;
        /*border: 1px solid #cccccc;*/
        /*display: table-row时margin、padding同时失效*/
    }

    .cell {
        /* display: table-cell;
         border: 1px solid #cccccc;
         padding: 5px;*/
        /*display: table-cell时margin会失效*/
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding-left: 10px;
        padding-right: 10px;
    }

    #applicationForm {
        width: 1100px;
        margin: 0 auto;
        padding: 0 60px;
    }
    //申请表标题
    .form-title {
        font-size: 22px;
        line-height: 35px;
        font-weight: bold;
        padding-bottom: 20px;
        width: 100%;
        & > div {
            text-align: center;
        }
    }
    //时间
    .form-time{
        margin: 0 auto;
        text-align: right;
        width: 100%;
        padding-right: 30px;
        padding-bottom: 10px;
    }

    //.el-main
    /deep/.el-input__inner{
        border: none !important;
    }
    /deep/.el-textarea__inner{
        border: none !important;
        resize:none
    }
    /deep/.el-textarea__inner:hover{
        border-color:#fff
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td{
        background-color: #fff;
    }
    .el-table th, .el-table td{
        text-align: center;
    }
    //下划线输入框的样式
    .title-year {
        display: inline-block;
        width: 80px;
        text-indent: 0;
        /deep/ .el-input__inner {
            padding: 0;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            color: #606266;
            border-bottom: 1px solid #606266 !important;
            border-radius: 0;
            height: 30px;
            line-height: 30px;
        }
    }

    .col-3-td {
        padding: 40px 20px ;
    }
    .mt-10 {
        margin-top: 10px;
    }
    .indent-row {
        text-indent: 2em;
        text-align: left;
        span,
        label {
            text-indent: 0;
        }
    }

</style>



