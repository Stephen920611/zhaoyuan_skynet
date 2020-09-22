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
                                        placeholder="请输入代码"
                                        class="filter-item"
                                        style="width: 95%;"
                                        @keyup.enter.native="handleFilter"
                                />
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 12 : 8" class="btns">
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
                    <!-- 表格开始 -->
                    <el-table
                            v-loading="listLoading"
                            :data="list"
                            border
                            fit
                            highlight-current-row
                            style="width: 100%;"
                            height="550px"
                    >
                        <el-table-column label="编号" type="index" align="center" width="80px">
                            <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="代码" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.code}}</template>
                        </el-table-column>
                        <el-table-column label="简称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.des}}</template>
                        </el-table-column>
                        <el-table-column label="全称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.des}}</template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页控件 -->
                    <pagination
                            v-show="total>0"
                            :total="total"
                            :page.sync="listQuery.page"
                            :limit.sync="listQuery.size"
                            style="padding:0px !important"
                            class="pagination"
                            @pagination="getTableData"
                    />
                </div>
            </el-main>
        </el-container>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {adminList} from '@/api/industry'

    export default {
        name: 'RegionList',
        components: {Pagination},
        data() {
            return {
                list: [],//table列表
                total: 0,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                dialogAddVisible: false,
                form: {
                    name: '',
                    lhgCode: '',    //联合国编号
                },
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
            }
        },
        created() {
            //默认执行
            this.setBtns();
            window.onresize=function(){
                this.setBtns();
            }
            this.getTableData();
        },
        methods: {
            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getTableData()
            },
            //设置按钮样式
            setBtns(){
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },
            getTableData(){
                let self = this;
                let obj={
                    page:self.listQuery.page,
                    size:self.listQuery.size,
                }
                if(this.form.name){
                    obj.des=this.form.name;
                }
                if(this.form.lhgCode){
                    obj.code=this.form.lhgCode;
                }
                this.loading = true
                adminList(obj).then(res => {
                    self.list=res.data.list
                    self.total=res.data.total
                    console.log(self.list)
                    this.loading = false
                })
                    .catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                        this.loading = false
                    })
            },
            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getTableData()
            },
            handleReset() {
                this.form = {
                    name: '',
                    lhgCode: ''    //联合国编号
                }
                this.listQuery.page=1;
                this.getTableData()
            },
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
</style>
