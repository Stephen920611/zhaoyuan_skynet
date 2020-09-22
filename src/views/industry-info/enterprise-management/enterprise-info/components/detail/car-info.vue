<template>
    <div class="container">
        <el-table
                v-loading="listLoading"
                :data="list"
                border
                fit
                class="table-info"
                height="400px"
        >
            <el-table-column label="序号" type="index" align="center" width="60px">
                <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="车牌号码" header-align="center" align="center" min-width="80">
                <template slot-scope="{row}">{{row.carNum}}</template>
            </el-table-column>
            <el-table-column label="车辆类型" header-align="center" align="center" min-width="40">
                <template slot-scope="{row}">{{row.carTypeName}}</template>
            </el-table-column>
            <!--<el-table-column label="道路运输证" header-align="center" align="center" min-width="40">
                <template slot-scope="{row}">{{row.roadCard}}</template>
            </el-table-column>-->
            <el-table-column label="车辆状态" header-align="center" align="center" min-width="40">
                <template slot-scope="{row}">{{row.workingStatusName}}</template>
            </el-table-column>
            <el-table-column label="运输证状态" header-align="center" align="center" min-width="40">
                <template slot-scope="{row}">{{row.transportStatus == '1'?'正常':'过期'}}</template>
            </el-table-column>
        </el-table>
        <!-- 分页控件 -->
        <pagination
                v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.size"
                :pageSizes="[5,10,15,20,30]"
                style="padding:0px !important"
                class="pagination"
                @pagination="getData"
        />
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {getCarByPage} from '@/api/industry'
    export default {
        name: "CarInfo",
        components: {Pagination},
        props:['companyId'],
        data() {
            return {
                list:[],
                listLoading:false,
                listQuery: {
                    page: 1,
                    size: 5,
                },
                total:0,
            }
        },
        mounted(){
            this.getData()
        },
        methods: {
            getData(){
                this.list = [];
                this.total = 0;
                const param = Object.assign({companyId:this.companyId},this.listQuery);
                getCarByPage(param).then(res=>{
                    this.list = res.data.list;
                    this.total = res.data.total;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        padding: 10px 20px;
        .pagination {
            /deep/ .el-pagination {
                display: flex;
                justify-content: center;
            }
        }
    }
</style>
