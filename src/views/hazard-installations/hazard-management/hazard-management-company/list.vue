<template>
    <div class="map-container">
        <!-------搜索条件------>
        <div class="filter-container">
            <el-form :inline="true" :model="form" class="form-inline-search">
                <el-row>
                    <el-form-item label="危险源名称：">
                        <el-input
                                v-model.trim="form.name"
                                placeholder="请输入危险源名称"
                                class="filter-item"
                                style="width: 95%;"
                                @keyup.enter.native="handleFilter"
                        />
                    </el-form-item>
                    <el-form-item label="危险源状态：">
                        <el-select v-model="form.state" class="filter-item"
                                   placeholder="请选择危险源状态" >
                            <el-option
                                    v-for="item in stateOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="危险源级别：">
                        <el-select v-model="form.level" class="filter-item"
                                   placeholder="请选择危险源级别" >
                            <el-option
                                    v-for="item in levelOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
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
                                @click="handleReset"
                        >
                            重置
                        </el-button>
                        <el-button type="primary" size="medium" style="margin-left: 10px;"
                                   icon="el-icon-folder-add"
                                   class="filter-item"
                                   @click="addTankFlag=true">
                            新 增
                        </el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div class="tunnel-list">
            <div class="content" style="height: 100%;width: 100%;position: relative" v-scrollBar>
                <CommonSubtitle title="检索结果" :isBold="true" class="commonSub-title"></CommonSubtitle>
                <div class="tunnel-info">
                    <div v-if="list.length == 0 && !isFirstLoad">
                        <span class="padding-lr-20 font-size-14">暂无数据！</span>
                    </div>
                    <div class="cm-haq-list-container" v-loading="listLoading" >
                        <div v-for="(item,index) in list" :key="index" class="line-item" :class="{'active':index==selectedItemIndex}" @click="handleSelect(index,item)">
                            <el-row class="base-info">
                                <el-col :span="8" class="text-right">
                                    危险源名称：
                                </el-col>
                                <el-col :span="16" class="ellipsis-l1">
                                    <span :title="item.name">{{item.name}}</span>
                                </el-col>
                            </el-row>
                            <el-row class="base-info">
                                <el-col :span="8" class="text-right">
                                    投入使用时间：
                                </el-col>
                                <el-col :span="16">
                                    <span>{{item.useDate}}</span>
                                </el-col>
                            </el-row>
                            <el-row class="base-info">
                                <el-col :span="8" class="text-right">
                                    危险源级别：
                                </el-col>
                                <el-col :span="16">
                                    <span>{{item.levelName}}</span>
                                </el-col>
                            </el-row>
                            <el-row class="base-info">
                                <el-col :span="8" class="text-right">
                                    状态：
                                </el-col>
                                <el-col :span="16">
                                    <span>{{item.stateName}}</span>
                                </el-col>
                            </el-row>
                            <el-divider></el-divider>
                            <el-row class="cm-haq-list-item-notice">
                                <el-col :span="16">
                                    <span @click="seeDetailFlag=true">
                                        查看详情 <i class="fa fa-chevron-circle-right operate-btn"></i>
                                    </span>
                                </el-col>
                                <el-col :span="8" class="text-right">
                                    <span class="margin-r-10 operate-btn" @click="editTankFlag=true">修改</span>
                                    <span class="operate-btn" @click="deleteHazard">删除</span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
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
        </div>
        <div class="map">
            <div class="rt-btn-wrapper">
                <el-button-group>
                    <el-button type="default" icon="el-icon-document" @click="saveDrawFigure">保存</el-button>
                    <el-button type="default" icon="el-icon-edit" @click="clearDrawFigure">重新绘制</el-button>
                </el-button-group>
            </div>
            <div class="map-wrapper">
                <google-map-view ref="googleMap" @map="getMap" :lat="mapCenterLat" :lng="mapCenterLng"></google-map-view>
            </div>
            <div class="lt-btn-wrapper">
                <!--<drop-down name="区域选择" ref="dropDownMenu" :data="regions" :defaultValue="defaultSelectRegionCode"
                           :isMultiSelect="false" @command="handRegionClick"></drop-down>-->
                <drop-down name="绘制工具" ref="dropDownMenu" :data="drawBtnItems" :defaultValue="defaultSelectDraw"
                           :isMultiSelect="false" @command="handleDraw"></drop-down>
            </div>
        </div>
        <!--详情的dialog-->
        <el-dialog title="新增" :visible.sync="addTankFlag" v-if="addTankFlag"  width="1000px" :close-on-click-modal="false" v-elDragDialog append-to-body>
            <add-hazard :states="stateOptions" :levels="levelOptions" :purposes ="purposeOptions" :userInfo="userInfo" :areaId="form.areaId" @closeDialog="handleCloseAddDialog"></add-hazard>
        </el-dialog>
        <!--详情的dialog-->
        <el-dialog title="编辑" :visible.sync="editTankFlag" v-if="editTankFlag" width="1000px" :close-on-click-modal="false" v-elDragDialog append-to-body>
            <edit-hazard :states="stateOptions" :levels="levelOptions" :purposes ="purposeOptions" :userInfo="userInfo" :areaId="form.areaId" :data="selectedHazardData" @closeDialog="handleCloseEditDialog"></edit-hazard>
        </el-dialog>
        <!--详情的dialog-->
        <el-dialog title="详细信息" :visible.sync="seeDetailFlag" v-if="seeDetailFlag"  width="1000px" :close-on-click-modal="false" v-elDragDialog append-to-body>
            <see-detail :states="stateOptions" :levels="levelOptions" :purposes ="purposeOptions" :userInfo="userInfo" :areaId="form.areaId" :data="selectedHazardData" @closeDialog="handleCloseDetailDialog"></see-detail>
        </el-dialog>
    </div>
