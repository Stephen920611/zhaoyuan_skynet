<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <div class="add-form">
                    <el-form label-position="right" ref="ruleForm" :inline="true" label-width="100px"
                             :model="ruleForm">
                        <el-form-item label="货物名称:" class="long-item">
                            <el-input v-model="ruleForm.name" placeholder="请输入货物名称"></el-input>
                        </el-form-item>
                        <el-form-item label="联合国编号:">
                            <el-input v-model="ruleForm.unCode" placeholder="请输入联合国编号">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="危险号:">
                            <el-input v-model="ruleForm.dangerCode" placeholder="请输入危险号"></el-input>
                        </el-form-item>
                        <el-form-item label="类别或项别:">
                            <el-select v-model="ruleForm.classId" clearable placeholder="请选择" @change="getTypeList2">
                                <el-option
                                        v-for="item in typeList1"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-select v-model="ruleForm.divisionId" filterable placeholder="请选择">
                                <el-option
                                        v-for="item in typeList2"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="btn-wrap">
                            <el-button
                                    class="filter-item"
                                    type="primary"
                                    icon="el-icon-search"
                                    style="margin-left: 10px;"
                                    @click="handleFilter">查 询
                            </el-button>
                            <el-button
                                    class="filter-item"
                                    icon="el-icon-refresh"
                                    @click="handleReset">重 置
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-table
                        ref="multipleTable"
                        :data="list"
                        border
                        fit
                        style="width: 100%"
                        height="400"
                        v-loading="listLoading"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="40">
                    </el-table-column>
                    <el-table-column label="名称" header-align="center" align="center" min-width="60">
                        <template slot-scope="{row}">{{row.name}}</template>
                    </el-table-column>
                    <el-table-column label="英文名称" header-align="center" align="center" min-width="100">
                        <template slot-scope="{row}">{{row.enName}}</template>
                    </el-table-column>
                    <el-table-column label="类别或项别" header-align="center" align="center" min-width="40">
                        <template slot-scope="{row}">{{row.className}}</template>
                    </el-table-column>
                    <el-table-column label="联合国编号" header-align="center" align="center" min-width="50">
                        <template slot-scope="{row}">{{row.unCode}}</template>
                    </el-table-column>
                    <el-table-column label="危险号" header-align="center" align="center" min-width="50">
                        <template slot-scope="{row}">{{row.dangerCode}}</template>
                    </el-table-column>
                </el-table>
                <!-- 分页控件 -->
                <pagination
                        v-show="total>0"
                        :total="total"
                        :page.sync="listQuery.page"
                        :limit.sync="listQuery.size"
                        style="padding:0px !important;text-align: center;"
                        class="pagination"
                        @pagination="getList"/>
                <div slot="footer" class="dialog-footer margin-t-20" style="text-align: center; width: 100%;">
                    <el-button @click="close">关 闭</el-button>
                    <el-button type="primary" @click="confirm">确 定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getByCode,queryChemicalType,dangerList} from '@/api/industry'
    import Pagination from '@/components/Pagination'

    export default {
        name: "search-cargo",
        components: {Pagination},
        data() {
            return {
                ruleForm: {
                    name:'',
                    unCode:'',
                    dangerCode:'',
                    classId:null,
                    divisionId:null,
                },
                typeList1:[],  //一级类别
                typeList2:[],  //二级项别

                list: [],//列表
                total: 0,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                multipleSelection: []
            };
        },
        created() {
            this.getTypeList1();  //获取一级类别
            this.getList()
        },
        methods: {
            getTypeList1(type){
                queryChemicalType({parentId:0}).then(res=>{
                    this.typeList1 = [];
                    res.data.map(item=>{
                        this.typeList1.push({id:item.id,name:item.typeName,parentId:item.parentId});
                    })
                }).catch(err=>{})
            },
            getTypeList2(){
                this.ruleForm.divisionId = null;  //清除上一次所选的项别
                queryChemicalType({parentId:this.ruleForm.classId}).then(res=>{
                    this.typeList2 = [];
                    res.data.map(item=>{
                        this.typeList2.push({id:item.id,name:item.typeName,parentId:item.parentId})
                    })
                }).catch(err=>{})
            },
            //确定按钮
            confirm() {
                this.$emit('showHiddenSearch', false, this.multipleSelection);
            },
            //关闭窗口
            close(){
                this.$emit('closeDialog');
            },
            //取消选择的选项
            toggleSelection() {
                this.$refs.multipleTable.clearSelection();
            },
            handleSelectionChange(val) {
                //将复选框设置成单选框
                if (val.length > 1) {
                    this.$refs.multipleTable.clearSelection();
                    this.$refs.multipleTable.toggleRowSelection(val.pop())
                }
                this.multipleSelection = val;
            },
            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            handleReset() {
                this.ruleForm = {
                    name:'',
                    unCode:'',
                    dangerCode:'',
                    classId:null,
                    divisionId:null,
                };
                this.listQuery.page = 1;
                this.getList()
            },
            getList() {
                let param = Object.assign(this.listQuery,this.ruleForm)
                this.listLoading = true;
                dangerList(param).then(res => {
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.listLoading = false
                }).catch((err) => {
                    this.listLoading = false
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-form-item:not(.btn-wrap){
        .el-form-item__content {
            width: 205px !important;
        }
    }

    /deep/ .el-table th {
        overflow: hidden;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-color: #308FE4;
        /* background-color: white; */
        color: #fff;
    }
</style>
