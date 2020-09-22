<template>
    <div class="app-container">
        <el-row ref="container">
            <!--左边树结构-->
            <el-col :span="5" class="left-panel all-background" style="margin-bottom: 0" ref="leftContainer"
                 v-show="isShowLeftPanel">
                <CommonSubtitle title="资源列表" :isBold="true" style="line-height: 10px"></CommonSubtitle>
                <div class="tree-wrap">
                    <region-tree :data="treeData" :loading="treeLoading" ref="regionTree"
                                 @node-click="handleNodeClick"></region-tree>
                </div>
            </el-col>
            <el-col :span="isShowLeftPanel?19:24" class="right-panel all-background">
                <!--搜索条件-->
                <div class="filter-container">
                    <el-form :inline="true" :model="form" class="form-inline">
                        <el-form-item label="人员姓名:">
                            <el-input
                                style="float: left"
                                placeholder="请输入人员姓名"
                                v-model="form.name"
                                @keyup.enter.native="handleFilter">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="身份证号:">
                            <el-input
                                style="float: left"
                                placeholder="请输入身份证号"
                                v-model="form.idCard"
                                @keyup.enter.native="handleFilter">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="人员类型(岗位):">
                            <el-select v-model="form.type" filterable placeholder="请选择人员类型">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                    @change="handleFilter">
                                </el-option>
                            </el-select>
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
                <div>
                    <el-row style="width: 90%;margin-bottom: 10px;margin-left: 30px">
                        <el-col style="width: 90px;margin-right: 10px">
                            <el-button type="primary" icon="el-icon-document-add" @click="addPersonnelShow">新 增
                            </el-button>
                        </el-col>
                        <el-col style="width: 90px;margin-right: 10px">
                            <el-button type="primary" icon="el-icon-edit" @click="editPersonnelShow">编 辑</el-button>
                        </el-col>
                        <el-col style="width: 90px;margin-right: 10px">
                            <el-button type="danger" icon="el-icon-delete" @click="deleteFunc">删 除</el-button>
                        </el-col>
                    </el-row>
                    <!-- 表格开始 -->
                    <el-table
                        v-loading="listLoading"
                        :data="list"
                        border
                        fit
                        highlight-current-row
                        @current-change="handleCurrentChange"
                        class="table-info"
                        height="570"
                    >
                        <el-table-column label="序号" type="index" align="center" width="50px">
                            <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="姓名" header-align="center" align="center" min-width="50">
                            <template slot-scope="{row}">{{row.name}}</template>
                        </el-table-column>
                        <el-table-column label="身份证号" header-align="center" align="center" min-width="80">
                            <template slot-scope="{row}">{{row.personNum}}</template>
                        </el-table-column>
                        <el-table-column label="所属企业" header-align="center" align="center" min-width="100">
                            <template slot-scope="{row}">{{row.companyName}}</template>
                        </el-table-column>
                        <el-table-column label="性别" header-align="center" align="center" min-width="30">
                            <template slot-scope="scope">
                                <span v-html="genderHtml(scope.row.gender)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="人员类型" header-align="center" align="center" min-width="50">
                            <template slot-scope="scope">
                                <span v-html="typeHtml(scope.row.type)"></span>
                            </template>
                        </el-table-column>
                       <!-- <el-table-column label="职务" header-align="center" align="center" min-width="50">
                            <template slot-scope="{row}">{{row.job}}</template>
                        </el-table-column>-->
                        <el-table-column label="联系方式" header-align="center" align="center" min-width="60">
                            <template slot-scope="{row}">{{row.phoneNum}}</template>
                        </el-table-column>
                        <!-- 操作 -->
                        <el-table-column
                            label="操作"
                            align="center"
                            width="100"
                            class-name="small-padding fixed-width"
                        >
                            <template slot-scope="{row}">
                                <i class="icon iconfont iconchakan" title="查看" @click="seeDetail(row)">
                                </i>
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
                    style="padding:0px !important"
                    class="pagination"
                    @pagination="getList"
                />
            </el-col>
        </el-row>
        <!--查看的dialog-->
        <el-dialog title="详情" v-if="detailShow" :visible.sync="detailShow" v-elDragDialog width="70%" :close-on-click-modal="false" append-to-body>
            <see-detail :editParamsInfo="editParamsInfo" v-on:showHiddenAdd="showHiddenDetail"></see-detail>
        </el-dialog>
        <!--新增的dialog-->
        <el-dialog title="新增" v-if="addShow" :visible.sync="addShow" v-elDragDialog width="70%" :close-on-click-modal="false" append-to-body>
            <add-personnel ref="addPersonnel" v-on:showHiddenAdd="showHiddenAdd"></add-personnel>
        </el-dialog>
        <el-dialog title="编辑" v-if="editShow" :visible.sync="editShow" v-elDragDialog width="70%" :close-on-click-modal="false" append-to-body>
            <edit-personnel v-on:showHiddenEdit="showHiddenEdit" :editParamsInfo="editParamsInfo"></edit-personnel>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import elDragDialog from '@/directive/el-drag-dialog'
    import {basicArea,getByCode,getWorker,WorkerSaveOrUpdate} from '@/api/industry'
    import addPersonnel from './components/add/add-personnel.vue'
    import editPersonnel from './components/edit/edit-personnel.vue'
    import regionTree from '../../components/regionTree.vue'
    import SeeDetail from "./components/detail/see-detail";
    export default {
        name: 'DrivingCardList',
        components: {SeeDetail, Pagination,CommonSubtitle,addPersonnel,editPersonnel,regionTree},
        directives: {elDragDialog},
        data() {
            return {
                isShowLeftPanel:false,  //是否显示左侧面板
                treeData: [],
                treeLoading:false,
                listLoading: false,
                addShow:false,
                editShow:false,
                detailShow:false,
                dialogVisible: false,//查看对话框
                selectedCompanyId:"",//选择中公司树节点
                selectedAreaId:"",//选择中区域树节点
                defaultProps: {
                    children: 'nodes',
                    label: 'text'
                },
                list: [],//table列表
                total: 1,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                options:[],
                form: {
                    name: '',
                    type: '',
                    idCard: ''
                },
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                editParamsInfo:null
            }
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            //获取用户信息,仅显示相关数据
            let userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            self.selectedCompanyId=userInfo.companyId;

            self.getList();
            self.getIndustryData("WORKER_TYPE");
//            self.getTreeData();
        },
        methods: {
            //删除
            deleteFunc(){
                let self=this;
                if(!this.editParamsInfo){
                    this.$message({
                        message: '请选择需要刪除的人员！',
                        type: 'warning'
                    });
                    return
                }
                this.$confirm('此操作将删除该人员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    WorkerSaveOrUpdate({id:this.editParamsInfo.id,status:0}).then(res => {
                        self.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        });
                        self.getList();
                    }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                    })
                })
            },
            //table选择按钮
            handleCurrentChange(val) {
                this.editParamsInfo = val;
            },
            //关闭新增界面并刷新？不刷新
            showHiddenDetail: function (data, refresh) {
                let self = this;
                this.addShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            //关闭新增界面并刷新？不刷新
            showHiddenAdd: function (data, refresh) {
                let self = this;
                this.addShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            //关闭新增界面并刷新？不刷新
            showHiddenEdit: function (data, refresh) {
                let self = this;
                this.editShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            //编辑
            editPersonnelShow(){
                if(!this.editParamsInfo){
                    this.$message({
                        message: '请选择需要编辑的人员！',
                        type: 'warning'
                    });
                    return
                }
                this.editShow=true
                console.log("this.editParamsInfo",this.editParamsInfo)
            },
            //新增
            addPersonnelShow(){
                this.addShow=true
            },
            //查看详情
            seeDetail(row){
                this.detailShow=true;
                this.editParamsInfo=row;
                if (row.type==1) {
                    this.editParamsInfo.typeName =  '驾驶员'
                } else if (row.type==2){
                    this.editParamsInfo.typeName =  '押运员'
                }
                if (row.gender==1) {
                    this.editParamsInfo.genderName =  '男'
                } else if (row.gender==2){
                    this.editParamsInfo.genderName =  '女'
                }
            },
            //      人员类型
            typeHtml: function (val) {
                if (val==1) {
                    return '驾驶员'
                } else if (val==2){
                    return '押运员'
                }
            },
            //      性别类型
            genderHtml: function (val) {
                if (val==1) {
                    return '男'
                } else if (val==2){
                    return '女'
                }
            },
            getTreeData() {
                let self = this;
                let obj={
                    ifShowSide: "2",
                };
                this.treeLoading=true;
                basicArea(obj).then(res => {
                    self.treeData = res.data;
                    this.treeLoading=false
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                    this.loading = false
                })
            },
            //点击树节点
            handleNodeClick: function (data) {
                let self = this;
                if(data.type== "company"){
                    this.selectedCompanyId=data.id;
                    this.selectedAreaId=""
                }else{
                    this.selectedAreaId=data.id;
                    this.selectedCompanyId=""
                }
                self.handleFilter()
            },
            //获取人员类型
            getIndustryData(type) {
                let self = this;
                let obj={
                    code: type,
                    enable: 1,
                };
                getByCode(obj).then(res => {
                    self.options=res.data.list
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },
            //设置按钮样式
            setBtns(){
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },
            handleReset() {
                this.form={
                    name: '',
                    type: '',
                    idCard: ''
                };
                this.listQuery.page = 1;
                this.getTreeData();
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
                    status:1,
                    companyId:self.selectedCompanyId
                };
                if(this.form.name){
                    obj.name=this.form.name;
                }
                if(this.form.type){
                    obj.type=this.form.type;
                }
                if(this.form.idCard){
                    obj.personNum=this.form.idCard;
                }
                this.loading = true;
                this.editParamsInfo=null;
                getWorker(obj).then(res => {
                    self.list=res.data.list;
                    self.total=res.data.total;
                    this.loading = false
                }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                        this.loading = false
                    })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../enterprise-management/styles/enterpriseInfo';
    /deep/ .el-image__inner, .el-image__placeholder, .el-image__error {
        height: 100%;
        width: 150px;
        margin-bottom: 20px;
    }
    /deep/ .el-image {
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .row-margin{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
    }
    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>
