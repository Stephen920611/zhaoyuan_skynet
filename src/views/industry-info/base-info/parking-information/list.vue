<template>
    <div class="map-container">
        <!-------加载离线地图的js文件------>
        <!--<googleMap></googleMap>-->
        <!-------搜索条件------>
        <div class="filter-container">
            <el-form :inline="true" :model="form" class="form-inline-search">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="停车场名称：" class="form-inline-search-item">
                            <el-input
                                v-model.trim="form.name"
                                placeholder="请输入停车场名称"
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
                        <!--<el-button type="primary" size="medium" style="margin-left: 10px;"
                                   icon="el-icon-folder-add"
                                   class="filter-item"
                                   @click="addData">新 增</el-button>-->
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
        <!--桥梁列表-->
        <div class="tunnel-list">
            <div class="content">
                <CommonSubtitle title="检索结果" :isBold="true" class="commonSub-title"></CommonSubtitle>
                <div class="tunnel-info" v-scrollBar style="position: relative">
                    <div v-if="list.length == 0">
                        暂无停车场数据！
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
                <!--<switch-item ref="switchItem" :data="operateBtnItems" :defaultValue="defaultSelectSwitch"
                             :isMultiSelect="true" :isInterval="false" @selectItem="handleSwitch"></switch-item>-->
            </div>
            <div class="map-wrapper">
                <google-map-view ref="googleMap" @map="getMap" :lat="mapCenterLat" :lng="mapCenterLng"></google-map-view>
            </div>
        </div>
        <!--新增的dialog-->
        <el-dialog title="新增" :visible.sync="addShow"  width="500px" :close-on-click-modal="false" append-to-body>
            <add-parking v-on:showHiddenAdd="showHiddenAdd"></add-parking>
        </el-dialog>
    </div>
