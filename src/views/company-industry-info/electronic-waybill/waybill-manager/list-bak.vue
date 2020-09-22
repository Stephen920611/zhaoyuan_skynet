<template>
    <div class="app-container">
        <el-container>
            <el-main style="padding: 10px;">
                <div class="text item">
                    <!--左边树结构-->
                    <!--<el-aside class="aside-wrap" style="margin-bottom: 0;width: 18%">
                        <el-input
                            placeholder="输入关键字进行过滤"
                            v-model="filterText"
                            style="margin-bottom: 6px;">
                        </el-input>
                        <div class="tree-wrap" v-scrollBar>
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
                    </el-aside>-->

                    <el-container class="container-wrap">
                        <el-header class="header-wrap" style="height: 102px;position: relative" v-scrollBar>
                            <el-row style="width: 100%;margin-bottom: 10px">

                                <el-col :span="7" class="search-wrap">
                                    <div class="input-suffix">
                                        <el-col style="margin-top: 7px;width:100px"><span class="label-name font-size-14 float-right">运单编号：</span>
                                        </el-col>
                                        <el-col :span="14">
                                            <el-input
                                                style="float: left"
                                                placeholder="请输入运单编码"
                                                v-model="code"
                                                @keyup.enter.native="handleFilter">
                                            </el-input>
                                        </el-col>

                                    </div>
                                </el-col>

                                <el-col :span="7" class="search-wrap">
                                    <div class="input-suffix">
                                        <el-col style="margin-top: 7px;width:80px;"><span class="label-name font-size-14 float-right">车牌号：</span>
                                        </el-col>
                                        <el-col :span="15">
                                            <el-input
                                                style="float: left"
                                                placeholder="请输入车牌号"
                                                v-model="plate"
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
                                    >
                                        检索
                                    </el-button>
                                    <el-button
                                               class="filter-item"
                                               icon="el-icon-refresh"
                                               @click="handleReset">重置</el-button>
                                   <!-- <el-button
                                        class="filter-item"
                                        style="margin-left: 10px;"
                                        icon="el-icon-bottom"
                                        @click="handleReset"
                                    >
                                        导出
                                    </el-button>-->
                                </el-col>

                            </el-row>

                            <el-row style="width: 100%">
                                <el-col :span="24" class="search-wrap">
                                    <div class="input-suffix">
                                        <el-col  style="margin-top: 7px;width: 100px">
                                            <span class="label-name font-size-14 float-right">状态：</span>
                                        </el-col>
                                        <el-col style="width:calc(100% - 100px)">
                                            <el-radio v-model="checkedStatus" :label="index+1" border v-for="(status, index) in state" style="margin-right: 5px">{{status}}</el-radio>
                                        </el-col>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-header>

                        <!-- 表格开始 -->
                        <el-main>

                            <el-row style="width: 100%;margin-bottom: 10px">
                                <el-col :span="3" class="btns" style="float: left">
                                    <el-button type="primary" size="medium"
                                               icon="el-icon-folder-add"
                                               class="filter-item"
                                               @click="addWaybill"
                                                v-show="showOperateBtn">新 增</el-button>
                                    <el-button type="danger" size="medium"
                                               @click="deleteWaybill"
                                               icon="el-icon-delete"
                                               v-show="showOperateBtn">作 废</el-button>
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
                                <el-table-column label="序号" type="index" align="center" width="60px">
                                    <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="运单编号" header-align="center" align="center" min-width="55">
                                    <template slot-scope="{row}">{{row.wayBillNo}}</template>
                                </el-table-column>
                                <el-table-column label="车牌号码" header-align="center" align="center" min-width="30">
                                    <template slot-scope="{row}">{{row.carNo}}</template>
                                </el-table-column>
                                <el-table-column label="驾驶员姓名" header-align="center" align="center" min-width="35">
                                    <template slot-scope="{row}">{{row.driverNameArray.join(',')}}</template>
                                </el-table-column>
                                <el-table-column label="承运方单位名称" header-align="center" align="center" min-width="70">
                                    <template slot-scope="{row}">{{row.carrierCompanyName}}</template>
                                </el-table-column>
                                <el-table-column label="收货方单位名称" header-align="center" align="center" min-width="70">
                                    <template slot-scope="{row}">{{row.receiverCompanyName}}</template>
                                </el-table-column>
                                <el-table-column label="危险货物名称" header-align="center" align="center" min-width="40">
                                    <template slot-scope="{row}">{{row.cargoName}}</template>
                                </el-table-column>
                                <el-table-column label="数量" header-align="center" align="center" min-width="20">
                                    <template slot-scope="{row}">{{row.cargoNum}}</template>
                                </el-table-column>
                                <!--<el-table-column label="应急联系电话" header-align="center" align="center" min-width="40">
                                    <template slot-scope="{row}">{{row.emergencyTelephone}}</template>
                                </el-table-column>-->
                                <el-table-column label="运单状态" header-align="center" align="center" min-width="30">
                                    <template slot-scope="scope">
                                        <span v-html="statusHtml(scope.row.wayBillStatus)"></span>
                                    </template>
                                </el-table-column>
                                <!-- 操作 -->
                                <el-table-column
                                    label="操作"
                                    align="center"
                                    width="70"
                                    class-name="small-padding fixed-width"
                                >
                                    <template slot-scope="{row}">
                                        <i class="icon iconfont iconchakan" title="查看" @click="seeDialog(row)"></i>
                                        <!--<i class="icon iconfont iconchuli" :class="(row.wayBillStatus!=3&&row.wayBillStatus!=5&&row.wayBillStatus!=6&&row.wayBillStatus)?'':'hide-icon'" title="处理" @click="taskAssignmentDialog(row)"></i>-->
                                    </template>
                                </el-table-column>
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
        <!--查看的dialog-->
        <el-dialog title="电子运单详情" :visible.sync="dialogVisible"  width="76%" :close-on-click-modal="false" append-to-body v-elDragDialog>
            <see-detail :editParamsInfo="editParamsInfo"></see-detail>
        </el-dialog>
        <!--新增的dialog-->
        <el-dialog title="新增电子运单" :visible.sync="addWaybillShow"  width="78%" :close-on-click-modal="false" append-to-body v-elDragDialog @open="openAddWayBillDialog" @close="closeAddWayBillDialog">
            <add-waybill v-on:showHiddenAdd="showHiddenAdd" ref="addWayBill"></add-waybill>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/Subtitle/CommonSubtitle.vue'
    import {basicArea,getValidLicence} from '@/api/industry'
    import {eleWaybillDelete,saveOrUpdate} from '@/api/industry'
    import {eleWaybill,checkUserOperation} from '@/api/industry'
    import elDragDialog from '@/directive/el-drag-dialog'
    import SeeDetail from './components/see-detail.vue'
    import AddWaybill from './components/add-waybill'
    export default {
        name: 'OrderTrackList',
        components: {AddWaybill, SeeDetail, Pagination,CommonSubtitle},
        directives: {elDragDialog},
        data() {
            return {
                dialogVisible: false,
                transportShow:false,
                loadingShow:false,
                dumpShow:false,
                wayBillNoTitle:"",
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                code:"",
                plate:"",
                total:0,
                list: [],
                listQuery: {
                    page: 1,
                    size: 10,
                },
                checkedStatus:"",
                state:["运单填报","等待装车","运输途中","等待卸车","运输完成"],
                filterText: '',
                treeData: [],
                defaultProps: {
                    children: 'nodes',
                    label: 'text'
                },
                editParamsInfo:{},
                addWaybillShow:false,
                selectedCompanyName:"",
                displayFlag:false,
                currentRow:null,
                treeLoading:false,
                userInfo:null,  //登录用户的信息
                showOperateBtn:true,  //显示“新增”和“作废”按钮，默认不显示
                driverNameArr:[],  //驾驶员姓名的数组
            };
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            let self = this;
            //默认执行
            this.setBtns();
            window.onresize=function(){
                self.setBtns();
            };
            //获取用户信息
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            //判断登录用户所属企业是否有运输资质，若是没有则不允许新增或者作废运单
            this.judgeCompanyQuality();

//            this.getTreeData();
            this.getList();
        },
        methods: {
            /**
             * 判断登录用户所属企业是否有运输资质
             * licenceType（String）:危化品道路运输资质:1,危化品安全生产资质:2,危化品经营存储资质:
             */
            judgeCompanyQuality(){
                const param = { companyId:this.userInfo.companyId,licenceType:1 };
                getValidLicence(param).then(res=>{
                    this.showOperateBtn = res.data;
//                    this.showOperateBtn = true;  //测试使用
                });
            },

            //删除电子运单
            deleteWaybill() {
                let self=this;
                if(!this.currentRow){
                    this.$message({message: '请选择需要删除的电子运单', type: 'warning'});
                    return false
                }
                //权限判断：只有该用户作为托运方发起运单，并且状态为“运单发起”才可删除
                if(!(this.currentRow.carrierCompanyId == this.userInfo.companyId && this.currentRow.wayBillStatus == 1)){
                    this.$message({message: '该运单不是自己发起的，不可删除！', type: 'warning'});
                    return false
                }
                //符合删除条件后，可删除
                let obj={id:this.currentRow.id,status:0};
                this.$confirm('此操作将该电子运单作废, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    saveOrUpdate(obj).then(res => {
                        self.$message({ showClose: true, message: '操作成功！', type: 'success'});
                        self.getList();
                    }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                    })
                })
            },
            //获取table选中的当前行
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            //关闭新增界面并刷新？不刷新
            showHiddenDump: function (data, refresh) {
                let self = this;
                this.dumpShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            //      关闭新增界面并刷新？不刷新
            showHiddenLoading: function (data, refresh) {
                let self = this;
                this.loadingShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            //      关闭新增界面并刷新？不刷新
            showHiddenTask: function (data, refresh) {
                let self = this;
                this.transportShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            //      关闭新增界面并刷新？不刷新
            showHiddenAdd: function (data, refresh) {
                let self = this;
                this.addWaybillShow = data;
                if (refresh) {
                    self.getList();
                }
            },
            //点击树节点
            handleNodeClick: function (data) {
                let self = this;
                console.log("data",data)
                if(data.type== "company"){
                    this.selectedCompanyName=data.text
                }else{
                    this.selectedCompanyName=""
                }
            },
            //新增电子运单
            addWaybill(){
                this.addWaybillShow=true
            },
            //查看详情
            seeDialog(row){
                this.dialogVisible=true;
                this.editParamsInfo=row
            },
            //处理电子运单
            taskAssignmentDialog(row){
                let userInfo=JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value
                let obj={roleId:userInfo.roleId,powerCode:"editEleWayBill"}
                checkUserOperation(obj).then(res => {
                    if(!res.data){
                        this.$message({
                            showClose: true,
                            message: '您没有操作权限！'
                        });
                    }else {
                        if(row.wayBillStatus==1){
                            this.transportShow=true
                        }else if(row.wayBillStatus==2){
                            this.loadingShow=true
                        }else if(row.wayBillStatus==4){
                            this.dumpShow=true
                        }else{
                            this.displayFlag=true
                        }
                        this.editParamsInfo=row
                    }
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            handleReset() {
                this.code = '';
                this.plate = '';
                this.listQuery.page = 1;
                this.getTreeData();
                this.selectedCompanyName="";
                this.checkedStatus = '';
                this.getList()
            },
            //      报警是否开启 显示文字格式化
            statusHtml: function (val) {
                let statusName = '';
                switch(val){
                    case 1:
                        statusName = '运单填报';
                        break;
                    case 2:
                        statusName = '等待装车';
                        break;
                    case 3:
                        statusName = '运输途中';
                        break;
                    case 4:
                        statusName = '等待卸车';
                        break;
                    case 5:
                        statusName = '运输完成';
                        break;
                }
                return statusName;
            },
            getList(){
                let self = this;
                self.currentRow = null;
                let obj={
                    page:self.listQuery.page,
                    size:self.listQuery.size,
                    companyId:self.userInfo.companyId,
                    status:1
                };
                if(self.code){
                    obj.wayBillNo=self.code;
                }
                if(this.plate){
                    obj.carNo=self.plate;
                }
                if(this.selectedCompanyName){
                    obj.companyName=self.selectedCompanyName;
                }
                if(this.checkedStatus){
                    obj.wayBillStatus=self.checkedStatus;
                }
                this.listLoading = true;
                eleWaybill(obj).then(res => {
                    res.data.list.map(item=>{
                        item.driverNameArray = [];
                        item.driverInfo.map(ktem=>{
                            item.driverNameArray.push(ktem.name)
                        })
                    })
                    self.list=res.data.list;
                    self.total=res.data.total;

                    this.listLoading = false
                }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                        this.loading = false
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
            getTreeData() {
                let self = this
                //this.loading = true
                let obj={
                    ifShowSide: "2"
                }
                this.treeLoading=true
                basicArea(obj).then(res => {
                    self.treeData = res.data
                    this.treeLoading=false
                }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                        this.loading = false
                    })
            },
            //打开新增电子运单的窗口
            openAddWayBillDialog(){
                this.$nextTick(()=>{
                    this.$refs.addWayBill.fillInFormByUser();
                });

            },
            //关闭新增电子运单的窗口
            closeAddWayBillDialog(){
                this.$nextTick(()=>{
                    this.$refs.addWayBill.resetForm('ruleForm')
                });

            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../waybill-manager/styles/waybillManager';
</style>
