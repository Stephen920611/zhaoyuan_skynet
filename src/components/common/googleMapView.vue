<!--初始化地图显示-->
<template>
    <div class="map-content">
        <div id="map_canvas"></div>
        <div class="tool_point">
            <p>级别:&nbsp;<span id="showZoom" class="showZoom">{{curZoom}}</span>&nbsp;&nbsp;经纬度:&nbsp;<span
                    id="latAndLng">{{latAndLng}}</span></p>
        </div>
    </div>
</template>
<script>
    import mapShowFunc from '@/utils/mapShowFunc'
    import {getParamsByCode} from '@/api/public'
    import {mapGetters} from 'vuex'
    export default {
        props:['lat','lng'],
        data() {
            return {
                latAndLng: '',    //当前的经纬度坐标
                curZoom: 12,    // 当前的缩放级别
                maxZoom: 18,
                minZoom: 5,
                map: null,
                isMark:false,  //标记是否已初始化地图
            }
        },
        mounted() {
            this.getMaptileUrl();
        },
        methods: {
            //获取地图瓦片的地址
            getMaptileUrl(){
                getParamsByCode({code:'maptile_url'}).then(res=>{
                    if(res.code == 1000){
                        localStorage.setItem('maptile_url',res.data);
                        this.initGoogleMap();
                    }
                });

            },
            //初始化地图配置
            initGoogleMap() {
                const mapUrl = localStorage.getItem('maptile_url');
//                this.loadingMap("map_canvas", mapUrl);
                this.loadingMap("map_canvas", mapUrl);
//                this.loadingMap("map_canvas", 'http://120.192.167.70:8087/');
                this.map = mapShowFunc.mapVariable.map;
                this.listenerMapEvent(this.map);
                //设置右键上下级
                let menuContext = new MenuControl(this.map);
                menuContext.sender = this.map;
                this.initMenuContext(this.map, menuContext);
                this.$emit('map',this.map);
            },

            //加载地图
            loadingMap(obj, url) {
                const container = document.getElementById(obj);
//                const lat = '37.6408324203';
//                const lng = '120.5088065485';
                const lat = this.lat;
                const lng = this.lng;
                this.latAndLng = lng + ',' + lat;
                mapShowFunc.initMap(container, url, lat, lng);
                this.getThisMap();
            },
            //监听地图事件
            listenerMapEvent(map) {
                // 鼠标移动、单击显示当前坐标，滚轮显示地图等级
                google.maps.event.addListener(map, 'mousemove', event => {
                    this.latAndLng = event.latLng.lng() + ',' + event.latLng.lat();
                });
                google.maps.event.addListener(map, 'zoom_changed', () => {
                    this.curZoom = map.getZoom();
                });
            },
            //设置右键菜单
            initMenuContext(thismap, context) {
                context.addSeparator("map");
                context.addItem(new MenuItem({
                    text: "放大一级",
                    icon: "images/zoomax.png",
                    groupName: "map",
                    handler: (coor) => {
                        if (this.curZoom < this.maxZoom) {
                            this.curZoom = this.curZoom + 1;
                            this.map.setZoom(this.curZoom)
                        }
                    }
                }));
                context.addItem(new MenuItem({
                    text: "缩小一级",
                    icon: "images/zoomin.png",
                    groupName: "map",
                    handler: (coor) => {
                        if (this.curZoom > 1) {
                            this.curZoom = this.curZoom - 1;
                            this.map.setZoom(this.curZoom)
                        }
                    }
                }));
                google.maps.event.addListener(thismap, "rightclick", function (e) {
                    if (context.isEnable) {
                        context.coordinate = {
                            point: e.pixel,
                            latlng: e.latLng
                        };
                        context.container.style.left = e.pixel.x + "px";
                        context.container.style.top = e.pixel.y + "px";
                        context.show("map");
                    }
                });
            },
            getThisMap() {
                this.map = mapShowFunc.mapVariable.map;
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "style/google-map.less";
</style>
