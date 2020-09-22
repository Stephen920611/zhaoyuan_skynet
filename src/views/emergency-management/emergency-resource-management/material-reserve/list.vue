<template>
    <div class="app-container">
        <el-container>
            <el-aside width="350px" class="search-tree all-background" style="overflow: hidden;">
                <CommonSubtitle title="应急物资储备库列表" :isBold="true"
                                style="width: 100%;line-height: 20px;margin-bottom: 20px"></CommonSubtitle>
                <el-input
                        class="search-tree-input"
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                </el-input>
                <el-tree
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
                        style="height: calc(100% - 112px);overflow-y: auto;"
                >
                    <span slot-scope="{node,data}" class="ellipsis-l1 font-size-14">
                        <span :title="data.text">{{data.text}}</span>
                    </span>
                </el-tree>

            </el-aside>
            <el-main style="padding: 20px 20px 0 20px">
                <div class="filter-container">
                    <el-form :inline="true" :model="form" ref="form" class="form-inline-search" label-width="120px">
                        <el-row :gutter="20">
                            <el-col :span="this.isSmallBtn ? 12 : 8">
                                <el-form-item label="储备点名称：" class="form-inline-search-item">
                                    <el-input v-model="form.name" placeholder="请输入储备点名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 12 : 16" class="btns" style="text-align: right">
                                <el-button
                                        class="filter-item"
                                        type="primary"
                                        style="margin-left: 10px;padding: 10px 30px"
                                        @click="handleFilter"
                                >
                                    检索
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
                <el-card class="table-card">
                    <div style="margin-bottom: 10px">
                        <el-button type="primary" icon="el-icon-document-add" @click="addEmergency('add')">新增
                        </el-button>
                        <el-button type="primary" icon="el-icon-edit" @click="addEmergency('edit')">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="delEmergency()">删除</el-button>
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
                        <el-table-column label="储备点名称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.name}}</template>
                        </el-table-column>
                        <el-table-column label="归属" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.sideCode}}</template>
                        </el-table-column>
                        <el-table-column label="所属单位名称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.startTime}}</template>
                        </el-table-column>
                        <el-table-column label="负责人" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.endTime}}</template>
                        </el-table-column>
                        <el-table-column label="联系电话" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.name === 1 ? '异常' : '正常' }}</template>
                        </el-table-column>
                        <!-- 操作 -->
                        <!--<el-table-column
                                label="操作"
                                align="center"
                                width="70"
                                class-name="small-padding fixed-width"
                        >
                            <template slot-scope="{row}">
                                <i class="icon iconfont iconchakan" title="查看" @click="seeDialog(row)"></i>
                                &lt;!&ndash;<i class="icon iconfont iconchuli" :class="(row.wayBillStatus!=3&&row.wayBillStatus!=5&&row.wayBillStatus!=6&&row.wayBillStatus)?'':'hide-icon'" title="处理" @click="taskAssignmentDialog(row)"></i>&ndash;&gt;
                            </template>
                        </el-table-column>-->

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
                    <div class="none-marker-notice" v-show="noneMarkerNotice">
                        暂未标注
                    </div>
                </div>
            </div>
            <div class="emergency-info">
                <CommonSubtitle title="详细信息" :isBold="true"
                                style="width: 100%;line-height: 20px;margin-bottom: 20px"></CommonSubtitle>
                <div style="padding-left: 10px" v-if="!(JSON.stringify(detailInfo) == '{}' || !detailInfo)">
                    <el-row>
                        <el-col :span="12">
                            储备点名称：{{detailInfo.hasOwnProperty('name')? detailInfo.name:''}}
                        </el-col>
                        <el-col :span="12">
                            负责人姓名：{{detailInfo.hasOwnProperty('liablePerson')?detailInfo.liablePerson:''}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            应急物资储备库归属：{{detailInfo.hasOwnProperty('typeName')?detailInfo.typeName:''}}
                        </el-col>
                        <el-col :span="12">
                            负责人联系电话：{{detailInfo.hasOwnProperty('tel')?detailInfo.tel:''}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            所属单位名称：{{detailInfo.hasOwnProperty('companyName')?detailInfo.companyName:''}}
                        </el-col>
                        <el-col :span="12">
                            备注：{{detailInfo.hasOwnProperty('mark')?detailInfo.mark:''}}
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <!--新增的dialog-->
        <el-dialog title="新增" v-if="addShow" :visible.sync="addShow" width="950px"
                   :close-on-click-modal="false" append-to-body @close="closeDialog"
        >
            <add-material-reserve type="add" :companyInfo=companyInfo :detailInfo="detailInfo"
                                  v-on:toggleHidden="toggleHidden"></add-material-reserve>
        </el-dialog>
        <!--新增的dialog-->
        <el-dialog title="编辑" :visible.sync="editShow" v-if="editShow" width="950px"
                   :close-on-click-modal="false" append-to-body @close="closeDialog">
            <add-material-reserve type="edit" :companyInfo=companyInfo :detailInfo="detailInfo"
                                  v-on:toggleHidden="toggleHidden"></add-material-reserve>
            <!--<edit-material-reserve ></edit-material-reserve>-->
        </el-dialog>

        <!--地图标注的dialog-->
        <el-dialog title="地图标注" :visible.sync="markerShow" v-if="markerShow" width="1200px" class="marker-dialog"
                   :close-on-click-modal="false" append-to-body v-elDragDialog @close="closeDialog">
            <toggle-google-map
                    ref="toggleGoogleMap"
                    v-if="markerShow"
                    :markerShow="markerShow"
                    :detailInfo="detailInfo"
                    :markerIcon="markerIcon"
                    v-on:toggleHidden="toggleHidden"
                    @saveOrUpdateBounds="saveOrUpdateBounds"
            ></toggle-google-map>
        </el-dialog>


    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import AddMaterialReserve from './components/add-material-reserve.vue'
    //    import  EditMaterialReserve from './components/edit-material-reserve.vue'
    import elDragDialog from '@/directive/el-drag-dialog'

    import {fetchAreaTree} from '@/api/courseMonitor/alarmSynthesis';
    import {
        getByCode,
        fetchEmergencyStoragePage,
        delEmergencyStorage,
        emergencyStorageSaveOrUpdateBounds
    } from '@/api/emergencyManagement/emergencyResource'

    import D from '@/utils/DFDZ';

    import googleMapView from '@/components/common/googleMapView.vue'
    import ToggleGoogleMap from '@/views/emergency-management/components/toggleGoogleMap.vue'
    import utility from '@/utils/ext.utility'
    import mapShowFunc from '@/utils/mapShowFunc'

    export default {
        name: 'EMMaterialReserveIndex',
        components: {Pagination, CommonSubtitle, googleMapView, AddMaterialReserve, elDragDialog, ToggleGoogleMap},
        directives: {elDragDialog},
        data() {
            return {
                //树相关的
                treeData: [], //树数据
                filterText: '',//树搜索
                currentNodeKey: '',//当前选中的keys值
                props: {
                    label: 'text', // 需要指定的节点渲染对象属性
                    children: 'nodes' // 指定的子级
                },
                //loading 效果
                listLoading: false,
                treeLoading: false,

                //要检索的条件
                form: {
                    name: '',//储备点名称
                    companyId: null,//企业Id
                },

                //列表
                list: [],
                total: 0,
                listQuery: {
                    page: 1,
                    size: 10,
                },

                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                map: null,
                mapCenterLat: '37.6408324203',  //地图默认区域中心的经纬度,默认为龙口市
                mapCenterLng: '120.5088065485',

                detailInfo: {},//应急物资储备库详情
                addShow: false,
                editShow: false,
                companyInfo: {},

                markerShow: false,  //地图标注弹窗显示
                shapeOverlays: [],
                noneMarkerNotice:true,//是否显示暂无标注标注
                markerHash: new utility.hashTable(),   //存储点位定位时绘制的marker点标记
                markerIcon:'8',
            }
        },
        watch: {
            filterText(val) {//监听树搜索
                this.$refs.tree.filter(val);
            },
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize = function () {
                self.setBtns();
            };
        },
        mounted() {
            //获取树数据
            this.fetchTreeData();
            this.getList();
        },
        methods: {
            //设置按钮样式
            setBtns() {
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },

            //获取列表
            getList() {
                let self = this;
                let obj = {
                    page: self.listQuery.page,
                    size: self.listQuery.size,
                    name: self.form.name,
                    companyId: self.form.companyId,
                };
                this.listLoading = true;
                fetchEmergencyStoragePage(obj).then(res => {
                    self.list = res.data.list;
                    self.total = res.data.total;

                    self.detailInfo={};
                    //重新初始化左下角地图，将this.map的指向由弹窗地图指向左侧地图
                    self.$refs['googleMap'].initGoogleMap();
                    if (!(JSON.stringify(self.detailInfo) == '{}' || !self.detailInfo)) {
                        self.handleSelect(self.detailInfo.id, self.detailInfo);
                    }

                    self.listLoading = false;
                }).catch((err) => {
                        self.listLoading = false
                    })
            },

            //地图
            getMap(map) {
                //地图右下角放大/缩小组件隐藏
                mapShowFunc.mapVariable['options']['zoomControl'] = false;
                this.map = map;
                //加载所有的行政区域：放在地图加载完成之后，防止地图未加载完成就标记点位
                //this.getAllRegions();
//                this.fetchTreeData();
//                this.addRouteLine();
            },

            //获取树的数据
            fetchTreeData() {
                this.treeLoading = true;
                //请求接口
                let self = this;
                let params = {
                    "ifShowSide": "2",
                    "ifShowCompany": "1",
                };
                fetchAreaTree(params).then(res => {
                    self.treeLoading = false;
                    self.treeData = res.data;
                }).catch(err => {
                    self.treeLoading = false;

                });
            },

            //点击树节点
            handleNodeClick: function (data, node, event) {
                this.detailInfo = {};
                //如果点击的树节点为公司
                if (data.hasOwnProperty('type') && data.type === 'company') {
                    this.form.companyId = data.id;
                    this.companyInfo = data;
                    this.handleFilter()
                } else {
                    this.form.companyId = null;
                    this.companyInfo = {};
                }

            },

            //搜索框
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },

            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },

            //重置
            handleReset() {
                this.form.name = '';
                this.form.companyId = null;
                this.companyInfo = {};
                this.listQuery.page = 1;
                this.fetchTreeData();
                this.getList()
            },

            //添加、编辑
            addEmergency(type) {
                this.type = type;
                if (type === 'edit') {
                    if (JSON.stringify(this.detailInfo) == '{}' || !this.detailInfo) {
                        this.$message({
                            message: '请选择需要编辑的应急资源储备库',
                            type: 'warning'
                        });
                        return
                    }
                    this.editShow = true;
                } else {
                    if (this.form.companyId === null) {
                        this.$message({
                            message: '请选择需要添加应急资源储备库的公司',
                            type: 'warning'
                        });
                        return
                    }
                    this.addShow = true;
                }

            },

            //点击表格信息
            showDetail(data) {
                this.detailInfo = data;
                if(data && data.hasOwnProperty('id')){
                    //队伍详情
                    this.handleSelect(this.detailInfo.id, this.detailInfo);
                }

            },
            //删除
            delEmergency() {
                let self = this;
                if (JSON.stringify(this.detailInfo) == '{}' || !this.detailInfo) {
                    this.$message({
                        message: '请选择需要删除的应急队伍',
                        type: 'warning'
                    });
                    return
                }
                this.$confirm('此操作将删除该应急队伍, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delEmergencyStorage({id: this.detailInfo.hasOwnProperty('id') ? this.detailInfo.id : null}).then(res => {
                        self.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        })
                        self.getList()
                    }).catch((err) => {
                    })
                })
            },

            //关闭弹窗后刷新列表
            closeDialog() {
                //刷新列表
                this.getList();
            },

            //关闭新增、编辑、标注弹窗
            toggleHidden(type) {
                this[type + 'Show'] = false;
                this.closeDialog();
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

            //清除所有点marker点标记
            clearAllMarkers(){
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
                        if(bounds.length === 1){
                            this.setMapPoint(bounds[0],index)

                        }else{
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

            //清空绘制的多边形
            clearDrawFigure() {
                this.shapeOverlays.map(item => {
                    item.setMap(null);
                });
                this.shapeOverlays = [];
            },

            //标注
            changeMarkerShow() {
                if (!(JSON.stringify(this.detailInfo) == '{}' || !this.detailInfo)) {
                    this.markerShow = true
                }else{
                    this.$message({
                        message: '请选择需要标注的应急资源储备库',
                        type: 'warning'
                    });
                }
            },

            //保存标注的边界
            saveOrUpdateBounds(params) {
                emergencyStorageSaveOrUpdateBounds(params).then(res => {
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
    @import "~@/views/emergency-management/styles/emergency-list.less";

</style>