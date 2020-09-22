<template>
    <div style="width: 100%;height: 100%;padding-bottom: 10px">
        <google-map-marker
                ref="googleMapMarker"
                @map="getMap"
                :lat="mapCenterLat"
                :lng="mapCenterLng"
                v-if="mapLoading"
        ></google-map-marker>
        <div class="lt-btn-wrapper" v-if="mapLoading">
            <el-button-group>
                <el-button type="default" icon="el-icon-location" size="small" @click="mapMarkerFunc">标注</el-button>
                <el-button type="default" icon="el-icon-edit" size="small" @click="drawPolygonFunc">绘制辖区</el-button>
                <el-button type="default" icon="el-icon-rank" size="small" @click="updateLocFunc">修改位置</el-button>
                <el-button type="default" icon="el-icon-delete" size="small" @click="resetMarkerFunc">重新标注</el-button>
            </el-button-group>
        </div>
        <el-divider></el-divider>
        <div class="btn-wrap float-right">
            <el-button type="default" @click="onCancel">关闭</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import GoogleMapMarker from '@/views/emergency-management/components/googleMapMarker.vue'
    import mapShowFunc from '@/utils/mapShowFunc'
    import utility from '@/utils/ext.utility'
    import {emergencyStorageSaveOrUpdateBounds} from '@/api/emergencyManagement/emergencyResource'

    export default {
        name: "ToggleGoogleMap",
        components: {CommonSubtitle, GoogleMapMarker},
        props: ['markerShow', 'detailInfo', 'markerIcon'],
        data() {
            return {
                map: null,
                mapCenterLat: '37.6408324203',  //地图默认区域中心的经纬度,默认为龙口市
                mapCenterLng: '120.5088065485',

                shapeOverlays: [],  //存储绘制的轨迹
                latLngArrays: [],  //存储绘制区域的顶点坐标
                mapLoading: false, //地图加载状态
                areaHash: new utility.hashTable(), //存储某区域下的所有隧道，key为id，value为重大危险源轨迹的数组
                areaMarkerHash: new utility.hashTable(), //存储某区域下的所有隧道，key为id，value为重大危险源marker的数组
                markerHash: new utility.hashTable(),   //存储点位定位时绘制的marker点标记

            }
        },
        watch: {
            markerShow: {
                handler: function (newV, oldV) {
                    if (newV) {
                        setTimeout(() => {
                            this.mapLoading = true;
                        }, 500)
                        setTimeout(() => {
                            if (this.detailInfo && this.detailInfo.hasOwnProperty('id')) {
                                this.handleSelect(this.detailInfo.id, this.detailInfo);
                            }
                        }, 600)
                    }
                },
                immediate: true
            }
        },
        mounted() {
        },
        methods: {

            getMap(map) {
                //地图右下角放大/缩小组件隐藏
                mapShowFunc.mapVariable['options']['zoomControl'] = false;
                this.map = map;
            },
            /**
             *初始显示多边形区域或点
             */
            handleSelect(index, data) {

                //绘制已保存的区域
                if (data.boundsAry && data.boundsAry.length > 0) {
                    const option = {
                        strokeColor: '#8b1d1a',
                        strokeOpatity: 1,
                        fillColor: '#8b1510',
                    };
                    //地图级别放大到15级
//                        this.map.setZoom(15);
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
                }
            },

            //在地图上画点
            setMapPoint(data, id) {
                const curMarker = this.markerHash.getValue(id);
                //定位
                if (data.hasOwnProperty('lat')) {
                    //判断是否已进行点位标注，若是则执行下面的操作
                    mapShowFunc.pan2Point(data.lat, data.lng);
                    if (!curMarker) {
                        //判断marker是否存在，不存在则标记marker
                        const marker = mapShowFunc.addMarker(this.map, new Date().getTime(), data.lat, data.lng, this.markerIcon, '', "device", true, true, () => {
                        });
                        this.markerHash.add(id, marker);
                    }
                    //存入数组
                    let arr = [];
                    arr.push({
                        lat: data.lat,
                        lng: data.lng
                    });
                    this.latLngArrays.push(arr);
                }
            },

            //清除所有点marker点标记
            clearAllMarkers() {
                const allMarkers = this.markerHash.getValues();
                allMarkers.map(item => {
                    item.setMap(null);
                    item.label.setMap(null);
                });
                this.markerHash.clear();
            },

            //区域清空绘制
            clearDrawFigure() {
                console.log(this.shapeOverlays,"this.shapeOverlays");
                this.shapeOverlays.map(item => {
                    item.setMap(null);
                });
                this.shapeOverlays = [];
            },

            //地图标注
            mapMarkerFunc() {
                //清除标注
//                this.clearDrawFigure();
                //监听地图点击事件
                google.maps.event.addListener(this.map, 'click', (event) => {
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();
                    const marker = mapShowFunc.addMarker(this.map, new Date().getTime(), lat, lng, this.markerIcon, '', 'device', true, true, () => {
                    });
                    this.markerHash.add(new Date().getTime(), marker);
                    //取消点击监听
                    google.maps.event.clearListeners(this.map, 'click');
                    //存入数组
                    let arr = [];
                    arr.push({
                        lat: lat,
                        lng: lng
                    });
                    this.latLngArrays.push(arr);
                });
            },

            //绘制辖区
            drawPolygonFunc() {
                //清除标注
//                this.clearDrawFigure();
                mapShowFunc.mapVariable._eventHandler = 'drawPolygon';
                mapShowFunc._eventCallback['drawPolygon'] = this.drawPolygonComplete;
                mapShowFunc.setDrawModel('polygon');
            },

            //绘制辖区完成的回调函数
            drawPolygonComplete(shape) {
                this.shapeOverlays.push(shape.overlay);  //存储绘制轨迹
                const paths = shape.overlay.getPath();
                let latLngArray = [];//存储所有的顶点坐标
                for (let i = 0; i < paths.length; i++) {
                    latLngArray.push({
                        lat: paths.getAt(i).lat(),
                        lng: paths.getAt(i).lng()
                    });
                }
                this.latLngArrays.push(latLngArray);
            },

            //修改位置
            updateLocFunc() {
                //将所有标注的marker设置为可拖拽状态
                let markers = this.markerHash.getValues();
                markers.map(marker => {
                    marker.setDraggable(true);
                })
            },
            //位置移动--保存位置后，更新坐标点
            updateMarkerLatLng(originalPos, nowPos) {
                //移动前的原始坐标点
                const oLat = originalPos.lat();
                const oLng = originalPos.lng();
                //移动后的最新坐标点
                const nLat = nowPos.lat();
                const nLng = nowPos.lng();
                //替换latLngArrays数组中对应的坐标点
                this.latLngArrays.map(item => {
                    if (item.length == 1) {
                        //标记的是点
                        if (Math.round(item[0].lat * 10000) / 10000 == Math.round(oLat * 10000) / 10000 &&
                            Math.round(item[0].lng * 10000) / 10000 == Math.round(oLng * 10000) / 10000) {
                            item[0].lat = nLat;
                            item[0].lng = nLng;
                        }
                    }
                });
            },

            //重新标注
            resetMarkerFunc() {
                this.clearDrawFigure();
                this.clearAllMarkers();
                this.latLngArrays = [];
            },

            //保存新位置
            onSubmit() {
                let params = {
                    id: this.detailInfo.hasOwnProperty('id') ? this.detailInfo.id : null,
                    bounds: JSON.stringify(this.latLngArrays)
                };
                this.$emit('saveOrUpdateBounds', params);
                /*emergencyStorageSaveOrUpdateBounds(params).then(res => {
                     this.$message({
                         showClose: true,
                         message: '保存成功！',
                         type: 'success'
                     });
                     setTimeout(()=>{
                         this.$emit('toggleHidden','marker')
                     },600);
                 }).catch((err) => {
                 });*/
            },

            //取消
            onCancel() {
                this.$emit('toggleHidden', 'marker')
            },
        }
    }
</script>

<style lang="scss" scoped type="text/scss">

</style>
