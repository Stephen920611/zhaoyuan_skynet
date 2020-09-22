<template>
    <div class="app-container">
        <el-container>
            <el-aside width="300px" class="search-tree all-background" >
                <el-input
                        class="search-tree-input"
                        placeholder="输入搜索内容"
                        v-model="filterText">
                </el-input>
                    <el-tree
                            v-loading="treeLoading"
                            :props="props"
                            class="filter-tree"
                            :data="treeData"
                            :default-expand-all=true
                            :current-node-key="currentNodekey"
                            highlight-current
                            :filter-node-method="filterNode"
                            icon-class="el-icon-caret-right"
                            @node-click="handleNodeClick"
                            :default-checked-keys="defaultCheckedKeys"
                            node-key="code"
                            ref="tree"
                            style="height: calc(100% - 51px);overflow-y: auto;"
                    >
                    <span slot-scope="{node,data}" class="ellipsis-l1 font-size-14">
                        <span :title="data.text">{{data.text}}</span>
                    </span>
                    </el-tree>

            </el-aside>
            <el-main class="list-main all-background">
                <div class="text item" >
                    <div class="filter-container">
                        <el-form :inline="true" :model="form" class="form-inline-search">
                            <el-row>
                                <el-col :span="this.isSmallBtn ? 6 : 6">
                                    <el-form-item label="开始时间：" class="form-inline-search-item">
                                        <el-date-picker type="date" placeholder="请选择开始时间" v-model="form.startTime"
                                                        style="width: 100%;"
                                                        :picker-options="pickerTimeBeg"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 6">
                                    <el-form-item label="结束时间：" class="form-inline-search-item">
                                        <el-date-picker type="date" placeholder="请选择结束时间" v-model="form.endTime"
                                                        :picker-options="pickerTimeEnd"
                                                        style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 6">
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
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 6" class="btns">
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
                    <common-subtitle :isBold="true" :title="'检索结果：'+ total "></common-subtitle>

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
                        <el-table-column label="编号" type="index" align="center" width="80px">
                            <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="装卸位名称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.sideName}}</template>
                        </el-table-column>
                        <el-table-column label="装卸ID" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.sideCode}}</template>
                        </el-table-column>
                        <el-table-column label="操作开始时间" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.startTime}}</template>
                        </el-table-column>
                        <el-table-column label="操作结束时间" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.endTime}}</template>
                        </el-table-column>
                        <el-table-column label="操作状态" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.status === 1 ? '异常' : '正常' }}</template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center"
                                width="100"
                                class-name="small-padding fixed-width"
                        >
                            <template slot-scope="{row}">
                                <i class="icon iconfont iconzhuisu" style="font-size: 18px;cursor: pointer;" title="视频追溯" @click="showVideoTracing(row)"></i>
                                <!--<i class="el-icon-aim" style="font-size: 18px;cursor: pointer;" @click="showVideoTracing(row)"></i>-->
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
        <el-dialog v-if="videoTracingVisible" :visible.sync="videoTracingVisible" width="950px" append-to-body :close-on-click-modal=false>
            <div slot="title">
                <span style="padding-right: 10px;">视频追溯</span>
            </div>
            <video-tracing v-on:toggleVideoTracing = "toggleVideoTracing"></video-tracing>
        </el-dialog>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import VideoTracing from './components/videoTracing'
    import {fetchAreaTree,fetchLadeProcessDetailInfo} from '@/api/courseMonitor/handingProcess'
    import D from '@/utils/DFDZ'

    export default {
        name: 'RegionList',
        components: {Pagination,CommonSubtitle,VideoTracing},
        data() {
            return {
                list: [],//列表
                total: 0,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                //要检索的条件
                form: {
                    status: null,//（int）操作状态 0正常 1异常（非必填）
                    startTime: '',//（String）开始时间（非必填）
                    endTime: '',//（String）结束时间（非必填）
                    companyId:null,//公司名称
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

                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行

                filterText: '',//树搜索
                currentNodekey: '',//当前选中的keys值
                defaultCheckedKeys:[],//默认选中的key数组
                props: {
                    label: 'text', // 需要指定的节点渲染对象属性
                    children: 'nodes' // 指定的子级
                },
                //树数据
                treeData: [],
                treeLoading: false, //树加载状态

                videoTracingVisible:false,  //是否展示视频追溯

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
                this.treeLoading = true;
                //请求接口
                let self = this;
                let params = {
                    "ifShowSide": "2"
                };
                fetchAreaTree(params).then(res => {
//                    self.currentNodekey = []
                    self.currentNodekey = res.data[0].text;
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
                let self = this;
                //如果点击的树节点为公司
                if(data.hasOwnProperty('type') && data.type === 'company'){
                    this.form.companyId = data.id
                }else{
                    this.form.companyId = null
                }

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

            // 重置查询
            handleReset() {
//                this.listQuery.code = ''
                this.listQuery.page = 1;
                this.listQuery.size = 10;
                this.form.status = null;//（int）操作状态 0正常 1异常（非必填）
                this.form.startTime = '';//（String）开始时间（非必填）
                this.form.endTime = '';//（String）结束时间（非必填）
                this.form.companyId = null;//公司名称
                this.fetchTreeData();
            },
            //操作
            showDetail(data) {

            },

            //弹窗的显示与隐藏
            toggleVideoTracing(type){
                this.videoTracingVisible = type
            },

            //打开视频追溯
            showVideoTracing(data){
                this.$store.dispatch('courseMonitor/handingProcess/setLadeProcessInfo', data);
                this.videoTracingVisible = true
            },
            closeDialog(){
                this.videoTracingVisible = false

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
    .el-select{
        width: 100%;
    }
    //弹出框样式
    /deep/.el-dialog__body{
        padding: 20px !important;
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
        padding: 20px 20px;
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
