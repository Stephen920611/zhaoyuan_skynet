<template>
    <div class="map-container">
        <!-------加载离线地图的js文件------>
        <!--<googleMap></googleMap>-->

        <div class="map">
            <div class="lt-btn-wrapper">
                <!--<drop-down name="区域选择" ref="dropDownMenu" :data="regions" :defaultValue="defaultSelectRegionCode"
                           :isMultiSelect="false" @command="handRegionClick"></drop-down>-->
                <!--<drop-down name="点位工具" :data="drawBtnItems" :isSelect="false" @command="handleDraw"></drop-down>-->

            </div>
            <div class="rt-btn-wrapper">
                <switch-item ref="switchItem" :data="operateBtnItems" :defaultValue="defaultSelectSwitch"
                             :isMultiSelect="true" :isInterval="false" @selectItem="handleSwitch"></switch-item>
            </div>
            <div class="map-wrapper">
                <google-map-view ref="googleMap" @map="getMap" :lat="mapCenterLat" :lng="mapCenterLng"></google-map-view>
               
            </div>
        </div>
        <right-panel ref="rightPanel">
            <right-drawer ref="rightDrawer" :region="regions" :map="map" :areaId="defaultSelectRegionCode.join(',')"></right-drawer>
        </right-panel>
        <!--电子运单详情的模态框-->
        <el-dialog title="电子运单详情" :visible.sync="waybillDialogVisible" width="65%" :close-on-click-modal="false"
                   @close="closeWaybillDialog" style="z-index: 65000;" v-elDragDialog>
            <waybill-detail></waybill-detail>
        </el-dialog>
        <!--车辆信息的模态框-->
        <el-dialog title="车辆信息" :visible.sync="carDialogVisible" width="50%" :close-on-click-modal="false"
                   @close="closeCarDialog" style="z-index: 65000;" v-elDragDialog>
            <car-detail></car-detail>
        </el-dialog>
        <!--视频播放的模态框-->
        <el-dialog title="实时视频" :visible.sync="videoDialogVisible" width="50%" :close-on-click-modal="false"
                   @close="closeVideoDialog" style="z-index: 65000;" v-elDragDialog>
            <real-play ref="realPlay"
                       :playState="playState"
                       btnShow="true"
                       :winCount="winNum_play"
                       :curWinCount="curWinNum_play"
                       :curRowCls="curVideoRowCls_play"
                       @change-win-num="changeWinNumFunc"
                       @change-win-zoom="updateData"
            ></real-play>
        </el-dialog>
    </div>
