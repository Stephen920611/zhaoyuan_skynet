<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 10px;">
                <div class="text item" >
                    <el-card>
                        <div class="filter-container">
                            <el-form :inline="true" :model="form" class="form-inline-search">
                                <el-row>

                                    <!--<el-col :span="this.isSmallBtn ? 6 : 6">
                                        <el-form-item label="操作状态：" class="form-inline-search-item">
                                            <el-select v-model="form.status" placeholder="请选择操作状态">
                                                <el-option
                                                        v-for="item in statusOptions"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>-->
                                    <el-col :span="this.isSmallBtn ? 6 : 5">
                                        <el-form-item label="年度：" class="form-inline-search-item">
                                            <el-input v-model="form.year" placeholder="请输入年度"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="this.isSmallBtn ? 6 : 5">
                                        <el-form-item label="公司名称：" class="form-inline-search-item">
                                            <el-input v-model="form.companyName" placeholder="请输入公司名称"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="this.isSmallBtn ? 6 : 10">
                                        <el-form-item label="当前环节：" class="form-inline-search-item" style="margin-bottom: 10px">
                                            <el-radio-group v-model="form.currentLink">
                                                <el-radio label="0" border size="medium">全部</el-radio>
                                                <el-radio label="1" border size="medium">待初评</el-radio>
                                                <el-radio label="2" border size="medium">初评完成</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="this.isSmallBtn ? 6 : 4" class="btns" style="text-align: right">
                                        <el-button
                                                class="filter-item"
                                                type="primary"
                                                style="margin-left: 10px;padding: 10px 30px"
                                                @click="handleFilter"
                                        >
                                            检索
                                        </el-button>
                                        <!--<el-button
                                                class="filter-item"
                                                style="margin-left: 10px;"
                                                icon="el-icon-refresh"
                                                @click="handleReset"
                                        >
                                            重置
                                        </el-button>-->
                                    </el-col>
                                </el-row>
                            </el-form>

                        </div>
                        <!-- 表格开始 -->
                        <el-table
                                v-loading="listLoading"
                                :data="list"
                                border
                                fit
                                highlight-current-row
                                @current-change="showDetail"
                                style="width: 100%;margin-top: 15px"
                                ref='mainTable'
                                >
                        >
                            <el-table-column label="序号" type="index" align="center" width="80px">
                                <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                                </template>
                            </el-table-column>
                            <el-table-column label="年度" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.sideName}}</template>
                            </el-table-column>
                            <el-table-column label="企业名称" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.sideCode}}</template>
                            </el-table-column>
                            <el-table-column label="法定代表人" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.startTime}}</template>
                            </el-table-column>
                            <el-table-column label="许可证号" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.endTime}}</template>
                            </el-table-column>
                            <el-table-column label="联系电话" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.status === 1 ? '异常' : '正常' }}</template>
                            </el-table-column>
                            <el-table-column label="营业执照号" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.endTime}}</template>
                            </el-table-column>
                            <el-table-column label="统一社会信用代码" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.endTime}}</template>
                            </el-table-column>
                            <el-table-column label="上年度质量信誉等级" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.endTime}}</template>
                            </el-table-column>
                            <el-table-column label="当前状态" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.status === 1 ? '异常' : '正常' }}</template>
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    align="center"
                                    width="100"
                                    class-name="small-padding fixed-width"
                            >
                                <template slot-scope="{row}">
                                    <i class="icon iconfont iconchuli" style="font-size: 18px;cursor: pointer;" title="提交" @click.stop="onSubmit(row)"></i>
                                    <!--<i class="el-icon-aim" style="font-size: 18px;cursor: pointer;" @click="showVideoTracing(row)"></i>-->
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 分页控件 -->
                        <div style="text-align: center">
                            <pagination
                                    v-show="total >0"
                                    :total="total"
                                    :page.sync="listQuery.page"
                                    :limit.sync="listQuery.size"
                                    style="padding:0px !important"
                                    class="pagination"
                                    @pagination="getList"
                                    :pageSizes="[10]"
                            />
                        </div>

                    </el-card>
                    <!--下部列表，质量信誉考核相关文件-->
                    <el-card class="box-card" style="margin-top: 20px" v-if="JSON.stringify(this.companyCurrentRow)!=='{}'">
                        <common-subtitle :isBold="true" :title="companyCurrentRow.sideName + '2020年质量信誉考核相关文件'" style="padding-top: 0;"></common-subtitle>
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

                </div>
            </el-main>
        </el-container>

    </div>
