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
                                        placeholder="请输入车牌号"
                                        class="filter-item"
                                        style="width: 95%;"
                                        @keyup.enter.native="handleFilter"
                                />
                            </el-col>
                            <el-col :span="this.isSmallBtn ? 6 : 4">
                                <el-input
                                        v-model="form.name"
                                        placeholder="请输入订单号"
                                        class="filter-item"
                                        style="width: 95%;"
                                        @keyup.enter.native="handleFilter"
                                />
                            </el-col>
                            <!--<el-col :span="this.isSmallBtn ? 6 : 4">
                                <el-select v-model="form.isEnable" class="filter-item"
                                           placeholder="请选择状态">
                                    <el-option
                                            v-for="item in isEnabled"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    />
                                </el-select>
                            </el-col>-->
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
                                        type="primary"
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
                        <el-table-column label="申报单号" header-align="center" align="center" min-width="60">
                            <template slot-scope="{row}">{{row.a1}}</template>
                        </el-table-column>
                        <el-table-column label="车牌号码" header-align="center" align="center"  min-width="50">
                            <template slot-scope="{row}">{{row.a2}}</template>
                        </el-table-column>
                        <el-table-column label="驾驶员姓名" header-align="center" align="center"  min-width="50">
                            <template slot-scope="{row}">{{row.a3}}</template>
                        </el-table-column>
                        <el-table-column label="驾驶证号码" header-align="center" align="center"  min-width="60">
                            <template slot-scope="{row}">{{row.a4}}</template>
                        </el-table-column>
                        <el-table-column label="货物名称" header-align="center" align="center"  min-width="60">
                            <template slot-scope="{row}">{{row.a5}}</template>
                        </el-table-column>
                        <el-table-column label="目的地" header-align="center" align="center"  min-width="90">
                            <template slot-scope="{row}">{{row.a6}}</template>
                        </el-table-column>
                        <el-table-column label="申报时间" header-align="center" align="center"  min-width="60">
                            <template slot-scope="{row}">{{row.a7}}</template>
                        </el-table-column>
                        <el-table-column label="状态" header-align="center" align="center"  min-width="40">
                            <template slot-scope="{row}">{{row.a8}}</template>
                        </el-table-column>
                        <!-- 操作 -->
                        <el-table-column
                                label="操作"
                                align="center"
                                width="120"
                                class-name="small-padding fixed-width"
                        >
                            <template slot-scope="{row}">
                                <el-button type="primary" size="mini" @click.native="">
                                    验核
                                </el-button>
                            </template>
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
                            @pagination="getList"
                    />
                </div>
            </el-main>
        </el-container>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'

    export default {
        name: 'WarehouseAuditList',
        components: {Pagination},
        data() {
            return {
                list: [
                    {a1:'BSQ2016021562787',a2:'鲁F12RD6',a3:'李晨明',a4:'32102522532233555',a5:'1-丙醇',a6:'龙口市新城大街14泊位',a7:'2020-06-30',a8:'下单'},
                    {a1:'BSQ2016021562787',a2:'鲁F12RD6',a3:'李晨明',a4:'32102522532233555',a5:'1-丙醇',a6:'龙口市新城大街14泊位',a7:'2020-06-30',a8:'下单'},
                    {a1:'BSQ2016021562787',a2:'鲁F12RD6',a3:'李晨明',a4:'32102522532233555',a5:'1-丙醇',a6:'龙口市新城大街14泊位',a7:'2020-06-30',a8:'下单'},
                    {a1:'BSQ2016021562787',a2:'鲁F12RD6',a3:'李晨明',a4:'32102522532233555',a5:'1-丙醇',a6:'龙口市新城大街14泊位',a7:'2020-06-30',a8:'下单'},
                    {a1:'BSQ2016021562787',a2:'鲁F12RD6',a3:'李晨明',a4:'32102522532233555',a5:'1-丙醇',a6:'龙口市新城大街14泊位',a7:'2020-06-30',a8:'下单'},
                    {a1:'BSQ2016021562787',a2:'鲁F12RD6',a3:'李晨明',a4:'32102522532233555',a5:'1-丙醇',a6:'龙口市新城大街14泊位',a7:'2020-06-30',a8:'下单'}


                ],//列表
                isEnabled:[
                    {'label':'全部',value:-1},
                    {'label':'有效',value:1},
                    {'label':'无效',value:0}
                ],
                total: 1,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                dialogAddVisible: false,
                form: {
                    name: '',
                    lhgCode: '',    //联合国编号
                    dangerCode: ''  //危险编号
                },
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
            }
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize=function(){
                self.setBtns();
            }
        },
        methods: {
            //设置按钮样式
            setBtns(){
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
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
