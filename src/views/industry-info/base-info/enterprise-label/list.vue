<template>
    <div class="map-container">
        <!-------加载离线地图的js文件------>
        <!--<googleMap></googleMap>-->
        <!--企业列表-->
        <div class="tunnel-list">
            <div class="content">
                <CommonSubtitle title="企业列表" :isBold="true" class="commonSub-title"></CommonSubtitle>
                <div class="tunnel-info" style="position: relative" v-scrollBar>
                    <region-tree :data="treeData" :loading="treeLoading" ref="regionTree"
                                 @node-click="handleNodeClick" :showSearch="true"></region-tree>
                </div>
            </div>
        </div>
        <div class="map">
            <!--<div class="rt-btn-wrapper">
                <el-button-group>
                    <el-button type="default" icon="el-icon-document" @click="saveDrawFigure">保存</el-button>
                    <el-button type="default" icon="el-icon-edit" @click="clearDrawFigure">重新绘制</el-button>
                </el-button-group>
            </div>-->
            <div class="map-wrapper">
                <google-map-view ref="googleMap" @map="getMap" :lat="mapCenterLat" :lng="mapCenterLng"></google-map-view>
            </div>
            <div class="lt-btn-wrapper">
               <!-- <drop-down name="区域选择" ref="dropDownMenu" :data="regions" :defaultValue="defaultSelectRegionCode"
                           :isMultiSelect="false" @command="handRegionClick"></drop-down>-->
                 <!--<drop-down name="绘制工具" ref="dropDownMenu" :data="drawBtnItems" :defaultValue="defaultSelectDraw"
                            :isMultiSelect="false" @command="handleDraw"></drop-down>-->
            </div>
           <!-- &lt;!&ndash;右侧列表&ndash;&gt;
            <div class="tree-list">
                <region-tree :data="treeData" :loading="treeLoading" ref="regionTree"
                             @node-click="handleNodeClick" :showSearch="true"></region-tree>
            </div>-->
        </div>
      <!--  &lt;!&ndash;详情的dialog&ndash;&gt;
        <el-dialog title="详细信息" :visible.sync="seeDetailFlag"  width="62%" :close-on-click-modal="false" v-elDragDialog append-to-body>
            <see-detail :userInfo="userInfo" :areaId="form.areaId"  :data="selectedTankData" @closeDialog="handleCloseDetailDialog"></see-detail>
        </el-dialog>-->
    </div>
