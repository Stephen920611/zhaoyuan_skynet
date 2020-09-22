<!--右侧抽屉-->
<template>
    <div class="tab-container tab-main">
        <el-tabs v-model="tabValue" @tab-click="changeTab" style="text-align: center;">
            <!--添加路线-->
            <el-tab-pane name="first">
                            <span slot="label" style="padding-left:12px;">
                                <el-button ><i
                                        class="icon iconfont iconxinzeng" style="margin-right: 5px;font-size: 15px "></i>添加路线</el-button>
                            </span>
                <div style="text-align: left;padding: 0 4px; height: calc(100vh - 235px);" v-if="tabValue==='first'" >
                    <CommonSubtitle title="资源列表" :isBold="true" class="commonSub-title"></CommonSubtitle>
                    <div class="tree-wrapper">
                        <el-tree
                                class="filter-tree"
                                :data="treeData"
                                ref="tree"
                                :props="defaultProps"
                                default-expand-all
                                :filter-node-method="filterNode"
                                node-key="code"
                                v-loading="treeLoading"
                                v-scrollBar
                                @node-click="handleNodeClick"
                                highlight-current
                                show-checkbox
                                @check="changeRoute"
                        >
                            <span class="custom-tree-node ellipsis-l1" slot-scope="{node,data}" >
                              <span :title="node.label" class="ellipsis-l1">
                                  <i class="self-icon" :class="data.icon?data.icon:''"></i>{{node.label}}
                              </span>
                          </span>
                        </el-tree>
                    </div>
                </div>

            </el-tab-pane>
            <!--关联路段-->
            <el-tab-pane name="second">
                             <span slot="label" style="padding-right:12px;">
                                <el-button><i class="icon iconfont icondianziyundan" style="margin-right: 5px;font-size: 15px "></i>关联路段</el-button>
                            </span>
                <div style="text-align: left;padding: 0 4px; height: calc(100vh - 245px);overflow-y: auto" v-if="tabValue==='second'" >
                    <CommonSubtitle title="路段列表" :isBold="true" class="commonSub-title"></CommonSubtitle>
                    <div>
                        <div v-for="(val,idx) in list" :key="idx" class="route-wrapper" :class="idx+1 === routeCardNum ? 'activeClass' :''" @click="changeRouteDetail(val,idx)" >
                            <el-row class="route-card">
                                <el-col :span="2">
                                    <span class="route-num">{{idx + 1}}</span>
                                </el-col>
                                <el-col :span="22" style="padding-left: 5px">
                                    <div class="ellipsis-l1 font-bold">{{val.title}}</div>
                                    <div class="route-second ellipsis-l1">线路编号：{{val.title}}</div>
                                </el-col>
                            </el-row>
                        </div>

                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="btn-bottom-group" v-if="tabValue === 'first'">
            <el-row>
                <el-button @click="toggleRouteDetailVisible" >添加</el-button>
                <el-button @click="resetRoute">重置</el-button>
                <el-button>取消</el-button>
            </el-row>
        </div>

    </div>
