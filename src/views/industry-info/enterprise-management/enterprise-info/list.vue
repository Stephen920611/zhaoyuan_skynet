<template>
    <div class="app-container">
        <el-row ref="container">
            <!--左边树结构-->
            <el-col :span="5" class="left-panel all-background" style="margin-bottom: 0" ref="leftContainer" v-show="isShowLeftPanel">
                <CommonSubtitle title="资源列表" :isBold="true" style="line-height: 10px"></CommonSubtitle>
                <div class="tree-wrap">
                    <region-tree :data="treeData" :loading="treeLoading" ref="regionTree" @node-click="handleNodeClick"></region-tree>
                </div>
            </el-col>
            <el-col :span="isShowLeftPanel?19:24" class="right-panel">
                <div class="all-background">
                    <!--搜索条件-->
                    <div class="filter-container">
                        <el-form :inline="true" :model="form" class="demo-form-inline">
                            <!--<el-form-item label="企业类型:">
                                <el-select v-model="form.type" filterable placeholder="企业类型">
                                    <el-option
                                            v-for="item in typeOptions"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value"
                                            @change="handleFilter">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所属行业:">
                                <el-select v-model="form.belong" filterable placeholder="所属行业">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value"
                                            @change="handleFilter">
                                    </el-option>
                                </el-select>
                            </el-form-item>-->
                            <el-form-item label="企业名称:">
                                <el-input
                                        v-model="form.companyName"
                                        style="float: left"
                                        placeholder="请输入企业名称"
                                        @keyup.enter.native="handleFilter">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="企业状态:">
                                <el-select v-model="form.businessStatus" filterable placeholder="企业状态">
                                    <el-option
                                            v-for="item in businessStatus"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                        class="filter-item"
                                        type="primary"
                                        icon="el-icon-search"
                                        style="margin-left: 10px;"
                                        @click.native="handleFilter">搜索
                                </el-button>
                                <el-button
                                        class="filter-item"
                                        style="margin-left: 10px;"
                                        icon="el-icon-refresh"
                                        @click="handleReset">重置
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div>
                        <el-row style="width: 90%;margin-bottom: 10px;margin-left: 30px">
                            <el-col style="width: 90px;margin-right: 10px">
                                <el-button type="primary" icon="el-icon-document-add" @click="addCompanyShow">新 增</el-button>
                            </el-col>
                            <el-col style="width: 90px;margin-right: 10px">
                                <el-button type="primary" icon="el-icon-edit" @click="editCompanyShow">编 辑</el-button>
                            </el-col>
                            <el-col style="width: 90px;margin-right: 10px">
                                <el-button type="danger" icon="el-icon-delete" @click="deleteParameterFunc">删 除</el-button>
                            </el-col>
                        </el-row>
                        <!-- 表格开始 -->
                        <el-table
                                v-loading="listLoading"
                                :data="list"
                                border
                                fit
                                highlight-current-row
                                class="table-info"
                                @current-change="handleCurrentChange"
                                height="570px"
                        >
                            <el-table-column label="序号" type="index" align="center" width="50px">
                                <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                                </template>
                            </el-table-column>
                            <el-table-column label="企业名称" header-align="center" align="center" min-width="70">
                                <template slot-scope="{row}">{{row.companyName}}</template>
                            </el-table-column>
                            <el-table-column label="所属行业" header-align="center" align="center" min-width="35">
                                <template slot-scope="{row}">{{row.industryName}}</template>
                            </el-table-column>
                            <el-table-column label="行政区划" header-align="center" align="center" min-width="40">
                                <template slot-scope="{row}">{{row.areaName}}</template>
                            </el-table-column>
                            <el-table-column label="企业类型" header-align="center" align="center" min-width="75">
                                <template slot-scope="{row}">{{row.companyTypeName.join('，')}}</template>
                            </el-table-column>
                            <el-table-column label="企业状态" header-align="center" align="center" min-width="40">
                                <template slot-scope="{row}">{{row.businessStatusName}}</template>
                            </el-table-column>
                            <!--<el-table-column label="法定代表人" header-align="center" align="center" min-width="40">
                                <template slot-scope="{row}">{{row.enterpriseLegalPerson}}</template>
                            </el-table-column>-->
                            <el-table-column label="主要负责人姓名" header-align="center" align="center" min-width="40">
                                <template slot-scope="{row}">{{row.header}}</template>
                            </el-table-column>
                            <el-table-column label="主要负责人联系电话" header-align="center" align="center" min-width="50">
                                <template slot-scope="{row}">{{row.headerPhone}}</template>
                            </el-table-column>
                            <!-- 操作 -->
                            <el-table-column
                                    label="操作"
                                    align="center"
                                    width="80"
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
                            @pagination="getCompanyData"
                    />
                </div>
            </el-col>
        </el-row>
        <!--修改的dialog-->
        <el-dialog title="查看" :visible.sync="dialogVisible" v-elDragDialog width="80%" :close-on-click-modal="true" append-to-body @open="openDetailDialog" @close="closeDetailDialog">
            <eye-detail ref="eyeDetail" v-if="initDetailPage" :showHiddenAdd="showHiddenAdd" :data="companyInfoData" :companyId="selectCompanyId" :companyName="selectCompanyName"></eye-detail>
        </el-dialog>
        <!--新增的dialog-->
        <el-dialog title="新增" :visible.sync="addDialogShow" v-elDragDialog width="82%" :close-on-click-modal="false" append-to-body @open="openAddDialog" @close="closeAddDialog">
            <add-company ref="addCompany" v-if="initAddPage"></add-company>
        </el-dialog>
        <el-dialog title="编辑" :visible.sync="editDialogShow" v-elDragDialog width="82%" :close-on-click-modal="false" append-to-body @open="openEditDialog" @close="closeEditDialog">
            <edit-company ref="editCompany" :data="companyInfoData" v-if="initEditPage" :companyId="selectCompanyId" :companyName="selectCompanyName"></edit-company>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import elDragDialog from '@/directive/el-drag-dialog'
    import {getCompanyList,basicArea,getByCode,companyDelete,getCompanyDetailInfo,companySaveOrUpdate} from '@/api/industry'
    import addCompany from './components/add/add-company.vue'
    import editCompany from './components/edit/edit-company.vue'
    import eyeDetail from './components/detail/eye-detail.vue'
    import regionTree from '../../components/regionTree.vue'
    export default {
        name: 'waybill',
        components: {Pagination,CommonSubtitle,addCompany,editCompany,eyeDetail,regionTree},
        directives: {elDragDialog},
        data() {
            return {
                isShowLeftPanel:true,  //是否显示左侧面板
                defaultProps: {
                    children: 'nodes',
                    label: 'text'
                },
                listQuery: {
                    page: 1,
                    size: 10,
                },
                form: {
                    companyName: '',
                    businessStatus: '',
                },
                listLoading: false,
                total:1,
                businessStatus:[],  //企业营业状态

                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                dialogVisible:false,
                list: [],//列表
                treeData: [],
                treeLoading:false,
                selectedAreaId:null,
                options:[],
                typeOptions:[],
                currentRow:null,
                addDialogShow:false,
                editDialogShow:false,
                initAddPage:false, //初始化新增页面
                initEditPage:false, //初始化编辑页面
                initDetailPage:false, //初始化详情页面
                companyInfoData:null, //选择某一行企业信息的详情数据
                selectCompanyId:null,
                selectCompanyName:null,
                userInfo:null,  //登录用户的信息
            }
        },
        created() {
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            //默认执行
            this.setBtns();
            this.dictionary();
            this.getCompanyData();
            this.getTreeData();
            this.getIndustryData("INDUSTRY");
            this.getIndustryData("COMPANY_TYPE");
        },
        methods: {
            //获取字典表对应的字段
            dictionary(){
                getByCode({code: 'COMPANY_BUSINESS_STATUS', enable: 1}).then(res=>{
                    this.businessStatus = [];
                    res.data.list.map(item=>{
                        this.businessStatus.push(item);
                    })
                })
            },

            //选中表中的一行数据
            handleCurrentChange(val) {
                if(val){
                    this.currentRow = val;
                    this.selectCompanyId = this.currentRow.id;
                    this.selectCompanyName = this.currentRow.companyName;
                    //获取所选中的企业信息
                    getCompanyDetailInfo({id:this.currentRow.id}).then(res=>{
                        if(res.code == '1000'){
                            this.companyInfoData = res.data;
                        }
                    });
                }
            },
            //编辑
            editCompanyShow(){
                if(!this.currentRow){
                    this.$message({
                        message: '请选择编辑的企业',
                        type: 'warning'
                    });
                    return
                }
                this.editDialogShow=true;


            },
            addCompanyShow(){
                this.addDialogShow=true
            },
            //  关闭新增界面并刷新？不刷新
            showHiddenAdd: function (data, refresh) {
                let self = this;
                this.addDialogShow = data;
                if (refresh) {
                    self.getCompanyData();
                }
            },
            //  关闭新增界面并刷新？不刷新
            showHiddenEdit: function (data, refresh) {
                let self = this;
                this.editDialogShow = data;
                if (refresh) {
                    self.getCompanyData();
                }
            },
            //      企业类型
            typeHtml: function (val) {
                if (val==1) {
                    return '运输企业'
                } else if (val==2){
                    return '港口企业'
                } else if (val==3){
                    return '其他企业'
                }
            },
            //搜索
            handleFilter() {
                this.listQuery.page = 1;
                this.getCompanyData()
            },
            //重置
            handleReset() {
                this.getTreeData();
                this.form.companyName = '';
                this.form.businessStatus = '';
                this.selectedAreaId = null;
                this.listQuery.page = 1;
                this.getCompanyData();
            },
            //删除
            deleteParameterFunc(){
                if(!this.currentRow){
                    this.$message({
                        message: '请选择需要刪除的企业！',
                        type: 'warning'
                    });
                    return
                }
                this.$confirm('此操作将删除该企业, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    companySaveOrUpdate({id:this.currentRow.id,status:0}).then(res => {
                        this.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.getCompanyData();
                    }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                    })
                })
            },
            getIndustryData(type) {
                let self = this
                let obj={
                    code: type,
                    enable: 1,
                }
                getByCode(obj).then(res => {
                    if(type=="INDUSTRY"){
                        self.options=res.data.list
                    }else {
                        self.typeOptions=res.data.list
                    }
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            seeDetail(row){
                this.dialogVisible=true
                this.currentRow=row
            },
            getTreeData() {
                let self = this
                //this.loading = true
                let obj={
                    ifShowSide: "2",
                    ifShowCompany: "2"
                };
                this.treeLoading=true;
                basicArea(obj).then(res => {
                    self.treeData = res.data
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
                    this.selectedAreaId = null;
                }else{
                    this.selectedAreaId=data.id;
                }
                self.handleFilter()
            },
            //获取公司列表数据
            getCompanyData() {
                let self = this;
                this.currentRow = null;
                const obj = Object.assign(this.listQuery,this.form);
                const keys = Object.keys(obj);
                for(let key of keys){
                    if(obj[key] == ''){
                        delete obj[key];
                    }
                }
                if(this.selectedAreaId){
                    obj.areaId = this.selectedAreaId;
                }else{
                    delete obj.areaId;
                }
                this.listLoading = true;
                this.editParamsInfo = null;
                obj.status = 1;
//                obj.companyId = this.userInfo.companyId;
                getCompanyList(obj).then(res => {
                    self.list=res.data.list;
                    self.total=res.data.total
                    this.listLoading = false
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            //设置按钮样式
            setBtns(){
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },
            //关闭“新增”弹窗，清除表单数据
            openAddDialog(){
                this.initAddPage = true;
            },
            closeAddDialog(){
                this.initAddPage = false;
                this.getCompanyData();
            },
            //关闭“编辑”弹窗
            openEditDialog(){
                this.initEditPage = true;
            },
            closeEditDialog(){
                this.initEditPage = false;
                this.getCompanyData();
            },
            //关闭“详情”弹窗
            openDetailDialog(){
                this.initDetailPage = true;
            },
            closeDetailDialog(){
                this.initDetailPage = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .row-margin{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
    }
    @import '../../enterprise-management/styles/enterpriseInfo';
</style>
