<template>
    <div class="app-container">
        <div class="all-background right-panel">
            <!--搜索条件-->
            <div class="filter-container">
                <el-form :inline="true" :model="form" class="form-inline">
                    <el-form-item label="货物名称:">
                        <el-input
                            style="float: left"
                            placeholder="请输入货物名称"
                            v-model="form.goodsName"
                            @keyup.enter.native="handleFilter">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            class="filter-item"
                            type="primary"
                            icon="el-icon-search"
                            style="margin-left: 10px;"
                            @click="handleFilter">搜索
                        </el-button>
                        <el-button
                            class="filter-item"
                            icon="el-icon-refresh"
                            @click="handleReset">重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- table控件 -->
            <div>
                <!--操作按钮-->
                <el-row style="width: 90%;margin-bottom: 10px;margin-left: 33px">
                    <el-col style="width: 90px;margin-right: 10px">
                        <el-button type="primary" icon="el-icon-document-add" @click="addShow=true">新 增</el-button>
                    </el-col>
                    <el-col style="width: 90px;margin-right: 10px">
                        <el-button type="primary" icon="el-icon-edit" @click="editGoods">编 辑</el-button>
                    </el-col>
                    <el-col style="width: 90px;margin-right: 10px">
                        <el-button type="danger" icon="el-icon-delete" @click="deleteFunc">删 除</el-button>
                    </el-col>
                </el-row>

                <!-- 表格开始 -->
                <el-table
                    :data="list"
                    v-loading="listLoading"
                    border
                    fit
                    highlight-current-row
                    class="table-info"
                    height="570"
                    @current-change="handleCurrentChange">
                    <el-table-column label="序号" type="index" align="center" width="60px">
                        <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="货物名称" header-align="center" align="center" min-width="100">
                        <template slot-scope="{row}">{{row.goodsName}}</template>
                    </el-table-column>
                    <el-table-column label="联合国编号" header-align="center" align="center" min-width="50">
                        <template slot-scope="{row}">{{row.unCode}}</template>
                    </el-table-column>
                    <el-table-column label="危化品名称" header-align="center" align="center" min-width="60">
                        <template slot-scope="{row}">{{row.chemicalName}}</template>
                    </el-table-column>
                    <el-table-column label="类/项名" header-align="center" align="center" min-width="50">
                        <template slot-scope="{row}">{{row.className}}</template>
                    </el-table-column>
                    <el-table-column label="危险编号" header-align="center" align="center" min-width="50">
                        <template slot-scope="{row}">{{row.dangerCode}}</template>
                    </el-table-column>
                    <!--<el-table-column label="单位" header-align="center" align="center" min-width="40">
                        <template slot-scope="{row}">{{row.unit}}</template>
                    </el-table-column>
                    <el-table-column label="每单位重量（吨）" header-align="center" align="center" min-width="60">
                        <template slot-scope="{row}">{{row.unitWeight}}</template>
                    </el-table-column>
                    <el-table-column label="包装规格" header-align="center" align="center" min-width="60">
                        <template slot-scope="{row}">{{row.packageInfo}}</template>
                    </el-table-column>-->
                    <el-table-column label="储运要求" header-align="center" align="center" min-width="100" :show-overflow-tooltip="false">
                        <template slot-scope="{row}">
                            <span class="ellipsis-2-line" :title="row.storage">{{row.storage}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        width="100"
                        class-name="small-padding fixed-width">
                        <template slot-scope="{row}">
                            <i class="icon iconfont iconchakan" title="查看" @click="seeShow=true">
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
                @pagination="getList"/>
        </div>
        <!--新增的dialog-->
        <el-dialog title="新增" v-if="addShow" :visible.sync="addShow" v-elDragDialog width="1000px" :close-on-click-modal="false" append-to-body>
            <add-cargo @showHiddenAdd="showHiddenAdd" @closeAddDialog="closeAddDialog"></add-cargo>
        </el-dialog>
        <el-dialog title="编辑" v-if="editShow" :visible.sync="editShow" v-elDragDialog width="1000px" :close-on-click-modal="false" append-to-body>
            <edit-cargo @showHiddenAdd="showHiddenAdd" @closeEditDialog="closeEditDialog" :data="currentRow" :isDisabled="false" role="edit"></edit-cargo>
        </el-dialog>
        <el-dialog title="详情" v-if="seeShow" :visible.sync="seeShow" v-elDragDialog width="1000px" :close-on-click-modal="false" append-to-body>
            <edit-cargo @showHiddenAdd="showHiddenAdd" :data="currentRow" :isDisabled="true" role="detail"></edit-cargo>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import elDragDialog from '@/directive/el-drag-dialog'
    import addCargo from './components/add-cargo.vue'
    import editCargo from './components/edit-cargo.vue'
    import {companyChemicalPage,deleteChemical} from '@/api/industry'
    export default {
        name: 'ManagementGoodsList',
        components: {Pagination,addCargo,editCargo},
        directives: {elDragDialog},
        data() {
            return {
                listLoading: false,//table的等待
                list: [],
                total: 1,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                //搜索参数
                form: {
                    goodsName: '',  //货物名称
                },
                addShow:false,    //是否显示新增对话框
                editShow:false,    //是否显示编辑对话框
                seeShow:false,    //是否显示详情对话框
                currentRow:null,  //选中的一条货物信息
                userInfo:null,    //用户登录信息
            }
        },
        created() {
            //获取用户信息
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            this.getList();
        },
        methods: {
            //关闭新增界面并刷新？不刷新
            showHiddenAdd: function (data, refresh) {
                let self = this;
                this.addShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            //删除
            deleteFunc(){
                if(!this.currentRow){
                    this.$message({
                        message: '请选择一条需要删除的货物！',
                        type: 'warning'
                    });
                    return
                }
                this.$confirm('此操作将删除该危化品货物, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteChemical({id:this.currentRow.id}).then(res => {
                        this.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.getList();
                    }).catch((err) => {})
                })
            },
            //table选择按钮
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            //重置
            handleReset() {
                this.form = { goodsName: ''};
                this.listQuery.page = 1;
                this.getList()
            },
            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            getList(){
                let param = Object.assign(this.form,this.listQuery);
                param.companyId = this.userInfo.companyId;
                companyChemicalPage(param).then(res => {
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.listLoading = false;
                }).catch((err) => {
                    this.listLoading = false
                })
            },
            //关闭新增对话框
            closeAddDialog(flag){
                this.addShow = flag;
                this.handleFilter();
            },
            //关闭编辑对话框
            closeEditDialog(flag){
                this.editShow = flag;
                this.handleFilter();
            },
            //编辑货物信息
            editGoods(){
                if(!this.currentRow){
                    this.$message({
                        message: '请选择一条需要编辑的货物！',
                        type: 'warning'
                    });
                    return
                }
                this.editShow = true;
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../enterprise-management/styles/enterpriseInfo';
    .right-panel{
        width: 100%;
        padding-left: 0;
        .filter-container{
            padding: 20px 33px 10px;
        }
    }
    .ellipsis-2-line{
        display:-webkit-box;
        text-overflow:ellipsis;
        overflow:hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient:vertical;
    }

</style>
