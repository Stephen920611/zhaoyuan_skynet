<template>
    <div class="app-container">
        <el-container>
            <el-aside width="300px" class="search-tree all-background" style="">
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
                        :current-node-key="currentNodeKey"
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
            <el-main class="list-main all-background">
                <div class="text item">
                    <div class="filter-container">
                        <el-form :inline="true" :model="form" class="form-inline-search">
                            <el-row>
                                <el-col :span="this.isSmallBtn ? 6 : 6">
                                    <el-form-item label="企业名称：" class="form-inline-search-item">
                                        <el-input v-model="form.companyName" placeholder="请输入企业名称"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 6">
                                    <el-form-item label="开始时间：" class="form-inline-search-item">
                                        <el-date-picker
                                                type="date"
                                                placeholder="请选择开始时间"
                                                v-model="form.startTime"
                                                style="width: 100%;"
                                                :picker-options="pickerTimeBeg"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 6">
                                    <el-form-item label="结束时间：" class="form-inline-search-item">
                                        <el-date-picker
                                                type="date"
                                                placeholder="请选择结束时间"
                                                v-model="form.endTime"
                                                :picker-options="pickerTimeEnd"
                                                style="width: 100%;"
                                        ></el-date-picker>
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
                                        查询
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
                    <common-subtitle :isBold="true" :title="'检索结果：'+ total + '个'" style="padding-top: 0;"></common-subtitle>
                    <div style="height:calc(100vh - 377px);overflow-y: auto;">
                        <div class="cm-haq-list-container" v-loading="listLoading" >
                            <div v-for="(item,idx) in tableList" :key="idx" class="cm-haq-list-item">
                                <div v-for="(val,idx1) in item" :key="idx1" class="cm-haq-list-item-content">
                                    <div class="cm-haq-list-item-name">
                                        {{val.companyName}}
                                    </div>
                                    <div class="cm-haq-list-item-alarm-points">
                                        累计告警积分：<span>{{val.alarmScore}}</span>
                                    </div>
                                    <div class="cm-haq-list-item-alarm-times">
                                        累计告警次数：<span>{{val.alarmCount}}</span>
                                    </div>
                                    <div class="cm-haq-list-item-update-time">
                                        上报时间：{{val.updateTime}}
                                    </div>
                                    <el-divider></el-divider>
                                    <ul class="cm-haq-list-item-notice">
                                        <li>
                                            报警列表 <i class="fa fa-chevron-circle-right" style="color: #1296DB;" @click="toHistoricalAlarmQueryAlarmList(val)"></i>
                                        </li>
                                        <li>
                                            <span style="color: #F7536A;">下发整改通知</span>
                                            <i @click="showRectificationNotice(val)" class="fa fa-chevron-circle-right" style="color: #F7536A;"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="cm-haq-list-item-no-data" v-if="tableList.length === 0">
                                暂无数据
                            </div>
                        </div>
                    </div>

                    <!-- 分页控件 -->
                    <pagination
                            v-show="total > 0"
                            :total="total"
                            :page.sync="listQuery.page"
                            :limit.sync="listQuery.size"
                            style="padding:0px !important"
                            class="pagination"
                            :pageSizes="[15]"
                            @pagination="getList"
                    />
                </div>
            </el-main>
        </el-container>

        <el-dialog :visible.sync="rectificationNoticeVisible" width="950px" append-to-body>
            <div slot="title">
                <span style="padding-right: 10px;">下发整改通知</span>
            </div>
            <add-notice v-on:toggleRectificationNotice="toggleRectificationNotice"></add-notice>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import VideoTracing from './components/videoTracing'
    import AddNotice from './components/addNotice'

    import {fetchHistoricalAlarmQueryCompanyList, fetchAreaTree} from '@/api/courseMonitor/handingProcess';

    import D from '@/utils/DFDZ';

    export default {
        name: 'CMHistoricalAlarmQueryIndex',
        components: {Pagination, CommonSubtitle, VideoTracing, AddNotice},
        data() {
            return {
                //列表内容
                tableList: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 15,
                },
                //要检索的条件
                form: {
                    startTime: '',  //开始时间
                    endTime: '',  //结束时间
                    companyName: '',//企业名称
                    areaId: null,   //如果type为company，需要找到其对应的父节点的值
                },
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

                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行

                filterText: '',//树搜索
                currentNodeKey: '',//当前选中的keys值
                props: {
                    label: 'text', // 需要指定的节点渲染对象属性
                    children: 'nodes' // 指定的子级
                },
                treeLoading: false,
                //树数据
                treeData: [],
                //树数据
                /*treeData: [{
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
                ],*/

                rectificationNoticeVisible: false
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

//            this.getList();

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
                    self.treeLoading = false;
                    self.treeData = res.data;
                    self.getList();
                }).catch(err => {
                    self.treeLoading = false;

                });
                //请求接口
