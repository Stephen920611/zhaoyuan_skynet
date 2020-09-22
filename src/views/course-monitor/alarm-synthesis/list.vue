<template>
    <div class="app-container">
        <el-container>
            <el-aside width="300px" class="search-tree all-background" style="overflow: hidden;padding-right: 0">
                <CommonSubtitle title="资源列表" :isBold="true" style="width: 100%;line-height: 20px;margin-bottom: 20px"></CommonSubtitle>
                <div style="height: calc(100% - 41px);overflow-y: auto;padding-right: 10px">
                    <el-input
                            class="search-tree-input"
                            placeholder="请输入企业名称"
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
                            ref="tree">
                    <span slot-scope="{node,data}" class="ellipsis-l1 font-size-14">
                        <span :title="data.text">{{data.text}}</span>
                    </span>
                    </el-tree>
                </div>

            </el-aside>
            <el-main class="list-main tab-main">
                <el-tabs v-model="tabValue" @tab-click="changeTab">
                    <!--车辆违规报警-->
                    <el-tab-pane name="first" >
                            <span slot="label" style="padding-left:20px;">
                                <el-button type="primary" ><i class="icon iconfont iconcheliangweiguibaojing"></i>车辆违规报警</el-button>
                            </span>
                            <vehicle-violation-alarm v-if="tabValue==='first'" v-on:resetTreeData = resetTreeData></vehicle-violation-alarm>
                    </el-tab-pane>
                    <!--装卸过程报警-->
                    <el-tab-pane name="second" >
                             <span slot="label" style="padding-right:20px;">
                                <el-button type="primary" ><i class="icon iconfont iconzhuangxieguochengbaojing"></i>装卸过程报警</el-button>
                            </span>
                        <handing-process-alarm v-if="tabValue==='second'" v-on:resetTreeData = resetTreeData></handing-process-alarm>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>


    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import VideoTracing from './components/videoTracing'
    import VehicleViolationAlarm from './components/vehicleViolationAlarm'
    import HandingProcessAlarm from './components/handingProcessAlarm'

    import {fetchAreaTree} from '@/api/courseMonitor/alarmSynthesis';

    import D from '@/utils/DFDZ';

    export default {
        name: 'CMAlarmSynthesisQueryIndex',
        components: {Pagination, CommonSubtitle, VideoTracing,VehicleViolationAlarm,HandingProcessAlarm},
        data() {
            return {
                //列表内容
                tableList: [],
//                tableList: [
//                    [
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: true,
//                        },
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: true,
//                        },
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: true,
//                        }
//                    ],
//                    [
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: true,
//                        },
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: true,
//                        },
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: true,
//                        }
//                    ],
//                    [
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: true,
//                        },
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: false,
//                        },
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: false,
//                        },
//                    ],
//                    [
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: true,
//                        },
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: false,
//                        },
//                        {
//                            name: '国储石油化工',
//                            alarmPoints: '20',
//                            alarmTimes: '20',
//                            updateTime: '2020-02-15 12: 21 : 12',
//                            hasAlarmList: true,
//                            hasRectificationNotice: false,
//                        },
//                    ],
//                ],
                listLoading: false,
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

                rectificationNoticeVisible: false,
                tabValue: 'first',//tab键

            }
        },
        watch: {
            filterText(val) {//监听树搜索
                this.$refs.tree.filter(val);
            },
            tabValue(val) {//tab页的变化，显示不同的树
                //获取树数据
                this.fetchTreeData();

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

            // tab键改变触发
            changeTab: function (tab, event) {
                this.tabValue = tab.name;
                this.$store.dispatch('courseMonitor/alarmSynthesis/changeSearchCompanyInfo', {})
            },

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
                    "ifShowSide": "2",
                    "ifShowCompany":"1",
                    "companyType": this.tabValue=== 'second' ? 2 : null,//判断选择的是tab,车辆违章报警是null，显示全部的企业；装卸过程报警是2，选择港口企业
                };
                fetchAreaTree(params).then(res => {
                    self.treeLoading = false;
                    self.treeData = res.data;
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
                console.log('data',data);
                //如果点击的树节点为公司
                if(data.hasOwnProperty('type') && data.type === 'company'){
                    this.$store.dispatch('courseMonitor/alarmSynthesis/changeSearchCompanyInfo', data)
                }else{
                    this.$store.dispatch('courseMonitor/alarmSynthesis/changeSearchCompanyInfo', {})
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

            // 重置查询
            resetTreeData() {
                this.fetchTreeData()
            },




        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    @import "~@/styles/course-monitor.scss";

    .tab-main{
        /deep/.el-tabs__nav-wrap::after{
            height: 0;
        }
        /deep/.el-tabs__active-bar{
            height: 0;
        }
        /deep/.el-tabs__item.is-active{
            /deep/ .el-button--primary{
                background:#0E58B6

            }
        }
        .iconcheliangweiguibaojing,.iconzhuangxieguochengbaojing{
            margin-right: 5px;
            font-size: 14px;

        }
    }
    /deep/.el-tabs__item.is-top:last-child{
        padding-left: 0;
    }
    .el-button--medium{
        padding: 10px 40px;
    }


    //树样式
    /deep/ .el-aside {
        background-color: #ffffff;
        line-height: 1;
        color: #333;
        /*text-align: center;*/
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


    //弹出框样式
    /deep/ .el-dialog__body {
        padding: 20px !important;
    }

    /deep/ .el-dialog__header {
        background-color: #304156;
        color: #fff;
    }

    /deep/ .el-dialog__header .el-dialog__headerbtn {
        top: 10px
    }

    //列表样式
    .list-main {
        /*border: 1px solid #ebebeb;*/
        /*padding: 10px 20px 10px 20px;*/
        padding: 0;
        margin-left: 10px;
    }

</style>