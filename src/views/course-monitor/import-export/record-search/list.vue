<template>
    <div class="app-container" >
        <el-container>
            <el-aside width="300px" class="search-tree all-background" v-loading="treeLoading">
                <el-input
                        class="search-tree-input"
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                </el-input>
                <el-tree
                        :props="props"
                        class="filter-tree"
                        :data="treeData"
                        :default-expand-all=true
                        :current-node-key="currentNodekey"
                        highlight-current
                        :filter-node-method="filterNode"
                        icon-class="el-icon-caret-right"
                        @node-click="handleNodeClick"
                        node-key="code"
                        ref="tree"
                        style="height: calc(100% - 51px);overflow-y: auto;"
                >
                    <span slot-scope="{node,data}" class="ellipsis-l1 font-size-14">
                        <span :title="data.text">{{data.text}}</span>
                    </span>
                </el-tree>
            </el-aside>
            <el-main class="list-main  all-background">
                <div class="text item" style="height: 100%">
                    <div class="filter-container">
                        <el-form :inline="true" :model="form" class="form-inline-search">
                            <el-row>
                                <el-col :span="this.isSmallBtn ? 12 : 5">
                                    <el-form-item label="运单编号：" class="form-inline-search-item">
                                        <el-input
                                                v-model="form.wayBillNo"
                                                placeholder="请输入运单编号"
                                                class="filter-item"
                                                @keyup.enter.native="handleFilter"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 12 : 5">
                                    <el-form-item label="车牌号码：" class="form-inline-search-item">
                                        <el-input
                                                v-model="form.carNum"
                                                placeholder="请输入车牌号码"
                                                class="filter-item"
                                                @keyup.enter.native="handleFilter"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 12 : 8">
                                    <el-form-item label="核验结论：" class="form-inline-search-item">
                                        <el-radio-group v-model="form.checkResult" size="medium">
                                            <el-radio :label="1" border >正常</el-radio>
                                            <el-radio :label="0" border >不正常</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 12 : 6" class="btns">
                                    <el-button
                                            class="filter-item"
                                            type="primary"
                                            icon="el-icon-search"
                                            style="margin-left: 10px;"
                                            @click="handleFilter"
                                    >
                                        搜索
                                    </el-button>
                                    <el-button
                                            class="filter-item"
                                            style="margin-left: 10px;"
                                            icon="el-icon-refresh"
                                            @click="handleReset"
                                    >
                                        重置
                                    </el-button>
                                    <!--<el-button
                                            class="filter-item"
                                            style="margin-left: 10px;"
                                            type="primary"
                                            icon="el-icon-refresh"
                                            @click="showDetail(row)"
                                    >
                                        查看
                                    </el-button>-->
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="this.isSmallBtn ? 12 : 5">
                                    <el-form-item label="开始时间：" class="form-inline-search-item">
                                        <el-date-picker
                                                type="datetime"
                                                placeholder="请选择开始时间"
                                                v-model="form.startTime"
                                                :picker-options="pickerTimeBeg"
                                                style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 12 : 5">
                                    <el-form-item label="结束时间：" class="form-inline-search-item">
                                        <el-date-picker
                                                v-model="form.endTime"
                                                type="datetime"
                                                placeholder="请选择结束时间"
                                                style="width: 100%;"
                                                :picker-options="pickerTimeEnd"
                                                >
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 12 : 14">
                                    <el-form-item label="进出目的：" class="form-inline-search-item">
                                        <el-radio-group v-model="form.waybillPurpose">
                                            <el-radio :label="1" border size="medium">装车</el-radio>
                                            <el-radio :label="2" border size="medium">卸车</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-row>


                        </el-form>

                    </div>
                    <!-- 表格开始 -->
                    <el-table
                            v-loading="loading"
                            :data="list"
                            border
                            fit
                            highlight-current-row
                            style="width: 100%;"
                            height="calc(100% - 274px)"
                    >
                        <el-table-column label="序号" type="index" align="center" width="80px">
                            <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="运单编号" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.wayBillNo}}</template>
                        </el-table-column>
                        <el-table-column label="车牌号码" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.carNum}}</template>
                        </el-table-column>
                        <!--<el-table-column label="驾驶人员" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.driverName}}</template>
                        </el-table-column>-->
                        <el-table-column label="进出目的" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.waybillPurpose === 1 ? '装车' : row.waybillPurpose === 2 ? '卸车' : ''}}</template>
                        </el-table-column>
                        <el-table-column label="进厂时间" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.toPortDate}}</template>
                        </el-table-column>
                        <el-table-column label="出厂时间" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.departPortDate}}</template>
                        </el-table-column>
                        <el-table-column label="核验结论" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.checkResultName}}</template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center"
                                width="100"
                                class-name="small-padding fixed-width"
                        >
                            <template slot-scope="{row}">
                                <i class="icon iconfont iconchakan" style="cursor: pointer" title="查看" @click="showDetail(row)"></i>
                                <!--<i class="el-icon-edit-outline" style="font-size: 18px" @click="showDetail(row)"></i>-->
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页控件 -->
                    <pagination
                            v-show="total >0"
                            :total="total"
                            :page.sync="listQuery.page"
                            :limit.sync="listQuery.size"
                            style="padding:0px !important"
                            class="pagination"
                            @pagination="getList"
                    />
                </div>
            </el-main>
        </el-container>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {fetchAreaTree,fetchCheckDetailInfo} from '@/api/courseMonitor/importExport'
    import D from '@/utils/DFDZ'

    export default {
        name: 'RegionList',
        components: {Pagination},
        data() {
            return {
                list: [],//列表
                total: 0,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                //要检索的条件
                form: {
                    companyId:null,//公司名称
                    wayBillNo: '',//运单编号
                    carNum: '',    //车牌号码
                    startTime: '',  //开始时间
                    endTime: '',  //结束时间
                    waybillPurpose: null,//进出目的
                    checkResult: null,//核验结论
                },

                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行

                filterText: '',//树搜索
                currentNodekey: '',//当前选中的keys值
                props: {
                    label: 'text', // 需要指定的节点渲染对象属性
                    children: 'nodes' // 指定的子级
                },
                loading:true,
                treeLoading:true,
                //树数据
                treeData: [],
                pickerTimeBeg: { //限制开始时间
                    disabledDate: (time) => {
                        if (this.form.endTime !== '' && this.form.endTime) {
                            let timeStr = this.form.endTime.getTime();
                            return time.getTime() > timeStr;
                        } else {
                            return ''
                        }
                    }
                },
                pickerTimeEnd: { //限制结束时间
                    disabledDate: (time) => {
                        if (this.form.startTime !== '' && this.form.startTime) {
                            let timeStr = this.form.startTime.getTime();
                            return time.getTime() < timeStr;
                        } else {
                            return ''
                        }
                    }
                },
            }
        },

        watch: {
            filterText(val) {//监听树搜索
                this.$refs.tree.filter(val);
            }
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize = function () {
                self.setBtns();
            }
        },
        mounted() {
            //获取树数据
            this.fetchTreeData();
        },
        methods: {
            //设置按钮样式
            setBtns() {
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1480;
            },

            //获取树的数据
            fetchTreeData() {
                this.loading = true;
                this.treeLoading = true;
                    //请求接口
                let self = this;
                let params = {
                    "ifShowSide": "2"
                };
                fetchAreaTree(params).then(res => {
                    self.treeLoading = false;
                    self.treeData = res.data;
                    self.getList();
                }).catch(err => {
                    self.treeLoading = false;

                });
            },

            //搜索框
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },

            //点击树节点
            handleNodeClick: function (data, node, event) {
                //如果点击的树节点为公司
                if(data.hasOwnProperty('type') && data.type === 'company'){
                    this.form.companyId = data.id;
                    this.handleFilter()
                }else{
                    this.form.companyId = null
                }

            },
            //获取列表数据
            getList() {
                let self = this;
                this.loading = true;
                let params = {
                    ...this.listQuery,
                    "waybillPurpose": this.form.waybillPurpose,
                    "carNum": this.form.carNum,
                    "checkResult": this.form.checkResult,
                    "wayBillNo": this.form.wayBillNo,
                    "startTime": this.form.startTime ? D.helper.dateFormat(this.form.startTime):'',
                    "endTime": this.form.endTime ? D.helper.dateFormat(this.form.endTime):'',
                    "companyId": this.form.companyId,
                };
                fetchCheckDetailInfo(params).then(res => {
                    self.loading = false;
                    self.list = res.data.list;
                    self.total = res.data.total
                }).catch(err => {
                    self.loading = false;
                });
            },
            //点击搜索
            handleFilter() {
                this.listQuery.page = 1;
                this.getList();
            },

            // 重置查询
            handleReset() {
                this.form.wayBillNo = '';//运单编号
                this.form.carNum = '';//车牌号码
                this.form.startTime= '';  //开始时间
                this.form.endTime= '';  //结束时间
                this.form.waybillPurpose= null;  //进出目的
                this.form.checkResult= null;  //核验结论
                this.listQuery.page = 1;
                this.form.companyId = null;//公司名称
//                this.getList();
                this.fetchTreeData();
            },
            //操作
            showDetail(data) {
                this.$store.dispatch("importExport/setEleWaybillDetailInfo",{eleWaybillDetail:data})
                this.$router.push(
                    {
                        name: 'cMVerificationRecordSearchDetail',
                        query: {}
                    }
                )

            }

        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    @import "~@/styles/course-monitor.scss";
    .pagination {
        /deep/ .el-pagination {
            display: flex;
            justify-content: center;
        }
    }

    //树样式
    /deep/ .el-aside {
        background-color: #ffffff;
        line-height: 1;
        color: #333;
        text-align: center;
        padding: 20px 10px;
        /*border: 1px solid #ebebeb;*/
    }

    .search-tree {
        .search-tree-input {
            margin-bottom: 15px;
        }
        /deep/ .el-tree-node__label {
            font-size: 14px
        }

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

    //列表样式
    .list-main {
        /*border: 1px solid #ebebeb;*/
        padding: 20px;
        margin-left: 10px;
    }

    .el-radio {
        margin-right: 0;
    }

    .width-70 {
        width: 70%;
    }

    .width-90 {
        width: 90%;
    }

    .btns {
        display: flex;
        justify-content: flex-end;

        /* 大屏幕 ：大于等于1200px*/
        @media (min-width: 1200px) {

        }

        /*默认*/
        @media screen and (min-width: 980px) and (max-width: 1199px) {

        }

        /* 平板电脑和小屏电脑之间的分辨率 */
        @media screen and (min-width: 768px) and (max-width: 979px) {

        }
        button {
            /*width: 100px;*/
        }
    }
</style>