</template>
<script>
    import switchItem from './components/switchItem.vue'    //开关项
    import dropDown from './components/dropDownMenu.vue'    //下拉列表组件
    import googleMapView from '@/components/common/googleMapView.vue'
    import rightDrawer from './components/rightDrawer.vue';
    import RightPanel from '@/components/RightPanel'
    import waybillDetail from './components/waybillDetail.vue'
    import carDetail from './components/carDetail.vue'
    import realPlay from '@/components/common/realPlay.vue';

    import utility from '../../utils/ext.utility'
    import extMain from '../../utils/ext.main'
    import mapShowFunc from '../../utils/mapShowFunc'
    import passParam from '../../utils/ext.passParam.js'
    import {mapGetters} from 'vuex'

    import {queryAreaList,queryCompanyPoints,queryCameraPoints,queryBayonetPoints,queryParkingPoints,queryBridgePoints,queryLadeSiteArea,queryTunnelPoints,queryDangerSource} from '../../api/map'
    import {getParamsByCode} from '../../api/public'
    import elDragDialog from '@/directive/el-drag-dialog'
    export default {
        name: 'MapMonitorIndex',
        directives: {elDragDialog},
        provide(){
            return{
                locMarkerOpenInfoWindow:this.locMarkerOpenInfoWindow,
                handleSwitch:this.handleSwitch,
                defaultSelectSwitch:this.getDefaultSelectSwitch,
                updateDefaultSelectSwitch:this.updateDefaultSelectSwitch
            }
        },
        data() {
            return {
                map: null,
                mapCenterLat:'37.6408324203',  //地图默认区域中心的经纬度,默认为龙口市
                mapCenterLng:'120.5088065485',
                regions: [],  //行政区域,
                defaultSelectRegionCode: [],  //默认选中的行政区编码
                defaultSelectDrawCode: [],  //默认选中的点位工具编码
                regionCameraMarkersHash: new utility.hashTable(), //存储某区域下的所有摄像机，key为id，value为摄像机marker数组
                regionCompanysHash: new utility.hashTable(), //存储某区域下的所有企业，key为id，value为企业marker数组
                regionCompanysPolgonHash: new utility.hashTable(), //存储某区域下的所有企业，key为id，value为企业绘制区域的数组
                regionCameraHash: new utility.hashTable(), //存储某区域下的所有摄像机，key为id，value为摄像机marker数组
                regionCarsHash: new utility.hashTable(), //存储某区域下的所有车辆，key为id，value为车辆marker数组
                regionBayonetsHash: new utility.hashTable(), //存储某区域下的所有进出卡口，key为id，value为进出卡口marker数组
                regionParksHash: new utility.hashTable(), //存储某区域下的所有停车场，key为id，value为停车场marker数组
                regionSitesHash: new utility.hashTable(), //存储某区域下的所有装卸位，key为id，value为装卸位marker数组
                regionBridgesHash: new utility.hashTable(), //存储某区域下的所有桥梁，key为id，value为桥梁marker数组
                regionTunnelsHash: new utility.hashTable(), //存储某区域下的所有隧道，key为id，value为隧道marker数组
                regionDangerSourceHash: new utility.hashTable(), //存储某区域下的所有隧道，key为id，value为重大危险源轨迹的数组
                regionDangerSourceMarkerHash: new utility.hashTable(), //存储某区域下的所有隧道，key为id，value为重大危险源marker的数组

                //功能开关，如摄像机
                operateBtnItems: [
                    {
                        name: '企业',
                        code: 'company',
                        icon: 'icon iconfont iconqiye1',
                        isActive: false,
                    },
                    {
                        name: '车辆',
                        code: 'car',
                        icon: 'icon iconfont iconcheliang',
                        isActive: false,
                    },
                    {
                        name: '摄像机',
                        code: 'camera',
                        icon: 'icon iconfont iconshexiangji',
                        isActive: false,
                    },
                    {
                        name: '进出卡口',
                        code: 'bayonet',
                        icon: 'icon iconfont iconjinchukakou',
                        isActive: false,
                    },
                    /*{
                        name: '停车场',
                        code: 'park',
                        icon: 'icon iconfont icontingchechang',
                        isActive: false,
                    },*/
                    {
                        name: '装卸区',
                        code: 'siteLade',
                        icon: 'icon iconfont iconzhuangxiequ',
                        isActive: false,
                    },
                    {
                        name: '桥梁',
                        code: 'bridge',
                        icon: 'icon iconfont iconqiaoliang',
                        isActive: false,
                    },
                    {
                        name: '隧道',
                        code: 'tunnel',
                        icon: 'icon iconfont iconsuidao',
                        isActive: false,
                    },
                    {
                        name: '重大危险源',
                        code: 'dangerSource',
                        icon: 'icon iconfont iconbaojingjingbaoyujing',
                        isActive:false,
                    }
                ],
                defaultSelectSwitch: ['company'],   //默认选中开关
//                defaultSelectSwitch: ['company','camera','bayonet','park','siteLade','dangerSource','bridge','tunnel'],   //默认选中开关
                drawBtnItems: [
                    {
                        des: '框选',
                        icon: 'fa fa-square-o',
                        code: 'rect'
                    },
                    {
                        des: '圈选',
                        icon: 'fa fa-circle-thin',
                        code: 'circle'
                    },
                    {
                        des: '线选',
                        icon: 'fa fa-italic',
                        code: 'line'
                    },
                    {
                        des: '多边形',
                        icon: 'fa fa-bookmark-o',
                        code: 'polygon'
                    },
                    {
                        des: '清除所有',
                        icon: 'fa fa-trash-o',
                        code: 'clear'
                    }
                ],     //绘制按钮
                carDialogVisible: false,  //车辆信息的弹窗
                waybillDialogVisible: false,   //电子运单信息的弹窗
                videoDialogVisible: false,   //电子运单信息的弹窗
                websocket: null,  //websocket对象
                userInfo:null,  //存储登录用户信息

                playState: 'realPlay',
                winNum_play: 4,    //窗口数量，默认为4窗口
                curWinNum_play: 4,   //当前的窗口数量
                curVideoRowCls_play: ['two-row'],  //窗口布局样式

            }
        },
        components: {googleMapView, switchItem, dropDown, rightDrawer, RightPanel, waybillDetail, carDetail,realPlay},
        computed: {
            ...mapGetters(['openWaybillDialog']),
            getMapZoom(){
                if(this.map){
                    return this.map.getZoom();
                }

            }
        },
        watch: {
            'openWaybillDialog': {
                handler(value) {
                    this.waybillDialogVisible = value
                }
            },
            //监听地图放大级别
            'getMapZoom': {
                handler(zoom) {
                    let flag = false;
                    if(zoom >=15){
                        //当级别大于等于15级时，将装卸区、进出卡口的标注显示出来
                        this.defaultSelectSwitch = ['company','camera','bayonet','park','siteLade','dangerSource','bridge','tunnel'];   //默认选中开关
                        flag = true;
                    }else{
                        this.defaultSelectSwitch = ['company'];   //默认选中开关
                        flag = false;
                    }
                    this.operateAllMarker(flag)
                }
            },
        },
        created() {
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            // 发送this 到 js 文件里
            mapShowFunc.sendThis(this);
            passParam.$on('openDialog',(flag,tag,data)=>{
                switch (tag){
                    case 'video':
                        this.videoDialogVisible = flag;
                        setTimeout(()=>{
                            this.$refs.realPlay.playAGroupOfVideo(data);
                        },300);
                        break;
                }
            })
        },
        methods: {
            getMap(map) {
                this.map = map;
                //加载所有的行政区域：放在地图加载完成之后，防止地图未加载完成就标记点位
                this.getAllRegions();
            },
            updateDefaultSelectSwitch(code){
                const index = this.defaultSelectSwitch.indexOf(code);
                let hash = null,polygonHash = null;
                switch (code){
                    case 'company':
                        console.log(222);
                        hash = this.regionCompanysHash;
                        polygonHash = this.regionCompanysPolgonHash;
                        break;
                    case 'camera':
                        hash = this.regionCameraHash;
                        break;
                    case 'bayonet':
                        hash = this.regionBayonetsHash;
                        break;
                    case 'siteLade':
                        hash = this.regionSitesHash;
                        break;
                    case 'dangerSource':
                        hash = this.regionDangerSourceMarkerHash;
                        polygonHash = this.regionDangerSourceHash
                        break;
                    case 'bridge':
                        hash = this.regionBridgesHash;
                        break;
                    case 'tunnel':
                        hash = this.regionTunnelsHash;
                        break;
                }
                if(index == -1){
                    this.defaultSelectSwitch.push(code);
                    const markers = hash.getValues();
                    markers.map(marker=>{
                        marker.setMap(this.map);
                    });
                    if(polygonHash){
                        const polygons = polygonHash.getValues();
                        polygons.map(polygon=>{
                            polygon.setMap(this.map);
                        });
                    }
                }
            },
            getDefaultSelectSwitch(){
                return this.defaultSelectSwitch;
            },
            /**
             * 操作开关项
             * @param code
             */
            handleSwitch(code) {
                const self = this;
                let index;
                this.operateBtnItems.forEach((item, indx) => {
                    if (item.code == code) {
                        index = indx;
                    }
                });
                const isActive = (this.$refs.switchItem.defaultSelectArr.indexOf(code) > -1);
                //控制对应的marker的显隐
                let obj = isActive == true?this.map:null
                switch (index) {
                    case 0:
                        //企业
                        //是否清除企业点位
                        const companyMarkers = self.regionCompanysHash.getValues();
                        companyMarkers.forEach(item => {
                            item.setMap(obj);
                            if(item.label){
                                item.label.setMap(obj);
                            }
                        });
                        //是否清除企业区域
                        const companyPolygons =self.regionCompanysPolgonHash.getValues();
                        companyPolygons.forEach(item => {
                            item.setMap(obj);
                        });
                        break;
                    case 1:
                        //车辆
                        if (isActive) {
                            //建立websocket连接,获取websocket地址
                            self.getVehicleWebSocketUrl()
                        } else {
                            //关闭websocket连接
                            this.websocket.close();
                            //清除地图上的车辆marker
                            const carMarkers = self.regionCarsHash.getValues();
                            carMarkers.forEach(item => {
                                item.setMap(null);
                                if(item.label){
                                    item.label.setMap(null);
                                }
                            })
                        }
                        break;
                    case 2:
                        //摄像机markers
                        const cameraMarkers = self.regionCameraHash.getValues();
                        cameraMarkers.forEach(item => {
                            item.setMap(obj);
                            if(item.label){
                                item.label.setMap(obj);
                            }
                        })
                        break;
                    case 3:
                        //进出卡口
                        const bayonetMarkers = self.regionBayonetsHash.getValues();
                        bayonetMarkers.forEach(item => {
                            item.setMap(obj);
                            if(item.label){
                                item.label.setMap(obj);
                            }

                        })
                        break;
                   /* case 4:
                        //停车场
                        const parkMarkers = self.regionParksHash.getValues();
                        parkMarkers.forEach(item => {
                            item.setMap(obj);
                            if(item.label){
                                item.label.setMap(obj);
                            }
                        })
                        break;*/
                    case 4:
                        //装卸区
                        const siteMarkers = self.regionSitesHash.getValues();
                        siteMarkers.forEach(item => {
                            item.setMap(obj);
                            if(item.label){
                                item.label.setMap(obj);
                            }
                        });
                        break;
                    case 5:
                        //桥梁
                        const bridgeMarkers = self.regionBridgesHash.getValues();
                        bridgeMarkers.forEach(item => {
                            item.setMap(obj);
                            if(item.label){
                                item.label.setMap(obj);
                            }
                        })
                        break;
                    case 6:
                        //隧道
                        const tunnelMarkers = self.regionTunnelsHash.getValues();
                        tunnelMarkers.forEach(item => {
                            item.setMap(obj);
                            if(item.label){
                                item.label.setMap(obj);
                            }
                        });
                        break;
                    case 7:
                        //重大危险源
                        //是否隐藏区域轨迹
                        const dangerSource = self.regionDangerSourceHash.getValues();
                        dangerSource.forEach(item => {
                            item.setMap(obj);
                        });

                        //是否隐藏marker
                        const dangerSourceMarker = self.regionDangerSourceMarkerHash.getValues();
                        dangerSourceMarker.forEach(item => {
                            item.setMap(obj);
                            if(item.label){
                                item.label.setMap(obj);
                            }
                        });
                        break;
                }
            },
            /**
             * 企业marker标记
             */
            addCompanyMarker(flag){
                const areaId = this.defaultSelectRegionCode.join(',');
                queryCompanyPoints({areaId:areaId}).then(res=>{
                    res.data.list.map((item,index)=>{
                        this.drawPolygonFunc(item,index,'company32',flag);
                       /* const marker = mapShowFunc.addMarker(this.map, item.id, item.lat, item.lng, 'company32', item.address, "device", true, true,()=>{});
                        this.regionCompanysHash.add(item.id, marker);*/
                    })
                })
            },
            /**
             *  摄像机marker标记
             */
            addCameraMarker(flag){
                const param = {
                    areaId:this.defaultSelectRegionCode.join(','),
                    roleId:this.userInfo.roleId
                };
                queryCameraPoints(param).then(res=>{
                    if(res.data.length>0){
                        res.data.map(item=>{
                            item = item.cameras[0];
                            let icon = '';
                            if(item.type == 3){
                                icon = 'cameraGun32'
                            }else{
                                icon = 'cameraBall32'
                            }
                            const marker = mapShowFunc.addMarker(this.map, item.id, item.lat, item.lng, icon, '', "camera", true, flag,()=>{});
                            marker.info = item.code+'&'+item.lat+'&'+item.lng+'&'+item.positionDes+'&'+item.type+'&'+item.status;
                            this.regionCameraHash.add(item.id, marker);
                            mapShowFunc.mapVariable._cameraShowMarkers.add(item.id, marker)
                        });
                    }
                })

            },
            /**
             * 获取websocket连接地址
             */
            getVehicleWebSocketUrl(){
                getParamsByCode({code:'vehicle_gps_websocket_url'}).then(res=>{
                    if(res.code == 1000){
                        let url = res.data;
                        this.buildWebSocket(url);
                    }
                })
            },

            /**
             * 建立websocket连接
             */
            buildWebSocket(url){
//                this.websocket = new WebSocket('ws://172.20.63.9:8060/work/websocket/vehicleGps');
                this.websocket = new WebSocket(url);
                this.websocket.onopen = ()=>{
                    console.log("websocket连接成功！");
                };
                this.websocket.onmessage = (e)=>{
                    const redata = JSON.parse(e.data);
                    console.log("返回数据是：",redata);
                    //车辆marker标记
                    let marker = this.regionCarsHash.getValue(redata.id);
                    if(marker){
                        const LatLng = new google.maps.LatLng(redata.lat, redata.lng);
                        marker.label.setMap(null);
                        marker.setPosition(LatLng);
                        const label = mapShowFunc.addLabelWithFont(redata.lat,redata.lng,redata.carNum,15);
                        marker.label = label;
                    }else{
                        marker = mapShowFunc.addMarker(this.map, redata.id, redata.lat, redata.lng, 'car32', redata.carNum, "car", true, true,()=>{});
                        this.regionCarsHash.add(redata.id, marker);
                    }

                };
                this.websocket.onerror = ()=>{
                    console.log("websocket连接失败！");
                };
                this.websocket.onclose = ()=>{
                    console.log('断开连接');

                };
            },

            /***
             * 进出卡口marker标记
             */
            addBayonetMarker(flag){
                //单选区域专用
                const areaId = this.defaultSelectRegionCode.join(',');
                queryBayonetPoints({areaId:areaId}).then(res=>{
                    res.data.list.map(item=>{
                        const marker = mapShowFunc.addMarker(this.map, item.id, item.lat, item.lng, 'bayonet32', '', "device", true, flag,()=>{});
                        marker.info = item.name;
                        this.regionBayonetsHash.add(item.id, marker);
                    })
                })

            },
            /***
             * 停车场marker标记
             */
            addParkMarker(flag){
                //单选区域专用
                const areaId = this.defaultSelectRegionCode.join(',');
                queryParkingPoints({areaId:areaId}).then(res=>{
                    res.data.list.map(item=>{
                        const marker = mapShowFunc.addMarker(this.map, item.id, item.lat, item.lng, 'park32', item.name, "device", true, flag,()=>{});
                        this.regionParksHash.add(item.id, marker);
                    })
                })

            },
            /**
             * 装卸区marker标记
             */
            addSiteMarker(flag){
                const areaId = this.defaultSelectRegionCode.join(',');
                queryLadeSiteArea({areaId:areaId}).then(res=>{
                    res.data.list.map(item=>{
                        if(JSON.parse(item.location)){
                            const marker = mapShowFunc.addMarker(this.map, item.id, JSON.parse(item.location)[0].lat, JSON.parse(item.location)[0].lng, 'loadPlace32', '', "device", true, flag,()=>{});
                            marker.info = item.name;
                            this.regionSitesHash.add(item.id, marker);
                        }
                    })
                })
            },
            /**
             * 桥梁marker标记
             */
            addBridgeMarker(flag){
                const areaId = this.defaultSelectRegionCode.join(',');
                queryBridgePoints({areaId:areaId}).then(res=>{
                    res.data.list.map(item=>{
                        if(JSON.parse(item.location)){
                            const marker = mapShowFunc.addMarker(this.map, item.id, JSON.parse(item.location)[0].lat, JSON.parse(item.location)[0].lng, 'bridge32', '', "device", true, flag,()=>{});
                            marker.info = item.name;
                            this.regionBridgesHash.add(item.id, marker);
                        }
                    })
                })
            },
            /**
             * 隧道marker标记
             */
            addTunnelMarker(flag){
                const areaId = this.defaultSelectRegionCode.join(',');
                queryTunnelPoints({areaId:parseInt(areaId)}).then(res=>{
                    res.data.list.map(item=>{
                        if(JSON.parse(item.location)){
                            const marker = mapShowFunc.addMarker(this.map, item.id, JSON.parse(item.location)[0].lat, JSON.parse(item.location)[0].lng, 'tunnel32', '', "device", true, flag,()=>{});
                            marker.info = item.name;
                            this.regionTunnelsHash.add(item.id, marker);
                        }
                    })
                })
            },
            /**
             * 重大危险源标记
             * @param flag 是否显示在地图上
             */
            addDangerSource(flag){
                const areaId = this.defaultSelectRegionCode.join(',');
                queryDangerSource({areaId:parseInt(areaId)}).then(res=>{
                    res.data.map((item,indx)=>{
                        this.drawPolygonFunc(item,indx,'dangerSource32',flag);

                    })

                })
            },
            /**
             * 绘制矩形或者多边形区域
             */
            drawPolygonFunc(data,dataIndex,type,flag){
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

                            drawFigure = mapShowFunc.drawRect(rectBounds,option,flag);
                        }else if(bounds.length > 2){
                            //刻画多边形
                            drawFigure = mapShowFunc.drawPolygon(bounds,option,flag);
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
                            case 'dangerSource32':
                                if(drawFigure){
                                    this.regionDangerSourceHash.add(data.id+'-'+boundIndex,drawFigure);
                                }
                                //marker中心点标记
                                marker = mapShowFunc.addMarker(this.map, data.id+'-'+boundIndex, latLng.lat(), latLng.lng(), type, '', "device", true, flag,()=>{});
                                marker.info = data.name;
                                this.regionDangerSourceMarkerHash.add(data.id+'-'+boundIndex, marker);
                                //this.map.setZoom(18)
                                break;
                            case 'company32':
                                if(drawFigure){
                                    this.regionCompanysPolgonHash.add(data.id+'-'+boundIndex,drawFigure);
                                }
                                marker = mapShowFunc.addMarker(this.map, data.id+'-'+boundIndex, latLng.lat(), latLng.lng(), 'company32', '', "company", true, flag,()=>{});
                                marker.info = data.companyName+"&"+data.officeAddress+'&'+JSON.stringify(data.boundsAry);
                                this.regionCompanysHash.add(data.id+'-'+boundIndex, marker);
                                break;

                        }

                    });
                }

            },
            /**
             * 定位标记点，并弹出气泡
             * @param id: 标识点的id
             * @param type 标识点的类型
             * @param flag  是否弹出气泡窗口
             */
            locMarkerOpenInfoWindow(id,type,flag){
                let marker = null;
                switch (type){
                    case 'company':
                        //地图级别放大到15级
                        this.map.setZoom(15);
                        marker = this.locMarkerOpenInfoWindow.getValue(id+'-'+0);
                        if(flag){
                            mapShowFunc.showMarkerInfo(this.map,id,marker,type);
                        }
                        break;
                    case 'siteLade':
                        marker = this.regionSitesHash.getValue(id);
                        if(flag){
                            mapShowFunc.showMarkerInfo(this.map,id,marker,'device');
                        }
                        break;
                    case 'bayonet':
                        marker = this.regionBayonetsHash.getValue(id);
                        if(flag){
                            mapShowFunc.showMarkerInfo(this.map,id,marker,'device');
                        }
                        break;
                    case 'dangerSource':
                        marker = this.regionDangerSourceMarkerHash.getValue(id+'-'+0);
                        if(flag){
                            mapShowFunc.showMarkerInfo(this.map,id,marker,'device');
                        }
                        break;
                    case 'bridge':
                        marker = this.regionBridgesHash.getValue(id);
                        if(flag){
                            mapShowFunc.showMarkerInfo(this.map,id,marker,'device');
                        }
                        break;
                    case 'tunnel':
                        marker = this.regionTunnelsHash.getValue(id);
                        if(flag){
                            mapShowFunc.showMarkerInfo(this.map,id,marker,'device');
                        }
                        break;
                }
            },
 
            /**
             * 清除地图上所有的marker标记
             */
            clearAllMarker(){
                const companyMarkers = this.regionCompanysHash.getValues();
                const cameraMarkers = this.regionCameraHash.getValues();
                const carMarkers = this.regionCarsHash.getValues();
                const bayonetMarkers = this.regionBayonetsHash.getValues();
                const parkMarkers = this.regionParksHash.getValues();
                const siteMarkers = this.regionSitesHash.getValues();
                const bridgeMarkers = this.regionBridgesHash.getValues();
                const tunnelMarkers = this.regionTunnelsHash.getValues();
                const dangerSourceMarkers = this.regionDangerSourceMarkerHash.getValues();
                const allMarkers = companyMarkers.concat(cameraMarkers).concat(carMarkers).concat(bayonetMarkers).concat(parkMarkers).concat(siteMarkers).concat(bridgeMarkers).concat(tunnelMarkers).concat(dangerSourceMarkers);
                allMarkers.map(item=> {
                    item.setMap(null);
                    if (item.label) {
                        item.label.setMap(null);
                    }
                });

                //清除重大危险源区域
                const dangerSourcePolygon = this.regionDangerSourceHash.getValues();
                dangerSourcePolygon.map(item=>{
                    item.setMap(null);
                })

            },
            /**
             * 控制地图上所有的marker标记的显示与隐藏，企业除始终显示
             */
            operateAllMarker(flag){
                const companyMarkers = this.regionCompanysHash.getValues();
                const cameraMarkers = this.regionCameraHash.getValues();
                const carMarkers = this.regionCarsHash.getValues();
                const bayonetMarkers = this.regionBayonetsHash.getValues();
                const parkMarkers = this.regionParksHash.getValues();
                const siteMarkers = this.regionSitesHash.getValues();
                const bridgeMarkers = this.regionBridgesHash.getValues();
                const tunnelMarkers = this.regionTunnelsHash.getValues();
                const dangerSourceMarkers = this.regionDangerSourceMarkerHash.getValues();
                const allMarkers = cameraMarkers.concat(carMarkers).concat(bayonetMarkers).concat(parkMarkers).concat(siteMarkers).concat(bridgeMarkers).concat(tunnelMarkers).concat(dangerSourceMarkers);
                let obj = (flag==true)?this.map:null;
                companyMarkers.map(marker=>{
                    marker.setMap(this.map);
                    if (marker.label) {
                        marker.label.setMap(this.map);
                    }
                });
                allMarkers.map(item=> {
                    item.setMap(obj);
                    if (item.label) {
                        item.label.setMap(obj);
                    }
                });

                //清除重大危险源区域
                const dangerSourcePolygon = this.regionDangerSourceHash.getValues();
                dangerSourcePolygon.map(item=>{
                    item.setMap(obj);
                });

                //关闭信息提示框
                mapShowFunc.closeInfoWin();

            },

            /**
             * 清除哈希表
             */
            clearHashTable(){
                this.regionCompanysHash.clear();
                this.regionCameraHash.clear();
                this.regionCarsHash.clear();
                this.regionBayonetsHash.clear();
                this.regionParksHash.clear();
                this.regionSitesHash.clear();
                this.regionBridgesHash.clear();
                this.regionTunnelsHash.clear();
                this.regionDangerSourceHash.clear();
                this.regionDangerSourceMarkerHash.clear();
                mapShowFunc.mapVariable._cameraShowMarkers.clear();
            },

            //获取烟台市的行政区域
            getAllRegions() {
                this.defaultSelectRegionCode = [];
                queryAreaList({parent:'370600'}).then(res=>{
                    this.regions = res.data;
                    let areaId = "";
                    this.regions.forEach(item => {
                        if (item.isCenter == "1") {
                            this.mapCenterLat = item.offsetLat;
                            this.mapCenterLng = item.offsetLng;
                            areaId = item.id;
                            this.defaultSelectRegionCode.push(areaId);   //初始化区域的选中状态
                        }
                    });
                    //加载默认区域的点位
                    //this.getAllCameras(areaCode);

                    //根据默认选中的开关项，加载默认区域对应的marker标记
                    this.getDefaultMarkers();
                })

            },
            getDefaultMarkers(){
                this.addCompanyMarker(true);
                this.addCameraMarker(false);
                this.addBayonetMarker(false);
//                this.addParkMarker(false);   //停车场：应急局暂时不用，隐藏
                this.addSiteMarker(false);
                this.addDangerSource(false);  //加载但不显示
                this.addBridgeMarker(false);
                this.addTunnelMarker(false);
            },


            /**
             * 切换区域选择,定位到该区域
             */
            handRegionClick(command) {
                //存储所选区域的值
                this.defaultSelectRegionCode = [];
                this.defaultSelectRegionCode.push(command);
                //重置开关选中状态
//                this.defaultSelectSwitch = [];
                this.defaultSelectSwitch = ['company'];
                //将地图的级别重置为12级
                this.map.setZoom(12);
                //清除地图上所有的marker
                this.clearAllMarker();
                this.clearHashTable();
                //关闭websocket
                if(this.websocket){
                    this.websocket.close();
                }

                //定位区域
                let offsetLat;
                let offsetLng;
                this.regions.forEach(item => {
                    if (item.id == command) {
                        offsetLat = item.offsetLat;
                        offsetLng = item.offsetLng;
                    }
                });
                mapShowFunc.pan2Point(offsetLat, offsetLng, this.map);

                //显示默认开关选中对应的markers
                this.getDefaultMarkers();
            },

            //关闭电子运单的弹窗
            closeWaybillDialog() {
                this.$store.dispatch('map/openDialogOfWaybill', false);
                this.waybillDialogVisible = false
            },
            //关闭车辆信息的弹窗
            closeCarDialog() {
                this.$store.dispatch('map/openDialogOfCar', false);
                this.carDialogVisible = false
            },
            //关闭实时视频播放的弹窗
            closeVideoDialog(){
                //关闭视频
                this.$refs.realPlay.closeAllVideo();
            },

            //实时视频窗口
            /**
             * 改变录像回放的窗口数量
             * @param winNum
             * @param curWinNum
             * @param curVideoRowCls
             * @param state
             */
            changeWinNumFunc(winNum, curWinNum, curVideoRowCls, state) {
                if (state == 'realPlay') {
                    this.winNum_play = winNum;
                    this.curWinNum_play = curWinNum;
                    this.curVideoRowCls_play = curVideoRowCls;
                }

            },
            //双击放大窗口改变参数
            updateData(value1, value2, state) {
                if (state == "realPlay") {
                    this.winNum_play = value1;
                    this.curVideoRowCls_play = [value2];
                }
            },

        },
    }
</script>
<style>
    .el-dropdown-menu {
        z-index: 60000 !important;
    }
</style>
<style lang="less" scoped>
    @import "./style/style.map-view.less";
    @import "./style/style.maker-info-window.less";
</style>