</template>
<script>
    import switchItem from '@/components/common/switchItem.vue'    //开关项
    import dropDown from '@/components/common/dropDownMenu.vue'    //下拉列表组件
    import googleMapView from '@/components/common/googleMapView.vue'
    import mapShowFunc from '@/utils/mapShowFunc'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import elDragDialog from '@/directive/el-drag-dialog'
    import Pagination from '@/components/Pagination'
    import {basicArea,getCompanyDetail,basicCompanyBounds} from '@/api/industry'
    import {queryAreaList,queryCompanyPoints} from '@/api/map'
    import regionTree from '@/components/common/regionTree.vue'
    import utility from '@/utils/ext.utility'
    export default {
        name: 'MapMonitorIndex',
        directives: {elDragDialog},
        components: {googleMapView, dropDown,CommonSubtitle,Pagination,switchItem,regionTree},
        data() {
            return {
                map: null,
                mapCenterLat:'37.6408324203',  //地图默认区域中心的经纬度,默认为龙口市
                mapCenterLng:'120.5088065485',
                list:null,//企业信息
                treeData: [],
                treeLoading:false,
                //框选工具
                drawBtnItems: [
                    {
                        des: '框选',
                        icon: 'fa fa-square-o',
                        code: 'rect'
                    },
                    {
                        des: '多边形',
                        icon: 'fa fa-bookmark-o',
                        code: 'polygon'
                    }
                ],
                drawTool: '',
                defaultSelectDraw: [],  //默认选中的框选工具
                regions:[],  //行政区域列表
                defaultSelectRegionCode: [],  //默认选中的行政区编码
                shapeOverlays:[],  //存储绘制的轨迹
                latLngArrays:[],  //存储绘制区域的顶点坐标
                addCompanyMarker:[],//存储公司点位
                areaId:null,//区域id
                companyHash: new utility.hashTable(), //所有企业，key为id，value为企业marker
                companyShapeHash: new utility.hashTable(), //所有企业区域，key为id，value为企业区域轨迹
                currentCompanyId:null,//当前树节点选择的公司id
            }
        },
        created() {

        },
        methods: {
            getMap(map) {
                this.map = map;
                //加载所有的行政区域：放在地图加载完成之后，防止地图未加载完成就标记点位
                this.getAllRegions();
            },
            getAllRegions() {
                this.defaultSelectRegionCode = [];
                queryAreaList({parent:'370600'}).then(res=>{
                    this.regions = res.data;
                    this.regions.forEach(item => {
                        if (item.isCenter == "1") {
                            this.mapCenterLat = item.offsetLat;
                            this.mapCenterLng = item.offsetLng;
                            this.defaultSelectRegionCode.push(item.code);   //初始化区域的选中状态
                            //加载部门树
                            this.getTreeData();
                            this.defaultSelectRegionCode.push(item.code);   //初始化区域的选中状态
                            this.areaId = item.id;
                            //加载企业点位
                            this.addCompanyAllMarker();
                        }
                    });
                })
            },
            /**
             * 企业marker标记
             */
            addCompanyAllMarker(){
                const areaId = this.areaId;
                queryCompanyPoints({areaId:areaId}).then(res=>{
                    res.data.list.map((item,index)=>{
                        this.drawPolygonFunc(item,index,'company32');
                        //重新更新当前选择的公司位置信息
                        if(item.id==this.currentCompanyId && this.currentCompanyId){
                            this.list=item;
                        }
                    })
                })
            },
            /**
             * 首次全部绘制矩形或者多边形区域
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
                        let centerMarker=false;
                        if(bounds.length == 1){
                            //刻画点位
                            const marker = mapShowFunc.addMarker(this.map, data.id + '-' + boundIndex, bounds[0].lat, bounds[0].lng, 'company32', null, "device", true, true, () => {});
                            marker.info = data.companyName+"&"+data.officeAddress+'&'+JSON.stringify(data.boundsAry);
                            this.companyHash.add(data.id + '-' + boundIndex, marker);
                        }else if(bounds.length == 2){
                            //刻画矩形
                            const rectBounds = new google.maps.LatLngBounds({lat:bounds[0].lat,lng:bounds[0].lng},{lat:bounds[1].lat,lng:bounds[1].lng});
                            drawFigure = mapShowFunc.drawRect(rectBounds,option);
                            centerMarker=true;
                        }else if(bounds.length > 2){
                            //刻画多边形
                            drawFigure = mapShowFunc.drawPolygon(bounds,option);
                            centerMarker=true;
                        }
                        this.companyShapeHash.add(data.id + '-' + boundIndex,drawFigure);
                        console.log(data.id + '-' + boundIndex,'index',drawFigure);

                        //移动至地图中央
                        let LatLngBounds = new google.maps.LatLngBounds();//API地图边界
                        bounds.map(ktem=>{
                            const temp = new google.maps.LatLng(ktem.lat, ktem.lng);
                            LatLngBounds.extend(temp);
                        });
                        //得到中心点
                        const latLng = LatLngBounds.getCenter();
                        //为多边形区域画中心点
                        let marker = null;
                        //是否绘制中心点，如果不是点位，则绘制
                        if(centerMarker){
                            marker = mapShowFunc.addMarker(this.map, data.id+'-'+boundIndex, latLng.lat(), latLng.lng(), 'company32', '', "device", true, true,()=>{});
                            marker.info = data.companyName+"&"+data.officeAddress+'&'+JSON.stringify(data.boundsAry);
                            this.companyHash.add(data.id + '-' + boundIndex, marker);
                        }
                    });
                }

            },
            getTreeData() {
                let obj={ ifShowSide: "2"};
                this.treeLoading=true;
                basicArea(obj).then(res => {
                    this.treeData = res.data;
                    this.treeLoading = false;
                }).catch((err) => {
                    this.treeLoading = false
                })
            },
            /**
             * 切换区域选择,定位到该区域
             */
            handRegionClick(command) {
                //存储所选区域的值(单选：先清空数组再赋值)
                this.defaultSelectRegionCode = [];
                this.defaultSelectRegionCode.push(command);

                //定位区域
                let offsetLat;
                let offsetLng;
                this.regions.forEach(item => {
                    if (item.code == command) {
                        offsetLat = item.offsetLat;
                        offsetLng = item.offsetLng;
                    }
                });
                mapShowFunc.pan2Point(offsetLat, offsetLng, this.map);
            },
            handleNodeClick(data){
                if(data.type== "company"){
                   this.getCompanyData({id:data.id})
                }
            },
            getCompanyData(obj){
                getCompanyDetail(obj).then(res => {
                    this.list = res.data.list[0];
                    //如果该公司有边界信息，则画出来
                    this.handleSelect(this.list)
                }).catch((err) => {
                })
            },
            //选中一条公司
            handleSelect(data) {
                //绘制已保存的区域
                if(data.boundsAry && data.boundsAry.length>0){
                    this.latLngArrays=[];
                    data.boundsAry.map((bounds,index)=>{
                        /* //工业园区的绘制区域
                         let drawFigure = null;
                         //标志是否需要画中心点位
                         let centerMarker=false;
                         if(bounds.length == 1){
                             //刻画点位
                             const marker = mapShowFunc.addMarker(this.map, this.list.id + '-' + index, bounds[0].lat, bounds[0].lng, 'company32', this.list.companyName, "device", true, true, () => {});
                             this.addCompanyMarker.push(marker);
                         }else if(bounds.length == 2){
                             //刻画矩形
                             const rectBounds = new google.maps.LatLngBounds({lat:bounds[0].lat,lng:bounds[0].lng},{lat:bounds[1].lat,lng:bounds[1].lng});
                             drawFigure = mapShowFunc.drawRect(rectBounds,option);
                             this.shapeOverlays.push(drawFigure);
                             this.latLngArrays.push(bounds);
                             centerMarker=true;
                         }else{
                             //刻画多边形
                             drawFigure = mapShowFunc.drawPolygon(bounds,option);
                             this.shapeOverlays.push(drawFigure);
                             this.latLngArrays.push(bounds);
                             centerMarker=true;
                         }*/
                        //移动至地图中央
                        let LatLngBounds = new google.maps.LatLngBounds();//API地图边界
                        this.latLngArrays.push(bounds);
                        bounds.map(ktem=>{
                            const temp = new google.maps.LatLng(ktem.lat, ktem.lng);
                            LatLngBounds.extend(temp);
                        });
                        //得到中心点
                        const latLng = LatLngBounds.getCenter();
                        //将点位的信息框弹出来
                        let marker = this.companyHash.getValue(data.id+ '-' + 0);
                        mapShowFunc.showMarkerInfo(this.map,data.id,marker,'device');
                        if(index == 0){
                            mapShowFunc.pan2Point(latLng.lat(),latLng.lng());
                            this.map.setZoom(15);
                        }
                    });
                }
            },
            //打开绘制按钮
            handleDraw(code) {
                let drawType = "";
                this.drawBtnItems.forEach(item => {
                    if (item.code == code) {
                        drawType = item.code;
                    }
                });
                //先清空所有的绘制区域
                mapShowFunc.clearAllOverlay();
                switch (drawType) {
                    case 'polygon':
                        //mapShowFunc.searchByPolygon();	//画多边形
                        mapShowFunc.mapVariable._eventHandler = 'drawPolygon';
                        mapShowFunc._eventCallback['drawPolygon'] = this.drawPolygonComplete;
                        mapShowFunc.setDrawModel('polygon');
                        break;
                    case 'rect':
//                        mapShowFunc.searchByRect();		//画矩形
                        mapShowFunc.mapVariable._eventHandler = 'drawRect';
                        mapShowFunc._eventCallback['drawRect'] = this.drawRectComplete;
                        mapShowFunc.setDrawModel('rectangle');
                        break;
                    default :
                        this.$message({message: '绘制类型错误！', type: 'warning'});
                        break;
                }
            },
            //完成绘制多边形
            drawPolygonComplete(shape){
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
            //完成绘制矩形
            drawRectComplete(shape){
                this.shapeOverlays.push(shape.overlay);  //存储绘制轨迹
                const bounds = shape.overlay.getBounds();
                let latLngArray = [];
                //有顺序，先存储西南角坐标点，然后是东北角坐标点
                latLngArray.push({
                    lat: bounds.getSouthWest().lat(),
                    lng: bounds.getSouthWest().lng()
                });
                latLngArray.push({
                    lat: bounds.getNorthEast().lat(),
                    lng: bounds.getNorthEast().lng()
                });
                this.latLngArrays.push(latLngArray);
            },

            //保存绘制的图形
            saveDrawFigure(){
                if(this.list == null){
                    this.$message({message:'请先从列表中选择一个公司',type:'warning'});
                    return
                }
                basicCompanyBounds({id:this.list.id,bounds: JSON.stringify(this.latLngArrays)}).then(res=>{
                    if(res.code == '1000'){
                        this.$message({message:'保存成功！',type:'success'});
                        this.latLngArrays=[];
                    }
                });
            },
            //修改位置，重新绘制
            clearDrawFigure(){
                //清空矢量图层
                this.shapeOverlays.map(item=>{
                    item.setMap(null);
                });
                //清空点位
                this.addCompanyMarker.map(item=>{
                    item.setMap(null);
                    item.label.setMap(null);
                });
                this.addCompanyMarker=[];
                this.shapeOverlays = [];
                this.latLngArrays = [];
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../../components/common/style/style.map-view.less";
    @import "../../../../components/common/style/style.maker-info-window.less";
    .lt-btn-wrapper{
        position: absolute;
        left: 370px;
        top: 10px;
        z-index: 999;
    }
    .rt-btn-wrapper {
        top: 5px;
    }
    .operate-btn{
        cursor: pointer;
        color: #1296DB;
    }
    .tree-list{
        width: 100%;
        max-width: 350px;
        height: calc(100% - 95px);
        position: absolute;
        top: 60px;
        right: 5px;
        background: #fff;
        z-index: 2000;
        padding: 10px;
    }
    .map{
        width: 100%;
        height: 100%;
    }
    .tunnel-list{
        height: calc(100% - 50px);
        top: 10px;
        left:10px;
        .content{
            height: 100%;
        }
    }
    .tunnel-info{
        height: calc(100% - 50px);
        padding: 0 10px 10px 10px;
    }
</style>
