<template>
    <div class="app-container" style="height: calc(100vh - 110px)">
        <el-container>
            <!--左侧线路列表-->
            <el-aside width="350px" class="search-tree all-background" v-loading="treeLoading">
                <CommonSubtitle title="线路列表" :isBold="true"
                                style="width: 100%;line-height: 20px;margin-bottom: 20px"></CommonSubtitle>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="状态:">
                        <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%;">
                            <el-option
                                    v-for="item in statusOptions"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-row>
                        <el-form-item label="路线名称:">
                            <el-col :span="24">
                                <el-input v-model="form.lineName" placeholder="请输入路线名称" style="width: 100%;"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="24" class="btns">
                            <el-button
                                    size="small"
                                    class="filter-item"
                                    type="primary"
                                    icon="el-icon-search"
                                    style="margin-left: 10px;"
                                    @click="handleFilter"
                            >
                                查询
                            </el-button>
                            <el-button
                                    size="small"
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
                <!--卡片列表-->
                <div class="card-group">
                    <div v-if="list.length === 0">
                        暂无线路数据！
                    </div>
                    <div v-for="(item,index) in list" :key="index" class="text item">
                        <el-card class="box-card" shadow="never" :class="index+1 === routeCardNum ? 'activeClass' :''"
                                 @click.native="handleSelect(item,index)">
                            <div slot="header" class="clearfix">
                                <span class="font-bold"><i class="el-icon-edit"
                                                           style="color:#1890ff;margin-right: 4px"></i>{{item.lineName}}</span>
                                <div style="float: right; padding: 0;">
                                    <i class="icon iconfont iconchuli" title="查看" style="cursor: pointer;"
                                       @click.stop="seeDetail(item)"></i>
                                    <el-popconfirm
                                            title="确定要删除该线路？"
                                            @onConfirm="delDetail(item)"
                                            placement="top"
                                    >
                                        <i class="el-icon-close" slot="reference" style="cursor: pointer;" title="删除" v-on:click.stop ></i>
                                    </el-popconfirm>
                                </div>
                            </div>
                            <div>
                                <el-row>
                                    <el-col :span="24" class="search-wrap">
                                        <div class="cm-haq-list-item-alarm-points ellipsis-l1 font-size-14"
                                             :title="item.code">
                                            <span>线路编号：{{item.lineCode}}</span>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24" class="search-wrap">
                                        <div class="cm-haq-list-item-alarm-points ellipsis-l1 font-size-14"
                                             :title="item.timeLimit">
                                            <span>限行时间：{{item.timeLimit}}</span>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24" class="search-wrap">
                                        <div class="cm-haq-list-item-alarm-points ellipsis-l1 font-size-14"
                                             :title="item.associatedLine">
                                            <span>关联路段：<span
                                                    style="color:#1890ff">{{item.associatedLine}}</span>个</span>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24" class="search-wrap" style="text-align: right"  >
                                        <el-switch
                                                v-on:click.prevent.self
                                                class="switch"
                                                :width='72'
                                                v-model="item.status"
                                                active-color="#60c9c3"
                                                inactive-color="#f7536a"
                                                :active-value="1"
                                                :inactive-value="0"
                                                active-text="已启用"
                                                inactive-text="已禁用"
                                        >
                                        </el-switch>
                                    </el-col>
                                </el-row>

                            </div>
                        </el-card>
                    </div>
                    <!-- 分页控件 -->
                    <pagination
                            v-show="total > 0"
                            :total="total"
                            :page.sync="listQuery.page"
                            :limit.sync="listQuery.size"
                            style="padding:0px !important"
                            class="pagination"
                            :pageSizes="[5]"
                            :pagerCount="5"
                            @pagination="getList"
                    />
                </div>
            </el-aside>
            <el-main class="list-main all-background">
                <div class="map-container" style="height: calc(100vh - 150px)">
                    <div class="map">
                        <div class="map-wrapper">
                            <google-map-view ref="googleMap" @map="getMap" :lat="mapCenterLat" :lng="mapCenterLng"></google-map-view>
                        </div>
                    </div>
                </div>
                <!--右侧列表-->
                <el-card class="tunnel-list">
                    <div class="content" style="height: calc(100vh - 175px);width: 100%">
                        <route-tree v-on:addRouteLine="addRouteLine"
                                    v-on:resetGoogleMap="resetGoogleMap"
                                    v-on:resetRouteCardNum="resetRouteCardNum"
                                    ref="routeTree"
                        ></route-tree>
                    </div>
                </el-card>
            </el-main>
        </el-container>

        <!--新增/编辑弹窗-->
        <el-dialog v-if="routeDetailVisible" :visible.sync="routeDetailVisible" width="650px" append-to-body
                   :before-close='toggleRouteDetailVisible'>
            <div slot="title">
                <span style="padding-right: 10px;">{{editRouteDetail ? '编辑路线' :'添加路线'}}</span>
            </div>
            <route-detail></route-detail>
        </el-dialog>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {fetchAreaTree, fetchCheckDetailInfo} from '@/api/courseMonitor/importExport'
    import {queryAreaList} from '@/api/map'
    import D from '@/utils/DFDZ'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import switchItem from '../components/switchItem.vue'    //开关项