</template>
<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import Pagination from '@/components/Pagination'
    import {fetchAreaTree,fetchLadeProcessDetailInfo} from '@/api/courseMonitor/handingProcess'
    import {mapState, mapGetters} from 'vuex'
    export default {
        name: 'EADepartmentPreliminaryAssessmentIndex',
        components: {Pagination, CommonSubtitle},
        data() {
            return {
                //要检索的条件
                form: {
                    currentLink:null,//当前环节
                    companyName:'',//公司名称
                    year:'',//年度
                },
                list: [{"id":1,"companyId":1,"ladeSiteId":1,"status":1,"startTime":"2020-06-22 17:49:31","endTime":"2020-06-22 17:49:34","updateTime":"2020-06-22 17:49:36","createTime":"2020-06-22 17:49:38","sideName":"装载位1","sideCode":"111"},
                    {"id":2,"companyId":2,"ladeSiteId":2,"status":2,"startTime":"2020-06-22 17:49:31","endTime":"2020-06-22 17:49:34","updateTime":"2020-06-22 17:49:36","createTime":"2020-06-22 17:49:38","sideName":"装载位2","sideCode":"222"}
                ],//列表
                total: 1,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                statusOptions:[
                    {
                        value: null,
                        label: '全部'
                    },
                    {
                        value: 1,
                        label: '异常'
                    },
                    {
                        value: 0,
                        label: '正常'
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
                        dealDisabled:false,
                    },
                    {
                        name:'烟台市危货企业质量信誉等级评定表',
                        unSubmitted:1,
                        submitted:0,
                        time:'2020-02-12 18:21:21',
                        viewDisabled:true,
                        dealDisabled:true,
                    }
                ],
                companyCurrentRow:{},//点击公司，保存的公司信息

            }
        },
        computed: {
            ...mapState([
                'evaluateAnalysis',
            ])},
        watch: {},
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize = function () {
                self.setBtns();
            }
        },
        mounted(){

        },
        methods: {
            //设置按钮样式
            setBtns() {
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },
            //获取列表数据
            getList() {
                let self = this;
                this.listLoading = true;
                let params = {
                    ...this.listQuery,
                    "status": this.form.status,
                    "startTime": this.form.startTime ? D.helper.dateFormat(this.form.startTime) :'',
                    "endTime": this.form.endTime ? D.helper.dateFormat(this.form.endTime):'',
                    "companyId": this.form.companyId,
                };
                fetchLadeProcessDetailInfo(params).then(res => {
                    self.listLoading = false;
                    self.list = res.data.list;
                    self.total = res.data.total
                }).catch(err => {
                    self.listLoading = false;
                });

            },
            //点击搜索
            handleFilter() {
                this.listQuery.page = 1;
                this.getList();
            },
            //点击表格
            showDetail(val) {
//                console.log('valvalval',val);
                this.companyCurrentRow = val;
                //点击的表格是处理/查看
            },
            //判断是否提交;
            onSubmit(data){
                //提交时需判断文件2和3是否提交完成，没有提交完成给出提示框：请完成提交《烟台市危险货物运输企业质量信誉考核评分表》和《烟台市危货企业质量信誉等级评定表》后点击提交
                this.$confirm(`请完成提交《烟台市危险货物运输企业质量信誉考核评分表》和《烟台市危货企业质量信誉等级评定表》后点击提交`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                }).catch(() => {
                });

            },
            dealDiffPage(item,type){
                //点击的按钮是处理/查看
                this.$store.dispatch("evaluateAnalysis/setFormStatus",{formStatus:type});

                //存储点击的公司初评信息
                this.$store.dispatch("evaluateAnalysis/setTableCurrentRow",{tableCurrentRow:this.companyCurrentRow});

                //跳转不同界面
                switch (item.name){
                    case '烟台市危险货物运输企业质量信誉考核评分表':
                        this.$router.push({name: 'EADepartmentPreliminaryAssessmentCheckScale'});
                        break;
                    case '质量信誉等级评定申请表':
                        this.$router.push({name: 'EADepartmentPreliminaryAssessmentApplicationForm'});
                        break;
                    case '烟台市危货企业质量信誉等级评定表':
                        this.$router.push({name: 'EADepartmentPreliminaryAssessmentRatingForm'});
                        break;
                }
            },
            //查询
            showFilePage(){
                this.$router.push({path: '/evaluate-analysis/department-preliminary-assessment/test'}) // 登录成功之后重定向到首页
            },
            //默认选中高亮
            setCurrentRow(){
                let currentRow = this.list.map((val)=>{
                    if(val.id === this.evaluateAnalysis.tableCurrentRow.id){
                        this.$refs.mainTable.setCurrentRow(val);
                        return val
                    }else{
                        this.companyCurrentRow = {};
                        return {}
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    //内容样式
    .el-card {
        border: 0;
        /deep/.el-table th{
            background-color: #308FE4;
            color: #fff;
        }
    }
    .el-card.is-always-shadow {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    }

    //搜索条件样式
    .form-inline-search {
        .form-inline-search-item {
            width: 100%;
            /deep/ .el-form-item__content {
                width: calc(100% - 100px);
            }
        }
        .el-radio.is-bordered + .el-radio.is-bordered {
            margin-left: 0;
        }
        .el-radio:after {
            clear: both;
            content: '';
        }

    }
    .el-select{
        width: 100%;
    }

</style>
