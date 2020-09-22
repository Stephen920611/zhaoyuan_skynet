<template>
    <div class="map-container">
        <!-------加载离线地图的js文件------>
        <!--<googleMap></googleMap>-->
        <!-------搜索条件------>
        <div class="filter-container">
            <el-form :inline="true" :model="form" class="form-inline-search">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="隧道名称：" class="form-inline-search-item">
                            <el-input
                                v-model.trim="form.name"
                                placeholder="请输入隧道名称"
                                class="filter-item"
                                style="width: 95%;"
                                @keyup.enter.native="handleFilter"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="行政区域：" class="form-inline-search-item">
                            <el-select v-model="form.areaId" class="filter-item"
                                       placeholder="请选择行政区域" @change="handRegionClick">
                                <el-option
                                    v-for="item in regions"
                                    :key="item.id"
                                    :label="item.des"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="btns">
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
                            @click="handleReset">
                            重置
                        </el-button>
                        <el-button type="primary" size="medium" style="margin-left: 10px;"
                                   icon="el-icon-folder-add"
                                   class="filter-item"
                                   @click="addData">新 增</el-button>
                        <el-button type="primary" size="medium" style="margin-left: 10px;"
                                   icon="el-icon-edit"
                                   class="filter-item"
                                   @click="editData">编 辑</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!--隧道列表-->
        <div class="tunnel-list">
            <div class="content">
                <CommonSubtitle title="检索结果" :isBold="true" class="commonSub-title"></CommonSubtitle>
                <div class="tunnel-info" v-scrollBar style="position: relative">
                    <div v-if="list.length == 0">
                        暂无隧道数据！
                    </div>
                    <div class="line-item" :class="{'active':index==selectedItemIndex}"  v-for="(item,index) in list" :key="index" v-else  @click="handleSelect(index)">
                        <div class="base-info">
                            <p class="title">{{item.name}}</p>
                        </div>
                     <!--   <div class="des-info">
                            <p>养护信息:2020-20-20道路维护信息现在接口没有返回哦!</p>
                        </div>-->
                    </div>
                </div>
            </div>
        </div>
        <div class="map">
            <div class="rt-btn-wrapper">
                <switch-item ref="switchItem" :data="operateBtnItems" :defaultValue="defaultSelectSwitch"
                             :isMultiSelect="true" :isInterval="false" @selectItem="handleSwitch"></switch-item>
            </div>
            <div class="map-wrapper">
                <google-map-view ref="googleMap" @map="getMap" :lat="mapCenterLat" :lng="mapCenterLng"></google-map-view>
            </div>
        </div>
        <!--新增的dialog-->
        <el-dialog title="新增" :visible.sync="addShow"  width="500px" :close-on-click-modal="false" v-elDragDialog append-to-body>
            <add-tunnel v-on:showHiddenAdd="showHiddenAdd"></add-tunnel>
        </el-dialog>
        <!--编辑的dialog-->
        <el-dialog title="编辑" :visible.sync="editShow"  width="500px" :close-on-click-modal="false" v-elDragDialog append-to-body>
            <edit-tunnel v-on:showHiddenEdit="showHiddenEdit" :tunnelData="list[selectedItemIndex]"></edit-tunnel>
        </el-dialog>
    </div>