//                this.currentNodeKey = this.treeData[0].id;//默认为选中第一个
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
                    this.form.companyName = data.text;
                    this.getNodeParentAreaId(this.treeData, data.parent)
                }else{
                    this.form.companyName = '';
                    this.form.areaId = data.id;
                }
            },

            //根据当前传入的id，找到其父节点的id
            getNodeParentAreaId(nodes, parentId){
                nodes.map( val => {
                    if(val.code === parentId) {
                        this.form.areaId = val.id;
                    }else {
                        if(val.nodes.length > 0){
                            this.getNodeParentAreaId(val.nodes, parentId)
                        }
                    }
                });
            },

            //获取列表数据
            getList() {
                this.listLoading = true;
                let params = {
                    "areaId": this.form.areaId,
                    "companyName": this.form.companyName,
                    "startTime": this.form.startTime === '' ? this.form.startTime : D.helper.dateFormat(this.form.startTime),
                    "endTime": this.form.endTime === '' ? this.form.endTime : D.helper.dateFormat(this.form.endTime),
                    "page": this.listQuery.page,
                    "size": this.listQuery.size
                };
                fetchHistoricalAlarmQueryCompanyList(params).then( resp => {
                    this.listLoading = false;
                    this.total = resp.data.total;
                    this.tableList = this.$lodash.chunk(resp.data.list, 3);
                }).catch(err => {
                    this.listLoading = false;
                })
            },

            //点击搜索
            handleFilter() {
                this.listQuery.page = 1;
                this.getList();
            },

            // 重置查询
            handleReset() {
                this.form = {
                    startTime: '',  //开始时间
                    endTime: '',  //结束时间
                    companyName: '',//企业名称
                    areaId: null,//企业名称
                };
                this.listQuery.page = 1;
                this.listQuery.size = 15;
                this.getList();
            },

            //操作
            showDetail(data) {

            },
            //弹窗的显示与隐藏
            toggleRectificationNotice(type) {
                this.rectificationNoticeVisible = type
            },

            //显示下发整改通知
            showRectificationNotice(data) {
                this.rectificationNoticeVisible = true
            },

            //显示报警列表
            toHistoricalAlarmQueryAlarmList(data) {
                this.$store.dispatch('courseMonitor/handingProcess/changeSearchCompanyInfo', data).then(resp => {
                    this.$router.push(
                        {
                            name: 'CMHistoricalAlarmQueryAlarmList',
                            query: {}
                        }
                    )
                });

            },


        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    @import "~@/styles/course-monitor.scss";

    .cm-haq-list-container {
        min-height: 500px;
        .cm-haq-list-item {
            display: flex;
            margin-top: 13px;
            /*justify-content: space-between;*/
            /*align-items: center;*/
            .cm-haq-list-item-content {
                width: 32%;
                height: 140px;
                border: 1px solid #E2E5EA;
                border-radius: 5px;
                padding: 10px 20px;
                font-size: 14px;
                float: left;
                margin-right: 2%;
                .cm-haq-list-item-name {
                    font-weight: bold;
                    font-size: 20px;
                    margin-bottom: 10px;
                }
                .cm-haq-list-item-alarm-points,
                .cm-haq-list-item-alarm-times {
                    line-height: 20px;
                    height: 20px;
                    span {
                        color: #3B93E5;
                        font-weight: bold;
                    }
                }
                .cm-haq-list-item-update-time {
                    line-height: 20px;
                    height: 20px;
                }
                .cm-haq-list-item-notice {
                    li {
                        float: left;
                        i {
                            cursor: pointer;
                        }
                    }
                    li:nth-child(1) {
                        margin-right: 15px;
                    }
                }
                :global {
                    .el-divider--horizontal {
                        margin: 6px 0;
                    }
                }
            }
            .cm-haq-list-item-content:nth-child(3n){
                margin-right: 0;
            }
        }
        /*暂无数据样式*/
        .cm-haq-list-item-no-data {
            height: 500px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

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
    /deep/ .el-dialog__body {
        padding: 20px !important;
    }

    /deep/ .el-dialog__header {
        background-color: #304156;
        color: #fff;
        padding: 13px 20px;
    }

    /deep/ .el-dialog__header .el-dialog__headerbtn {
        top: 10px
    }

    //列表样式
    .list-main {
        /*border: 1px solid #ebebeb;*/
        padding: 20px 20px 20px 20px;
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