//    import googleMapView from '../components/googleMapView.vue'
    import googleMapView from '@/components/common/googleMapView.vue'
    import RouteTree from './components/routeTree.vue'
    import RouteDetail from './components/routeDetail'
    import {mapGetters} from 'vuex'
    import {queryBasicLine, queryLinePoints} from '@/api/map'
    import utility from '@/utils/ext.utility'
    import mapShowFunc from '@/utils/mapShowFunc'


    export default {
        name: 'RestrictedRoadIndex',
        components: {Pagination, CommonSubtitle, googleMapView, RouteTree, RouteDetail},
        data() {
            return {
                list: [],
                total: 100,
                listQuery: {
                    page: 1,
                    size: 5,
                },
                //要检索的条件
                form: {
                    status: null,//状态
                    lineName: '',//线路名称
                },
                statusOptions: [
                    {
                        id:null,
                        label:'全部'
                    },
                    {
                        id:1,
                        label:'启用'
                    },
                    {
                        id:0,
                        label:'禁用'
                    }
                ],
                map: null,
                mapCenterLat:'37.6408324203',  //地图默认区域中心的经纬度,默认为龙口市
                mapCenterLng:'120.5088065485',
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行

                loading: true,
                treeLoading: false,
                routeCardNum: 0,//默认选中

                selectedLineIdArr: [],
                lineTrajectoryArr: [],  //存储每条线路的若干条道路轨迹
                lineTrajectoryHash: new utility.hashTable(),   //存储每条线路轨迹



            }
        },
        computed: {
            ...mapGetters([
                'routeDetailVisible',
                'editRouteDetail',
            ])
        },
        /*watch:{
            'form.areaValue': {
                handler(value) {
                    console.log('value',value)
                    this.handRegionClick(value);
                }
            }
        },*/
        created() {
        },
        mounted() {
            this.getList()
        },
        methods: {
            getMap(map) {
                //地图类型插件放于地图的左上角
//                mapShowFunc.mapVariable['options']['mapTypeControlOptions']['position'] = 1;
                //地图右下角放大/缩小组件隐藏
                mapShowFunc.mapVariable['options']['zoomControl'] = false;
                this.map = map;
                //加载所有的行政区域：放在地图加载完成之后，防止地图未加载完成就标记点位
                //this.getAllRegions();
//                this.fetchTreeData();
//                this.addRouteLine();
            },
            //获取烟台市的行政区域
            getAllRegions() {
                queryAreaList({parent:'370600'}).then(res => {
                    this.areaOptions = res.data;
                    res.data.map(item => {
                        item.id = item.id + '';
                        if (item.isCenter == "1") {
//                            this.handRegionClick(item.id)
                            this.mapCenterLat = item.offsetLat;
                            this.mapCenterLng = item.offsetLng;
                        }
                    });
                })

            },
            /**
             * 切换区域选择,定位到该区域
             */
            handRegionClick(id) {
                //定位区域
                let offsetLat;
                let offsetLng;
                this.areaOptions.map(item => {
                    if (item.id == id) {
                        offsetLat = item.offsetLat;
                        offsetLng = item.offsetLng;
                    }
                });
                mapShowFunc.pan2Point(offsetLat, offsetLng, this.map);
            },


            //弹窗的显示与隐藏
            toggleRouteDetailVisible() {
                this.$store.dispatch("industryInfo/baseInfo/restrictedRoad/toggleRouteDetailVisible", {routeDetailVisible: false})
            },

            //删除左侧列表卡片
            delDetail(data) {

                /*delPoorHouseHold(params).then(res => {
                    self.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    self.listQuery.page = 1;
                    self.getList();
                })*/

            },

            //左侧线路列表-查看详情
            seeDetail(data) {
                //是新建还是编辑
                this.$store.dispatch("industryInfo/baseInfo/restrictedRoad/editRouteDetail", {editRouteDetail: true});
                //是否显示弹窗
                this.$store.dispatch("industryInfo/baseInfo/restrictedRoad/toggleRouteDetailVisible", {routeDetailVisible: true})
            },


            //获取列表数据
            getList() {
                let self = this;
                //默认选中为空
                this.routeCardNum = 0;
                this.loading = true;
                /*let params = {
                    ...this.listQuery,
                    "waybillCheck": this.form.waybillCheck,
                    "wayBillNo": this.form.wayBillNo,
                    "companyName": this.form.companyName,
                };
                self.loading = false;*/
                const param = Object.assign(this.listQuery,this.form);
                queryBasicLine(param).then(res => {
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.loading = false;
                })
            },
            //点击搜索
            handleFilter() {
                this.listQuery.page = 1;
//                this.handRegionClick(this.form.areaValue);
                this.getList();
            },

            // 重置查询
            handleReset() {
//                this.form.areaValue = '';  //行政区域
                this.form.lineName = '';  //路线名称
                this.form.status = null;
                this.listQuery.page = 1;
                this.getList();
                //页面销毁之前，清除地图上所有的行驶线路
                this.clearAllTrajectorys();
            },

            //页面销毁之前，清除地图上所有的行驶线路
            clearAllTrajectorys() {
                let trajectorys = this.lineTrajectoryHash.getValues();
                trajectorys.map(item => {
                    item.map(jtem => {
                        jtem.setMap(null);
//                      jtem = null;   //直接在地图上清除掉
                    })

                })

            },

            //点击左侧关联路段列表
            handleSelect(val, idx) {
                //左侧列表显示关联路段
                this.$refs.routeTree.tabValue = 'second';
                //页面销毁之前，清除地图上所有的行驶线路
                this.clearAllTrajectorys();
                this.routeCardNum = idx + 1;

                //点击选中
                this.selectedLineIdArr.push(val.id);
                //数组去重
                this.selectedLineIdArr = this.$lodash.uniq(this.selectedLineIdArr);
                this.lineTrajectoryArr = [];
                queryLinePoints({id: val.id}).then(res => {
                    const color = mapShowFunc.colorRandom();
                    res.data.map((item, index) => {
                        //绘制线路
                        const lineTrajectory = mapShowFunc.drawLine(this.map, JSON.parse(item.bounds), '线路名称：' + val.remark.trim(), color, '1');
                        this.lineTrajectoryArr.push(lineTrajectory);
                        if (index == 0) {
                            const lat = JSON.parse(item.bounds)[0].lat;
                            const lng = JSON.parse(item.bounds)[0].lng;
                            mapShowFunc.pan2Point(lat, lng);
                        }
                    });
                    this.lineTrajectoryHash.add(val.id, this.lineTrajectoryArr);
                })
                /*if (this.selectedLineIdArr.indexOf(val.id) == -1) {
                    //点击选中
                    this.selectedLineIdArr.push(val.id);
                    this.lineTrajectoryArr = [];
                    queryLinePoints({id: val.id}).then(res => {
                        const color = mapShowFunc.colorRandom();
                        res.data.map((item, index) => {
                            //绘制线路
                            const lineTrajectory = mapShowFunc.drawLine(this.map, JSON.parse(item.bounds), '线路名称：' + val.remark.trim(), color, '1');
                            this.lineTrajectoryArr.push(lineTrajectory);
                            if (index == 0) {
                                const lat = JSON.parse(item.bounds)[0].lat;
                                const lng = JSON.parse(item.bounds)[0].lng;
                                mapShowFunc.pan2Point(lat, lng);
                            }
                        });
                        this.lineTrajectoryHash.add(val.id, this.lineTrajectoryArr);
                    })
                }
                else {
                    //取消选中
                    const evens = this.$lodash.remove(this.selectedLineIdArr, function (n) {
                        return n != val.id;
                    });
                    this.selectedLineIdArr = evens;
                    let trajectorys = this.lineTrajectoryHash.getValue(val.id);
                    trajectorys.map(item => {
                        item.setMap(null);
                        //                        item = null;   //直接在地图上清除掉
                    })
                }*/

            },

            //绘制线（子组件使用）
            addRouteLine(val) {

                /*this.selectedLineIdArr = selectedLineIdArr;
                this.lineTrajectoryArr = lineTrajectoryArr;
                this.lineTrajectoryHash = lineTrajectoryHash;*/

                if (this.selectedLineIdArr.indexOf(val.id) == -1) {
                    //点击选中
                    this.selectedLineIdArr.push(val.id);
                    this.lineTrajectoryArr = [];
                    queryLinePoints({id: val.id}).then(res => {
                        const color = mapShowFunc.colorRandom();
                        res.data.map((item, index) => {
                            //绘制线路
                            const lineTrajectory = mapShowFunc.drawLine(this.map, JSON.parse(item.bounds), '线路名称：' + val.text, color, '1');
                            this.lineTrajectoryArr.push(lineTrajectory);
                            if (index == 0) {
                                const lat = JSON.parse(item.bounds)[0].lat;
                                const lng = JSON.parse(item.bounds)[0].lng;
                                mapShowFunc.pan2Point(lat, lng);
                            }
                        });
                        this.lineTrajectoryHash.add(val.id, this.lineTrajectoryArr);
                    })
                }
                else {
                    //取消选中
                    const evens = this.$lodash.remove(this.selectedLineIdArr, function (n) {
                        return n != val.id;
                    });
                    this.selectedLineIdArr = evens;
                    let trajectorys = this.lineTrajectoryHash.getValue(val.id);
                    trajectorys.map(item => {
                        item.setMap(null);
                        //                        item = null;   //直接在地图上清除掉
                    })
                }

            },

            //重置地图绘制区域（子组件使用）
            resetGoogleMap() {
                //先清空所有的绘制区域
                this.clearAllTrajectorys();
            },

            //重置routeCardNum（子组件使用）
            resetRouteCardNum() {
                this.clearAllTrajectorys();
                this.selectedLineIdArr = [];
                this.lineTrajectoryArr = [];  //存储每条线路的若干条道路轨迹
                this.lineTrajectoryHash = new utility.hashTable();   //存储每条线路轨迹
                this.routeCardNum = 0;
            }

        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    @import "./style/style.map-view.less";
    @import "./style/style.maker-info-window.less";

    //分页按钮样式
    .pagination {
        /deep/ .el-pagination {
            display: flex;
            justify-content: center;
        }
        /deep/ .el-pagination__sizes {
            display: none;
        }
        /deep/ .el-pagination__jump {
            display: none;
        }
        /deep/ .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li {

        }
        /deep/ .el-pager li, /deep/ .el-pagination button {
            min-width: 24px;
            height: 22px;
            line-height: 22px;
        }
        /deep/ .el-pagination span:not([class*=suffix]) {
            min-width: 44px;
            height: 22px;
            line-height: 22px;
        }
        /deep/ .el-pager .more::before {
            line-height: 24px;
        }
    }

    //标题样式
    .common-subtitle {
        border-bottom: 0;
        font-size: 18px;
    }

    /deep/ .common-subtitle-i {
        height: 20px;
        margin: -4px 10px;
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

    //按钮样式
    .btns {
        display: flex;
        justify-content: center;
    }

    .el-button--small {
        padding: 9px 30px;
    }

    //左边卡片样式
    .item {
        margin-top: 12px;
    }

    /deep/ .el-card__header {
        padding: 14px 18px;
        border: 0;
    }

    /deep/ .el-card__body {
        padding: 0 20px 10px 20px;
    }

    .cm-haq-list-item-alarm-points {
        line-height: 22px;
    }

    //卡片列表
    .card-group {
        margin-top: 17px;
    }

    .search-tree, .list-main {
        height: calc(100vh - 150px)
    }

    //列表样式
    .list-main {
        /*border: 1px solid #ebebeb;*/
        padding: 0;
        margin-left: 10px;
        position: relative;
        .gmnoprint {
            left: 0 !important;
            right: auto !important;
        }
    }

    //右侧列表页
    .tunnel-list {
        width: 350px;
        max-width: 350px;
        position: absolute;
        height: calc(100vh - 150px);
        top: 0;
        right: 0;
        background: #fff;
        z-index: 2000;
    }

    //弹出框样式
    /deep/ .el-dialog__body {
        padding: 20px 40px 20px 20px !important;
    }

    /deep/ .el-dialog__header {
        background-color: #304156;
        color: #fff;
        padding: 13px 20px;
    }

    /deep/ .el-dialog__header .el-dialog__headerbtn {
        top: 10px
    }

    //switch 文字写在按钮上样式
    /deep/ .switch .el-switch__label {
        position: absolute;
        color: #fff !important;
        z-index: 1;
        display: none;
    }

    /deep/ .el-switch__label * {
        font-size: 13px !important;
    }

    /deep/ .switch .is-active {
        display: block;
    }

    /deep/ .switch .el-switch__label--left span {
        margin-left: 22px;
    }

    //路段列表 点击状态
    .activeClass {
        border: 1px solid #1a70dc;
        background-color: #f7fcff;
    }
    .map{
        width: calc(100% - 350px);
        height: 100%;
        float: left;
    }
    .el-card /deep/ .el-card__body{
        height: 100%;
        padding: 0;
    }
</style>