</template>
<script>
    import switchItem from '../components/switchItem.vue'    //开关项
    import dropDown from '../components/dropDownMenu.vue'    //下拉列表组件
    import googleMapView from '@/components/common/googleMapView.vue'
    import mapShowFunc from '@/utils/mapShowFunc'
    import passParam from '@/utils/ext.passParam'
    import {queryAreaList} from '@/api/map'
    import {getTunnel,basicTunnel} from '@/api/industry'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import elDragDialog from '@/directive/el-drag-dialog'
    import AddTunnel from './components/add-tunnel.vue'
    import EditTunnel from './components/edit-tunnel.vue'

    export default {
        name: 'MapMonitorIndex',
        directives: {elDragDialog},
        components: {googleMapView, switchItem, dropDown,CommonSubtitle,AddTunnel,EditTunnel},
        data() {
            return {
                map: null,
                mapCenterLat:'37.6408324203',  //地图默认区域中心的经纬度,默认为龙口市
                mapCenterLng:'120.5088065485',
                regions: [],  //行政区域,
                selectedItemIndex:null,//选中的序号
                list:[],//隧道列表
                defaultSelectRegionCode: [],  //默认选中的行政区编码
                defaultSelectDrawCode: [],  //默认选中的点位工具编码
                //功能开关
                operateBtnItems: [
                    {
                        name: '保存',
                        code: 'save',
                        icon: 'fa fa-floppy-o',
                        isActive: false,
                    },
                    {
                        name: '标注',
                        code: 'mark',
                        icon: 'icon iconfont iconbiaozhu',
                        isActive: false,
                    },
                    {
                        name: '修改位置',
                        code: 'location',
                        icon: 'icon iconfont iconxiugaiweizhi',
                        isActive: false,
                    }
                ],
                defaultSelectSwitch: [],   //默认选中开关
                form: {
                    name: '',
                    areaId: null,
                },
                lineTrajectoryArr:null,  //存储隧道
                TunnelsArr:[],//隧道点位marker
                addShow:false,
                editShow:false,
                markerLatLng:[],//打点经纬度集合
                saveFlag:false,//是否可以存储标注
            }
        },
        created() {
            this.getList();
            passParam.$on('resetSwitchActive',()=>{
                this.defaultSelectSwitch = [];
            });
            //时刻监控位置坐标
            passParam.$on('latLng',(latLngInfo)=>{
                this.markerLatLng=latLngInfo;
            })
        },
        methods: {
            //保存位置信息
            saveLocation() {
                let self=this;
                const curTunnel = this.list[this.selectedItemIndex];
                let obj={
                    id:curTunnel.id,
                    location:JSON.stringify(this.markerLatLng)
                };
                basicTunnel(obj).then(res => {
                    self.$message({
                        showClose: true,
                        message: '操作成功！',
                        type:'success'
                    });
                    self.getList();
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            addData(){
                this.addShow = true;
            },
            editData(){
                if(this.selectedItemIndex!=null){
                    this.editShow = true;
                }else{
                    this.$message({
                        type: 'warning',
                        message: '请选择需要编辑的隧道'
                    });
                }
            },
            //      关闭编辑界面并刷新？不刷新
            showHiddenEdit: function (data, refresh) {
                let self = this;
                this.editShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            //      关闭新增界面并刷新？不刷新
            showHiddenAdd: function (data, refresh) {
                let self = this;
                this.addShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            handleSelect(index) {
                this.selectedItemIndex = index;
                this.defaultSelectSwitch = [];//清空多选功能按钮
                //切换的时候阻止地图打点检测
                mapShowFunc.mapVariable.addMarkerTag=null;
                this.saveFlag=false;
                this.clearMapData();
                const curTunnel = this.list[index];
                if(!curTunnel.location || curTunnel.location=="[]"){
                    this.$confirm('该条隧道没有位置信息, 是否标注?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        /*一次打点画线*/
                        this.defaultSelectSwitch = ['mark'];
                        mapShowFunc.mapVariable.addMarkerTag='tunnel32&'+curTunnel.id+'&'+curTunnel.name;
                        passParam.$on('marker',(tunnelMarker,tunnelLine)=>{
                            this.TunnelsArr=this.TunnelsArr.concat(tunnelMarker);
                            this.lineTrajectoryArr=tunnelLine
                        });
                        mapShowFunc.mapVariable._tunnelMarker=[];
                        mapShowFunc.mapVariable._tunnelLine=null;
                        this.saveFlag=true
                    }).catch(() => {
                    });
                }else{
                    this.TunnelsArr=[];
                    let location=JSON.parse(curTunnel.location);
                    let marker=null;
                    location.map(item=>{
                        marker = mapShowFunc.addMarker(this.map, curTunnel.id, item.lat, item.lng, 'tunnel32', curTunnel.name, "device", true, true,()=>{});
                        this.TunnelsArr.push(marker);
                    });
                    //定位
                    mapShowFunc.pan2Point(JSON.parse(curTunnel.location)[0].lat, JSON.parse(curTunnel.location)[0].lng);
                    this.lineTrajectoryArr=mapShowFunc.drawLine(this.map,JSON.parse(curTunnel.location),null,"#5d1dfe",'1');
                }
            },
            //操作开关项
            handleSwitch(code) {
                const isActive = (this.$refs.switchItem.defaultSelectArr.indexOf(code) > -1);
                if(isActive){
                    if(this.selectedItemIndex == null){
                        this.$message({
                            type: 'warning',
                            message: '请选择需要标注的隧道'
                        });
                        this.defaultSelectSwitch = [];//清空多选功能按钮
                        return
                    }
                    const curTunnel = this.list[this.selectedItemIndex];
                    if(code=='save'){
                        if(this.saveFlag){
                            //保存操作
                            this.saveLocation();
                            this.saveFlag=false;
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '无位置修改，无法保存'
                            });
                            this.defaultSelectSwitch = [];//清空多选功能按钮
                        }
                    }else if(code=='location'){
                        //修改位置前先把标注的点位信息清空
                        mapShowFunc.mapVariable._markerArr=[];
                        mapShowFunc.mapVariable._tunnelLine=null;
                        //修改位置操作
                        if (this.TunnelsArr.length!=0) {
                            this.$confirm('该条隧道已有位置信息, 是否重新标注?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.list[this.selectedItemIndex]=curTunnel;
                                this.clearMapData();
                                /*一次打点画线*/
                                mapShowFunc.mapVariable.addMarkerTag='tunnel32&'+curTunnel.id+'&'+curTunnel.name;
                                passParam.$on('marker',(tunnelMarker,tunnelLine)=>{
                                    this.TunnelsArr=this.TunnelsArr.concat(tunnelMarker);
                                    console.log(tunnelLine,'tunnelLine');
                                    this.lineTrajectoryArr=tunnelLine
                                });
                                mapShowFunc.mapVariable._tunnelMarker=[];
                                mapShowFunc.mapVariable._tunnelLine=null;
                                this.saveFlag=true
                            }).catch(() => {
                                this.defaultSelectSwitch = [];//清空多选功能按钮
                            })
                        }
                    }else{
                        //标注操作
                        if (curTunnel.location != "[]" && curTunnel.location && !this.saveFlag) {
                            this.$message({
                                type: 'warning',
                                message: '该隧道已标注'
                            });
                            this.defaultSelectSwitch = [];
                        } else {
                            mapShowFunc.mapVariable.addMarkerTag = 'tunnel32&' + curTunnel.id + '&' + curTunnel.name
                        }
                    }
                }
            },
            // 条件查询
            handleFilter() {
                this.getList()
            },
            handleReset() {
                this.form={
                    name: '',
                    areaId: null,
                };
                this.clearMapData();
                this.selectedItemIndex=null;
                this.defaultSelectSwitch = [];//清空多选功能按钮
                this.getList()
            },
            getList(){
                let self = this;
                this.loading = true;
                getTunnel(this.form).then(res => {
                    self.list=res.data.list;
                    self.total=res.data.total;
                    this.loading = false
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                    this.loading = false
                })
            },
            getMap(map) {
                this.map = map;
                //加载所有的行政区域：放在地图加载完成之后，防止地图未加载完成就标记点位
                this.getAllRegions();
            },
            //获取烟台市的行政区域
            getAllRegions() {
                queryAreaList({parent:'370600'}).then(res=>{
                    this.regions = res.data;
                    this.regions.forEach(item => {
                        item.id=item.id+'';
                        if (item.isCenter == "1") {
                            this.mapCenterLat = item.offsetLat;
                            this.mapCenterLng = item.offsetLng;
                            this.handRegionClick(item.id)
                        }
                    });
                    //加载默认区域的点位
                    //this.getAllCameras(areaCode);
                })

            },
            /**
             * 切换区域选择,定位到该区域
             */
            handRegionClick(id) {
                //定位区域
                let offsetLat;
                let offsetLng;
                this.clearMapData();
                this.handleFilter();
                this.regions.forEach(item => {
                    if (item.id == id) {
                        offsetLat = item.offsetLat;
                        offsetLng = item.offsetLng;
                    }
                });
                mapShowFunc.pan2Point(offsetLat, offsetLng, this.map);
            },
            clearMapData(){
                //清空打点和画线
                if(this.TunnelsArr.length!=0){
                    this.TunnelsArr.map(item=>{
                        item.setMap(null);
                        item.label.setMap(null);
                    });
                    this.TunnelsArr=[]
                }
                if(this.lineTrajectoryArr){
                    this.lineTrajectoryArr.setMap(null);
                    this.lineTrajectoryArr=null;
                }
                mapShowFunc.mapVariable._markerArr=[];
                mapShowFunc.mapVariable._tunnelLine=null;
            },
        },
    }
</script>

<style lang="less" scoped>
    @import "../style/style.map-view.less";
    @import "../style/style.maker-info-window.less";
</style>
