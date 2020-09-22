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
            <el-table-column label="人员姓名" header-align="center" align="center" min-width="80">
                <template slot-scope="{row}">{{row.name}}</template>
            </el-table-column>
            <el-table-column label="性别" header-align="center" align="center" min-width="40">
                <template slot-scope="{row}">{{row.gender==1?'男':'女'}}</template>
            </el-table-column>
            <el-table-column label="身份证号" header-align="center" align="center" min-width="40">
                <template slot-scope="{row}">{{row.personNum}}</template>
            </el-table-column>
            <el-table-column label="人员类型" header-align="center" align="center" min-width="40">
                <template slot-scope="{row}">{{row.typeName}}</template>
            </el-table-column>
            <el-table-column label="联系方式" header-align="center" align="center" min-width="40">
                <template slot-scope="{row}">{{row.phoneNum}}</template>
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
    import {getWorker} from '@/api/industry'
    export default {
        name: "DriverInfo",
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
                getWorker(param).then(res=>{
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
