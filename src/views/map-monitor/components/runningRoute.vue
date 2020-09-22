<!--右侧抽屉-->
<template>
    <div class="tab-container">
        <el-row class="search-wrap">
            <!--<el-col :span="7" class="search-item">
                <el-select v-model="form.areaName">
                    <el-option label="烟台市" value="37000"></el-option>
                    <el-option label="莱山区" value="37001"></el-option>
                    <el-option label="芝罘区" value="37002"></el-option>
                </el-select>
            </el-col>-->
            <el-col :span="18" class="search-item">
                <el-input v-model="form.lineName" placeholder="请输入线路名称" @keyup.enter.native="handleSearch"></el-input>
            </el-col>
            <el-col :span="4" class="search-button">
                <el-button type="primary" @click="handleFilter">搜索</el-button>
            </el-col>
        </el-row>
        <div class="content" v-scrollBar>
            <div v-if="list.length == 0 && !firstLoad">
                暂无行驶线路！
            </div>
            <div class="line-item" :class="{'active':selectedLineIdArr.indexOf(item.id)>-1}"  v-for="(item,index) in list" :key="index" v-else  @click="handleSelect(item.id,item.remark)">
                <div class="base-info">
                    <p class="title">{{item.lineName}}</p>
                    <p>限行时段：10:00-12:00</p>
                </div>
                <div class="hr-line"></div>
                <div class="des-info">
                    <p>描述：{{item.remark}}</p>
                </div>
                <div class="btn-wrap">
                    <p><span>运行车辆信息<i class="fa fa-chevron-circle-right"></i></span></p>
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
                @pagination="lineList"
        />
    </div>
</template>
<script>
    import {queryBasicLine,queryLinePoints} from '../../../api/map'
    import Pagination from '@/components/Pagination'
    import utility from '@/utils/ext.utility'
    import mapShowFunc from '@/utils/mapShowFunc'

    export default {
        props: {
            map: {
                type: Object
            }
        },
        data() {
            return {
                form: {
                    lineName: '',
                },
                total: 0,
                list: [],
                listQuery: {
                    page: 1,
                    size: 5,
                },
                selectedLineIdArr: [],
                firstLoad: true,  //默认时首次加载页面
                lineTrajectoryArr:[],  //存储每条线路的若干条道路轨迹
                lineTrajectoryHash:new utility.hashTable(),   //存储每条线路轨迹
            }
        },
        components: {Pagination},
        mounted() {
            this.lineList()
        },
        beforeDestroy(){
            //页面销毁之前，清除地图上所有的行驶线路
            this.clearAllTrajectorys()
        },
        methods: {
            lineList(){
                const param = Object.assign(this.form,this.listQuery);
                queryBasicLine(param).then(res => {
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.firstLoad = false;
                })
            },
            handleSearch() {
                this.listQuery.page = 1;
                this.lineList();
            },
            handleSelect(id,remark) {
                if(this.selectedLineIdArr.indexOf(id)==-1){
                    //点击选中
                    this.selectedLineIdArr.push(id);
                    this.lineTrajectoryArr = [];
                    queryLinePoints({id:id}).then(res=>{
                        const color = mapShowFunc.colorRandom();
                        res.data.map((item,index)=>{
                            //绘制线路
                            const lineTrajectory = mapShowFunc.drawLine(this.map,JSON.parse(item.bounds),'线路名称：'+remark.trim(),color,'1');
                            this.lineTrajectoryArr.push(lineTrajectory);
                            if(index==0){
                                const lat = JSON.parse(item.bounds)[0].lat;
                                const lng = JSON.parse(item.bounds)[0].lng;
                                mapShowFunc.pan2Point(lat,lng);
                            }
                        });
                        this.lineTrajectoryHash.add(id,this.lineTrajectoryArr);
                    })
                }else{
                    //取消选中
                    const evens = this.$lodash.remove(this.selectedLineIdArr, function(n) {
                        return n != id;
                    });
                    this.selectedLineIdArr = evens;
                    let trajectorys = this.lineTrajectoryHash.getValue(id);
                    trajectorys.map(item=>{
                        item.setMap(null);
//                        item = null;   //直接在地图上清除掉
                    })
                }

            },
            clearAllTrajectorys(){
                let trajectorys = this.lineTrajectoryHash.getValues();
                trajectorys.map(item=>{
                    item.map(jtem=>{
                        jtem.setMap(null);
//                      jtem = null;   //直接在地图上清除掉
                    })

                })

            },
            handleFilter(){
                this.listQuery.page = 1;
                this.lineList();
            }
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
