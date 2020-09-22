<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 0;">
                <!--左边树结构-->
                <el-aside class="aside-wrap all-background" style="margin-bottom: 0;width: 18%">
                    <CommonSubtitle title="资源列表" :isBold="true" style="width: 100%;line-height: 20px;margin-bottom: 10px"></CommonSubtitle>
                    <div class="tree-content">
                        <el-tree
                            class="filter-tree"
                            :data="treeData"
                            :props="defaultProps"
                            default-expand-all
                            highlight-current
                            :filter-node-method="filterNode"
                            @node-click="handleNodeClick"
                            v-loading="treeLoading"
                            ref="tree">
                              <span class="ellipsis-l1 font-size-14" :title="node.label"  slot-scope="{node,data}" >
                                  {{node.label}}
                              </span>
                        </el-tree>
                    </div>
                </el-aside>
                <div class="right-panel all-background">
                    <div class="filter-container">
                        <el-form :inline="true" :model="form" class="form-inline-search">
                            <el-row>
                                <el-col :span="this.isSmallBtn ? 6 : 6">
                                    <el-form-item label="公司名称：" class="form-inline-search-item">
                                        <el-input
                                                v-model="form.name"
                                                placeholder="请输入公司名称"
                                                class="filter-item"
                                                style="width: 95%;"
                                                @keyup.enter.native="handleFilter"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 6">
                                    <el-form-item label="状态选择：" class="form-inline-search-item">
                                        <el-select v-model="form.isEnable" class="filter-item"
                                                   placeholder="请选择状态">
                                            <el-option
                                                    v-for="item in isEnabled"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 20 : 12" class="btns">
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
                            <el-table-column label="业户姓名" header-align="center" align="center" min-width="60">
                                <template slot-scope="{row}">{{row.header}}</template>
                            </el-table-column>
                            <el-table-column label="公司名称" header-align="center" align="center" min-width="100">
                                <template slot-scope="{row}">{{row.companyName}}</template>
                            </el-table-column>
                            <el-table-column label="证件编号" header-align="center" align="center" min-width="65">
                                <template slot-scope="{row}">{{row.licenceCode}}</template>
                            </el-table-column>
                            <el-table-column label="发证机关" header-align="center" align="center" min-width="100">
                                <template slot-scope="{row}">{{row.licenceAuthor}}</template>
                            </el-table-column>
                            <el-table-column label="发证日期" header-align="center" align="center" min-width="90">
                                <template slot-scope="{row}">{{row.givingTime}}</template>
                            </el-table-column>
                            <el-table-column label="证件有效期" header-align="center" align="center" min-width="90">
                                <template slot-scope="{row}">{{row.endUseTime}}</template>
                            </el-table-column>
                            <el-table-column label="状态" header-align="center" align="center" min-width="40">
                                <template slot-scope="scope" >
                                    <span v-html="statusHtml(scope.row.status)"></span>
                                </template>
                            </el-table-column>
                            <el-table-column label="数据来源" header-align="center" align="center" min-width="50">
                                <template slot-scope="{row}">{{row.source}}</template>
                            </el-table-column>
                            <el-table-column label="备案日期" header-align="center" align="center" min-width="90">
                                <template slot-scope="{row}">{{row.recordTime}}</template>
                            </el-table-column>
                            <!-- 操作 -->
                            <el-table-column
                                label="操作"
                                align="center"
                                width="65"
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
                </div>
            </el-main>
        </el-container>
        <!--查看-->
        <el-dialog title="查看" :visible.sync="dialogVisible" v-elDragDialog width="40%" :close-on-click-modal="false">
            <span class="title">基本信息</span>
            <el-divider></el-divider>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">业户姓名：</label></el-col>
                <el-col :span="6" style="margin-right: 50px"><el-input v-model="currentRow.header" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">公司名称：</label></el-col>
                <el-col :span="6" ><el-input v-model="currentRow.companyName" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">证件编号：</label></el-col>
                <el-col :span="6" style="margin-right: 50px"><el-input v-model="currentRow.licenceCode" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">发证机关：</label></el-col>
                <el-col :span="6" ><el-input v-model="currentRow.licenceAuthor" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">发证日期：</label></el-col>
                <el-col :span="6" style="margin-right: 50px"><el-input v-model="currentRow.givingTime" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">证件有效期：</label></el-col>
                <el-col :span="6" ><el-input v-model="currentRow.endUseTime" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">状态：</label></el-col>
                <el-col :span="6" style="margin-right: 50px"><el-input v-model="currentRow.statusName" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">数据来源：</label></el-col>
                <el-col :span="6" ><el-input v-model="currentRow.source" :disabled="true"></el-input></el-col>
            </el-row>
           <!-- <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">备案日期：</label></el-col>
                <el-col :span="6" style="margin-right: 50px"><el-input :disabled="true"></el-input></el-col>
            </el-row>-->
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = !dialogVisible">关 闭</el-button>
            </div>
        </el-dialog>
        <!--新增的dialog-->
        <el-dialog title="新增" :visible.sync="addShow"  width="850px" :close-on-click-modal="false" append-to-body>
            <add-company v-on:showHiddenAdd="showHiddenAdd" :selectedCompanyId="selectedCompanyId" :selectedCompanyName="selectedCompanyName"></add-company>
        </el-dialog>
        <el-dialog title="编辑" :visible.sync="editShow"  width="850px" :close-on-click-modal="false" append-to-body>
            <edit-company v-on:showHiddenAdd="showHiddenEdit" :editParamsInfo="editParamsInfo"></edit-company>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import elDragDialog from '@/directive/el-drag-dialog'
    import {companyQuality} from '@/api/industry'
    import {basicArea,companyLicenceDelete} from '@/api/industry'
    import addCompany from './components/add-company.vue'
    import editCompany from './components/edit-company.vue'
    export default {
        name: 'CompanyQualifyList',
        components: {Pagination,CommonSubtitle,addCompany,editCompany},
        directives: {elDragDialog},
        data() {
            return {
                list: [],//列表
                isEnabled:[
                    {'label':'全部',value:null},
                    {'label':'有效',value:1},
                    {'label':'无效',value:2}
                ],
                total: 1,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                defaultProps: {
                    children: 'nodes',
                    label: 'text'
                },
                dialogVisible: false,
                form: {
                    name: '',
                    isEnable: '',
                },
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                //树数据
                treeData: [],
                selectedCompanyId:"",
                selectedCompanyName:"",
                selectedAreaId:"",
                treeLoading:false,
                currentRow:{},
                addShow:false,
                editShow:false,
                editParamsInfo:null,
            }
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize=function(){
                self.setBtns();
            }
            this.getList();
            this.getTreeData()
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            //删除
            deleteParameterFunc(){
                let self=this;
                if(!this.editParamsInfo){
                    this.$message({
                        message: '请选择编辑数列',
                        type: 'warning'
                    });
                    return
                }
                let obj={
                    id:this.editParamsInfo.id
                }
                this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    companyLicenceDelete(obj).then(res => {
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
                this.editParamsInfo = val;
            },
            editCompanyShow(){
                if(!this.editParamsInfo){
                    this.$message({
                        message: '请选择编辑数列',
                        type: 'warning'
                    });
                    return
                }
                this.editShow=true
                if (this.editParamsInfo.status==1) {
                    this.editParamsInfo.statusName= '有效'
                } else {
                    this.editParamsInfo.statusName= '无效'
                }
            },
            addCompanyShow(){
                if(!this.selectedCompanyId){
                    this.$message({
                        message: '请选择添加资质的公司！',
                        type: 'warning'
                    });
                    return
                }
                this.addShow=true
            },
            //      关闭新增界面并刷新？不刷新
            showHiddenAdd: function (data, refresh) {
                let self = this;
                this.addShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            //      关闭新增界面并刷新？不刷新
            showHiddenEdit: function (data, refresh) {
                let self = this;
                this.editShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            getTreeData() {
                let self = this
                //this.loading = true
                let obj={
                    ifShowSide: "2"
                }
                this.treeLoading=true;
                this.selectedCompanyId=null
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
                console.log("data",data)
                if(data.type== "company"){
                    self.selectedCompanyId=data.id
                    self.selectedCompanyName=data.text
                    self.selectedAreaId=""
                }else{
                    self.selectedAreaId=data.id
                    self.selectedCompanyId=""
                }
                this.getList()
            },
            seeDetail(row){
                this.dialogVisible=true
                this.currentRow=row
                if (row.status==1) {
                    this.currentRow.statusName= '有效'
                } else {
                    this.currentRow.statusName= '无效'
                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },
            //      报警是否开启 显示文字格式化
            statusHtml: function (val) {
                if (val==1) {
                    return '有效'
                } else {
                    return '无效'
                }
            },
            //设置按钮样式
            setBtns(){
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            handleReset() {
                this.form={
                    name: '',
                    isEnable: '',
                }
                this.getTreeData()
                this.selectedCompanyId=""
                this.selectedAreaId = ''
                this.listQuery.page = 1
                this.getList()
            },
            getList(){
                let self = this;
                let obj={
                    page:self.listQuery.page,
                    size:self.listQuery.size,
                }
                if(this.form.name){
                    obj.companyName=this.form.name;
                }
                if(this.form.isEnable){
                    obj.status=this.form.isEnable;
                }
                if(this.selectedAreaId){
                    obj.areaId=this.selectedAreaId;
                }
                if(this.selectedCompanyId){
                    obj.companyId=this.selectedCompanyId;
                }
                this.listLoading = true
                companyQuality(obj).then(res => {
                    self.list=res.data.list
                    self.total=res.data.total
                    let chemicaId=[];
                    self.list.map(item=>{
                        chemicaId=[]
                        item.companyLicenceChemica.map(item=>{
                            chemicaId.push(item.chemicaId)
                        });
                        item.chemicaId=chemicaId
                    });
                    this.listLoading = false
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

<style lang="scss" scoped type="text/scss">
    @import '../styles/enterpriseInfo';
    .el-form-item{
        margin-bottom: 0;
    }
    //搜索条件样式
    .form-inline-search {
        .form-inline-search-item {
            width: 100%;
            /deep/ .el-form-item__content {
                width: calc(100% - 100px);
            }
        }

    }
</style>
