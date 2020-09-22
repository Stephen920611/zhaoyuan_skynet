<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 10px;">
                <div class="text item">
                    <div class="filter-container">
                        <el-row>
                            <el-col :span="this.isSmallBtn ? 6 : 4">
                                <el-input
                                        v-model="form.name"
                                        placeholder="请输入名称"
                                        class="filter-item"
                                        style="width: 95%;"
                                        @keyup.enter.native="handleFilter"
                                />
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 6 : 4">
                                <el-input
                                        v-model="form.lhgCode"
                                        placeholder="请输入联合国编号"
                                        class="filter-item"
                                        style="width: 95%;"
                                        @keyup.enter.native="handleFilter"
                                />
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 6 : 4">
                                <el-input
                                        v-model="form.dangerCode"
                                        placeholder="请输入危险编号"
                                        class="filter-item"
                                        style="width: 95%;"
                                        @keyup.enter.native="handleFilter"
                                />
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 18 : 8" class="btns">
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
                            </el-col>
                        </el-row>
                    </div>
                    <div>
                        <!--<el-row style="width: 90%;margin-bottom: 10px;">
                            <el-col style="width: 90px;margin-right: 10px">
                                <el-button type="primary" icon="el-icon-document-add" @click="addDangerShow">新 增</el-button>
                            </el-col>
                            <el-col style="width: 90px;margin-right: 10px">
                                <el-button type="primary" icon="el-icon-edit" @click="editDangerShow">编 辑</el-button>
                            </el-col>
                            <el-col style="width: 90px;margin-right: 10px">
                                <el-button type="danger" icon="el-icon-delete" @click="deleteParameterFunc">删 除</el-button>
                            </el-col>
                        </el-row>-->
                        <!-- 表格开始 -->
                        <el-table
                            v-loading="listLoading"
                            :data="list"
                            border
                            fit
                            highlight-current-row
                            style="width: 100%;"
                            height="550px"
                            @current-change="handleCurrentChange"
                        >
                            <el-table-column label="编号" type="index" align="center" width="80px">
                                <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                                </template>
                            </el-table-column>
                            <el-table-column label="货物名称" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.name}}</template>
                            </el-table-column>
                            <el-table-column label="货物别名" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.alias}}</template>
                            </el-table-column>
                            <el-table-column label="联合国编号" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.unCode}}</template>
                            </el-table-column>
                            <el-table-column label="危险编号" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.dangerCode}}</template>
                            </el-table-column>
                            <el-table-column label="危险类别" header-align="center" align="center">
                                <template slot-scope="{row}">{{row.levelType}}</template>
                            </el-table-column>
                            <el-table-column label="状态" header-align="center" align="center">
                                <template slot-scope="{row}">
                                    <span style="color: red" v-if="row.status==0">禁用</span>
                                    <span style="color: green" v-else>启用</span>
                                </template>
                            </el-table-column>
                            <!-- 操作 -->
                            <!-- 操作 -->
                            <el-table-column
                                label="操作"
                                align="center"
                                width="100"
                                class-name="small-padding fixed-width"
                            >
                                <template slot-scope="{row}">
                                    <i class="icon iconfont iconchakan" title="查看" @click="seeDetail(row)">
                                    </i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 分页控件 -->
                    <pagination
                            v-show="total>0"
                            :total="total"
                            :page.sync="listQuery.page"
                            :limit.sync="listQuery.size"
                            style="padding:0px !important"
                            class="pagination"
                            @pagination="getList"
                    />
                </div>
            </el-main>
        </el-container>
        <!--查看-->
        <el-dialog title="详情" :visible.sync="detailShow" v-elDragDialog width="1000px" :close-on-click-modal="true" append-to-body>
            <see-detail v-on:showHiddenDetail="showHiddenDetail" :editParamsInfo="editParamsInfo"></see-detail>
        </el-dialog>
        <!--新增的dialog-->
        <el-dialog title="新增" :visible.sync="addShow" v-elDragDialog width="1000px" :close-on-click-modal="false" append-to-body>
            <add-danger v-on:showHiddenAdd="showHiddenAdd"></add-danger>
        </el-dialog>
        <el-dialog title="编辑" :visible.sync="editShow" v-elDragDialog width="1000px" :close-on-click-modal="false" append-to-body>
            <edit-danger v-on:showHiddenEdit="showHiddenEdit" :editParamsInfo="editParamsInfo"></edit-danger>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {dangerList,chemicalsDelete} from '@/api/industry'
    import SeeDetail from "./components/see-detail";
    import AddDanger from "./components/add-danger";
    import EditDanger from "./components/edit-danger";
    import elDragDialog from '@/directive/el-drag-dialog'
    export default {
        name: 'DangerDirectoryList',
        components: {SeeDetail,Pagination,AddDanger,EditDanger},
        directives: {elDragDialog},
        data() {
            return {
                list: [],//列表
                total: 0,
                listLoading: false,
                detailShow:false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                form: {
                    name: '',
                    lhgCode: '',    //联合国编号
                    dangerCode: ''  //危险编号
                },
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                editParamsInfo:null,
                addShow:false,
                editShow:false,
            }
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize = function () {
                self.setBtns();
            }
            self.getList()
        },
        methods: {
            //删除
            deleteParameterFunc(){
                let self=this;
                if(!this.editParamsInfo){
                    this.$message({
                        message: '请选择操作数列',
                        type: 'warning'
                    });
                    return
                }
                let obj={
                    id:this.editParamsInfo.id
                }
                this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    chemicalsDelete(obj).then(res => {
                        self.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        })
                        self.getList()
                    }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                    })
                })
            },
            handleCurrentChange(val) {
                this.editParamsInfo = val;
            },
            addDangerShow(){
                this.addShow=true
            },
            editDangerShow(){
                if(!this.editParamsInfo){
                    this.$message({
                        message: '请选择编辑数列',
                        type: 'warning'
                    });
                    return
                }
                this.editShow=true
            },
            //      关闭新增界面并刷新？不刷新
            showHiddenAdd: function (data, refresh) {
                let self = this;
                this.addShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            //      关闭新增界面并刷新？不刷新
            showHiddenEdit: function (data, refresh) {
                let self = this;
                this.editShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            seeDetail(row){
                this.detailShow=true;
                this.editParamsInfo=row;
            },
            //      关闭新增界面并刷新？不刷新
            showHiddenDetail: function (data, refresh) {
                this.detailShow = data;
            },
            //设置按钮样式
            setBtns() {
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },
            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            handleReset() {
                this.form={
                    name: '',
                    lhgCode: '',    //联合国编号
                    dangerCode: ''  //危险编号
                }
                this.listQuery.page = 1;
                this.getList()
            },
            getList(){
                let self = this;
                self.editParamsInfo=null
                let obj={
                    page:self.listQuery.page,
                    size:self.listQuery.size,
                }
                if(this.form.name){
                    obj.name=this.form.name;
                }
                if(this.form.lhgCode){
                    obj.unCode=this.form.lhgCode;
                }
                if(this.form.dangerCode){
                    obj.dangerCode=this.form.dangerCode;
                }
                this.loading = true
                dangerList(obj).then(res => {
                    self.list=res.data.list
                    self.total=res.data.total
                    this.loading = false
                })
                    .catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                        this.loading = false
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .pagination {
        /deep/ .el-pagination {
            display: flex;
            justify-content: center;
        }
    }

    .width-70 {
        width: 70%;
    }

    .width-90 {
        width: 90%;
    }

    .btns {
        display: flex;
        justify-content: flex-start;

        /* 大屏幕 ：大于等于1200px*/
        @media (min-width: 1200px) {

        }

        /*默认*/
        @media screen and (min-width: 980px) and (max-width: 1199px) {

        }

        /* 平板电脑和小屏电脑之间的分辨率 */
        @media screen and (min-width: 768px) and (max-width: 979px) {

        }
        button {
            /*width: 100px;*/
        }
    }
    .iconfont {
        font-size: 20px !important;
        cursor: pointer;
    }
</style>
