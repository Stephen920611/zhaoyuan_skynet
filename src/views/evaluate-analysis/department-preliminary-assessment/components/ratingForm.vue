<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 10px;text-align: center">
                <div style="text-align: right">
                    <el-button type="primary" @click="printForm">
                        打印
                    </el-button>
                </div>
                <div id="pdfDom">
                    <div class="form-title">
                        <div>
                            烟台市
                            <div class="title-year">
                                <el-input v-model="form.titleYear" :disabled="formStatus === 'view'" ></el-input>
                            </div>
                            年度道路危险货物运输企业
                        </div>
                        <div>质量信誉考核等级评定表</div>
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
                    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition table-form mt-10">
                        <table class="el-table__body" style="width: 100%">
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">企业名称（章）</div>
                                </td>
                                <td>
                                    <div class="none-textarea">
                                        <el-input v-model="form.companyName"
                                                  type="textarea"
                                                  autosize
                                                  :disabled="formStatus === 'view'"
                                        ></el-input>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">许可证号</div>
                                </td>
                                <td>
                                    <div class="none-textarea">
                                        <el-input v-model="form.code"
                                                  type="textarea"
                                                  autosize
                                                  :disabled="formStatus === 'view'"
                                        ></el-input>
                                    </div>
                                </td>
                            </tr>
                            <!----------------------------------- 初评意见 -------------------------------------->
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">初评意见</div>
                                </td>
                                <td colspan="3" class="col-3-td">
                                    <div style="text-align: left" class="mt-10">
                                        经考核，该企业：
                                    </div>
                                    <div class="indent-row mt-10 elRadio">
                                        <el-radio v-model="preliminaryAssessmentForm.preliminaryAssessmentRadio" label="1" style="margin-right: 0;" :disabled="formStatus === 'view'" >有</el-radio>
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="preliminaryAssessmentForm.vetoValue" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        类
                                        <el-radio v-model="preliminaryAssessmentForm.preliminaryAssessmentRadio" label="2" :disabled="formStatus === 'view'" >无</el-radio>
                                        <span>
                                        否决项，
                                    </span>
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
                                    <div class="indent-row mt-10">
                                        初步评定为
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="preliminaryAssessmentForm.gradeValue" :disabled="formStatus === 'view'" ></el-input>
                                        </div>
                                        级质量信誉企业。
                                    </div>
                                    <div class="mt-10" style="text-align: right; padding-right: 10%; ">
                                        考核负责人：
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
                            <!----------------------------------- 复评意见 -------------------------------------->
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">复评意见</div>
                                </td>
                                <td colspan="3" class="col-3-td">
                                    <div style="text-align: left">
                                        经复核，
                                    </div>
                                    <div class="indent-row mt-10 elRadio" style="">
                                        <el-radio v-model="reviewForm.reviewRadio" label="1" style="margin-right: 0;" disabled >同意</el-radio>
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="reviewForm.reviewVetoValue" disabled ></el-input>
                                        </div>
                                        类
                                        <el-radio v-model="reviewForm.reviewRadio" label="2" style="margin-right: 0;" disabled >不同意</el-radio>
                                        <span>
                                        初评意见
                                    </span>
                                    </div>
                                    <div class="indent-row" style="margin-top: 15px;">
                                        （不同意原因）
                                    </div>
                                    <div class="indent-row" style="height: 220px;">
                                        <!--<div contenteditable="true" class="name1" style="white-space: pre">{{reviewForm.reviewDisagreeReason}}</div>-->
                                        <el-input id='test' style="width: 90%;margin: 15px 0;"
                                                  v-model="reviewForm.reviewDisagreeReason"
                                                  :autosize="{ minRows: 4}" type="textarea"
                                                  disabled
                                        ></el-input>
                                        <!--<div class="el-textarea el-input&#45;&#45;medium">
                                            <textarea name="" id="" cols="30" rows="10">fwefwfwfwfwefwefwefwfewwefe</textarea>
                                        </div>-->
                                    </div>
                                    <div class="indent-row">
                                        建议评定为
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="reviewForm.reviewGradeValue" disabled ></el-input>
                                        </div>
                                        级质量信誉企业。
                                    </div>
                                    <div style="text-align: right; padding-right: 10%">
                                        复核负责人：
                                        <div class="title-year" style="width: 60px;">
                                            <el-input v-model="reviewForm.reviewCheckPerson" disabled ></el-input>
                                        </div>
                                        （签字）
                                    </div>
                                    <div style="text-align: right; padding-right: 10%">
                                        <div class="title-year" style="width: 60px;">
                                            <el-input v-model="reviewForm.reviewYear" disabled ></el-input>
                                        </div>
                                        年
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="reviewForm.reviewMonth" disabled ></el-input>
                                        </div>
                                        月
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="reviewForm.reviewDay" disabled ></el-input>
                                        </div>
                                        日
                                    </div>
                                </td>
                            </tr>
                            <!----------------------------------- 等级评定意见 -------------------------------------->
                            <tr class="el-table__row">
                                <td>
                                    <div class="cell">等级评定意见 </div>
                                </td>
                                <td colspan="3" class="col-3-td">
                                    <div class="indent-row elRadio" >
                                        经综合评定，该企业在
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="ratingForm.ratingTitleYear" disabled ></el-input>
                                        </div>
                                        年度质量信誉考核中，
                                        <el-radio v-model="ratingForm.ratingRadio" label="1" style="margin-right: 0;" disabled >有</el-radio>
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="ratingForm.ratingVetoValue" disabled ></el-input>
                                        </div>
                                        类
                                        <el-radio v-model="ratingForm.ratingRadio" label="2" style="margin-right: 0;" disabled >无</el-radio>
                                        <span>
                                        否决指标，得分
                                    </span>
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="ratingForm.ratingScoreValue" disabled ></el-input>
                                        </div>
                                        分，
                                        按规定评定为
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="ratingForm.ratingGradeValue" disabled ></el-input>
                                        </div>
                                        级质量信誉企业
                                    </div>
                                    <div style="text-align: right; padding-right: 10%">
                                        评定负责人：
                                        <div class="title-year" style="width: 60px;">
                                            <el-input v-model="ratingForm.ratingCheckPerson" disabled ></el-input>
                                        </div>
                                        （签字）
                                    </div>
                                    <div style="text-align: right; padding-right: 10%">
                                        <div class="title-year" style="width: 60px;">
                                            <el-input v-model="ratingForm.ratingYear" disabled ></el-input>
                                        </div>
                                        年
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="ratingForm.ratingMonth" disabled ></el-input>
                                        </div>
                                        月
                                        <div class="title-year" style="width: 40px;">
                                            <el-input v-model="ratingForm.ratingDay" disabled ></el-input>
                                        </div>
                                        日
                                    </div>
                                </td>
                            </tr>
                        </table>

                    </div>
                </div>
                <el-row class="submit-btn" v-if="formStatus === 'add'">
                    <el-button
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
                //初评上方的内容
                form: {
                    titleYear: '',  //年度
                    titleTimeYear: '',       //年
                    titleTimeMonth: '',      //月
                    titleTimeDay: '',        //日
                    companyName: '',//公司名称
                    code: '',//许可证号
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
                    gradeValue: '',   //合计总分
                    checkPerson: '',    //考核负责人
                    preliminaryAssessmentYear: '',  //年
                    preliminaryAssessmentMonth: '',  //月
                    preliminaryAssessmentDay: '',  //日
                },
                //复评
                reviewForm: {
                    reviewRadio: '',               //是否同意，初评的有无否决项, 1为是，2为否
                    reviewVetoValue: '',    //几类否决项
                    reviewDisagreeReason: '',             //不同意原因
                    reviewGradeValue: '',             //不同意原因
                    reviewCheckPerson: '',    //复核负责人
                    reviewYear: '',  //年
                    reviewMonth: '',  //月
                    reviewDay: '',  //日
                },

                //等级评定
                ratingForm: {
                    ratingTitleYear: '',        //年度
                    ratingRadio: '',        //初评的有无否决项, 1为是，2为否
                    ratingVetoValue: '',    //几类否决项
                    ratingScoreValue: '',    //得分
                    ratingGradeValue: '',    //评定等级
                    ratingCheckPerson: '',    //评定负责人
                    ratingYear: '',  //年
                    ratingMonth: '',  //月
                    ratingDay: '',  //日
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
        methods: {
            printForm(){
                this.$nextTick(() => {
                    this.getPdf('#pdfDom');//在main中导入，所以可以直接使用
                })
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

    #pdfDom {
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
    .form-time {
        text-align: right;
        width: 100%;
        padding-right: 30px;
        padding-bottom: 10px;
        margin: 10px 0 25px;
    }

    .mt-10 {
        margin-top: 10px;
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

    .indent-row {
        text-indent: 2em;
        text-align: left;
        span,
        label {
            text-indent: 0;
        }
    }

    //.el-main
    /deep/ .el-input__inner {
        border: none !important;
    }

    .none-textarea {
         /deep/ .el-textarea__inner {
            border: none !important;
            resize: none
        }

        /deep/ .el-textarea__inner:hover {
            border-color: #fff
        }

        /deep/ .textarea-div {
            border: none;
            width: 100%;
            margin: 15px 0;
            font-size: 14px;
            padding: 5px 15px;
            text-align: left;
        }
    }

    /deep/ .textarea-div {
        width: 90%;
        text-indent: 0;
        margin: 15px 2em;
        font-size: 14px;
        padding: 5px 15px;
        line-height: 1.5;
        color: #606266;
        background-color: #fff;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        word-break: break-all

    }


    .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #fff;
    }

    .el-table th, .el-table td {
        text-align: center;
    }

    .col-3-td {
        padding: 40px 20px ;
    }



</style>



