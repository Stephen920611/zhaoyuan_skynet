<template>
    <div class="all-background padding-20">
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
            <!-- 表格开始 -->
            <el-table
                    ref="multipleTable"
                    :data="list"
                    border
                    fit
                    highlight-current-row
                    class="table-info"
                    @current-change="handleCurrentChange"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        class="text-center"
                        type="selection"
                        width="40">
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
            </el-table>
        </div>
        <!-- 分页控件 -->
        <pagination
                v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.size"
                :pageSizes="[5, 10, 20, 30]"
                style="padding:0px !important"
                class="pagination"
                @pagination="getList"/>
        <div slot="footer" class="dialog-footer margin-t-20" style="text-align: center; width: 100%;">
            <el-button @click="close">关 闭</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import elDragDialog from '@/directive/el-drag-dialog'
    import {companyChemicalPage,deleteChemical} from '@/api/industry'
    export default {
        name: 'ManagementGoodsList',
        components: {Pagination},
        directives: {elDragDialog},
        data() {
            return {
                listLoading: false,//table的等待
                list: [],
                total: 1,
                listQuery: {
                    page: 1,
                    size: 5,
                },
                //搜索参数
                form: {
                    goodsName: '',  //货物名称
                },
                currentRow:null,  //选中的一条货物信息
                userInfo:null,    //用户登录信息
                multipleSelection: [],
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
            handleSelectionChange(val) {
                //将复选框设置成单选框
                if (val.length > 1) {
                    this.$refs.multipleTable.clearSelection();
                    this.$refs.multipleTable.toggleRowSelection(val.pop())
                }
                this.multipleSelection = val;
            },
            //确定按钮
            confirm() {
                this.$emit('showHiddenSearch', false, this.multipleSelection);
            },
            //关闭窗口
            close(){
                this.$emit('closeDialog');
            },

        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../enterprise-management/styles/enterpriseInfo';
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
    .table-info{
        height: auto !important;
    }

</style>
