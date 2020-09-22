<!--右侧抽屉-->
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
                    <el-select v-model="form.companyId" filterable clearable placeholder="请选择所属企业" @change="handleChangeCompany">
                        <el-option
                                v-for="item in companyList"
                                :label="item.companyName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="14" class="search-item">
                    <el-input v-model="form.name" placeholder="请输入装卸区名称" @keyup.enter.native="handleSearch"></el-input>
                </el-col>
                <el-col :span="9" class="search-button">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
                        <el-button type="default" size="small" @click="handleReset">重置</el-button>
                    </el-button-group>
                </el-col>
            </el-row>
        </div>
        <div class="content" v-scrollBar>
            <div v-if="list.length == 0 && !firstLoad">
                暂无装卸区数据！
            </div>
            <div class="line-item" :class="{'active':index==selectedItemIndex}"  v-for="(item,index) in list" :key="index" v-else  @click="handleSelect(index,item)">
                <div class="base-info">
                    <p class="title">{{item.name}}</p>
                    <p>所属企业：{{item.companyName}}</p>
                    <p>所属区县：{{item.areaName}}</p>
                </div>
                <div class="hr-line"></div>
                <div class="des-info">
                    <p>描述：{{item.des}}</p>
                </div>
                <div class="btn-wrap">
                    <p>
                        <span class="margin-r-20">装卸位信息<i class="fa fa-chevron-circle-right"></i></span>
                        <span>运行车辆信息<i class="fa fa-chevron-circle-right"></i></span>
                    </p>
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
                style="padding:0px !important;text-align: center;margin: 10px 0"
                class="pagination"
                @pagination="ladeSiteList"
        />
    </div>
</template>
<script>
    import {queryLadeSiteArea} from '../../../api/map'
    import Pagination from '@/components/Pagination'
    import utility from '@/utils/ext.utility'
    import mapShowFunc from '@/utils/mapShowFunc'
    import {getCompanyDetail} from '../../../api/industry'
    export default {
        inject:['handleSwitch','updateDefaultSelectSwitch','defaultSelectSwitch','locMarkerOpenInfoWindow'],  //注入参数
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
            companyList:{
                type: Array,
                default: function () {
                    return []
                }
            },
            map:{
                type:Object
            }
        },
        components: {Pagination},
        data() {
            return {
                form: {
                    areaId: null,
                    name: '',
                    companyId: null
                },
                total: 0,
                list: [],
                listQuery: {
                    page: 1,
                    size: 5,
                },
                selectedItemIndex:null,
                firstLoad:true,  //默认时首次加载页面
            }
        },
        mounted() {
            this.form.areaId = parseInt(this.areaId);
            this.ladeSiteList()
        },
        methods: {
            ladeSiteList() {
                let params = {};
                for (const key in this.form) {
                    if (this.form[key] !== '' || this.form[key] !== null) {
                        params[key] = this.form[key];
                    }
                }
                const obj = Object.assign(params,this.listQuery);
                queryLadeSiteArea(obj).then(res => {
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.firstLoad = false
                })
            },
            handleSearch(){
                this.listQuery.page = 1;
                this.selectedItemIndex = null;
                this.ladeSiteList();
            },
            handleReset(){
                this.form.name = '';
                this.form.companyId = null;
                this.listQuery.page = 1;
                this.selectedItemIndex = null;
                this.ladeSiteList();
            },
            handleSelect(index,data) {
                this.selectedItemIndex = index;

                //在地图上定位所在位置
                if(data.location && JSON.parse(data.location).length>0){
                    mapShowFunc.pan2Point(JSON.parse(data.location)[0].lat,JSON.parse(data.location)[0].lng);
                    //定位--弹出气泡窗口
                    this.locMarkerOpenInfoWindow(data.id,'siteLade',true);
                }else{
                    this.$message({message:'暂未标注，请先标注位置信息！',type:'warning'})
                }
            },
            /**
             * 下拉选择企业时，触发该事件
             */
            handleChangeCompany(){
                //若是选择所属企业，在地图上定位到企业所在位置
                if(this.form.companyId){
                    //首先判断企业的控制显隐开关是否打开
                    const flag = this.defaultSelectSwitch().indexOf('company')>-1;
                    if(!flag){
                        //调用主页面的方法，打开企业显隐开关
                        this.updateDefaultSelectSwitch('company');
                    }
                    //定位--放大级别--弹出气泡窗口
                    getCompanyDetail({id:this.form.companyId}).then(res=>{
                        const boundsAry = res.data.list[0].boundsAry;
                        if(boundsAry && boundsAry.length>0){
                            //获取中心点坐标
                            boundsAry.map((bounds,index)=>{
                                if(bounds.length >= 2){
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
                                }else{
                                    mapShowFunc.pan2Point(bounds[0].lat,bounds[0].lng);
                                }
                                //调用主页面的方法，定位--放大级别--弹出气泡窗口
                                this.locMarkerOpenInfoWindow(this.form.companyId,'company',true);
                            })
                        }else{
                            this.$message({message:'该公司暂未在地图上标注位置，请选标注！',type:'warning'})
                        }
                    });

                }
            },
        }

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