</template>
<script>
    import switchItem from '../components/switchItem.vue'    //开关项
    import dropDown from '../components/dropDownMenu.vue'    //下拉列表组件
    import googleMapView from '@/components/common/googleMapView.vue'
    import mapShowFunc from '@/utils/mapShowFunc'
    import passParam from '@/utils/ext.passParam'
    import {queryAreaList,queryCompanyPoints} from '@/api/map'
    import {getParking,basicParking} from '@/api/industry'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import elDragDialog from '@/directive/el-drag-dialog'
    import addParking from './components/add-parking.vue'
    export default {
        name: 'MapMonitorIndex',
        directives: {elDragDialog},
        data() {
            return {
                map: null,
                mapCenterLat:'37.6408324203',  //地图默认区域中心的经纬度,默认为龙口市
                mapCenterLng:'120.5088065485',
                regions: [],  //行政区域,
                selectedItemIndex:null,
                list:[],//隧道列表
                defaultSelectRegionCode: [],  //默认选中的行政区编码
                defaultSelectDrawCode: [],  //默认选中的点位工具编码
                //功能开关，如摄像机
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
                TunnelsArr:[],
                addShow:false,
                markerArr:[],
                markerLatLng:[],
                saveFlag:false
            }
        },
        components: { googleMapView, switchItem, dropDown,CommonSubtitle,addParking},
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
                    lat:this.markerLatLng[0].lat,
                    lng:this.markerLatLng[0].lng
                };
                basicParking(obj).then(res => {
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
                //清空上一次打点和画线
                if(this.TunnelsArr.length!=0){
                    this.TunnelsArr.map(item=>{
                        item.setMap(null);
                        item.label.setMap(null);
                    });
                    this.TunnelsArr=[]
                }
                mapShowFunc.mapVariable._markerArr=[];
                const curTunnel = this.list[index];
                if(!curTunnel.lat || !curTunnel.lng){
                    this.$confirm('该停车场没有位置信息, 是否标注?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        /*一次打点画线*/
                        this.defaultSelectSwitch = ['mark'];//清空多选功能按钮
                        mapShowFunc.mapVariable.addMarkerTag='park32&'+curTunnel.id+'&'+curTunnel.name;
                        passParam.$on('marker',(tunnelMarker)=>{
                            this.TunnelsArr=this.TunnelsArr.concat(tunnelMarker);
                        });
                        mapShowFunc.mapVariable._tunnelMarker=[];
                        mapShowFunc.mapVariable._tunnelLine=null
                    }).catch(() => {
                        this.defaultSelectSwitch = [];//清空多选功能按钮
                    });
                    return
                }
                //在地图上定位
                mapShowFunc.pan2Point(curTunnel.lat,curTunnel.lng);
                //画隧道的开始节点和结尾处节点
                const firstMarker = mapShowFunc.addMarker(this.map, curTunnel.id, curTunnel.lat, curTunnel.lng, 'park32', curTunnel.name, "device", true, true,()=>{});
                this.TunnelsArr.push(firstMarker);
            },
            //操作开关项
            handleSwitch(code) {
                const self = this;
                const isActive = (this.$refs.switchItem.defaultSelectArr.indexOf(code) > -1);
                if(isActive){
                    if(this.selectedItemIndex == null){
                        this.$message({
                            type: 'warning',
                            message: '请选择相应的停车场'
                        });
                        this.defaultSelectSwitch = [];
                        return
                    }
                    const curTunnel = this.list[this.selectedItemIndex];
                    if(code=='save'){
                        //只有标注新的停车场或者修改后才能保存
                        if(this.saveFlag || !curTunnel.lat || !curTunnel.lng){
                            //保存操作
                            this.saveLocation()
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
                        //修改位置操作
                        if (this.TunnelsArr.length!=0) {
                            this.$confirm('停车场已有位置信息, 是否重新标注?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.list[this.selectedItemIndex]=curTunnel;
                                if(this.TunnelsArr.length!=0){
                                    this.TunnelsArr.map(item=>{
                                        item.setMap(null);
                                        item.label.setMap(null);
                                    });
                                    this.TunnelsArr=[]
                                }
                                /*一次打点画线*/
                                mapShowFunc.mapVariable.addMarkerTag='park32&'+curTunnel.id+'&'+curTunnel.name;
                                passParam.$on('marker',(tunnelMarker)=>{
                                    this.TunnelsArr=this.TunnelsArr.concat(tunnelMarker);
                                });
                                mapShowFunc.mapVariable._tunnelMarker=[];
                                this.saveFlag=true
                            }).catch(() => {
                                this.defaultSelectSwitch = [];//清空多选功能按钮
                            })
                        }
                    }else{
                        //标注操作
                        if (curTunnel.lat && curTunnel.lng || this.saveFlag) {
                            this.$message({
                                type: 'warning',
                                message: '该停车场已标注'
                            });
                            this.defaultSelectSwitch = [];
                        } else {
                            mapShowFunc.mapVariable.addMarkerTag = 'park32&' + curTunnel.id + '&' + curTunnel.name
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
                    areaId: null
                };
                this.selectedItemIndex=null;
                this.defaultSelectSwitch = [];//清空多选功能按钮
                this.getList();
                this.clearMarker();
            },
            getList(){
                let self = this;
                this.loading = true;
                getParking(this.form).then(res => {
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
                            this.handRegionClick(item.id);
                            this.defaultSelectRegionCode.push(item.code);   //初始化区域的选中状态
                            this.form.areaId = item.id;
                            //加载企业点位
                            this.addCompanyMarker();
                        }
                    });
                    //加载默认区域的点位
                    //this.getAllCameras(areaCode);
                })
            },
            /**
             * 企业marker标记
             */
            addCompanyMarker(){
                const areaId = this.form.areaId;
                queryCompanyPoints({areaId:areaId}).then(res=>{
                    res.data.list.map((item,index)=>{
                        this.drawPolygonFunc(item,index,'company32');
                        /* const marker = mapShowFunc.addMarker(this.map, item.id, item.lat, item.lng, 'company32', item.address, "device", true, true,()=>{});
                         this.regionCompanysHash.add(item.id, marker);*/
                    })
                })
            },
            /**
             * 绘制矩形或者多边形区域
             */
            drawPolygonFunc(data,dataIndex,type){
                if(data.boundsAry && data.boundsAry.length>0){
                    const option = {
                        strokeColor : type=='dangerSource32'?'#8b1d1a':'#468EF7',
                        strokeOpatity : 1,
                        fillColor : type=='dangerSource32'?'#8b1510':'#13c2f7',
                    };
                    data.boundsAry.map((bounds,boundIndex)=>{

                        //绘制区域
                        let drawFigure = null;
                        if(bounds.length == 2){
                            //刻画矩形
                            const rectBounds = new google.maps.LatLngBounds({lat:bounds[0].lat,lng:bounds[0].lng},{lat:bounds[1].lat,lng:bounds[1].lng});
                            drawFigure = mapShowFunc.drawRect(rectBounds,option);
                        }else if(bounds.length > 2){
                            //刻画多边形
                            drawFigure = mapShowFunc.drawPolygon(bounds,option);
                        }

                        //移动至地图中央
                        let LatLngBounds = new google.maps.LatLngBounds();//API地图边界
                        bounds.map(ktem=>{
                            const temp = new google.maps.LatLng(ktem.lat, ktem.lng);
                            LatLngBounds.extend(temp);
                        });
                        //得到中心点
                        const latLng = LatLngBounds.getCenter();
                        /*if(dataIndex == 0){
                            mapShowFunc.pan2Point(latLng.lat(),latLng.lng());
                        }*/
                        //根据不同的类型，将绘制的区域图形和标记点存储在对应的哈希表中
                        let marker = null;
                        switch (type){
                            case 'company32':
                                marker = mapShowFunc.addMarker(this.map, data.id+'-'+boundIndex, latLng.lat(), latLng.lng(), 'company32', '', "device", true, true,()=>{});
                                marker.info = data.companyName+"&"+data.officeAddress+'&'+JSON.stringify(data.boundsAry);
                                break;

                        }

                    });
                }

            },
            /**
             * 切换区域选择,定位到该区域
             */
            handRegionClick(id) {
                //定位区域
                let offsetLat;
                let offsetLng;
                //清空打点和画线
                if(this.TunnelsArr.length!=0){
                    this.TunnelsArr.map(item=>{
                        item.setMap(null);
                        item.label.setMap(null);
                    });
                    this.TunnelsArr=[]
                }
                mapShowFunc.mapVariable._markerArr=[];
                this.handleFilter();
                this.regions.forEach(item => {
                    if (item.id == id) {
                        offsetLat = item.offsetLat;
                        offsetLng = item.offsetLng;
                    }
                });
                mapShowFunc.pan2Point(offsetLat, offsetLng, this.map);
            },
            clearMarker(){
                //清空打点和画线
                if(this.TunnelsArr.length!=0){
                    this.TunnelsArr.map(item=>{
                        item.setMap(null);
                        item.label.setMap(null);
                    });
                    this.TunnelsArr=[]
                }
                mapShowFunc.mapVariable._markerArr=[];
            }

        },
    }
</script>

<style lang="less" scoped>
    @import "../style/style.map-view.less";
    @import "../style/style.maker-info-window.less";
</style>
