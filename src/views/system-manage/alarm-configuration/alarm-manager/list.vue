<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 10px;">
                <div class="text item">
                    <div class="filter-container">
                        <el-row>
                            <el-col style="width: 90px;margin-right: 10px">
                                <el-button type="primary" icon="el-icon-document-add" @click="addAlarmFunc('1')">新增</el-button>
                            </el-col>
                            <el-col style="width: 90px;margin-right: 10px">
                                <el-button type="primary" icon="el-icon-edit" @click="addAlarmFunc('2')">编辑</el-button>
                            </el-col>
                            <el-col style="width: 90px">
                                <el-button type="danger" icon="el-icon-delete" @click="deleteAlarmFunc()">删除</el-button>
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
                            @current-change="handleCurrentChange"
                    >
                        <el-table-column label="序号" type="index" align="center" width="80px">
                            <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="报警类型" header-align="center" align="center"  min-width="90">
                            <template slot-scope="{row}">{{row.alarmName}}</template>
                        </el-table-column>
                        <el-table-column label="单次报警积分" header-align="center" align="center"  min-width="90">
                            <template slot-scope="{row}">{{row.alarmScore}}</template>
                        </el-table-column>
                        <el-table-column label="报警级别" header-align="center" align="center"  min-width="60">
                            <template slot-scope="scope">
                                <span v-html="classHtml(scope.row.alarmClass)"></span>
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
        <!--修改的dialog-->
        <el-dialog :title="titleInfo" :visible.sync="dialogVisible" v-elDragDialog width="30%" :close-on-click-modal="false">
            <el-form :label-position="labelPosition" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="115px">
                <el-form-item label="报警类型:" prop="alarmType">
                    <el-input v-model="ruleForm.alarmType" placeholder="请输入报警类型"></el-input>
                </el-form-item>
                <el-form-item label="单次报警积分:" prop="number">
                    <el-input v-model="ruleForm.number" placeholder="请输入单次报警积分" oninput="value=value.replace(/[^\d-]/g,'')"></el-input>
                </el-form-item>
                <el-form-item label="报警级别:" prop="level">
                    <el-radio-group  v-model="ruleForm.level">
                        <el-radio label="1" border>一般</el-radio>
                        <el-radio label="2" border>较大</el-radio>
                        <el-radio label="3" border>严重</el-radio>
                    </el-radio-group>
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
    import {ladeAlarm} from '@/api/system'
    import {deleteAlarmate} from '@/api/system'
    import {saveOrUpdate} from '@/api/system'
    import CommonSubtitle from '@/components/Subtitle/CommonSubtitle.vue'
    import elDragDialog from '@/directive/el-drag-dialog'
    export default {
        name: 'SystemAlarmManagerIndex',
        components: {Pagination,CommonSubtitle},
        directives: {elDragDialog},
        data() {
            return {
                list: [],//列表
                total: 1,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                dialogVisible: false,
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                labelPosition: 'right',
                ruleForm: {
                    alarmType: '',
                    number: '',
                    level: ''
                },
                rules: {
                    alarmType: [
                        { required: true, message: '请输入报警类型', trigger: 'blur' },
                    ],
                    number: [
                        { required: true, message: '请输入单次报警积分', trigger: 'blur' }
                    ],
                    level: [
                        { required: true, message: '请选择报警级别', trigger: 'change' }
                    ],
                },
                currentRow:{},
                titleInfo:"新增",
            }
        },
        created() {
            let self = this;
            this.getList()
        },
        methods: {
            deleteAlarmFunc(){
                let self=this;
                if(JSON.stringify(this.currentRow)=='{}'|| !this.currentRow){
                    this.$message({
                        message: '请选择需要编辑的一条信息',
                        type: 'warning'
                    });
                    return
                }
                let obj={
                    id:this.currentRow.id
                }
                this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteAlarmate(obj).then(res => {
                        self.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        })
                        self.getList()
                    }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                    })
                })
            },
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            submitForm(formName) {
                let self=this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let obj={
                            alarmName:self.ruleForm.alarmType,
                            alarmScore:self.ruleForm.number,
                            alarmClass:self.ruleForm.level,
                        }
                        if(self.titleInfo=='编辑'){
                            obj.id=this.currentRow.id
                        }
                        saveOrUpdate(obj).then(res => {
                            this.$message({
                                message: '操作成功！',
                                type: 'success'
                            });
                            this.dialogVisible=false
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
            //      报警级别
            classHtml: function (val) {
                if (val==1) {
                    return '一般'
                } else if (val==2) {
                    return '较大'
                }else {
                    return '重大'
                }
            },
            addAlarmFunc(type){
                if(type=="2"){
                    if(JSON.stringify(this.currentRow)=='{}' || !this.currentRow){
                        this.$message({
                            message: '请选择需要编辑的报警数据',
                            type: 'warning',
                        });
                        return
                    }
                    this.titleInfo="编辑";
                    this.ruleForm={
                        alarmType:this.currentRow.alarmName,
                            number:this.currentRow.alarmScore,
                            level:this.currentRow.alarmClass+'',
                    }
                    this.dialogVisible=true;
                }else{
                    this.titleInfo="新增";
                    this.ruleForm={
                        alarmType: '',
                            number: '',
                            level: ''
                    }
                    this.dialogVisible=true;
                }
            },
            handleReset() {
                this.form={
                    name: '',
                    company: '',
                    isEnabled: ''
                }
                this.listQuery.page = 1;
                this.getList()
            },
            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            getList(){
                let self = this;
                let obj={
                    page:self.listQuery.page,
                    size:self.listQuery.size,
                }
                this.listLoading = true
                ladeAlarm(obj).then(res => {
                    self.list=res.data.list
                    self.total=res.data.total
                    this.listLoading = false
                }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                        this.listLoading = false
                    })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../alarm-manager/styles/alarmManager';
</style>