</template>
<script>
    import switchItem from '@/components/common/switchItem.vue'    //开关项
    import dropDown from '@/components/common/dropDownMenu.vue'    //下拉列表组件
    import googleMapView from '@/components/common/googleMapView.vue'
    import {getByCode} from '@/api/industry'
    import {queryAreaList,queryCompanyPoints} from '@/api/map'
    import {queryHazardSourceList,getHazardSourceDetail,saveOrUpdateHazardSource,updateBoundsHazardSource,deleteHazardSource} from '@/api/majorHazardSource'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import elDragDialog from '@/directive/el-drag-dialog'
    import SeeDetail from "./components/see-detail";
    import Pagination from '@/components/Pagination'
    import AddHazard from "./components/add-hazard";
    import EditHazard from "./components/edit-hazard";
    import utility from '@/utils/ext.utility'
    import extMain from '@/utils/ext.main'
    import mapShowFunc from '@/utils/mapShowFunc'
    export default {
        name: 'HazardSourceIndex',
        directives: {elDragDialog},
        components: {EditHazard,AddHazard, SeeDetail, googleMapView, dropDown,CommonSubtitle,Pagination,switchItem},
        data() {
            return {
                map: null,
                mapCenterLat:'37.6408324203',  //地图默认区域中心的经纬度,默认为龙口市
                mapCenterLng:'120.5088065485',
                selectedItemIndex:null,
                list:[],//隧道列表
                form: {
                    name: '',
                    areaId: null,
                    companyId: null,
                    state: null,
                    level: null
                },
                listLoading:false,
                seeDetailFlag:false,
                addTankFlag:false,
                editTankFlag:false,
                total: 0,
                listQuery: {
                    page: 1,
                    size: 4,
                },
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
                userInfo:null,  //登录用户的信息
                stateOptions:[],   //状态列表
                levelOptions:[],   //级别列表
                purposeOptions:[],   //生产用途
                isFirstLoad:true,  //是否是初始化第一次加载
                selectedHazardData:null,   //选中的重大危险源数据
                shapeOverlays:[],  //存储绘制的轨迹
                latLngArrays:[],  //存储绘制区域的顶点坐标
            }
        },
        created() {
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            this.form.companyId =  this.userInfo.companyId;
            this.dictionary()
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
                            this.form.areaId = item.id;
                            this.defaultSelectRegionCode.push(item.code);   //初始化区域的选中状态
                            //加载默认区域下的重大危险源
                            this.getList();
                            //加载企业点位
                            this.addCompanyMarker();
                        }
                    });
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
                        this.form.areaId = item.id;
                    }
                });
                mapShowFunc.pan2Point(offsetLat, offsetLng, this.map);
            },
            //字典查询
            dictionary() {
                //状态
                getByCode({code: 'HAZARD_STATE', enable: 1}).then(res => {
                    this.stateOptions = [];
                    res.data.list.map(item => {
                        item.value= parseInt(item.value);
                        this.stateOptions.push(item);
                    })
                });
                //级别
                getByCode({code: 'HAZARD_LEVEL', enable: 1}).then(res => {
                    this.levelOptions = [];
                    res.data.list.map(item => {
                        item.value= parseInt(item.value);
                        this.levelOptions.push(item);
                    })
                });
                //生产用途
                getByCode({code: 'HAZARD_PURPOSE', enable: 1}).then(res => {
                    this.purposeOptions = [];
                    res.data.list.map(item => {
                        item.value= parseInt(item.value);
                        this.purposeOptions.push(item);
                    })
                });
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
            //选中一条重大危险源
            handleSelect(index,data) {
                this.selectedItemIndex = index;
                this.selectedHazardData = data;
                this.clearDrawFigure();
                //绘制已保存的区域
                if(data.boundsAry && data.boundsAry.length>0){
                    const option = {
                        strokeColor : '#8b1d1a',
                        strokeOpatity : 1,
                        fillColor : '#8b1510',
                    };
                    data.boundsAry.map((bounds,index)=>{
                        //工业园区的绘制区域
                        let drawFigure = null;
                        if(bounds.length == 2){
                            //刻画矩形
                            const rectBounds = new google.maps.LatLngBounds({lat:bounds[0].lat,lng:bounds[0].lng},{lat:bounds[1].lat,lng:bounds[1].lng});
                            drawFigure = mapShowFunc.drawRect(rectBounds,option);
                        }else{
                            //刻画多边形
                            drawFigure = mapShowFunc.drawPolygon(bounds,option);
                        }

                        this.shapeOverlays.push(drawFigure);
                        this.latLngArrays.push(bounds);
                        //移动至地图中央
                        let LatLngBounds = new google.maps.LatLngBounds();//API地图边界
                        bounds.map(ktem=>{
                            const temp = new google.maps.LatLng(ktem.lat, ktem.lng);
                            LatLngBounds.extend(temp);
                        });
                        //得到中心点
                        const latLng = LatLngBounds.getCenter();
                        if(index == 0){
                            mapShowFunc.pan2Point(latLng.lat(),latLng.lng());
                        }
                    });
                }
            },
            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            handleReset() {
                this.form.name = '';
                this.form.state = null;
                this.form.level = null;
                this.selectedItemIndex = null;
                this.getList();
            },
            getList() {
                let self = this;
                this.loading = true;
                //过滤对象中的空值
                let obj = {};
                for(let i in this.form){
                    if(this.form[i]){
                        obj[i] = this.form[i]
                    }
                }
                obj.page = this.listQuery.page;
                obj.size = this.listQuery.size;
                queryHazardSourceList(obj).then(res => {
                    self.list = res.data.list;
                    self.total = res.data.total;
                    this.loading = false;
                    this.isFirstLoad = false;
                    //清除所选中项的选中状态
                    this.selectedItemIndex = null;
                    this.selectedHazardData = null;
                }).catch((err) => {
                    this.loading = false;
                    this.isFirstLoad = false;
                })
            },
            //新增完成后的回调
            handleCloseAddDialog(){
                this.addTankFlag = false;
                this.handleFilter(); //刷新列表
            },
            //编辑完成后的回调
            handleCloseEditDialog(){
                this.editTankFlag = false;
                this.handleFilter(); //刷新列表
            },
            //查看详情完成后的回调
            handleCloseDetailDialog(){
                this.seeDetailFlag = false;
            },
            //删除重大危险源
            deleteHazard(){
                this.$confirm('此操作将删除重大危险源, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteHazardSource({id:this.selectedHazardData.id}).then(res=>{
                        this.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.handleFilter();
                    })
                })

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
                if(!this.selectedItemIndex){
                    this.$message({message:'请先从列表中选择一条重大危险源',type:'warning'});
                    return
                }
                updateBoundsHazardSource({id:this.selectedHazardData.id,bounds: JSON.stringify(this.latLngArrays)}).then(res=>{
                    if(res.code == '1000'){
                        this.$message({message:'保存成功！',type:'success'});
                        //刷新列表
                        this.handleFilter();
                    }
                });
            },
            //修改位置，重新绘制
            clearDrawFigure(){
                this.shapeOverlays.map(item=>{
                    item.setMap(null);
                });
                this.shapeOverlays = [];
                this.latLngArrays = [];
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
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../../components/common/style/style.map-view.less";
    @import "../../../../components/common/style/style.maker-info-window.less";
    .cm-haq-list-container{
        padding: 0 10px;
        .line-item{
            height: 145px;
            border: 1px solid #E2E5EA;
            border-radius: 5px;
            font-size: 14px;
            float: left;
            margin-bottom: 10px;
            padding: 15px 15px 0 15px;
            .base-info{
                height: 22px;
            }
            .el-divider--horizontal {
                margin: 0 0 8px 0;
            }
        }
    }
    .cm-haq-list-item-notice {
        width: 100%;
        height: 20px;
        line-height: 20px;
        padding: 0;
        li {
            float: left;
            cursor: pointer;
        }
        li:nth-child(1) {
            text-align: right;
            float: right;
        }
    }
    .tunnel-info{
        height: calc(100% - 100px);
    }
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
    .pagination-container {
        margin-top: 10px;
    }
    .active{
        border: 1px solid #1a70dc !important;
        background-color: #f7fcff;
    }
    .lt-btn-wrapper{
        position: absolute;
        left: 360px;
        top: 60px;
        z-index: 999;
    }
    .operate-btn{
        cursor: pointer;
        color: #1296DB;
    }
</style>
