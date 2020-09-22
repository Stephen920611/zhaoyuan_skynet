<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 10px;">
                <div class="filter-container">
                    <el-form :inline="true" :model="form" class="form-inline-search" label-width="100px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="年度：" class="form-inline-search-item">
                                    <el-select v-model="form.year" placeholder="请选择">
                                        <el-option
                                                v-for="item in yearOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="评价等级：" class="form-inline-search-item">
                                    <span class="font-bold" style="color: #308FE4">暂未完成</span>
                                </el-form-item>
                            </el-col>

                            <el-col :span="12" class="btns" style="text-align: right">
                                <el-button
                                        class="filter-item"
                                        type="primary"
                                        style="margin-left: 10px;"
                                        @click="handleFilter"
                                >
                                    立即申请
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <!--当前环节分布组件-->
                <el-card class="box-card">
                    <common-subtitle :isBold="true" title="当前环节" style="padding-top: 0;"></common-subtitle>
                    <div class="step-groups">
                        <steps :active="stepActive" finish-status="success" align-center >
                            <template v-for="(item,index) in stepGroups">
                                <step :lineTitle="item.stepDes" >
                                    <div slot="title" >
                                        <span class="step-number">{{index + 1}}</span>
                                        <span class="font-bold">{{item.title}}</span>
                                        <div style="color: #C0C4CC">{{item.updateTime}}</div>
                                    </div>
                                </step>
                            </template>
                        </steps>
                    </div>
                </el-card>
                <el-card class="box-card" style="margin-top: 20px">
                    <common-subtitle :isBold="true" title="相关文件" style="padding-top: 0;"></common-subtitle>
                    <!-- 表格开始 -->
                    <el-table
                            v-loading="listLoading"
                            :data="fileList"
                            border
                            fit
                            highlight-current-row
                            style="width: 100%;margin-top: 15px"
                    >
                        <el-table-column label="序号" type="index" align="center" width="80px">
                            <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="文件名称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.name}}</template>
                        </el-table-column>
                        <el-table-column label="提交状态" header-align="center" align="center">
                            <template slot-scope="{row}">未提交 {{row.unSubmitted}}（已提交 <span style="color:#2794e7;font-weight: bold">{{row.submitted}}</span>）</template>
                        </el-table-column>
                        <el-table-column label="提交时间" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.time}}</template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center"
                                width="300"
                                class-name="small-padding fixed-width"
                        >
                            <template slot-scope="{row}">
                                <el-button :type="row.dealDisabled ? 'primary' : 'info'" :disabled="!row.dealDisabled" size="mini" style="width: 70px" @click="dealDiffPage(row,'add')">处理</el-button>
                                <el-button :type="row.viewDisabled ? 'primary' : 'info'"  :disabled="!row.viewDisabled" size="mini" style="width: 70px" @click="dealDiffPage(row,'view')" >查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-main>
        </el-container>

    </div>
</template>
<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import Pagination from '@/components/Pagination'
    import Steps from '@/components/Steps/steps.vue'
    import Step from '@/components/Steps/step.vue'

    export default {
        name: 'EAEnterpriseSelfAssessmentIndex',
        components: {Pagination, CommonSubtitle,Steps,Step},
        data() {
            return {
                total: 0,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 16,
                },
                //要检索的条件
                form: {
                    year: '',  //年度
                    companyName: '',//评价等级
                },
                stepGroups:[
                    {
                        title:'提交申请',
                        updateTime:'2020-12-12 18:18:18',
                        stepDes:'已提交申请，请等待主管部门初评',
                    },
                    {
                        title:'主管部门初评',
                        updateTime:'2020-12-13 18:18:18',
                        stepDes:'初评完成，已提交市级部门核定',
                    },
                    {
                        title:'市级主管部门复核',
                        updateTime:null,
                        stepDes:'复核完成，等待评定结果',
                    },
                    {
                        title:'结果公示',
                        updateTime:'',
                        stepDes:''
                    },
                ],
                fileList:[
                    {
                        name:'烟台市危险货物运输企业质量信誉考核评分表',
                        unSubmitted:1,
                        submitted:0,
                        time:'2020-02-10 18:21:21',
                        viewDisabled:true,
                        dealDisabled:true,
                    },
                    {
                        name:'质量信誉等级评定申请表',
                        unSubmitted:1,
                        submitted:0,
                        time:'2020-02-11 18:21:21',
                        viewDisabled:true,
                        dealDisabled:true,
                    },
                    {
                        name:'烟台市危货企业质量信誉等级评定表',
                        unSubmitted:1,
                        submitted:0,
                        time:'2020-02-12 18:21:21',
                        viewDisabled:true,
                        dealDisabled:false,
                    }
                ],
                yearOptions:[],//年份
                stepActive:2,//步骤条所处的位置

            }
        },
        computed: {},
        watch: {},
        created() {
        },
        methods: {
            //立即申请
            handleFilter(){
                this.$confirm('请完成提交《质量信誉等级评定申请表》和《烟台市危险货物运输企业质量信誉考核评分表》后点击申请！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                })

            },

            dealDiffPage(item,type){
                //点击的按钮是处理/查看
                this.$store.dispatch("evaluateAnalysis/setFormStatus",{formStatus:type});
                //跳转不同界面
                switch (item.name){
                    case '烟台市危险货物运输企业质量信誉考核评分表':
                        this.$router.push({name: 'EAEnterpriseSelfAssessmentCheckScale'});
                        break;
                    case '质量信誉等级评定申请表':
                        this.$router.push({name: 'EAEnterpriseSelfAssessmentApplicationForm'});
                        break;
                    case '烟台市危货企业质量信誉等级评定表':
                        this.$router.push({name: 'EAEnterpriseSelfAssessmentRatingForm'});
                        break;
                }
            },
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    //顶部条件样式
    /deep/ .el-form-item__label {
        font-size: 16px;
    }

    /deep/ .el-form-item__content {
        font-size: 16px;
        width: calc(100% - 100px);
    }

    /deep/ .el-form-item {
        width: 100%;
    }
    //搜索条件样式
    .form-inline-search {
        .form-inline-search-item {
            width: 100%;
            /deep/ .el-form-item__content {
                width: calc(100% - 100px);
            }
        }

    }
    .el-select{
        width: 90%;
    }
    //内容样式
    .el-card {
        border: 0;
        //分步样式
        .step-groups{
            padding: 30px 20px;
            height: 260px;
            display: flex;
            justify-content: flex-end;
            flex-direction: column;
            .step-number{
                color:#2794e7;
                font-weight: bold;
                font-size: 20px;
            }
            .is-wait{
                .step-number{
                    color:#C0C4CC;
                    font-weight: bold;
                    font-size: 20px;
                }
            }
            .is-success{
                .step-number{
                    color:#2794e7;
                    font-weight: bold;
                    font-size: 20px;
                }
            }
            /deep/.el-step__head,/deep/.el-step__title{
                font-weight: bold !important;
            }
            /deep/.el-step__head.is-success{
                color: #308FE4;
                border-color:#308FE4
            }
            /deep/.el-step__title.is-success{
                color: #303133;
            }

        }
        /deep/.el-table th{
            background-color: #308FE4;
            color: #fff;
        }
    }
    .el-card.is-always-shadow {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    }


</style>



