<!--停车场-->
<template>
    <div class="tab-container">
        <div class="search-wrap">
            <el-row class="margin-d-10">
                <!--<el-col :span="7" class="search-item">
                    <el-select v-model="form.areaId">
                        <el-option :label="item.des" :value="item.id" v-for="item in region"></el-option>
                    </el-select>
                </el-col>-->
                <el-col :span="23" class="search-item">
                    <!--<el-input v-model="form.companyName" placeholder="请输入所属企业的名称" @keyup.enter.native="handleSearch"></el-input>-->
                    <el-select v-model="form.companyId" filterable clearable placeholder="请选择所属企业">
                        <el-option
                                v-for="item in companyList"
                                :label="item.companyName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="17" class="search-item">
                    <el-input v-model="form.name" placeholder="请输入停车场名称" @keyup.enter.native="handleSearch"></el-input>
                </el-col>
                <el-col :span="4" class="search-button">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="content" v-scrollBar>
            <div v-if="list.length == 0 && !firstLoad">
                暂无停车场数据！
            </div>
            <div class="line-item" :class="{'active':index==selectedItemIndex}" v-for="(item,index) in list" :key="index" v-else @click="handleSelect(index)">
                <div class="base-info">
                    <p class="title">{{item.name}}</p>
                    <p>所属区县：{{item.areaName}}</p>
                </div>
                <div class="hr-line"></div>
                <div class="des-info">
                    <p>描述：{{item.des}}</p>
                </div>
                <div class="btn-wrap">
                    <p><span>进出车辆信息<i class="fa fa-chevron-circle-right"></i></span></p>
                </div>
            </div>
        </div>
        <!-- 分页控件 -->
        <pagination
                v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.size"
                layout="total, prev, pager, next"
                style="padding:0px !important;text-align: center;margin: 20px 0"
                class="pagination"
                @pagination="parkingList"
        />
    </div>
</template>
<script>
    import {queryParkingPoints} from '../../../api/map'
    import Pagination from '@/components/Pagination'
    import utility from '@/utils/ext.utility'
    import mapShowFunc from '@/utils/mapShowFunc'
    export default {
        props: {
            region: {
                type: Array,
                default: function () {
                    return []
                }
            },
            areaId:{
                type:String
            },
            map:{
                type:Object
            },
            companyList:{
                type: Array,
                default: function () {
                    return []
                }
            },
        },
        components: {Pagination},
        data() {
            return {
                form: {
                    areaId: null,
                    name: '',
                    companyId:null
                },
                total: 0,
                list: [],
                listQuery: {
                    page: 1,
                    size: 4,
                },
                selectedItemIndex:null,
                firstLoad:true,  //默认时首次加载页面
                markerHash: new utility.hashTable(),   //存储定位时绘制的marker点标记
            }
        },
        mounted() {
            this.form.areaId = parseInt(this.areaId);
            this.parkingList();
        },
        beforeDestroy(){
            //页面销毁之前，清除地图上所有的标记marker
            this.clearAllMarkers();
        },
        methods: {
            parkingList() {
                this.selectedItemIndex = null;  //切页后清除选中样式
                let params = {};
                for (const key in this.form) {
                    if (this.form[key] !== '' && this.form[key] !== null) {
                        params[key] = this.form[key]
                    }
                }
                const obj = Object.assign(params,this.listQuery);
                queryParkingPoints(obj).then(res => {
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.firstLoad = false;
                })
            },
            handleSearch() {
                this.listQuery.page = 1;
                this.parkingList();
                //重置
                this.selectedItemIndex = null;
                this.clearAllMarkers();
                this.markerHash.clear();
            },
            handleSelect(index) {
                this.selectedItemIndex = index;
                const curMarker =  this.markerHash.getValue(this.list[index].id);
                //定位
                mapShowFunc.pan2Point(this.list[index].lat, this.list[index].lng);
                if(!curMarker){
                    //判断marker是否存在，不存在则标记marker
                    const marker = mapShowFunc.addMarker(this.map, this.list[index].id, this.list[index].lat, this.list[index].lng, 'park32', this.list[index].name, "device", true, true,()=>{});
                    this.markerHash.add(this.list[index].id, marker);

                }
            },
            //清除所有marker点标记
            clearAllMarkers(){
                const allMarkers = this.markerHash.getValues();
                allMarkers.map(item=>{
                    item.setMap(null);
                    item.label.setMap(null);
                })
            }
        },
    }
</script>
<style lang="less">
    .el-select-dropdown {
        z-index: 60000 !important;
    }
</style>
<style lang="less" scoped>
    @import "../style/style.running-route.less";
</style>
