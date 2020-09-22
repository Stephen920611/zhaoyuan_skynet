<template>
    <div class="text item">
        <div class="filter-container">
            <el-form :inline="true" :model="form" class="form-inline-search">
                <el-row>
                    <el-col :span="this.isSmallBtn ? 6 : 6">
                        <el-form-item label="车牌号码：" class="form-inline-search-item">
                            <el-input v-model="form.carNum" placeholder="请输入车牌号码"></el-input>
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
                <div>
                    <el-form-item label="违规操作：" class="form-inline-search-item" style="margin-bottom: 10px">
                        <el-radio-group v-model="form.alarmType">
                            <el-radio :label="item.value" border v-for="(item, index) in alarmTypeOptions" :key="item.value"
                                      style="margin-right: 10px;float:left;margin-bottom: 10px">{{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="cm-haq-list">
            <el-card class="box-card">
                <common-subtitle :isBold="true" :title="'检索结果：'+ total " style="padding-top: 0;"></common-subtitle>
                <div class="cm-haq-list-container " v-loading="listLoading">
                    <div v-for="(item,idx) in tableList" :key="idx" class="cm-haq-list-item">
                        <div v-for="(val,idx1) in item" :key="idx1" class="cm-haq-list-item-content">
                            <el-image
                                    style="width:100%; height:180px;margin-bottom: 10px"
                                    :src="require('@/assets/image/login_bg.png')"
                            >
                            </el-image>
                            <el-row>
                                <el-col :span="8" class="search-wrap">
                                    <div class="cm-haq-list-item-alarm-points ellipsis-l1 font-size-18" :title="val.carNum">
                                        <span class="font-bold">{{val.carNum}}</span>
                                    </div>
                                </el-col>
                                <el-col :span="16" class="search-wrap">
                                    <div class="cm-haq-list-item-alarm-times ellipsis-l1 text-right">
                                        <el-tag type="danger" class="font-bold" :title="val.alarmTypeName">
                                            {{val.alarmTypeName}}
                                        </el-tag>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row style="color:#606266">
                                <el-col :span="12" class="search-wrap" >
                                    <div class="cm-haq-list-item-alarm-times ellipsis-l1 " :title="val.alarmAddress">
                                        <span>{{val.alarmAddress}}</span>
                                    </div>
                                </el-col>
                                <el-col :span="12" class="search-wrap" >
                                    <div class="cm-haq-list-item-update-time ellipsis-l1 text-right" :title="val.alarmTime">
                                        {{val.alarmTime}}
                                    </div>
                                </el-col>
                            </el-row>


                            <el-divider></el-divider>
                            <ul class="cm-haq-list-item-notice">
                                <li  @click="toAlarmDetail(val)" style="cursor: pointer;color:#606266">
                                    查看详情 <i class="fa fa-chevron-circle-right" style="color: #1296DB;"
                                ></i>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="cm-haq-list-item-no-data" v-if="tableList.length === 0">
                        暂无数据
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
                        :pageSizes="[9]"
                        @pagination="getList"
                />
            </el-card>
        </div>

        <el-dialog :visible.sync="alarmDetailVisible" width="650px" append-to-body>
            <div slot="title">
                <span style="padding-right: 10px;">报警详情</span>
            </div>
            <alarm-detail v-on:toggleAlarmDetail="toggleAlarmDetail" ></alarm-detail>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonSubtitle from '@/components/CommonSubtitle'
    import Pagination from '@/components/Pagination'
    import AlarmDetail from './alarmDetail'
    import {
        fetchAlarmClass,
        fetchtCarAlarmList
    } from '@/api/courseMonitor/alarmSynthesis';

    import {fetchVideoTrackType} from '@/api/courseMonitor/handingProcess';
    import D from '@/utils/DFDZ';
    /*引入工具类*/
    import dateTime from '@/utils/ext.dateTime'

    export default {
        name: 'vehicleViolationAlarm',
        props: [''],
        components: {CommonSubtitle, Pagination,AlarmDetail},
        data() {
            return {
                //列表内容
                tableList: [],
                total: 0,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 9,
                },
                //要检索的条件
                form: {
                    startTime: '',  //开始时间
                    endTime: '',  //结束时间
                    companyId: null,//企业名称
                    alarmType: null,//违规操作
                    carNum:'',//车牌号
                },
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
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
                alarmTypeOptions:[],
                alarmDetailVisible: false,
            }
        },
        computed: {
            //监听state中点击树节点的值的变化，根据不同的公司获取不同大的装卸区
            searchCompanyInfo() {
                return this.$store.state['courseMonitor/alarmSynthesis'].searchCompanyInfo
            }
        },
        watch: {
            //监听state中点击树节点的值的变化，更新companyId
            searchCompanyInfo() {
                this.form.companyId = this.$store.state['courseMonitor/alarmSynthesis'].searchCompanyInfo.hasOwnProperty('id') ? this.$store.state['courseMonitor/alarmSynthesis'].searchCompanyInfo.id : null;
            },
        },
        mounted() {
            this.initData();//初始化数据
        },
        methods: {
            initData(){
                this.fetchAlarmType();//获取车辆违规报警类型
                //获取列表数据
                this.getList();
            },
            //违规操作
            fetchAlarmType() {
                let self = this;
                let params = {
                    "code": "CAR_ALARM_TYPE"
                };
                fetchAlarmClass(params).then(resp => {
                    self.alarmTypeOptions = resp.data.list;
                    //获取列表数据
//                    self.getList();
                }).catch(err => {
                })

            },

            //获取列表数据
            getList() {
                this.listLoading = true;
                let self = this;
                this.form.companyId = this.$store.state['courseMonitor/alarmSynthesis'].searchCompanyInfo.hasOwnProperty('id') ? this.$store.state['courseMonitor/alarmSynthesis'].searchCompanyInfo.id : null;
                let params = {
                    "companyId": this.form.companyId,
                    "startTime": this.form.startTime === '' ? this.form.startTime : D.helper.dateFormat(this.form.startTime),
                    "endTime": this.form.endTime === '' ? this.form.endTime : D.helper.dateFormat(this.form.endTime),
                    "carNum": this.form.carNum,
                    "alarmType": this.form.alarmType,
                    "page": this.listQuery.page,
                    "size": this.listQuery.size
                };
                fetchtCarAlarmList(params).then(resp => {
                    self.listLoading = false;
                    self.total = resp.data.total;
                    self.tableList = self.$lodash.chunk(resp.data.list, 3);
                }).catch(err => {
                    self.listLoading = false;
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
                    companyId: null,//企业名称
                    alarmType: null,//违规操作
                    carNum:'',//车牌号
                };
                this.listQuery.page = 1;
                this.listQuery.size = 9;
                //重置父组件树节点
                this.$store.dispatch('courseMonitor/alarmSynthesis/changeSearchCompanyInfo', {});
                this.$emit('resetTreeData');
                this.initData();

            },

            //弹窗的显示与隐藏
            toggleAlarmDetail(type) {
                this.alarmDetailVisible = type
            },
            //显示查看详情弹窗
            toAlarmDetail(data) {
                this.$store.dispatch('courseMonitor/alarmSynthesis/changeAlarmInfo', data).then(resp => {
                    this.alarmDetailVisible = true
                });

            },
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .filter-container{
        padding: 0 20px;
    }
    .cm-haq-list{
        padding: 15px 20px 10px 20px;
    }
    .el-card{
        border: 0;
    }
    .el-card.is-always-shadow{
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
    }

    .cm-haq-list-container {
        min-height: 480px;
        .cm-haq-list-item {
            display: flex;
            margin-top: 13px;
            /*justify-content: space-between;*/
            /*align-items: center;*/
            .cm-haq-list-item-content {
                width: 32%;
                height: 290px;
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
                    margin-bottom: 3px;
                    line-height: 20px;
                    height: 20px;
                    span {
                        /*color: #3B93E5;*/
                        /*font-weight: bold;*/
                    }
                    .el-tag--medium{
                        height: 20px;
                        line-height: 20px;
                    }
                    .el-tag{
                        border-radius: 10px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        /*width:50%;*/
                        /*text-align: center;*/
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
            .cm-haq-list-item-content:nth-child(3n) {
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
        padding: 10px;
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
        .el-radio.is-bordered+.el-radio.is-bordered{
            margin-left: 0;
        }
        .el-radio:after{
            clear: both;
            content: '';
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
        padding: 10px 20px 10px 20px;
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
