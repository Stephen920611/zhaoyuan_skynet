<template>
    <div class="app-container">
        <el-container>
            <el-aside width="350px" class="search-tree all-background" style="overflow: hidden;">
                <CommonSubtitle title="应急预案编制单位列表" :isBold="true" style="width: 100%;line-height: 20px;margin-bottom: 20px"></CommonSubtitle>
                <el-input
                        class="search-tree-input"
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                </el-input>
                <el-tree
                        :props="props"
                        class="filter-tree"
                        :data="treeData"
                        :default-expand-all=true
                        :current-node-key="currentNodeKey"
                        highlight-current
                        :filter-node-method="filterNode"
                        icon-class="el-icon-caret-right"
                        @node-click="handleNodeClick"
                        node-key="code"
                        ref="tree"
                        style="height: calc(100% - 112px);overflow-y: auto;"
                >
                    <span slot-scope="{node,data}" class="ellipsis-l1 font-size-14">
                        <span :title="data.text">{{data.text}}</span>
                    </span>
                </el-tree>

            </el-aside>
            <el-main style="padding: 20px" >
                <div class="filter-container">
                    <el-form :inline="true" :model="form" ref="form" :rules="rules" class="form-inline-search" label-width="180px">
                        <el-row :gutter="20" >
                            <el-col :span="this.isSmallBtn ? 12 : 8">
                                <el-form-item label="应急预案名称：" class="form-inline-search-item" prop="name">
                                    <el-input v-model="form.name" placeholder="请输入应急预案名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 12 : 8">
                                <el-form-item label="应急预案事件类型：" class="form-inline-search-item" prop="eventType">
                                    <el-select v-model="form.eventType" placeholder="请选择应急预案事件类型">
                                        <el-option
                                                v-for="item in eventTypeOptions"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 12 : 8" class="btns" style="text-align: right">
                                <el-button
                                        class="filter-item"
                                        type="primary"
                                        style="margin-left: 10px;padding: 10px 30px"
                                        @click="handleFilter"
                                >
                                    检索
                                </el-button>
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
                        <el-row :gutter="20">
                            <el-col :span="this.isSmallBtn ? 12 : 8">
                                <el-form-item label="应急预案备案开始时间：" class="form-inline-search-item" prop="startTime">
                                    <el-date-picker
                                            type="date"
                                            placeholder="请选择应急预案备案开始时间"
                                            v-model="form.startTime"
                                            style="width: 100%;"
                                            :picker-options="pickerTimeBeg"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 12 : 8">
                                <el-form-item label="应急预案备案结束时间：" class="form-inline-search-item" prop="endTime">
                                    <el-date-picker
                                            type="date"
                                            placeholder="请选择应急预案备案结束时间"
                                            v-model="form.endTime"
                                            :picker-options="pickerTimeEnd"
                                            style="width: 100%;"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" >

                            <el-col :span="this.isSmallBtn ? 24 : 24">
                                <el-form-item label="事件等级：" class="form-inline-search-item" prop="eventLevel" style="margin-bottom: 12px">
                                    <el-radio-group v-model="form.eventLevel">
                                        <el-radio :label="item.value" border v-for="(item, index) in eventLevelOptions" :key="item.value"
                                                  style="margin-right: 10px;float:left;margin-bottom: 10px">{{item.name}}
                                        </el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>
                </div>
                <el-card>
                    <div style="margin-bottom: 10px">
                        <el-button type="primary" icon="el-icon-document-add" @click="addOrEditPlan('add')">新增</el-button>
                        <el-button type="primary" icon="el-icon-edit" @click="addOrEditPlan('edit')">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deleteAlarmFunc()">删除</el-button>
                    </div>
                    <!-- 表格开始 -->
                    <el-table
                            v-loading="listLoading"
                            :data="list"
                            border
                            fit
                            highlight-current-row
                            @current-change="showDetail"
                            style="width: 100%;"
                    >
                        <el-table-column label="序号" type="index" align="center" width="80px">
                            <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="应急预案名称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.name}}</template>
                        </el-table-column>
                        <el-table-column label="应急预案编制单位" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.sideCode}}</template>
                        </el-table-column>
                        <el-table-column label="应急预案级别" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.startTime}}</template>
                        </el-table-column>
                        <el-table-column label="应急预案类型" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.endTime}}</template>
                        </el-table-column>
                        <el-table-column label="应急预案事件类型" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.status === 1 ? '异常' : '正常' }}</template>
                        </el-table-column>
                        <el-table-column label="应急预案备案时间" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.endTime}}</template>
                        </el-table-column>
                        <!-- 操作 -->
                        <el-table-column
                                label="操作"
                                align="center"
                                width="70"
                                class-name="small-padding fixed-width"
                        >
                            <template slot-scope="{row}">
                                <i class="icon iconfont iconchakan" title="查看" @click="seeDialog(row)"></i>
                                <!--<i class="icon iconfont iconchuli" :class="(row.wayBillStatus!=3&&row.wayBillStatus!=5&&row.wayBillStatus!=6&&row.wayBillStatus)?'':'hide-icon'" title="处理" @click="taskAssignmentDialog(row)"></i>-->
                            </template>
                        </el-table-column>

                    </el-table>
                    <!-- 分页控件 -->
                    <div style="text-align: center">
                        <pagination
                                v-show="total >0"
                                :total="total"
                                :page.sync="listQuery.page"
                                :limit.sync="listQuery.size"
                                style="padding:0px !important"
                                class="pagination"
                                @pagination="getList"
                                :pageSizes="[10]"
                        />
                    </div>

                </el-card>
            </el-main>
        </el-container>


    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'

    import {fetchAreaTree} from '@/api/courseMonitor/alarmSynthesis';

    import D from '@/utils/DFDZ';

    export default {
        name: 'EMPlanIndex',
        components: {Pagination, CommonSubtitle,},
        data() {
            return {
                filterText: '',//树搜索
                currentNodeKey: '',//当前选中的keys值
                props: {
                    label: 'text', // 需要指定的节点渲染对象属性
                    children: 'nodes' // 指定的子级
                },
                loading:true,
                treeLoading:true,
                //树数据
                treeData: [],

                //要检索的条件
                form: {
                    name: '',//应急预案名称
                    eventType: null,//应急预案事件类型
                    eventLevel:null,//事件等级
                    startTime:'',//开始时间
                    endTime:'',//结束时间
                },
                rules:{},
                //事件等级
                eventLevelOptions:[
                    {
                        name:'全部',
                        value:0,
                    },
                    {
                        name:'省级',
                        value:1,
                    },
                    {
                        name:'市级',
                        value:2,
                    },
                    {
                        name:'县级',
                        value:3,
                    },
                    {
                        name:'企业级',
                        value:4,
                    },
                    {
                        name:'其他',
                        value:5,
                    },
                ],
                //应急预案事件
                eventTypeOptions:[
                    {
                        name:'生产安全事故',
                        value:0,
                    },
                    {
                        name:'危险货物事故',
                        value:1,
                    },
                    {
                        name:'自然灾害',
                        value:2,
                    },
                    {
                        name:'人员疏散',
                        value:3,
                    },
                    {
                        name:'社会安全',
                        value:4,
                    },
                    {
                        name:'其他',
                        value:5,
                    },
                ],
                pickerTimeBeg: { //限制开始时间
                    disabledDate: (time) => {
                        if (this.form.endTime !== '' && this.form.endTime) {
                            let timeStr = this.form.endTime.getTime();
                            return time.getTime() > timeStr;
                        } else {
                            return ''
                        }
                    }
                },
                pickerTimeEnd: { //限制结束时间
                    disabledDate: (time) => {
                        if (this.form.startTime !== '' && this.form.startTime) {
                            let timeStr = this.form.startTime.getTime();
                            return time.getTime() < timeStr;
                        } else {
                            return ''
                        }
                    }
                },

                list: [{
                    "id": 1,
                    "companyId": 1,
                    "ladeSiteId": 1,
                    "status": 1,
                    "startTime": "2020-06-22 17:49:31",
                    "endTime": "AAA",
                    "updateTime": "2020-06-22 17:49:36",
                    "createTime": "2020-06-22 17:49:38",
                    "sideName": "装载位1",
                    "sideCode": "111"
                }],//列表
                total: 1,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                currentRow:{},//选中的表格信息


            }
        },
        watch: {
            filterText(val) {//监听树搜索
                this.$refs.tree.filter(val);
            }
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize = function () {
                self.setBtns();
            };
        },
        mounted() {
            //获取树数据
            this.fetchTreeData();
        },
        methods: {
            //设置按钮样式
            setBtns(){
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },

            //获取树的数据
            fetchTreeData() {
                this.treeLoading = true;
                //请求接口
                let self = this;
                let params = {
                    "ifShowSide": "2",
                    "ifShowCompany":"1",
                    "companyType": this.tabValue=== 'second' ? 2 : null,//判断选择的是tab,车辆违章报警是null，显示全部的企业；装卸过程报警是2，选择港口企业
                };
                fetchAreaTree(params).then(res => {
                    self.treeLoading = false;
                    self.treeData = res.data;
                }).catch(err => {
                    self.treeLoading = false;

                });
                //请求接口
//                this.currentNodeKey = this.treeData[0].id;//默认为选中第一个
            },

            //点击树节点
            handleNodeClick: function (data, node, event) {
                //如果点击的树节点为公司
                if(data.hasOwnProperty('type') && data.type === 'company'){
                    this.form.companyId = data.id;
                    this.handleFilter()
                }else{
                    this.form.companyId = null
                }

            },

            //搜索框
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },
            //检索
            handleFilter(){

            },
            //获取表格数据
            getList(){

            },
            //重置
            handleReset() {
                this.$refs.form.resetFields();
                this.listQuery.page = 1;
//                this.getList()
            },
            //查看详情
            seeDialog(row){
            },
            //点击的表格
            showDetail(val){
                this.currentRow = val

            },
            //添加或编辑
            addOrEditPlan(type){
//                this.$store.dispatch('poorHouseholds/setHouseholdsData', data);
                if(type === 'edit'){
                    if(JSON.stringify(this.currentRow)=='{}'|| !this.currentRow){
                        this.$message({
                            message: '请选择需要编辑的应急预案',
                            type: 'warning'
                        });
                        return
                    }
                    this.$router.push({name: 'EMPlanEdit',})
                }else{
                    this.$router.push(
                        {
                            name: 'EMPlanAdd',
                            /*query: {
                                id: data.id,
                                familyType: data.familyType,
                            }*/
                        }
                    )
                }


            },
            deleteAlarmFunc(){
                let self=this;
                if(JSON.stringify(this.currentRow)=='{}'|| !this.currentRow){
                    this.$message({
                        message: '请选择需要删除的应急预案',
                        type: 'warning'
                    });
                    return
                }
                this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   /* deleteAlarmate(obj).then(res => {
                        self.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        })
                        self.getList()
                    }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                    })*/
                })
            },


        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    @import "~@/styles/course-monitor.scss";
    //树样式
    /deep/ .el-aside {
        background-color: #ffffff;
        line-height: 1;
        color: #333;
        text-align: left;
        padding: 10px 10px;
        /*border: 1px solid #ebebeb;*/
    }

    .search-tree {
        .search-tree-input {
            margin-bottom: 15px;
        }
        /deep/ .el-tree-node__label {
            font-size: 14px
        }

    }
    //列表样式
    .list-main {
        /*border: 1px solid #ebebeb;*/
        padding: 0;
        margin-left: 10px;
    }

    //内容样式
    .el-card {
        border: 0;
        /deep/ .el-table th {
            background-color: #308FE4;
            color: #fff;
        }
    }

    .el-card.is-always-shadow {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    }

    //搜索条件样式
    .form-inline-search {
        .form-inline-search-item {
            width: 100%;
            /deep/ .el-form-item__content {
                width: calc(100% - 180px);
            }
        }
        .el-radio.is-bordered + .el-radio.is-bordered {
            margin-left: 0;
        }
        .el-radio:after {
            clear: both;
            content: '';
        }

    }

    .el-select {
        width: 100%;
    }
    .filter-container{
        padding-bottom: 0;
    }


</style>