<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 10px;">
                <div class="text item">
                    <el-container class="container-wrap">

                        <el-header class="header-wrap" style="height: 60px">
                            <el-form :inline="true" :model="form" class="demo-form-inline">
                                <el-form-item label="参数编号:">
                                    <el-input
                                            style="float: left"
                                            placeholder="请输入参数编号"
                                            v-model="form.code"
                                            @keyup.enter.native="handleFilter">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="参数名称:">
                                    <el-input
                                            style="float: left"
                                            placeholder="请输入参数名称"
                                            v-model="form.name"
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
                            <!--<el-row style="width: 100%;margin-bottom: 10px">
                                <el-col :span="7" class="search-wrap">
                                    <div class="input-suffix">
                                        <el-col :span="2" style="margin-top: 7px;min-width: 86px"><span class="label-name" style="float: right">参数编号：</span>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-input
                                                style="float: left"
                                                placeholder="请输入参数编号"
                                                v-model="code"
                                                @keyup.enter.native="handleFilter">
                                            </el-input>
                                        </el-col>

                                    </div>
                                </el-col>

                                <el-col :span="7" class="search-wrap">
                                    <div class="input-suffix">
                                        <el-col :span="4" style="margin-top: 7px;min-width: 100px"><span class="label-name">参数名称：</span>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-input
                                                style="float: left"
                                                placeholder="请输入参数名称"
                                                v-model="name"
                                                @keyup.enter.native="handleFilter">
                                            </el-input>
                                        </el-col>
                                    </div>
                                </el-col>

                                <el-col :span="7" class="btns" style="float: right">
                                    <el-button
                                        class="filter-item"
                                        type="primary"
                                        icon="el-icon-search"
                                        style="margin-left: 10px;"
                                        @click="handleFilter"
                                    >搜索
                                    </el-button>
                                    <el-button
                                               class="filter-item"
                                               icon="el-icon-refresh"
                                               @click="handleReset">重置</el-button>
                                </el-col>

                            </el-row>-->
                        </el-header>

                        <!-- 表格开始 -->
                        <el-main>

                            <el-row style="width: 100%;margin-bottom: 10px">
                                <el-col style="width: 90px;margin-right: 10px">
                                    <el-button type="primary" icon="el-icon-document-add" @click="seeDialog">新 增
                                    </el-button>
                                </el-col>
                                <el-col style="width: 90px;margin-right: 10px">
                                    <el-button type="primary" icon="el-icon-edit" @click="editParameterFunc">编 辑
                                    </el-button>
                                </el-col>
                                <el-col style="width: 90px;margin-right: 10px">
                                    <el-button type="danger" icon="el-icon-delete" @click="deleteParameterFunc()">删 除
                                    </el-button>
                                </el-col>
                            </el-row>

                            <el-table
                                    v-loading="listLoading"
                                    :data="list"
                                    border
                                    fit
                                    highlight-current-row
                                    style="width: 100%;"
                                    height="520px"
                                    @current-change="handleCurrentChange"
                            >
                                <el-table-column label="序号" type="index" align="center" width="80px">
                                    <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1
                                        }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="参数编码" header-align="center" align="center">
                                    <template slot-scope="{row}">{{row.code}}</template>
                                </el-table-column>
                                <el-table-column label="参数名称" header-align="center" align="center">
                                    <template slot-scope="{row}">{{row.name}}</template>
                                </el-table-column>
                                <el-table-column label="参数值" header-align="center" align="center">
                                    <template slot-scope="{row}">{{row.value}}</template>
                                </el-table-column>
                                <el-table-column label="参数说明" header-align="center" align="center">
                                    <template slot-scope="{row}">{{row.remark}}</template>
                                </el-table-column>
                                <!-- 操作 -->
                                <!--        <el-table-column
                                            label="操作"
                                            align="center"
                                            width="120"
                                            class-name="small-padding fixed-width"
                                        >
                                            <template slot-scope="{row}">
                                                <i class="icon iconfont iconchakan" title="查看" @click="seeDialog(row)">
                                                </i>
                                            </template>
                                        </el-table-column>-->
                            </el-table>

                            <!-- 分页控件 -->
                            <pagination
                                    v-show="total>0"
                                    :total="total"
                                    :page.sync="listQuery.page"
                                    :limit.sync="listQuery.size"
                                    style="padding:0px !important;text-align: center;margin-bottom: 20px"
                                    class="pagination"
                                    @pagination="getList"
                            />

                        </el-main>
                    </el-container>
                </div>
            </el-main>
        </el-container>
        <!--修改的dialog-->
        <el-dialog :title="titleInfo" :visible.sync="dialogVisible" v-elDragDialog width="30%"
                   :close-on-click-modal="false">
            <el-form :label-position="labelPosition" :model="ruleForm" :rules="rules" ref="ruleForm"
                     label-width="110px">
                <el-form-item label="参数编码:" prop="code">
                    <el-input v-model="ruleForm.code" placeholder="请输入参数编码"></el-input>
                </el-form-item>
                <el-form-item label="参数名称:" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入参数名称"></el-input>
                </el-form-item>
                <el-form-item label="参数值:" prop="value">
                    <el-input v-model="ruleForm.value" placeholder="请输入参数值"></el-input>
                </el-form-item>
                <el-form-item label="参数说明:" prop="remark">
                    <el-input v-model="ruleForm.remark" placeholder="请输入参数说明"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/Subtitle/CommonSubtitle.vue'
    import elDragDialog from '@/directive/el-drag-dialog'
    import {dict, dictSaveOrUpdate, deleteParameter} from '@/api/system'

    export default {
        name: 'SystemGlobalParameterIndex',
        components: {Pagination, CommonSubtitle},
        directives: {elDragDialog},
        data() {
            return {
                dialogVisible: false,
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                form: {
                    code: "",
                    name: "",
                },
                total: 0,
                list: [],
                listQuery: {
                    page: 1,
                    size: 10,
                },
                listLoading: false,
                editParamsInfo: {},
                labelPosition: 'right',
                ruleForm: {
                    code: '',
                    name: '',
                    value: '',
                    remark: '',
                },
                rules: {
                    code: [
                        {required: true, message: '请输入参数编码', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'},
                    ],
                    value: [
                        {required: true, message: '请输入参数值', trigger: 'blur'},
                    ],
                    remark: [
                        {required: true, message: '请输入参数说明', trigger: 'blur'},
                    ]
                },
                currentRow: null,
                titleInfo: "新增",
            };
        },
        watch: {},
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize = function () {
                self.setBtns();
            };
            this.getList()
        },
        methods: {
            editParameterFunc() {
                if (!this.currentRow) {
                    this.$message({
                        message: '请选择需要编辑的全局参数',
                        type: 'warning'
                    });
                    return
                }
                this.titleInfo = "编辑";
                this.ruleForm = {
                    code: this.currentRow.code,
                    name: this.currentRow.name,
                    value: this.currentRow.value,
                    remark: this.currentRow.remark,
                };
                this.dialogVisible = true;
            },
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            deleteParameterFunc() {
                let self = this;
                if (JSON.stringify(this.currentRow) == '{}' || !this.currentRow) {
                    this.$message({
                        message: '请选择需要编辑的一条信息',
                        type: 'warning',
                    });
                    return
                }
                let obj = {
                    id: this.currentRow.id
                };
                this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteParameter(obj).then(res => {
                        self.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        });
                        self.getList()
                    }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                    })
                })
            },
            submitForm(formName) {
                let self = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (self.titleInfo == '编辑') {
                            this.ruleForm.id = this.currentRow.id
                        }
                        dictSaveOrUpdate(this.ruleForm).then(res => {
                            this.$message({
                                message: '操作成功！',
                                type: 'success'
                            });
                            this.dialogVisible = false
                            self.getList()
                        }).catch((err) => {
                            // 公共方法有，所以不需要加提示了
                            // this.$message.error(err.msg)
                            this.listLoading = false
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            handleReset() {
                this.form.code = "";
                this.form.name = "";
                this.listQuery.page = 1;
                this.getList()
            },
            getList() {
                const obj = Object.assign(this.form, this.listQuery);
                this.listLoading = true;
                this.currentRow = null;
                dict(obj).then(res => {
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.listLoading = false
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                    this.listLoading = false
                });
            },
            //设置按钮样式
            setBtns() {
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },
            //查看详情
            seeDialog() {
                this.titleInfo = "新增";
                this.ruleForm = {
                    code: '',
                    name: '',
                    value: '',
                    remark: '',
                };
                this.dialogVisible = true;
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import 'styles/parameter';
</style>
