<template>
    <div class="text item cm-haq-wrap">
        <div class="cm-haq-list">
            <el-card class="box-card">
                <common-subtitle :isBold="true" :title="'检索结果：'+ tableList.length " style="padding-top: 0;"></common-subtitle>
                <div class="cm-haq-list-container " v-loading="listLoading">
                    <div v-for="(val,idx1) in tableList" :key="idx1" class="cm-haq-list-item-content">
                        <el-image style="width:100%; height: 180px;margin-bottom: 10px" :src="require('@/assets/image/login_bg.png')">
                        </el-image>
                        <el-row>
                            <el-col :span="20" class="search-wrap">
                                <div class="cm-haq-list-item-alarm-points ellipsis-l1 font-size-18" :title="val.carNum">
                                    <span class="font-bold" :title="val.carNum">{{val.carNum}}</span>
                                </div>
                            </el-col>
                             <el-col :span="4" class="search-wrap">
                                 <div class="cm-haq-list-item-alarm-times ellipsis-l1 text-right">
                                     <el-tag :type="(val.alarmTypeName=='高')?'danger':'warning'" class="font-bold" :title="val.alarmTypeName">
                                         {{val.alarmTypeName}}
                                     </el-tag>
                                 </div>
                             </el-col>
                        </el-row>
                        <el-row style="color:#606266">
                            <el-col :span="24" class="search-wrap" >
                                <div class="cm-haq-list-item-alarm-times ellipsis-l1 " :title="val.alarmAddress">
                                    <span :title="val.alarmAddress">{{val.alarmAddress}}</span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-divider></el-divider>
                        <ul class="cm-haq-list-item-notice">
                            <el-row>
                                <el-col :span="12" class="text-left">
                                    <div class="cm-haq-list-item-update-time ellipsis-l1" :title="val.alarmTime">
                                        {{val.alarmTime}}
                                    </div>
                                </el-col>
                                <el-col :span="12" class="text-right" style="margin-top: 3px">
                                    查看详情 <i class="fa fa-chevron-circle-right" style="color: #1296DB;"></i>
                                </el-col>
                            </el-row>
                        </ul>
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
                        :pageSizes="[10]"
                        @pagination="getList"
                />
            </el-card>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonSubtitle from '@/components/CommonSubtitle'
    import Pagination from '@/components/Pagination'

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
        components: {CommonSubtitle, Pagination},
        data() {
            return {
                //列表内容
                tableList: [
                    {
                        alarmAddress: "东方电子工业园园区西墙东南角",
                        alarmTime: "2020-06-24 10:15:53",
                        alarmType: 1,
                        alarmTypeName: "高",
                        carId: 1,
                        carNum: "周界入侵告警",
                        companyId: 1,
                        createTime: "2020-06-24 10:15:36",
                        id: 2,
                        updateTime: "2020-06-24 10:15:34"
                    },
                    {
                        alarmAddress: "东方电子工业园园区西墙东南角",
                        alarmTime: "2020-06-24 10:15:53",
                        alarmType: 1,
                        alarmTypeName: "中",
                        carId: 1,
                        carNum: "周界入侵告警",
                        companyId: 1,
                        createTime: "2020-06-24 10:15:36",
                        id: 2,
                        updateTime: "2020-06-24 10:15:34"
                    },
                    {
                        alarmAddress: "东方电子工业园园区西墙东南角",
                        alarmTime: "2020-06-24 10:15:53",
                        alarmType: 1,
                        alarmTypeName: "高",
                        carId: 1,
                        carNum: "周界入侵告警",
                        companyId: 1,
                        createTime: "2020-06-24 10:15:36",
                        id: 2,
                        updateTime: "2020-06-24 10:15:34"
                    },
                    {
                        alarmAddress: "东方电子工业园园区西墙东南角",
                        alarmTime: "2020-06-24 10:15:53",
                        alarmType: 1,
                        alarmTypeName: "高",
                        carId: 1,
                        carNum: "周界入侵告警",
                        companyId: 1,
                        createTime: "2020-06-24 10:15:36",
                        id: 2,
                        updateTime: "2020-06-24 10:15:34"
                    },
                    {
                        alarmAddress: "东方电子工业园园区西墙东南角",
                        alarmTime: "2020-06-24 10:15:53",
                        alarmType: 1,
                        alarmTypeName: "高",
                        carId: 1,
                        carNum: "周界入侵告警",
                        companyId: 1,
                        createTime: "2020-06-24 10:15:36",
                        id: 2,
                        updateTime: "2020-06-24 10:15:34"
                    },
                    {
                        alarmAddress: "东方电子工业园园区西墙东南角",
                        alarmTime: "2020-06-24 10:15:53",
                        alarmType: 1,
                        alarmTypeName: "高",
                        carId: 1,
                        carNum: "周界入侵告警",
                        companyId: 1,
                        createTime: "2020-06-24 10:15:36",
                        id: 2,
                        updateTime: "2020-06-24 10:15:34"
                    },
                    {
                        alarmAddress: "东方电子工业园园区西墙东南角",
                        alarmTime: "2020-06-24 10:15:53",
                        alarmType: 1,
                        alarmTypeName: "高",
                        carId: 1,
                        carNum: "周界入侵告警",
                        companyId: 1,
                        createTime: "2020-06-24 10:15:36",
                        id: 2,
                        updateTime: "2020-06-24 10:15:34"
                    },
                    {
                        alarmAddress: "东方电子工业园园区西墙东南角",
                        alarmTime: "2020-06-24 10:15:53",
                        alarmType: 1,
                        alarmTypeName: "高",
                        carId: 1,
                        carNum: "周界入侵告警",
                        companyId: 1,
                        createTime: "2020-06-24 10:15:36",
                        id: 2,
                        updateTime: "2020-06-24 10:15:34"
                    }

                ],
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
//                this.getList();
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
                    self.getList();
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
//                    self.tableList = self.$lodash.chunk(resp.data.list, 3);
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
    .cm-haq-wrap{
        height: 100%;
    }
    .cm-haq-list{
        height: 100%;
    }
    .el-card{
        border: 0;
        height: 100%;
        /deep/ .el-card__body{
            height: 100%;
        }
    }
    .el-card.is-always-shadow{
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
    }

    .cm-haq-list-container {
        height: calc(100% - 100px);
        padding: 20px 0 0 20px;
        .cm-haq-list-item-content {
            width: calc(25% - 20px);
            height: auto;
            border: 1px solid #E2E5EA;
            border-radius: 5px;
            padding: 10px 20px 5px 20px;
            font-size: 14px;
            float: left;
            margin-right: 20px;
            margin-bottom: 20px;
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
