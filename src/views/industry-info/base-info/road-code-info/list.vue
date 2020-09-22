<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 10px;">
                <div class="text item">
                    <div class="filter-container">
                        <el-row>
                            <el-col :span="this.isSmallBtn ? 6 : 4">
                                <el-input
                                        v-model="form.code"
                                        placeholder="请输入道路代码"
                                        class="filter-item"
                                        style="width: 95%;"
                                        @keyup.enter.native="handleFilter"
                                />
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 6 : 4">
                                <el-input
                                        v-model="form.name"
                                        placeholder="请输入道路名称"
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
                        <el-table-column label="道路代码" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.lineCode}}</template>
                        </el-table-column>
                        <el-table-column label="道路名称" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.lineName}}</template>
                        </el-table-column>
                        <el-table-column label="备注" header-align="center" align="center">
                            <template slot-scope="{row}">{{row.remark}}</template>
                        </el-table-column>
                        <!-- 操作 -->
                        <!--<el-table-column
                                label="操作"
                                align="center"
                                width="270"
                                class-name="small-padding fixed-width"
                        >
                            <template slot-scope="{row}">
                                <el-button type="primary" size="mini" @click.native="">
                                    查看
                                </el-button>
                            </template>
                        </el-table-column>-->
                    </el-table>
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

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {basicLine} from '@/api/industry'
    export default {
        name: 'RoadCodeInfoList',
        components: {Pagination},
        data() {
            return {
                list: [],//列表
                total: 0,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                dialogAddVisible: false,
                form: {
                    name: '',
                    code: '',
                },
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
            }
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize = function () {
                self.setBtns();
            }
            this.getList()
        },
        methods: {
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
            //设置按钮样式
            setBtns() {
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },
            getList(){
                let self = this;
                let obj={
                    page:self.listQuery.page,
                    size:self.listQuery.size,
                }
                if(this.form.name){
                    obj.lineName=this.form.name;
                }
                if(this.form.code){
                    obj.lineCode=this.form.code;
                }
                this.loading = true
                basicLine(obj).then(res => {
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
</style>
