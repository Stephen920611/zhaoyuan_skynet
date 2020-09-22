<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 0;">
                <!--左边树结构-->
                <el-aside class="aside-wrap all-background" style="margin-bottom: 0;width: 18%">
                    <CommonSubtitle title="资源列表" :isBold="true" style="width: 100%;line-height: 20px;margin-bottom: 10px"></CommonSubtitle>
                    <!--<CommonSubtitle title="资源列表" :isBold="true" style="width: 100%"></CommonSubtitle>-->
                    <!--<el-divider></el-divider>-->
                    <div class="tree-content">
                        <el-tree
                            v-loading="treeLoading"
                            class="filter-tree"
                            :data="treeData"
                            :props="defaultProps"
                            default-expand-all
                            highlight-current
                            :filter-node-method="filterNode"
                            @node-click="handleNodeClick"
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
                                    <el-form-item label="车牌号码：" class="form-inline-search-item">
                                        <el-input
                                                v-model="form.carNum"
                                                placeholder="请输入车牌号"
                                                class="filter-item"
                                                style="width: 95%;"
                                                @keyup.enter.native="handleFilter"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 6 : 6">
                                    <el-form-item label="所属公司：" class="form-inline-search-item">
                                        <el-input
                                                v-model="form.company"
                                                placeholder="请输入所属公司"
                                                class="filter-item"
                                                style="width: 95%;"
                                                @keyup.enter.native="handleFilter"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="this.isSmallBtn ? 8 : 6" v-show="false">
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
                                <el-col :span="this.isSmallBtn ? 12 : 6" class="btns">
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
                    <!-- 表格开始 -->
                    <el-table
                        v-loading="listLoading"
                        :data="list"
                        border
                        fit
                        highlight-current-row
                        class="table-info"
                        height="570"
                    >
                        <el-table-column label="序号" type="index" align="center" width="50">
                            <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="车牌号码" header-align="center" align="center" min-width="40">
                            <template slot-scope="{row}">{{row.carNum}}</template>
                        </el-table-column>
                        <el-table-column label="所属公司" header-align="center" align="center" min-width="80">
                            <template slot-scope="{row}">{{row.companyName}}</template>
                        </el-table-column>
                        <el-table-column label="证件编号" header-align="center" align="center" min-width="50">
                            <template slot-scope="{row}">{{row.licenceCode}}</template>
                        </el-table-column>
                        <el-table-column label="证件有效期" header-align="center" align="center" min-width="70">
                            <template slot-scope="{row}">{{row.endUseTime}}</template>
                        </el-table-column>
                        <el-table-column label="发证机关" header-align="center" align="center" min-width="75">
                            <template slot-scope="{row}">{{row.licenceAuthor}}</template>
                        </el-table-column>
                        <el-table-column label="发证日期" header-align="center" align="center" min-width="70">
                            <template slot-scope="{row}">{{row.givingTime}}</template>
                        </el-table-column>
                        <!--<el-table-column label="状态" header-align="center" align="center" min-width="30">
                            <template slot-scope="{row}">{{row.a7}}</template>
                        </el-table-column>-->
                        <el-table-column label="数据来源" header-align="center" align="center" min-width="40">
                            <template slot-scope="{row}">{{row.source}}</template>
                        </el-table-column>
                        <el-table-column label="备案日期" header-align="center" align="center" min-width="70">
                            <template slot-scope="{row}">{{row.recordTime}}</template>
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
        <el-dialog title="查看" :visible.sync="dialogVisible" v-elDragDialog width="40%" :close-on-click-modal="false">
            <span class="title">基本信息</span>
            <el-divider></el-divider>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">车牌号码：</label></el-col>
                <el-col :span="6" style="margin-right: 50px"><el-input v-model="currentRow.carNum" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">所属公司：</label></el-col>
                <el-col :span="6" ><el-input v-model="currentRow.companyName" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">证件编号：</label></el-col>
                <el-col :span="6" style="margin-right: 50px"><el-input v-model="currentRow.licenceCode" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">证件有效期：</label></el-col>
                <el-col :span="6" ><el-input v-model="currentRow.endUseTime" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">发证机关：</label></el-col>
                <el-col :span="6" style="margin-right: 50px"><el-input v-model="currentRow.licenceAuthor" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">发证日期：</label></el-col>
                <el-col :span="6" ><el-input v-model="currentRow.givingTime" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">数据来源：</label></el-col>
                <el-col :span="6" style="margin-right: 50px"><el-input v-model="currentRow.source" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">备案日期：</label></el-col>
                <el-col :span="6" ><el-input v-model="currentRow.recordTime" :disabled="true"></el-input></el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = !dialogVisible">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {carTransportLicense} from '@/api/industry'
    import {basicArea} from '@/api/industry'
    import elDragDialog from '@/directive/el-drag-dialog'
    export default {
        name: 'TransportCertificateList',
        components: {Pagination,CommonSubtitle},
        directives: {elDragDialog},
        data() {
            return {
                list: [],//列表
                defaultProps: {
                    children: 'nodes',
                    label: 'text'
                },
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
                dialogVisible: false,
                form: {
                    carNum: '',
                    isEnabled: '',    //联合国编号
                    company: ''  //危险编号
                },
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                treeData: [],
                selectedCompanyId:"",
                selectedAreaId:"",
                treeLoading:false,
                currentRow:{},
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
            seeDetail(row){
                this.dialogVisible=true
                this.currentRow=row
            },
            getTreeData() {
                let self = this
                //this.loading = true
                let obj={
                    ifShowSide: "2"
                }
                this.treeLoading=true
                basicArea(obj).then(res => {
                    this.treeLoading=false
                    self.treeData = res.data
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
                    this.selectedCompanyId=data.id
                    this.selectedAreaId=""
                }else{
                    this.selectedAreaId=data.id
                    this.selectedCompanyId=""
                }
                this.getList()
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
                    company: '',
                    isEnabled: ''
                }
                this.selectedCompanyId=""
                this.selectedAreaId = ''
                this.getTreeData()
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
                if(this.form.carNum){
                    obj.carNum=this.form.carNum;
                }
                if(this.form.isEnable){
                    obj.status=this.form.isEnable;
                }
                if(this.form.company){
                    obj.companyName=this.form.company;
                }
                if(this.selectedAreaId){
                    obj.areaId=this.selectedAreaId;
                }
                if(this.selectedCompanyId){
                    obj.companyId=this.selectedCompanyId;
                }
                this.loading = true
                carTransportLicense(obj).then(res => {
                    self.list=res.data.list
                    self.total=res.data.total
                    this.loading = false
                })
                    .catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                        this.loading = false
                    })
            },

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