</template>
<script>
    import dfCreateTree from '@/components/common/createTree.vue'
    import {
        queryAreaTree,
        queryCompanyCar,
        queryCameraPoints,
        queryBayonetPoints,
        queryParkingPoints,
        queryLadeSiteArea,
        queryLadeSitePoints,
        queryBridgePoints,
        queryTunnelPoints,
        queryLinePoints
    } from '@/api/map'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import mapShowFunc from '@/utils/mapShowFunc'
    import utility from '@/utils/ext.utility'


    export default {
        data() {
            return {
                tabValue: 'first',//tab键
                list:[
                    {
                        title:"南大街至青年南路线",
                        code:'1234567890'
                    },
                    {
                        title:"南大街至青年南路线",
                        code:'1234567890'
                    },
                    {
                        title:"南大街至青年南路线",
                        code:'1234567890'
                    },
                    {
                        title:"南大街至青年南路线",
                        code:'1234567890'
                    },
                    {
                        title:"南大街至青年南路线南大街至青年南路线南大街至青年南路线",
                        code:'1234567890'
                    },
                    {
                        title:"南大街至青年南路线",
                        code:'1234567890'
                    },
                    {
                        title:"南大街至青年南路线",
                        code:'1234567890'
                    },
                ],
                routeCardNum:1,
                form: {
                    pointType: '1',
                    pointTypes: [
                        {value: '1', label: '车辆'},
                        {value: '2', label: '摄像机'},
                        {value: '3', label: '进出卡口'},
                        {value: '4', label: '装卸区'},
                        {value: '5', label: '停车场'},
                        {value: '6', label: '桥梁'},
                        {value: '7', label: '隧道'}
                    ],
                },
                filterText: '',
                treeData: [],
                defaultProps: {
                    children: 'nodes',
                    label: 'text'
                },
                timeout: null,
                restaurants: [],
                ifShowCompany: "1",  //是否显示公司信息，"1"显示，"2"不显示
                treeLoading: false,
                userInfo: null,  //存储登录用户信息,

                selectedLineIdArr: [],
                lineTrajectoryArr: [],  //存储每条线路的若干条道路轨迹
                lineTrajectoryHash: new utility.hashTable(),   //存储每条线路轨迹

            }
        },
        components: {CommonSubtitle},
        watch: {
            filterText(val) {
                this.filterText = val;
                //监听输入框，若是清空数据后，启动筛选节点，将全部的节点显示出来
                if (!val) {
                    this.$refs.tree.filter(this.filterText);
                }
            }
        },
        mounted() {
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            this.getAreaTree({ifShowCompany: this.ifShowCompany});

        },
        methods: {
            // tab键改变触发
            changeTab: function (tab, event) {
                this.tabValue = tab.name;
                //如果是选择添加路线，要清空左侧列表的选中状态
                if(this.tabValue === 'first'){
                    console.log('11111',this.tabValue)
                    this.$emit('resetRouteCardNum');
                }
            },
            //点击左侧关联路段列表
            changeRouteDetail(val,idx){
                this.routeCardNum = idx+1
            },

            //弹窗的显示与隐藏
            toggleRouteDetailVisible(){
                //是新建还是编辑
                this.$store.dispatch("industryInfo/baseInfo/restrictedRoad/editRouteDetail",{editRouteDetail:false});
                //弹窗的显示与隐藏
                this.$store.dispatch("industryInfo/baseInfo/restrictedRoad/toggleRouteDetailVisible",{routeDetailVisible:true})
            },

            //重置按钮
            resetRoute(){
                this.getAreaTree({ifShowCompany: this.ifShowCompany});
                this.$emit("resetGoogleMap")
            },

            /**
             * 获取区域树
             */
            getAreaTree(param) {
                this.treeLoading = true;
                queryAreaTree(param).then(res => {
                    this.treeData = res.data;
                    this.treeLoading = false;
                }).catch(err => {
                    this.treeLoading = false;
                })
            },

            /*筛选符合条件的节点*/
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },

            //点击节点，加载下级节点
            handleNodeClick(node) {
                //调用父组件画线函数
//                this.$emit('addRouteLine');
            },

            //选中树节点的checkbox
            changeRoute(data,checkedKey){
//                console.log('data',data,checkedKey);
                this.$emit('addRouteLine',data);
            }

        },
    }
</script>
<style lang="less">
    .el-select-dropdown, .el-autocomplete-suggestion {
        z-index: 60000 !important;
    }

</style>
<style lang="less" scoped type="text/scss">
    @import "../style/style.running-route.less";
    @import "@/components/common/style/create-tree.less";

    .tab-main {
        position: relative;
        /deep/ .el-tabs__nav-wrap::after {
            height: 0;
        }
        /deep/ .el-tabs__active-bar {
            height: 0;
        }
        /deep/ .el-tabs__item.is-active {
            /deep/ .el-button{
                background: #1890ff;
                color: #fff;

            }
        }
        /deep/.el-tabs__item{
            padding: 0 12px;
        }
        /deep/.el-tabs__header{
            margin-bottom: 10px;
        }
        .el-button--medium{
            padding: 8px 26px;
        }
        .iconcheliangweiguibaojing, .iconzhuangxieguochengbaojing {
            margin-right: 5px;
            font-size: 14px;

        }

        .common-subtitle{
            border-bottom: 0;
            font-size:18px;
        }
        /deep/.common-subtitle-i{
            height: 20px;
            margin: -4px 10px;
        }


        //路段列表 点击状态
        .activeClass{
            background-color: #eff2f8 !important;
            border: solid 1px #eff2f8 !important;
            .route-card{
                color: #2d88fc !important;
            }
            .route-num{
                background-color:#2d88fc !important;
            }
        }
        //关联路段
        .route-wrapper{
            border: solid 1px #fff;
            cursor: pointer;
            padding: 10px;
            margin-bottom: 10px;
            font-family: MicrosoftYaHei-Bold;
            .route-card{
                line-height: 16px;
                font-size: 16px;
                color: #333333;
                .route-num{
                    line-height:18px;
                    display: block;
                    text-align: center;
                    color: #ffffff;
                    width: 18px;
                    height: 18px;
                    background-color: #314055;
                    border-radius: 4px;
                    font-size: 14px;
                }
                .route-second{
                    height: 15px;
                    font-size: 14px;
                    line-height: 18px;
                    color: #666666;
                    margin-top: 8px;
                }
            }

        }
        .btn-bottom-group{
            position: absolute;
            bottom: 10px;
            left: 0;
            right: 0;
            text-align: center;
        }

    }

    /deep/ .el-tabs__item.is-top:last-child {
        padding-left: 0;
    }

</style>
