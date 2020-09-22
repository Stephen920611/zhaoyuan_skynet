<template>
    <div class="app-container">
        <el-container>
            <el-main class="list-main all-background">
                <div class="text item">
                    <div class="filter-container">
                        <el-form :inline="true" :model="form" class="form-inline-search">
                            <el-row>
                                <el-col :span="this.isSmallBtn ? 6 : 4">
                                    <el-form-item label="开始时间：" class="form-inline-search-item">
                                        <el-date-picker type="date" placeholder="请选择开始时间" v-model="form.startTime" :picker-options="pickerTimeBeg"
                                                        style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 4">
                                    <el-form-item label="结束时间：" class="form-inline-search-item">
                                        <el-date-picker type="date" placeholder="请选择结束时间" v-model="form.endTime" :picker-options="pickerTimeEnd"
                                                        style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 4">
                                    <el-form-item label="报警类型：" class="form-inline-search-item">
                                        <el-select v-model="form.alarmType" placeholder="请选择">
                                            <el-option
                                                    v-for="item in alarmTypeOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 4">
                                    <el-form-item label="报警级别：" class="form-inline-search-item">
                                        <el-select v-model="form.alarmClass" placeholder="请选择">
                                            <el-option
                                                    v-for="item in alarmClassOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 8" class="btns">
                                    <el-button
                                            class="filter-item"
                                            type="primary"
                                            icon="el-icon-search"
                                            style="margin-left: 10px;"
                                            @click="handleSearch"
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
                    <common-subtitle :isBold="true" :title="'检索结果：'+ total + '个'"></common-subtitle>

                    <!-- 表格开始 -->
                    <el-table
                            v-loading="listLoading"
                            :data="tableList"
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
                        <el-table-column label="报警类型" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.alarmName}}</template>
                        </el-table-column>
                        <el-table-column label="报警时间" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.operateTime}}</template>
                        </el-table-column>
                        <el-table-column label="报警级别" header-align="center" align="center">
                            <template slot-scope="{row}">
                                <el-tag
                                        effect="light"
                                        style="color: white;"
                                        :color = "Number(row.alarmClass) ===1 ? '#e6a23c' : Number(row.alarmClass) === 2 ? '#EFC605':'#f56c6c' "
                                >
                                    {{mapToAlarmClass[row.alarmClass]}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center"
                                width="100"
                                class-name="small-padding fixed-width"
                        >
                            <template slot-scope="{row}">
                                <!--<i class="el-icon-aim" style="font-size: 18px;cursor: pointer;" @click="showVideoTracing(row)"></i>-->
                                <i class="icon iconfont iconzhuisu" style="font-size: 18px;cursor: pointer;" title="视频追溯" @click="showVideoTracing(row)"></i>
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
        <el-dialog v-if="videoTracingVisible"  :visible.sync="videoTracingVisible" width="950px" append-to-body :close-on-click-modal="false">
            <div slot="title">
                <span style="padding-right: 10px;">视频追溯</span>
            </div>
            <video-tracing v-on:toggleVideoTracing = "toggleVideoTracing" :videoTracingInfo = videoTracingInfo ></video-tracing>
        </el-dialog>
       <!-- <el-dialog :visible.sync="videoTracingVisible" width="950px" append-to-body>
            <div slot="title">
                <span style="padding-right: 10px;">下发整改通知</span>
            </div>
            <add-notice v-on:toggleVideoTracing = "toggleVideoTracing"></add-notice>
        </el-dialog>-->
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import VideoTracing from './components/videoTracing'
    import AddNotice from './components/addNotice'

    import {fetchCompanyAlarmList, fetchAlarmType} from '@/api/courseMonitor/handingProcess';
    import D from '@/utils/DFDZ';

    export default {
        name: 'CMHistoricalAlarmQueryAlarmList',
        components: {Pagination,CommonSubtitle,VideoTracing,AddNotice},
        data() {
            return {
                tableList: [],//列表
                total: 0,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                //要检索的条件
                form: {
                    startTime: '',  //开始时间
                    endTime: '',  //结束时间
                    alarmType:null,//报警类型
                    alarmClass: null,//报警级别
                },
                //限制开始时间
                pickerTimeBeg: {
                    disabledDate: (time) => {
                        if (this.form.endTime !== '' && this.form.endTime) {
                            let timeStr = this.form.endTime.getTime();
                            return time.getTime() > timeStr;
                        } else {
                            return ''
                        }
                    }
                },
                //限制结束时间
                pickerTimeEnd: {
                    disabledDate: (time) => {
                        if (this.form.startTime !== '' && this.form.startTime) {
                            let timeStr = this.form.startTime.getTime();
                            return time.getTime() < timeStr;
                        } else {
                            return ''
                        }
                    }
                },
                //报警类型
                alarmTypeOptions:[],
                //报警级别
                alarmClassOptions:[
                    {
                        value: 1,
                        label: '一般'
                    },
                    {
                        value: 2,
                        label: '较大'
                    },
                    {
                        value: 3,
                        label: '重大'
                    },
                ],
                mapToAlarmClass: {
                    1: '一般',
                    2: '较大',
                    3: '重大',
                },

                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行

                videoTracingVisible:false,
                videoTracingInfo:{},//要显示的视频追溯的详情
            }
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            //获取报警类型
            this.fetchAlarmType();
            window.onresize = function () {
                self.setBtns();
            }
        },
        mounted() {
        },
        methods: {
            //设置按钮样式
            setBtns() {
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },

            //获取报警类型
            fetchAlarmType() {
                let params = {};
                fetchAlarmType(params).then( resp => {
                    this.alarmTypeOptions = resp.data.list.map( val => {
                        return {
                            value: val.id,
                            label: val.alarmName
                        }
                    });
                    //获取列表数据
                    this.getList();
                }).catch(err => {

                })
            },

            //获取列表数据
            getList() {
                let info = this.$store.state['courseMonitor/handingProcess'].searchCompanyInfo;
                let params = {
                    "companyId": info.id,
                    "alarmId": this.form.alarmType,
                    "alarmClass": this.form.alarmClass,
                    "startTime": this.form.startTime === '' ? this.form.startTime : D.helper.dateFormat(this.form.startTime),
                    "endTime": this.form.endTime === '' ? this.form.endTime : D.helper.dateFormat(this.form.endTime),
                    "page": this.listQuery.page,
                    "size": this.listQuery.size
                };
                this.listLoading = true;
                fetchCompanyAlarmList(params).then( resp => {
                    this.listLoading = false;
                    this.tableList = resp.data.list;
                    /*this.tableList = [{
                        "id": 2,
                        "ladeProcessId": 1,
                        "alarmId": 2,
                        "isAlarm": 1,
                        "operateTime": null,
                        "updateTime": null,
                        "createTime": null,
                        "sideName": "装载位1",
                        "sideCode": "111",
                        "alarmName": "钥匙管理",
                        "alarmClass": 1
                    }];*/
                }).catch(err => {
                    this.listLoading = false;
                })
            },

            //点击搜索
            handleSearch() {
                this.listQuery.page = 1;
                this.getList();
            },

            // 重置查询
            handleReset() {
                //要检索的条件
                this.form = {
                    startTime: '',  //开始时间
                    endTime: '',  //结束时间
                    alarmType: null,//报警类型
                    alarmClass: null,//报警级别
                };
                this.listQuery.page = 1;
                this.listQuery.size = 10;
                this.getList();
            },
            //操作
            showDetail(data) {

            },

            //弹窗的显示与隐藏
            toggleVideoTracing(type){
                this.videoTracingVisible = type
            },

            //展示当前状态下的视频追溯
            showVideoTracing(data){
                this.$store.dispatch('courseMonitor/handingProcess/changeHistoricalAlarmQueryVideoTrackInfo', data).then(res => {
                    this.videoTracingInfo = data;
                    this.videoTracingVisible = true
                });
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
    //el-tag
    .el-tag{
        border-radius: 15px;
        border-color:#fff
    }

    //树样式
    /deep/ .el-aside {
        background-color: #ffffff;
        line-height: 1;
        color: #333;
        text-align: center;
        padding: 10px;
        border: 1px solid #ebebeb;
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
