<!--右侧抽屉-->
<template>
    <div class="tab-container">
        <el-row class="search-wrap">
            <!--<el-col :span="7" class="search-item">
                <el-select v-model="form.areaId">
                    <el-option :label="item.des" :value="item.id" v-for="item in region"></el-option>
                </el-select>
            </el-col>-->
            <el-col :span="14" class="search-item">
                <el-input v-model="form.name" placeholder="请输入桥梁名称" @keyup.enter.native="handleSearch"></el-input>
            </el-col>
            <el-col :span="9" class="search-button">
                <el-button-group>
                    <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
                    <el-button type="default" size="small" @click="handleReset">重置</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <div class="content" v-scrollBar>
            <div v-if="list.length == 0 && !firstLoad">
                暂无桥梁数据！
            </div>
            <div class="line-item" :class="{'active':index==selectedItemIndex}"  v-for="(item,index) in list" :key="index" v-else  @click="handleSelect(index,item)">
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
                @pagination="bridgeList"
        />
    </div>
</template>
<script>
    import {queryBridgePoints} from '@/api/map'
    import Pagination from '@/components/Pagination'
    import utility from '@/utils/ext.utility'
    import mapShowFunc from '@/utils/mapShowFunc'
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
            map:{
                type:Object
            }
        },
        components: {Pagination},
        data(){
          return{
              form: {
                  areaId: null,
                  name: ''
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
            this.bridgeList()
        },
        methods: {
            bridgeList() {
                const param = Object.assign(this.form,this.listQuery);
                queryBridgePoints(param).then(res => {
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.firstLoad = false;
                })
            },
            handleSearch(){
                this.listQuery.page = 1;
                this.selectedItemIndex = null;
                this.bridgeList();
            },
            handleReset(){
                this.listQuery.page = 1;
                this.selectedItemIndex = null;
                this.form.name = '';
                this.bridgeList();
            },
            handleSelect(index,data) {
                this.selectedItemIndex = index;
                //在地图上定位所在位置
                if(data.location && JSON.parse(data.location).length>0){
                    mapShowFunc.pan2Point(JSON.parse(data.location)[0].lat,JSON.parse(data.location)[0].lng);
                    //定位--弹出气泡窗口
                    this.locMarkerOpenInfoWindow(data.id,'bridge',true);
                }else{
                    this.$message({message:'暂未标注，请先标注位置信息！',type:'warning'})
                }

            },
        }
    }
</script>
<style lang="less">
    .el-select-dropdown{
        z-index: 60000 !important;
    }
</style>
<style lang="less" scoped>
    @import "../style/style.running-route.less";
</style>
