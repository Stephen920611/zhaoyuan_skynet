<template>
    <div class="app-container">
        <el-container>
            <el-main class="list-main tab-main">
                <div>
                    <el-form :inline="true" :model="form" class="form-inline-search">
                        <el-row>
                            <el-col :span="this.isSmallBtn ? 6 : 6">
                                <el-form-item label="装卸位名称：" class="form-inline-search-item">
                                    <el-input
                                            v-model="form.name"
                                            placeholder="请输入装卸位名称"
                                            class="filter-item"
                                            @keyup.enter.native="handleFilter"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 10 : 10">
                                <el-form-item label="装卸位属性：" class="form-inline-search-item" style="margin-bottom: 10px">
                                    <el-radio-group v-model="form.type">
                                        <el-radio :label="item.value" border v-for="(item, index) in ladeSiteStatusOptions" :key="item.value"
                                                  style="margin-right: 10px;float:left;margin-bottom: 10px">{{item.name}}
                                        </el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 8 : 8" class="btns">
                                <el-button
                                        class="filter-item"
                                        type="primary"
                                        icon="el-icon-search"
                                        style="margin-left: 10px;"
                                        @click="handleFilter"
                                >
                                    查询
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
                        <div>

                        </div>
                    </el-form>
                </div>
                <div style="padding: 0 20px 10px 10px; height: calc(100% - 78px)">
                    <el-card class="box-card" style="height: 100%;" >
                        <el-row class="table-list-total">
                            <el-col :span=8>
                                <common-subtitle :isBold="true" :title="'检索结果：'+ total " ></common-subtitle>
                            </el-col>
                            <el-col :span=16 style="text-align: right">
                                <el-button @click="toggleDetail('add')">
                                    <i class="el-icon-plus" style="cursor: pointer" title="新增" ></i>
                                    新增
                                </el-button>
                                <el-button @click="toggleDetail('edit')">
                                    <i class="el-icon-edit-outline" style="cursor: pointer" title="编辑" ></i>
                                    编辑
                                </el-button>
                                <el-button @click="deleteDetail" >
                                    <i class="el-icon-delete" style="cursor: pointer" title="删除" ></i>
                                    删除
                                </el-button>

                            </el-col>
                        </el-row>

                        <!-- 表格开始 -->
                        <el-table
                                v-loading="listLoading"
                                :data="tableList"
                                border
                                fit
                                highlight-current-row
                                style="width: 100%;margin-top: 13px;"
                                height="calc(100% - 170px)"
                                @current-change="handleCurrentChange"
                        >
                            <el-table-column label="序号" type="index" align="center" width="80px">
                                <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                                </template>
                            </el-table-column>
                            <el-table-column label="装卸位名称" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.name}}</template>
                            </el-table-column>
                            <el-table-column label="所属企业" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.companyName}}</template>
                            </el-table-column>
                            <el-table-column label="装卸位类型" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.typeName}}</template>
                            </el-table-column>
                            <el-table-column label="装卸方式" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.modelName}}</template>
                            </el-table-column>
                            <el-table-column label="装卸介质" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.chemicalName}}</template>
                            </el-table-column>
                            <el-table-column label="运营状态" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.statusName}}</template>
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    align="center"
                                    width="100"
                                    class-name="small-padding fixed-width"
                            >
                                <template slot-scope="{row}">
                                    <i class="icon iconfont iconchakan" style="cursor: pointer" title="查看" @click="showDetail(row)"></i>
                                    <!--<i class="el-icon-edit-outline" style="font-size: 18px" @click="showDetail(row)"></i>-->
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
                </div>
            </el-main>
        </el-container>

        <el-dialog :visible.sync="loadingDetailVisible" width="900px" append-to-body>
            <div slot="title">
                <span style="padding-right: 10px;">查看</span>
            </div>
            <loading-dock-detail v-if="loadingDetailVisible" v-on:toggleLoadingDockDetail = "toggleLoadingDockDetail" :ladeSiteInfo="ladeSiteInfo" ></loading-dock-detail>
        </el-dialog>
        <el-dialog :visible.sync="addLoadingDetailVisible" width="900px" append-to-body>
            <div slot="title">
                <span style="padding-right: 10px;">新增</span>
            </div>
            <add-loading-dock-detail v-if="addLoadingDetailVisible" v-on:toggleLoadingDockDetail = "toggleLoadingDockDetail" ></add-loading-dock-detail>
        </el-dialog>
        <el-dialog :visible.sync="editLoadingDetailVisible" width="900px" append-to-body>
            <div slot="title">
                <span style="padding-right: 10px;">编辑</span>
            </div>
            <edit-loading-dock-detail v-if="editLoadingDetailVisible" v-on:toggleLoadingDockDetail = "toggleLoadingDockDetail" :ladeSiteInfo="currentRowDetail"></edit-loading-dock-detail>
        </el-dialog>


    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import LoadingDockDetail from '../components/loadingDockDetail'
    import AddLoadingDockDetail from './components/addLoadingDockDetail'
    import EditLoadingDockDetail from './components/editLoadingDockDetail'

    import {fetchAreaTree,fetchLadeSitePage,deleteLadeSite} from '@/api/courseMonitor/loadingManagement';
    import {getByCode} from '@/api/industry'
    import {getStorage} from '@/utils/storage'

    import D from '@/utils/DFDZ';

    export default {
        name: 'CMLoadingManagementIndex',
        components: {Pagination, CommonSubtitle,LoadingDockDetail,AddLoadingDockDetail,EditLoadingDockDetail},
        data() {
            return {
                //列表内容
                tableList: [],
                total: 0,
                listLoading: false,
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                listQuery: {
                    page: 1,
                    size: 10,
                },
                //要检索的条件
                form: {
                    name: '',//装卸位
                    type: null,//报警级别
                },
                ladeSiteStatusOptions: [],//装卸位属性
                ladeSiteInfo:{},//点击的表格中的装卸位

                loadingDetailVisible:false,//查看弹出框的显示与隐藏
                addLoadingDetailVisible:false,//添加弹出框的显示与隐藏
                editLoadingDetailVisible:false,//编辑弹出框的显示与隐藏
                currentRowDetail:{},//点击表格的详细信息
                userInfo:{},//用户信息

            }
        },
        watch: {
            filterText(val) {//监听树搜索
                this.$refs.tree.filter(val);
            },
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize = function () {
                self.setBtns();
            }
            //获取用户信息
            this.userInfo = getStorage('userInfo');
        },
        mounted() {
            //获取装卸类型
            this.dictionary();
            //获取树数据
            this.getList();

        },
        methods: {
            //设置按钮样式
            setBtns() {
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },

            //获取字典表对应的字段
            dictionary(){
                //装卸类型
                getByCode({code: 'LADE_SITE_TYPE', enable: 1}).then(res=>{
                    this.ladeSiteStatusOptions = [];
                    res.data.list.map(item=>{
                        this.ladeSiteStatusOptions.push(item);
                    })
                });
            },

            //获取列表数据
            getList() {
                let self = this;
                this.listLoading = true;
                let params = {
                    ...this.listQuery,
                    "type": this.form.type,
                    "companyId": this.userInfo.hasOwnProperty('companyId') ? this.userInfo.companyId : null,
                    "name": this.form.name,
                };
                fetchLadeSitePage(params).then(res => {
                    self.listLoading = false;
                    self.tableList = res.data.list;
                    self.total = res.data.total
                }).catch(err => {
                    self.listLoading = false;
                });
            },

            //点击搜索
            handleFilter() {
                this.listQuery.page = 1;
                this.getList();
            },

            // 重置查询
            handleReset() {
                this.form.name = '';//装卸位名称
                this.form.type = null;//装卸位属性
                this.getList();
            },

            //点击表格
            handleCurrentChange(val) {
//              //点击的表格是处理/查看
                this.currentRowDetail = val;
            },

            //查看
            showDetail(data){
                this.ladeSiteInfo = data;
                this.loadingDetailVisible = true;
            },
            //隐藏弹窗
            toggleLoadingDockDetail(type){
                if(type ==='add'){
                    this.addLoadingDetailVisible = false;
                }else if(type === 'edit'){
                    this.editLoadingDetailVisible = false;
                }else if(type === 'view'){
                    this.loadingDetailVisible = false;
                }
                //刷新列表
                this.getList();
            },

            //添加装卸位
            toggleDetail(type){
                if(type ==='add'){
                    this.addLoadingDetailVisible = true;
                }else if(type === 'edit'){
                    if (JSON.stringify(this.currentRowDetail) === "{}") {
                        this.$message({
                            message: '请选择装卸位！',
                            type: 'warning'
                        });
                        return;
                    }
                    this.editLoadingDetailVisible = true;
                }
            },
            //删除装卸位
            deleteDetail(){
                if (JSON.stringify(this.currentRowDetail) === "{}") {
                    this.$message({
                        message: '请选择装卸位！',
                        type: 'warning'
                    });
                    return;
                }

                this.$confirm(`确定要删除该装卸位吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteLadeSite({id: this.currentRowDetail.hasOwnProperty('id')?this.currentRowDetail.id : null}).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.selectTreeNode = null;
                        this.tableList = [];
                        //刷新列表
                        this.getList();
                    });
                }).catch(() => {
                });

            },
            //点击表格
            showCurrentRowDetail(val) {
//                console.log('valvalval',val);
                this.currentRowDetail = val;
                //点击的表格是处理/查看
            },

        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    @import "~@/styles/course-monitor.scss";

    //搜索条件样式
    .form-inline-search {
        padding: 10px 20px;
        .form-inline-search-item {
            width: 100%;
            /deep/ .el-form-item__content {
                width: calc(100% - 120px);
            }
        }
        .el-radio.is-bordered + .el-radio.is-bordered {
            margin-left: 0;
        }
        .el-radio:after {
            clear: both;
            content: '';
        }
        .btns{
            text-align: right;
        }

    }


    //树样式
    /deep/ .el-aside {
        background-color: #ffffff;
        line-height: 1;
        color: #333;
        /*text-align: center;*/
        padding: 10px;
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


    //弹出框样式
    /deep/.el-dialog__body{
        padding: 20px 40px 20px 20px!important;
    }
    /deep/ .el-dialog__header {
        background-color: #304156;
        color: #fff;
        padding: 13px 20px;
    }
    /deep/.el-dialog__header .el-dialog__headerbtn{
        top:10px
    }

    //列表样式
    .list-main {
        /*border: 1px solid #ebebeb;*/
        /*padding: 10px 20px 10px 20px;*/
        padding: 0;
        margin-left: 10px;
        //内容样式
        .el-card {
            border: 0;
            /deep/ .el-table th {
                background-color: #308FE4;
                color: #fff;
            }
            /deep/.el-card__body{
                height: 100%;
            }
        }

        .el-card.is-always-shadow {
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        }
    }
    //检验结果
    .table-list-total{
        .common-subtitle{
            border: none;
        }
    }

</style>