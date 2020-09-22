<template>
    <div class="app-container">
        <el-container>
            <el-aside width="300px" class="search-tree all-background">
                <el-input
                        class="search-tree-input"
                        placeholder="输入搜索内容"
                        v-model="filterText">
                </el-input>
                <el-tree
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
                        <span :title="data.label">{{data.label}}</span>
                    </span>
                </el-tree>
            </el-aside>
            <el-main class="list-main all-background">
                <div class="text item">
                    <div class="filter-container">
                        <el-form :inline="true" :model="form" class="form-inline-search">
                            <el-row>
                                <el-col :span="this.isSmallBtn ? 6 : 6">
                                    <el-form-item label="开始时间：" class="form-inline-search-item">
                                        <el-date-picker type="date" placeholder="请选择开始时间" v-model="form.startDate"
                                                        style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 6">
                                    <el-form-item label="结束时间：" class="form-inline-search-item">
                                        <el-date-picker type="date" placeholder="请选择结束时间" v-model="form.endDate"
                                                        style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="this.isSmallBtn ? 12 : 12" class="btns">
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
                            style="width: 100%;margin-top: 15px"
                            height="calc(100vh - 377px)"
                    >
                        <el-table-column label="序号" type="index" align="center" width="80px">
                            <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="企业名称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.code}}</template>
                        </el-table-column>
                        <el-table-column label="通知下发时间" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.shortName}}</template>
                        </el-table-column>
                        <el-table-column label="整改期限" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.fullName}}</template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center"
                                width="100"
                                class-name="small-padding fixed-width"
                        >
                            <template slot-scope="{row}">
                                <!--<i class="el-icon-edit-outline" style="font-size: 18px" @click="showDetail(row)"></i>-->
                                <i class="icon iconfont iconchakan" title="查看" @click="showDetail(row)"></i>
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
        <el-dialog :visible.sync="detailVisible" width="900px" append-to-body>
            <div slot="title">
                <span style="padding-right: 10px;">查看</span>
            </div>
            <edit-notice v-on:toggleDetail = "toggleDetail" ></edit-notice>
            <!--<video-tracing v-on:toggleDetail = "toggleDetail"></video-tracing>-->
        </el-dialog>

    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import EditNotice from './components/editNotice.vue'
    export default {
        name: 'CMRectificationNoticeIndex',
        components: {Pagination,CommonSubtitle,EditNotice},
        data() {
            return {

                list: [
                    {code: '37001', shortName: '东辖区', fullName: '烟台市-龙口市-东辖区'},
                    {code: '37002', shortName: '东辖区', fullName: '烟台市-龙口市-东辖区'},
                    {code: '37003', shortName: '东辖区', fullName: '烟台市-龙口市-东辖区'},
                    {code: '37004', shortName: '东辖区', fullName: '烟台市-龙口市-东辖区'},
                    {code: '37005', shortName: '东辖区', fullName: '烟台市-龙口市-东辖区'}
                ],//列表
                total: 1,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                //要检索的条件
                form: {
                    startDate: '',  //开始时间
                    endDate: '',  //结束时间
                },

                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行

                filterText: '',//树搜索
                currentNodekey: '',//当前选中的keys值

                //树数据
                treeData: [{
                    "children": [
                        {
                            "code": "KM02",
                            "label": "龙口"
                        }
                    ],
                    "id": "1267808018266710017",
                    "label": "龙口市"
                },
                    {
                        "children": [
                            {
                                "code": "KM03",
                                "label": "海阳"
                            }
                        ],
                        "id": "1267760247081869314",
                        "label": "海阳市"
                    },
                    {
                        "children": [
                            {
                                "code": "KM02",
                                "label": "芝罘"
                            }
                        ],
                        "id": "1267752184782327810",
                        "label": "芝罘区"
                    }
                ],
                detailVisible:false

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
            this.fetchTreeData()
        },
        methods: {
            //设置按钮样式
            setBtns() {
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },

            //获取树的数据
            fetchTreeData() {
                //请求接口
                this.currentNodekey = this.treeData[0].id;//默认为选中第一个
            },

            //搜索框
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            //点击树节点
            handleNodeClick: function (data, node, event) {
                let self = this;

            },
            //获取列表数据
            getList() {

            },
            //点击搜索
            handleFilter() {
                this.listQuery.page = 1;
                this.getList();
            },

            // 重置查询
            handleReset() {
                this.listQuery.villageName = ''
//                this.listQuery.code = ''
                this.listQuery.page = 1;
                this.listQuery.size = 10;
                this.getList();
            },
            //操作
            showDetail(data){
                this.detailVisible = true
            },
            //弹窗的显示与隐藏
            toggleDetail(type){
                this.detailVisible = type
            },


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
    //弹出框样式
      /deep/.el-dialog__body{
          padding: 20px 60px 20px 20px!important;
      }
    /deep/ .el-dialog__header {
        background-color: #304156;
        color: #fff;
        padding: 13px 20px;
    }
    /deep/.el-dialog__header .el-dialog__headerbtn{
        top:10px
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
