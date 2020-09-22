<template>
    <div class="container">
        <CommonSubtitle title="选择资源" v-if="!handleEdit" :isBold="true" style="width: 100%;line-height: 20px;margin-bottom: 10px"></CommonSubtitle>
        <!-- 表格开始 -->
        <el-table
                v-loading="listLoading"
                :data="list"
                border
                fit
                highlight-current-row
                @selection-change="handleSelectionChange"
                style="width: 100%;"
                ref="teamTable"
        >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column label="序号" type="index" align="center" width="80px">
                <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="队伍名称" header-align="center" align="center">
                <template slot-scope="{row}">{{row.name}}</template>
            </el-table-column>
            <el-table-column label="归属" header-align="center" align="center">
                <template slot-scope="{row}">{{row.sideCode}}</template>
            </el-table-column>
            <el-table-column label="所属单位名称" header-align="center" align="center">
                <template slot-scope="{row}">{{row.startTime}}</template>
            </el-table-column>
            <el-table-column label="救援方向" header-align="center" align="center">
                <template slot-scope="{row}">{{row.startTime}}</template>
            </el-table-column>
            <el-table-column label="负责人" header-align="center" align="center">
                <template slot-scope="{row}">{{row.endTime}}</template>
            </el-table-column>
            <el-table-column label="联系电话" header-align="center" align="center">
                <template slot-scope="{row}">{{row.status === 1 ? '异常' : '正常' }}</template>
            </el-table-column>
            <el-table-column label="值班电话" header-align="center" align="center">
                <template slot-scope="{row}">{{row.status === 1 ? '异常' : '正常' }}</template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
                    v-if="handleEdit"
                    label="操作"
                    align="center"
                    width="70"
                    class-name="small-padding fixed-width"
            >
                <template slot-scope="{row}">
                    <i class="icon iconfont iconshanchu1" title="删除" style="margin-left: 5px" @click="deleteMenu(row)"></i>
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
                    :pageSizes="[5]"
            />
        </div>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'

    export default {
        name: "teamTable",
        props: ['isDisabled', 'handleEdit','type'],
        components: {ElImageViewer,Pagination,CommonSubtitle},
        data() {
            return {
                showViewer: false, // 显示查看器
                total: 1,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                list:[{
                    name:'队伍1'
                }],
                tableSelection:[]
            }
        },
        mounted(){
//            console.log('type',this.type);
        },
        methods: {
            //获取列表数据
            getList(){

            },
            //删除菜单
            deleteMenu(data) {
                this.$confirm(`确定要删除该节点吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    /*deleteSysPath({id: data.id}).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.selectTreeNode = null;
                        //刷新列表
                        this.getTree();
                        this.list = [];
                    });*/
                }).catch(() => {
                });

            },
            //选中行数
            handleSelectionChange(val) {
                //表格多行选中 val:数组
                this.tableSelection = val;
            },
            //清空选中行数
            handleClearSelection(){
                this.$refs['teamTable'].clearSelection()
            }
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    @import "~@/views/emergency-management/emergency-plan-management/styles/dialog-table.less";

</style>
