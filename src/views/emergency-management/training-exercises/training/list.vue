<template>
    <div class="app-container">
        <el-container>
            <el-aside width="350px" class="search-tree all-background" style="overflow: hidden;">
                <CommonSubtitle title="应急培训列表" :isBold="true"
                                style="width: 100%;line-height: 20px;margin-bottom: 20px"></CommonSubtitle>
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
            <el-main style="padding: 20px 20px 0 20px">
                <div class="filter-container">
                    <el-form :inline="true" :model="form" ref="form" class="form-inline-search" label-width="120px">
                        <el-row :gutter="20">
                            <el-col :span="this.isSmallBtn ? 12 : 8">
                                <el-form-item label="培训名称：" class="form-inline-search-item" >
                                    <el-input v-model="form.name" placeholder="请输入培训名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 12 : 16" class="btns" style="text-align: right">
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
                    </el-form>
                </div>
                <el-card class="table-card">
                    <div style="margin-bottom: 10px">
                        <el-button type="primary" icon="el-icon-document-add" @click="addTrainingFlag=true">新增</el-button>
                        <el-button type="primary" icon="el-icon-edit" @click="editExercise">编辑</el-button>
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
                        height="calc(100% - 115px)"
                        style="width: 100%;"
                    >
                        <el-table-column label="序号" type="index" align="center" width="80px">
                            <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="培训名称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.name}}</template>
                        </el-table-column>
                        <el-table-column label="企业名称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.sideCode}}</template>
                        </el-table-column>
                        <el-table-column label="培训地点" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.startTime}}</template>
                        </el-table-column>
                        <el-table-column label="开始时间" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.endTime}}</template>
                        </el-table-column>
                        <el-table-column label="结束时间" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.status === 1 ? '异常' : '正常' }}</template>
                        </el-table-column>
                        <el-table-column label="培训机构" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.endTime}}</template>
                        </el-table-column>
                        <el-table-column label="培训人数" header-align="center" align="center">
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
                                <i class="icon iconfont iconchakan" title="查看" @click="detailTrainingFlag=true"></i>
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
        <!--新增的dialog-->
        <el-dialog title="新增" :visible.sync="addTrainingFlag"  width="1000px" :close-on-click-modal="false" v-elDragDialog append-to-body>
            <add-training></add-training>
        </el-dialog>
        <!--编辑的dialog-->
        <el-dialog title="编辑" :visible.sync="editTrainingFlag"  width="1000px" :close-on-click-modal="false" v-elDragDialog append-to-body>
            <edit-training :materialsInfo="materialsInfo"></edit-training>
        </el-dialog>
        <!--编辑的dialog-->
        <el-dialog title="应急培训详细信息" v-if="detailTrainingFlag" :visible.sync="detailTrainingFlag"  width="800px" :close-on-click-modal="false" v-elDragDialog append-to-body>
            <see-detail :materialsInfo="materialsInfo"></see-detail>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import elDragDialog from '@/directive/el-drag-dialog'
    import {fetchAreaTree} from '@/api/courseMonitor/alarmSynthesis';
    import AddTraining from "./components/add-training";
    import EditTraining from "./components/edit-training";
    import SeeDetail from "./components/see-detail";
    export default {
        name: 'EMMaterialReserveIndex',
        components: {SeeDetail, AddTraining, Pagination, CommonSubtitle,EditTraining},
        directives: {elDragDialog},
        data() {
            return {
                filterText: '',//树搜索
                currentNodeKey: '',//当前选中的keys值
                props: {
                    label: 'text', // 需要指定的节点渲染对象属性
                    children: 'nodes' // 指定的子级
                },
                loading: true,
                treeLoading: true,
                //树数据
                treeData: [],

                //要检索的条件
                form: {
                    name: '',//储备点名称
                },

                list: [
                    {
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
                    },{
                        "id": 2,
                        "companyId": 1,
                        "ladeSiteId": 1,
                        "status": 1,
                        "startTime": "2020-06-22 17:49:31",
                        "endTime": "AAA",
                        "updateTime": "2020-06-22 17:49:36",
                        "createTime": "2020-06-22 17:49:38",
                        "sideName": "装载位1",
                        "sideCode": "111"
                    },{
                        "id": 3,
                        "companyId": 1,
                        "ladeSiteId": 1,
                        "status": 1,
                        "startTime": "2020-06-22 17:49:31",
                        "endTime": "AAA",
                        "updateTime": "2020-06-22 17:49:36",
                        "createTime": "2020-06-22 17:49:38",
                        "sideName": "装载位1",
                        "sideCode": "111"
                    },{
                        "id": 4,
                        "companyId": 1,
                        "ladeSiteId": 1,
                        "status": 1,
                        "startTime": "2020-06-22 17:49:31",
                        "endTime": "AAA",
                        "updateTime": "2020-06-22 17:49:36",
                        "createTime": "2020-06-22 17:49:38",
                        "sideName": "装载位1",
                        "sideCode": "111"
                    },{
                        "id": 5,
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
                materialsInfo:null,//应急物资储备库详情
                addTrainingFlag:false,
                editTrainingFlag:false,
                detailTrainingFlag:false,
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
            editExercise(){
                if (!this.materialsInfo) {
                    this.$message({
                        message: '请选择需要编辑的应急演习！',
                        type: 'warning'
                    });
                    return
                }
                this.editTrainingFlag = true
            },
            //设置按钮样式
            setBtns() {
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
                    "ifShowCompany": "1",
                    "companyType": this.tabValue === 'second' ? 2 : null,//判断选择的是tab,车辆违章报警是null，显示全部的企业；装卸过程报警是2，选择港口企业
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
                if (data.hasOwnProperty('type') && data.type === 'company') {
                    this.form.companyId = data.id;
                    this.handleFilter()
                } else {
                    this.form.companyId = null
                }

            },

            //搜索框
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },

            //获取列表
            getList(){

            },
            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            //重置
            handleReset() {
                this.form.name = '';
                this.listQuery.page = 1;
//                this.getList()
            },
            //查看详情
            seeDialog(row) {
            },
            //添加
            addPlan(type) {
                //弹窗
//                this.$store.dispatch('poorHouseholds/setHouseholdsData', data);

            },
            //查看
            showDetail(data){
                this.materialsInfo = data;
            },
            //删除
            deleteAlarmFunc(){
                let self=this;
                if(JSON.stringify(this.materialsInfo)=='{}'|| !this.materialsInfo){
                    this.$message({
                        message: '请选择需要删除的储备点',
                        type: 'warning'
                    });
                    return
                }
                this.$confirm('此操作将删除该储备点, 是否继续?', '提示', {
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
    .table-card{
        height: calc(100% - 58px);
        /deep/.el-card__body{
            height: 100%;
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

    .filter-container {
        padding-bottom: 0;
    }
    .el-container{
        height: calc(100vh - 150px);
    }
    .el-aside,.el-main{
        height: 100%;
    }
    //分页
    .pagination-container{
        margin-top: 20px;
    }
    .iconfont {
        font-size: 20px;
    }
</style>
