<template>
    <div class="app-container">
        <el-row ref="container">
            <!--左边树结构-->
            <el-col :span="5" class="left-panel all-background" style="margin-bottom: 0" ref="leftContainer" v-if="false"
                 v-show="isShowLeftPanel">
                <CommonSubtitle title="资源列表" :isBold="true" style="line-height: 10px"></CommonSubtitle>
                <div class="tree-wrap">
                    <region-tree :data="treeData" :loading="treeLoading" ref="regionTree"
                                 @node-click="handleNodeClick"></region-tree>
                </div>
            </el-col>
            <el-col :span="isShowLeftPanel?19:24" class="right-panel">
                <div class="all-background">
                    <!--搜索条件-->
                    <div class="filter-container">
                        <el-form :inline="true" :model="form" class="form-inline">
                            <el-form-item label="车牌号码:">
                                <el-input
                                        style="float: left"
                                        placeholder="请输入车牌号码"
                                        v-model="form.carNum"
                                        @keyup.enter.native="handleFilter">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="车辆类型:">
                                <el-select v-model="form.carType" filterable placeholder="请选择车辆类型">
                                    <el-option
                                            v-for="item in carTypeOptions"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="运输证状态:">
                                <el-select v-model="form.transportStatus" filterable placeholder="请选择运输证状态">
                                    <el-option
                                            v-for="item in licenceStatusOptions"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value"
                                    >
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
                                <el-button type="primary" icon="el-icon-document-add" @click="addCarBaseInfo">新 增
                                </el-button>
                            </el-col>
                            <el-col style="width: 90px;margin-right: 10px">
                                <el-button type="primary" icon="el-icon-edit" @click="editVehicleShow">编 辑</el-button>
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
                                class="table-info"
                                height="570"
                                @current-change="handleCurrentChange"
                        >
                            <el-table-column label="序号" type="index" align="center" width="60px">
                                <template slot-scope="row">{{ (listQuery.page - 1) * listQuery.size + row.$index + 1 }}
                                </template>
                            </el-table-column>
                            <el-table-column label="车牌号码" header-align="center" align="center" min-width="50">
                                <template slot-scope="{row}">{{row.carNum}}</template>
                            </el-table-column>
                            <el-table-column label="所属企业" header-align="center" align="center" min-width="100">
                                <template slot-scope="{row}">{{row.companyName}}</template>
                            </el-table-column>
                            <el-table-column label="车籍地" header-align="center" align="center" min-width="60">
                                <template slot-scope="{row}">{{row.vehicleOrigin}}</template>
                            </el-table-column>
                            <el-table-column label="车辆用途" header-align="center" align="center" min-width="50">
                                <template slot-scope="{row}">{{row.carTypeName}}</template>
                            </el-table-column>

                            <el-table-column label="车辆类型" header-align="center" align="center" min-width="50">
                                <template slot-scope="{row}">{{row.carTypeName}}</template>
                            </el-table-column>
                            <el-table-column label="车辆状态" header-align="center" align="center" min-width="50">
                                <template slot-scope="{row}">{{row.workingStatusName}}</template>
                            </el-table-column>
                            <el-table-column label="运输证状态" header-align="center" align="center" min-width="50">
                                <template slot-scope="{row}">{{row.transportStatusName}}</template>
                            </el-table-column>
                            <!-- <el-table-column label="随车电话" header-align="center" align="center" min-width="100">
                                 <template slot-scope="{row}">{{row.endUseTime}}</template>
                             </el-table-column>-->
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
                </div>
            </el-col>
        </el-row>
        <!--修改的dialog-->
        <el-dialog title="查看" :visible.sync="dialogVisible" v-if="dialogVisible" v-elDragDialog width="70%"
                   :close-on-click-modal="false" append-to-body>
            <see-detail
                    :currentRow="currentRow"
                    :carTypeOptions=carTypeOptions
                    :carWorkingStatusOptions=carWorkingStatusOptions
                    :licenceStatusOptions=licenceStatusOptions
                    :treeData=treeData
            ></see-detail>
        </el-dialog>
        <!--新增的dialog-->
        <el-dialog title="新增" v-if="addShow" :visible.sync="addShow" v-elDragDialog width="70%"
                   :close-on-click-modal="false" append-to-body @close="closeDialog"
        >
            <add-vehicle
                    ref="addPersonnel"
                    v-on:showHiddenAdd="showHiddenAdd"
                    :carTypeOptions=carTypeOptions
                    :carWorkingStatusOptions=carWorkingStatusOptions
                    :licenceStatusOptions=licenceStatusOptions
                    :treeData=treeData

            ></add-vehicle>
        </el-dialog>
        <!--新增的dialog-->
        <el-dialog title="编辑" :visible.sync="editShow" v-if="editShow" v-elDragDialog width="70%"
                   :close-on-click-modal="false" append-to-body @close="closeDialog" >
            <edit-vehicle
                    v-on:showHiddenEdit="showHiddenEdit"
                    :carTypeOptions=carTypeOptions
                    :carWorkingStatusOptions=carWorkingStatusOptions
                    :licenceStatusOptions=licenceStatusOptions
                    :treeData=treeData

            ></edit-vehicle>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import elDragDialog from '@/directive/el-drag-dialog'
    import {basicArea, getByCode, getCar,deleteCompanyCar} from '@/api/industryInfo/vehicleInfo'
    import regionTree from '../../components/regionTree.vue'
    import AddVehicle from './components/add/add-vehicle'
    import EditVehicle from './components/edit/edit-vehicle'
    import SeeDetail from "./components/detail/see-detail";
    import {getStorage} from '@/utils/storage'

    export default {
        name: 'DrivingCardList',
        components: {SeeDetail, Pagination, CommonSubtitle, regionTree, AddVehicle, EditVehicle},
        directives: {elDragDialog},
        data() {
            return {
                isShowLeftPanel: false,  //是否显示左侧面板
                treeData: [],
                treeLoading: false,
                defaultProps: {
                    children: 'nodes',
                    label: 'text'
                },
                list: [],//列表
                total: 1,
                listLoading: false,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                form: {
                    carNum: '',
                    carType: null,
                    transportStatus: null,//运输证状态
                },
                selectedCompanyId: null,
                selectedAreaId: null,
                isSmallBtn: false,   //是否是换行按钮组，如果窗口太小，就换行
                dialogVisible: false,
                addShow: false,
                editShow: false,
                currentRow: {},//点击查看详情的当前行
                editParamsInfo: null,//选择table高亮显示的当前行
                carTypeOptions: [],//车辆类型
                carWorkingStatusOptions: [],//车辆运营状态
                licenceStatusOptions: [],//运输证状态
                selectedCompanyInfo: {},//点击的公司信息
                userInfo:{},//用户信息
            }
        },
        created() {
            this.userInfo = getStorage('userInfo');
            let self = this;
            //默认执行
            this.setBtns();
            self.getList();
//            self.getCarType("CAR_TYPE");
            self.dictionary();
            //为了子界面转化显示区域
            self.getTreeData();
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
        },
        methods: {
            //字典查询
            dictionary() {
                //车辆类型
                getByCode({code: 'CAR_TYPE', enable: 1}).then(res => {
                    this.carTypeOptions = [];
                    res.data.list.map(item => {
                        this.carTypeOptions.push(item);
                    })
                });
                //运营状态
                getByCode({code: 'CAR_WORKING_STATUS', enable: 1}).then(res => {
                    this.carWorkingStatusOptions = [];
                    res.data.list.map(item => {
                        this.carWorkingStatusOptions.push(item);
                    })
                });
                //运输证状态
                getByCode({code: 'LICENCE_STATUS', enable: 1}).then(res => {
                    this.licenceStatusOptions = [];
                    res.data.list.map(item => {
                        this.licenceStatusOptions.push(item);
                    })
                });
            },
            //编辑
            editVehicleShow() {
                if (!this.editParamsInfo) {
                    this.$message({
                        message: '请选择需要编辑的车辆！',
                        type: 'warning'
                    });
                    return
                }
                this.editShow = true
            },
            //删除
            deleteFunc() {
                let self = this;
                if (!this.editParamsInfo) {
                    this.$message({
                        message: '请选择需要刪除的车辆！',
                        type: 'warning'
                    });
                    return
                }
                let obj = {
                    id: this.editParamsInfo.id,
                    status:0
                };
                this.$confirm('此操作将删除该车辆, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteCompanyCar(obj).then(res => {
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
            //table高亮选择
            handleCurrentChange(val) {
                this.editParamsInfo = val;
                this.$store.dispatch("industryInfo/enterpriseManagement/vehicleInfo/setCarDetail", {carDetail: val});
            },
            //关闭新增界面并刷新？不刷新
            showHiddenEdit: function (data, refresh) {
                let self = this;
                this.editShow = data;
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
            seeDetail(row) {
                this.dialogVisible = true;
                this.currentRow = row;
                this.$store.dispatch("industryInfo/enterpriseManagement/vehicleInfo/setCarDetail", {carDetail: row});
            },
            //获取车辆类型
            getCarType(type) {
                let self = this
                let obj = {
                    code: type,
                    enable: 1,
                }
                getByCode(obj).then(res => {
                    self.options = res.data.list
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            getTreeData() {
                let self = this;
                //this.loading = true
                let obj = {
                    ifShowSide: "2",
                };
                this.treeLoading = true;
                basicArea(obj).then(res => {
                    self.treeData = res.data;
                    this.treeLoading = false
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                    this.loading = false
                })
            },
            //点击树节点
            handleNodeClick: function (data) {
                let self = this;
                if (data.type == "company") {
                    this.selectedCompanyInfo = data;
                    this.selectedCompanyId = data.id
                    this.selectedAreaId = null
                } else {
                    this.selectedCompanyInfo = {};
                    this.selectedAreaId = data.id
                    this.selectedCompanyId = null
                }
                self.handleFilter()
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },
            //设置按钮样式
            setBtns() {
                let offsetWid = document.documentElement.clientWidth;
                this.isSmallBtn = offsetWid < 1500;
            },
            //重置
            handleReset() {
                this.form = {
                    carNum: '',
                    carType: null,
                    transportStatus: null,//运输证状态
                }
                this.listQuery.page = 1;
                this.selectedCompanyId = null
                this.selectedAreaId = null
                this.selectedCompanyInfo = {};
                this.getList();
                this.getTreeData();
            },
            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            //获取车辆列表
            getList() {
                let self = this;
                let obj = {
                    page: self.listQuery.page,
                    size: self.listQuery.size,
                    companyId: this.userInfo.companyId,
//                    companyId: this.selectedCompanyId,
                    status:1,
                    ...this.form
                };
                /*if(this.form.carNum){
                    obj.carNum=this.form.carNum;
                }
                if(this.form.type){
                    obj.carType=this.form.type
                }
                if(this.selectedCompanyId){
                    obj.companyId=this.selectedCompanyId;
                }*/
                this.listLoading = true;
                this.editParamsInfo = null;
                getCar(obj).then(res => {
                    self.list = res.data.list;
                    self.total = res.data.total;
                    this.listLoading = false
                })
                    .catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                        this.listLoading = false
                    })
            },
            addCarBaseInfo() {
                this.selectedCompanyInfo = {
                    id:this.userInfo.companyId,
                    text:this.userInfo.companyName,
                    areaId:this.userInfo.areaId,
                };
                this.$store.dispatch("industryInfo/enterpriseManagement/vehicleInfo/setCompanyDetail", {companyDetail: this.selectedCompanyInfo})
                this.addShow = true;
            },
            closeDialog(){
                //刷新列表
                this.getList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../enterprise-management/styles/enterpriseInfo';

    /deep/ .el-image__inner, .el-image__placeholder, .el-image__error {
        height: 500px;
        width: 100%;
        margin-bottom: 20px;
    }

    /deep/ .el-image {
        width: 60%;;
        height: 500px;
        float: left;
        margin-bottom: 15px;
    }

    .dialog-right {
        float: left;
        width: 38%;
        height: 500px;
    }

    .row-margin {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
    }

    .el-dialog__body {
        padding: 30px 20px 10px;
    }
</style>
