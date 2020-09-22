<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 20px 20px 0 20px">
                <div class="filter-container">
                    <el-form :inline="true" :model="form" ref="form" class="form-inline-search" label-width="100px">
                        <el-form-item label="机构名称：">
                            <el-input v-model="form.name" placeholder="请输入机构名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                    class="filter-item"
                                    type="primary"
                                    style="margin-left: 10px;padding: 10px 30px"
                                    @click="handleFilter">
                                检索
                            </el-button>
                            <el-button
                                    class="filter-item"
                                    style="margin-left: 10px;"
                                    icon="el-icon-refresh"
                                    @click="handleReset">
                                重置
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-card class="table-card">
                    <div style="margin-bottom: 10px">
                        <el-button type="primary" icon="el-icon-document-add" @click="addPlan('add')">新增</el-button>
                        <el-button type="primary" icon="el-icon-edit" @click="addPlan('edit')">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deleteAlarmFunc()">删除</el-button>
                    </div>
                    <!-- 表格开始 -->
                    <el-table
                            v-loading="listLoading"
                            :data="list"
                            border
                            fit
                            highlight-current-row
                            @row-click="showDetail"
                            height="calc(100% - 115px)"
                            style="width: 100%;"
                    >
                        <el-table-column label="序号" type="index" align="center" width="80px">
                            <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="机构名称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.name}}</template>
                        </el-table-column>
                        <el-table-column label="地址" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.address}}</template>
                        </el-table-column>
                        <el-table-column label="更新时间" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.insertTime}}</template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页控件 -->
                    <div style="text-align: center">
                        <pagination
                                v-show="total >0"
                                :total="total"
                                :page.sync="listQuery.page"
                                :limit.sync="listQuery.size"
                                style="padding:0px !important"
                                class="pagination"
                                @pagination="getList"
                                :pageSizes="[10]"
                        />
                    </div>
                </el-card>
            </el-main>
        </el-container>
        <div class="emergency-map-container">
            <div class="emergency-map">
                <div class="map">
                    <div class="map-wrapper">
                        <google-map-view ref="googleMap" @map="getMap" :lat="mapCenterLat"
                                         :lng="mapCenterLng"></google-map-view>
                    </div>
                    <div class="map-marker" @click="changeMarkerShow">
                        <i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;标注/放大
                    </div>
                    <!--未标注提示开始-->
                    <div class="none-marker-notice" v-show="noneMarkerNotice">
                        暂未标注
                    </div>
                </div>
            </div>
            <div class="emergency-info">
                <CommonSubtitle title="详细信息" :isBold="true"
                                style="width: 100%;line-height: 20px;margin-bottom: 20px"></CommonSubtitle>
                <div style="padding-left: 10px">
                    <el-row>
                        <el-col :span="8" class="ellipsis-l1" :title="materialsInfo.name">
                            机构名称：{{materialsInfo.name}}
                        </el-col>
                        <el-col :span="8">
                            地址：{{materialsInfo.address}}
                        </el-col>
                        <el-col :span="8">
                            更新时间：{{materialsInfo.insertTime}}
                        </el-col>
                    </el-row>
                    <el-row v-for="(item,index) in materialsInfo.telAry">
                        <el-col :span="8">
                            联系人：{{item.contact}}
                        </el-col>
                        <el-col :span="8">
                            联系方式：{{item.contactTel}}
                        </el-col>
                        <el-col :span="8">
                            邮箱：{{item.email}}
                        </el-col>
                    </el-row>
                    <el-row v-if="!materialsInfo.telAry || (materialsInfo.telAry && materialsInfo.telAry.length == 0)">
                        <el-col :span="8">
                            联系人：
                        </el-col>
                        <el-col :span="8">
                            联系方式：
                        </el-col>
                        <el-col :span="8">
                            邮箱：
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <!--新增的dialog-->
        <el-dialog title="新增" v-if="addShow" :visible.sync="addShow" width="1100px" type="add"
                   :close-on-click-modal="false" append-to-body @close="closeDialog" v-elDragDialog>
            <add-external v-on:toggleHidden="toggleHidden"></add-external>
        </el-dialog>
        <!--新增的dialog-->
        <el-dialog title="编辑" :visible.sync="editShow" v-if="editShow" width="1100px" type="edit"
                   :close-on-click-modal="false" append-to-body @close="closeDialog" v-elDragDialog>
            <edit-external :data="materialsInfo" v-on:toggleHidden="toggleHidden"></edit-external>
        </el-dialog>
        <!--地图标注的dialog-->
        <el-dialog title="地图标注" :visible.sync="markerShow" v-if="markerShow" width="1200px" class="marker-dialog"
                   :close-on-click-modal="false" append-to-body v-elDragDialog @close="closeDialog">
            <toggle-google-map  ref="toggleGoogleMap" v-if="markerShow" :markerShow="markerShow" :detailInfo="materialsInfo"
                               :markerIcon="markerIcon" v-on:toggleHidden="toggleHidden"
                               @saveOrUpdateBounds="saveOrUpdateBounds"></toggle-google-map>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import AddExternal from './components/add-external.vue'
    import EditExternal from './components/edit-external.vue'
    import ToggleGoogleMap from '@/views/emergency-management/components/toggleGoogleMap.vue'
    import elDragDialog from '@/directive/el-drag-dialog'
    import {fetchAreaTree} from '@/api/courseMonitor/alarmSynthesis';
    import {
        emergencyExtResourcesPage,
        getEmergencyExtResources,
        saveEmergencyExtResources,
        updateBoundsEmergencyExtResources,
        deleteEmergencyExtResources
    } from '@/api/emergency';
    import googleMapView from '@/components/common/googleMapView.vue'
    import utility from '@/utils/ext.utility'
    import mapShowFunc from '@/utils/mapShowFunc'

    export default {
        name: 'EMMaterialReserveIndex',
        components: {
            Pagination,
            CommonSubtitle,
            googleMapView,
            AddExternal,
            EditExternal,
            elDragDialog,
            ToggleGoogleMap
        },
        directives: {elDragDialog},
        data() {
            return {
                //要检索的条件
                form: {
                    name: '',//机构名称
                },
                //table
                list: [],
                total: 1,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                materialsInfo: {},//应急物资储备库详情
                //地图
                map: null,
                mapCenterLat: '37.6408324203',  //地图默认区域中心的经纬度,默认为龙口市
                mapCenterLng: '120.5088065485',
                markerHash: new utility.hashTable(),   //存储定位时绘制的marker点标记
                addShow: false,
                editShow: false,
                markerShow: false,  //地图标注弹窗显示
                mapLoading: false, //地图加载状态
                mapMarkerHash: new utility.hashTable(),  //存储标记的marker
                shapeOverlays: [],  //存储绘制的轨迹
                latLngArrays: [],  //存储绘制区域的顶点坐标
                noneMarkerNotice: true,  //"暂未标注"提示框显示
                markerIcon:'8',

            }
        },
        watch: {
            filterText(val) {//监听树搜索
                this.$refs.tree.filter(val);
            },
            markerShow(val) {
                //监听地图标注的弹窗是否打开，打开时，延迟500ms后加载地图
                if (val) {
                    setTimeout(() => {
                        this.mapLoading = true;
                    }, 500)
                }
            }
        },
        mounted() {
            // 发送this 到 js 文件里
            this.$nextTick(()=>{
                mapShowFunc.sendThis(this);
            });
            //获取分页数据
            this.getList();
        },
        methods: {
            getMap(map) {
                //地图右下角放大/缩小组件隐藏
                mapShowFunc.mapVariable['options']['zoomControl'] = false;
                this.map = map;
                //加载所有的行政区域：放在地图加载完成之后，防止地图未加载完成就标记点位
                //this.getAllRegions();
//                this.fetchTreeData();
//                this.addRouteLine();
            },
            //获取列表
            getList() {
                const param = Object.assign(this.form, this.listQuery);
                emergencyExtResourcesPage(param).then(res => {
                    if (res.code == 1000) {
                        this.list = res.data.list;
                        this.total = res.data.total;
                        this.materialsInfo = {};
                        //重新初始化左下角地图，将this.map的指向由弹窗地图指向左侧地图
                        this.$refs['googleMap'].initGoogleMap();
                        if (!(JSON.stringify(this.materialsInfo) == '{}' || !this.materialsInfo)) {

                            this.handleSelect(this.materialsInfo.id, this.materialsInfo);
                        }
                    }
                })
            },
            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            //重置
            handleReset() {
                this.form.name = '';
                this.listQuery.page = 1;
                this.getList();
            },
            //添加
            addPlan(type) {
                if (type === 'edit') {
                    if (JSON.stringify(this.materialsInfo) == '{}' || !this.materialsInfo) {
                        this.$message({
                            message: '请选择需要编辑的外部资源',
                            type: 'warning'
                        });
                        return
                    }
                    this.editShow = true;
                } else {
                    this.addShow = true;
                }
            },
            //查看
            showDetail(data) {
                getEmergencyExtResources({id: data.id}).then(res => {
                    if (res.code == 1000) {
                        this.materialsInfo = res.data;
                        if (res.data.boundsAry.length > 0) {
                            this.noneMarkerNotice = false;
                        } else {
                            this.noneMarkerNotice = true
                        }
                        this.handleSelect(this.materialsInfo.id, this.materialsInfo);
                    }
                })
            },
            //删除
            deleteAlarmFunc() {
                let self = this;
                if (JSON.stringify(this.materialsInfo) == '{}' || !this.materialsInfo) {
                    this.$message({
                        message: '请选择需要删除的外部资源',
                        type: 'warning'
                    });
                    return
                }
                this.$confirm('此操作将删除该外部资源, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     deleteEmergencyExtResources({id:this.materialsInfo.id}).then(res => {
                         self.$message({
                             showClose: true,
                             message: '删除成功！',
                             type: 'success'
                         })
                         self.getList();

                     }).catch((err) => {
                         // 公共方法有，所以不需要加提示了
                         // this.$message.error(err.msg)
                     })
                })
            },
            //清除所有点marker点标记
            clearAllMarkers() {
                const allMarkers = this.markerHash.getValues();
                allMarkers.map(item => {
                    item.setMap(null);
                    if(item.label){
                        item.label.setMap(null);
                    }
                });
                this.markerHash.clear();
            },

            /**
             *显示多边形区域或点位
             */
            handleSelect(index, data) {
                //重置
                this.clearDrawFigure();
                this.clearAllMarkers();

                //绘制已保存的区域
                if (data.boundsAry && data.boundsAry.length > 0) {
                    //隐藏暂未标注
                    this.noneMarkerNotice = false;

                    const option = {
                        strokeColor: '#8b1d1a',
                        strokeOpatity: 1,
                        fillColor: '#8b1510',
                    };
                    //地图级别放大到15级
//                    this.map.setZoom(15);

                    data.boundsAry.map((bounds, index) => {
                        //如果是点，数组的长度等于1
                        if (bounds.length === 1) {
                            this.setMapPoint(bounds[0], index)

                        } else {
                            //如果数组中，存的坐标大于1，则为多边形

                            //工业园区的绘制区域
                            let drawFigure = null;
                            //刻画多边形
                            drawFigure = mapShowFunc.drawPolygon(bounds, option);

                            this.shapeOverlays.push(drawFigure);
                            //移动至地图中央
                            let LatLngBounds = new google.maps.LatLngBounds();//API地图边界
                            bounds.map(ktem => {
                                const temp = new google.maps.LatLng(ktem.lat, ktem.lng);
                                LatLngBounds.extend(temp);
                            });
                            //得到中心点
                            const latLng = LatLngBounds.getCenter();
                            if (index == 0) {
                                mapShowFunc.pan2Point(latLng.lat(), latLng.lng());
                            }
                        }
                    });
                } else {
                    this.noneMarkerNotice = true;
//                    this.$message({message: '暂未标注，请先标注位置信息！', type: 'warning'})
                }

            },
            //在地图上画点
            setMapPoint(data,id){
                const curMarker =  this.markerHash.getValue(id);
                //定位
                if(data.hasOwnProperty('lat')){
                    //判断是否已进行点位标注，若是则执行下面的操作
                    mapShowFunc.pan2Point(data.lat, data.lng);
                    if(!curMarker){
                        //判断marker是否存在，不存在则标记marker
                        const marker = mapShowFunc.addMarker(this.map, id, data.lat, data.lng, this.markerIcon, '', "device", true, true,()=>{});
                        this.markerHash.add(id, marker);

                    }
                }
            },

            //清空绘制的多边形
            clearDrawFigure() {
                this.shapeOverlays.map(item => {
                    item.setMap(null);
                });
                this.shapeOverlays = [];
            },
            //标注
            changeMarkerShow() {
                if (!(JSON.stringify(this.materialsInfo) == '{}' || !this.materialsInfo)) {
                    this.markerShow = true
                } else {
                    this.$message({
                        message: '请选择需要标注的外部资源',
                        type: 'warning'
                    });
                }
            },
            //关闭新增、编辑、标注弹窗
            toggleHidden(type) {
                this[type + 'Show'] = false;
                this.closeDialog();
            },

            closeDialog() {
                //刷新列表
                this.getList();
            },
            //保存标注的边界
            saveOrUpdateBounds(params) {
                updateBoundsEmergencyExtResources(params).then(res => {
                    this.$message({
                        showClose: true,
                        message: '保存成功！',
                        type: 'success'
                    });
                    this.toggleHidden('marker');
                }).catch((err) => {
                });
            }
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    @import "~@/components/common/style/style.map-view.less";
    @import "~@/components/common/style/style.maker-info-window.less";
    //树样式
    /deep/ .el-aside {
        background-color: #ffffff;
        line-height: 1;
        color: #333;
        text-align: left;
        padding: 10px 10px;
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

    //列表样式
    .list-main {
        /*border: 1px solid #ebebeb;*/
        padding: 0;
        margin-left: 10px;
    }

    //内容样式
    .el-card {
        border: 0;
        /deep/ .el-table th {
            background-color: #308FE4;
            color: #fff;
        }
    }

    .table-card {
        height: calc(100% - 58px);
        /deep/ .el-card__body {
            height: 100%;
        }
    }

    .el-card.is-always-shadow {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    }

    //搜索条件样式
    .form-inline-search {
        .form-inline-search-item {
            width: 100%;
            /deep/ .el-form-item__content {
                width: calc(100% - 180px);
            }
        }
    }

    .filter-container {
        padding-bottom: 0;
    }

    .el-container {
        height: calc(100vh - 470px);
    }

    .el-aside, .el-main {
        height: 100%;
    }

    //分页
    .pagination-container {
        margin-top: 20px;
    }

    //下部地图
    .emergency-map-container {
        width: 100%;
        height: 300px;
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        .emergency-map {
            width: 500px;
            /*background-color: gray;*/
            padding: 0 15px 10px 0;
        }
        .emergency-info {
            width: calc(100% - 500px);
            padding: 0 15px 15px 15px;
            .el-row {
                line-height: 36px;
                font-size: 14px;
                font-weight: 700
            }
        }
        .map {
            height: 100%;
            position: relative;
        }
        .map-marker {
            position: absolute;
            z-index: 99;
            color: #333;
            background-color: #fff;
            padding: 5px;
            line-height: 10px;
            top: 10px;
            left: 10px;
            border-radius: 10px;
            font-size: 14px;
            cursor: crosshair;
        }
        /deep/ .tool_point {
            margin-left: 15px !important;
        }
    }

    //弹出框样式
    /deep/ .el-dialog__body {
        padding: 10px 40px 20px 20px !important;
    }

    /deep/ .el-dialog__header {
        background-color: #304156;
        color: #fff;
        padding: 13px 20px;
    }

    /deep/ .el-dialog__header .el-dialog__headerbtn {
        top: 10px
    }

    /*地图标注弹窗*/
    .marker-dialog {
        /deep/ .el-dialog {
            height: 700px;
            .el-dialog__body {
                height: calc(100% - 90px);
                position: relative;
            }
            .lt-btn-wrapper {
                position: absolute;
                top: 20px;
                left: 30px;
            }
            /deep/ .el-divider--horizontal {
                margin: 10px 0;
            }
        }
    }

    .none-marker-notice {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100;
        background-color: #ed5565;
        color: #fff;
        border-radius: 3px;
        width: 70px;
        height: 30px;
        margin: auto;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
    }
</style>
