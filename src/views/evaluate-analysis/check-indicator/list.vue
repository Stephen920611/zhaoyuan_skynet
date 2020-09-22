<template>
    <div class="app-container">
        <el-container style="height: calc(100vh - 150px);">
            <el-main style="padding: 10px;">
                <el-row style="height: 100%">
                    <el-col class="left-tree-wrap">
                        <el-row class="btn-wrap text-center">
                            <el-button type="primary" size="medium" @click.native="addLevelMenu('root')">添加一级考核项
                            </el-button>
                            <el-button type="primary" size="medium" @click.native="addLevelMenu('child')">添加下级考核项
                            </el-button>
                            <el-button size="medium" @click.native="deleteMenu(selectTreeNode)">删除</el-button>
                        </el-row>
                        <el-row class="tree-wrap">
                            <el-tree
                                    v-loading="treeLoading"
                                    class="filter-tree"
                                    :data="treeData"
                                    :props="defaultProps"
                                    highlight-current
                                    :expand-on-click-node="false"
                                    @node-click="handleNodeClick"
                                    ref="tree"
                                    node-key="id"
                                    :default-checked-keys="[23]"
                                    style="height: 100%;overflow-y: auto;"
                            >
                                <span slot-scope="{node,data}" class="ellipsis-l1 font-size-14">
                                     <span :title="data.appraiseDes">{{data.appraiseDes}}</span>
                                </span>
                            </el-tree>
                        </el-row>
                    </el-col>
                    <el-col class="right-detail-wrap" style="height: calc(100vh - 170px);">
                        <div style="height: 100%;overflow-y: auto">
                            <el-card class="box-card">
                                <common-subtitle :isBold="true" title="考核项信息" style="padding-top: 0;"></common-subtitle>
                                <div class="detail-wrap" style="padding-top: 20px">
                                    <el-form :model="ruleForm" ref="ruleForm" label-width="120px"
                                             class="demo-ruleForm">
                                        <el-row>
                                            <el-col :span="24">
                                                <el-form-item label="考核内容:" prop="appraiseDes">
                                                    <el-input type="textarea" autosize v-model="ruleForm.appraiseDes"
                                                              auto-complete="off"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="8">
                                                <el-form-item label="考核项编码:"  prop="appraiseCode">
                                                    <el-input v-model="ruleForm.appraiseCode" ></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-form-item label="考核项类型:" prop="appraiseType">
                                                    <el-select v-model="ruleForm.appraiseType" >
                                                        <el-option
                                                                v-for="item in appraiseTypeOptions"
                                                                :key="item.value"
                                                                :label="item.name"
                                                                :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-form-item label="考核满分值:" prop="appraiseTotalScore">
                                                    <el-input type="number"
                                                              min="0" v-model="ruleForm.appraiseTotalScore"
                                                              auto-complete="off"></el-input>
                                                </el-form-item>
                                            </el-col>

                                        </el-row>
                                        <el-row>
                                            <el-col :span="8">
                                                <el-form-item label="扣/加分:" prop="appraiseTotalScore">
                                                    <el-input type="number"
                                                              min="0" v-model="ruleForm.appraiseTotalScore"
                                                              auto-complete="off"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-form-item label="排序:" prop="displayOrder">
                                                    <el-input v-model.number="ruleForm.displayOrder"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-form-item label="级别:" prop="appraiseLevel">
                                                    <el-input disabled v-model="ruleForm.appraiseLevel" auto-complete="off"
                                                              type="number"
                                                              min="0"></el-input>
                                                </el-form-item>
                                            </el-col>

                                        </el-row>
                                        <el-row>
                                            <el-col :span="16">
                                                <el-form-item label="备注:" prop="remarkDes">
                                                    <el-input type="textarea" autosize v-model="ruleForm.remarkDes"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-form-item style="float: right">
                                                    <el-button type="primary" :disabled="!ruleForm.appraiseDes"
                                                               @click="submitForm('ruleForm','rule')">保 存
                                                    </el-button>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                </div>
                            </el-card>

                            <el-card class="box-card"
                                     style="margin-top: 20px;height: calc(100% - 342px);min-height:248px;overflow-y: auto;">
                                <common-subtitle :isBold="true" title="评分标准" style="padding-top: 0;"></common-subtitle>
                                <el-row class="right-search-input">
                                    <el-col :span="10" class="right-input">
                                        <el-input v-model="searchInput" placeholder="请输入关键字搜索"></el-input>
                                        <el-button type="primary" style="margin-left: 10px" @click="searchAppraiseDes">检索</el-button>
                                    </el-col>
                                    <el-col :span="14">
                                        <el-button type="success" style="margin-left: 20px;float: right"
                                                   @click.native="addLevelMenu('child')">
                                            <i class="icon iconfont iconxinzeng"></i>
                                            新增
                                        </el-button>
                                    </el-col>
                                </el-row>
                                <!-- 表格开始 -->
                                <el-table
                                        v-loading="listLoading"
                                        :data="list"
                                        border
                                        fit
                                        highlight-current-row
                                        style="width: 100%;margin-top: 15px;"
                                        height="314px"
                                >
                                    <el-table-column label="评分标准" header-align="center" align="center">
                                        <template slot-scope="{row}">{{row.appraiseDes}}</template>
                                    </el-table-column>
                                    <el-table-column
                                            label="考核项满分值"
                                            header-align="center"
                                            align="center"
                                            width="150"
                                    >
                                        <template slot-scope="{row}">{{row.appraiseTotalScore}}</template>
                                    </el-table-column>
                                    <el-table-column
                                            label="扣/加分"
                                            header-align="center"
                                            align="center"
                                            width="150"
                                    >
                                        <template slot-scope="{row}">{{row.appraiseUnitScore}}</template>
                                    </el-table-column>
                                    <el-table-column
                                            label="操作"
                                            align="center"
                                            width="150"
                                            class-name="small-padding fixed-width"
                                    >
                                        <template slot-scope="{row}">
                                            <i class="icon iconfont iconchuli" title="编辑" @click="seeDetail(row)"></i>
                                            <i class="icon iconfont iconshanchu1" title="删除" style="margin-left: 5px"
                                               @click="deleteMenu(row)"></i>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!--<div style="text-align: center">
                                    &lt;!&ndash; 分页控件 &ndash;&gt;
                                    <pagination
                                            v-show="total >0"
                                            :total="total"
                                            :page.sync="listQuery.page"
                                            :limit.sync="listQuery.size"
                                            style="padding:0px !important"
                                            class="pagination"
                                            @pagination="getList"
                                    />
                                </div>
    -->
                            </el-card>

                        </div>


                    </el-col>
                </el-row>
            </el-main>

        </el-container>

        <!--添加一级考核项的dialog-->
        <el-dialog title="添加一级考核项" :visible.sync="dialogAddVisible.root" v-if="dialogAddVisible.root" width="650px">
            <el-form :model="addRootForm" :rules="addRules" ref="addRootForm">
                <el-form-item label="考核项编码：" :label-width="formLabelWidth" class="width-90" prop="appraiseCode">
                    <el-input v-model="addRootForm.appraiseCode" auto-complete="off" placeholder="请输入考核项编码"></el-input>
                </el-form-item>
                <el-form-item label="考核内容：" :label-width="formLabelWidth" class="width-90" prop="appraiseDes">
                    <el-input type="textarea" autosize v-model="addRootForm.appraiseDes" auto-complete="off"
                              placeholder="请输入考核内容"></el-input>
                </el-form-item>
                <el-form-item label="考核项类型：" :label-width="formLabelWidth" class="width-90" prop="appraiseType">
                    <el-radio-group v-model="addRootForm.appraiseType">
                        <el-radio :label="item.value" border v-for="(item, index) in appraiseTypeOptions"
                                  :key="item.value"
                                  style="margin-right: 10px;float:left;margin-bottom: 10px">{{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="考核项满分值：" :label-width="formLabelWidth" class="width-90" prop="appraiseTotalScore">
                    <el-input v-model="addRootForm.appraiseTotalScore" auto-complete="off" type="number"
                              placeholder="请输入考核项满分值"></el-input>
                </el-form-item>
                <el-form-item label="扣/加分：" :label-width="formLabelWidth" class="width-90" prop="appraiseUnitScore">
                    <el-input v-model="addRootForm.appraiseUnitScore" auto-complete="off" placeholder="请输入扣/加分(正整数)"
                              type="number"
                              min="0"></el-input>
                </el-form-item>
                <el-form-item label="级别：" :label-width="formLabelWidth" class="width-90" prop="appraiseLevel">
                    <el-input disabled v-model="addRootForm.appraiseLevel" auto-complete="off" placeholder="请输入级别"
                              type="number"
                              min="0"></el-input>
                </el-form-item>
                <el-form-item label="排序：" :label-width="formLabelWidth" class="width-90" prop="displayOrder">
                    <el-input v-model="addRootForm.displayOrder" auto-complete="off" placeholder="请输入排序"
                              type="number"
                              min="0"></el-input>
                </el-form-item>
                <el-form-item label="备注：" :label-width="formLabelWidth" class="width-90" prop="remarkDes">
                    <el-input v-model="addRootForm.remarkDes" auto-complete="off" placeholder="请输入备注"
                              type="textarea" autosize></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('addRootForm')">重 置</el-button>
                <el-button type="primary" @click="submitForm('addRootForm','root')" :disabled="addDisable.root">确 定
                </el-button>
            </div>
        </el-dialog>

        <!--添加下级菜单的dialog-->
        <el-dialog title="添加下级考核项" :visible.sync="dialogAddVisible.child" v-if="dialogAddVisible.child" width="650px">
            <el-form :model="addChildForm" :rules="addRules" ref="addChildForm">
                <el-form-item label="本级节点名称：" :label-width="formLabelWidth" class="width-90" prop="parentName">
                    <el-input v-model="addChildForm.parentName" auto-complete="off" type="textarea" autosize disabled ></el-input>
                </el-form-item>
                <el-form-item label="考核项编码：" :label-width="formLabelWidth" class="width-90" prop="appraiseCode">
                    <el-input v-model="addChildForm.appraiseCode" auto-complete="off" placeholder="请输入考核项编码"></el-input>
                </el-form-item>
                <el-form-item label="考核内容：" :label-width="formLabelWidth" class="width-90" prop="appraiseDes">
                    <el-input type="textarea" autosize v-model="addChildForm.appraiseDes" auto-complete="off"
                              placeholder="请输入考核内容"></el-input>
                </el-form-item>
                <el-form-item label="考核项类型：" :label-width="formLabelWidth" class="width-90" prop="appraiseType">
                    <el-radio-group v-model="addChildForm.appraiseType">
                        <el-radio :label="item.value" border v-for="(item, index) in appraiseTypeOptions"
                                  :key="item.value"
                                  style="margin-right: 10px;float:left;margin-bottom: 10px">{{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="考核项满分值：" :label-width="formLabelWidth" class="width-90" prop="appraiseTotalScore">
                    <el-input v-model="addChildForm.appraiseTotalScore" auto-complete="off" type="number"
                              placeholder="请输入考核项满分值"></el-input>
                </el-form-item>
                <el-form-item label="扣/加分：" :label-width="formLabelWidth" class="width-90" prop="appraiseUnitScore">
                    <el-input v-model="addChildForm.appraiseUnitScore" auto-complete="off" placeholder="请输入扣/加分(正整数)"
                              type="number"
                              min="0"></el-input>
                </el-form-item>
                <el-form-item label="级别：" :label-width="formLabelWidth" class="width-90" prop="appraiseLevel">
                    <el-input disabled v-model="addChildForm.appraiseLevel" auto-complete="off" placeholder="请输入级别"
                              type="number"
                              min="0"></el-input>
                </el-form-item>
                <el-form-item label="排序：" :label-width="formLabelWidth" class="width-90" prop="displayOrder">
                    <el-input v-model="addChildForm.displayOrder" auto-complete="off" placeholder="请输入排序"
                              type="number"
                              min="0"></el-input>
                </el-form-item>
                <el-form-item label="备注：" :label-width="formLabelWidth" class="width-90" prop="remarkDes">
                    <el-input v-model="addChildForm.remarkDes" auto-complete="off" placeholder="请输入备注"
                              type="textarea" autosize></el-input>
                </el-form-item>
                <!--<el-form-item label="排序：" :label-width="formLabelWidth" class="width-90" prop="appraiseLevel">
                    <el-input v-model="addChildForm.appraiseLevel" auto-complete="off" placeholder="请输入排序号"
                              type="number"
                              min="0"></el-input>
                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('addChildForm')">重 置</el-button>
                <el-button type="primary" @click="submitForm('addChildForm','child')" :disabled="addDisable.child">确 定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import elDragDialog from '@/directive/el-drag-dialog'
    import {
        getSysPathTree,
        getSysPathDetail,
        saveSysPath,
        deleteSysPath,
        getRoleList
    } from '@/api/evaluateAnalysis/checkIndicator'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import Pagination from '@/components/Pagination'

    export default {
        name: 'menuManage',
        directives: {elDragDialog},
        components: {CommonSubtitle, Pagination},
        data() {
            //appraiseType为0时，appraiseTotalScore必须大于0
            let validcodeAppraiseTotalScore = (rule, value, callback) => {
                if (this.dialogAddVisible['root'] && this.addRootForm.appraiseType === '0' || this.dialogAddVisible['child'] && this.addChildForm.appraiseType === '0') {
                    if (value <= 0) {
                        callback(new Error('记分类目的考核满分值必须大于0'));
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            };
            //appraiseType为选择扣分项为2 次数扣分项为3 加分项4时，appraiseUnitScore必须大于0
            let validcodeAppraiseUnitScore = (rule, value, callback) => {
                if (this.dialogAddVisible['root'] && this.$lodash.indexOf(['2', '3', '4'], this.addRootForm.appraiseType) > -1 || this.dialogAddVisible['child'] && this.$lodash.indexOf(['2', '3', '4'], this.addChildForm.appraiseType) > -1) {
                    if (value <= 0) {
                        callback(new Error('扣/加分分值必须大于0'));
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            };
            return {
                dialogAddVisible: {
                    root: false,   //显示"添加一级菜单"的dialog
                    child: false   //显示"添加下级菜单"的dialog
                },
                addDisable: {
                    root: false,   //"添加一级菜单"的按钮的禁用状态
                    child: false   //"添加下级菜单"的按钮的禁用状态
                },
                formLabelWidth: '120px',
                ruleForm: {
                    id: null,
                    appraiseLevel: null,//级别
                    appraiseDes: '',//考核内容
                    appraiseTotalScore: 0,//分数
                    displayOrder: null,//排序

                    parentName: '',//父节点名字
                    appraiseType: '',//考核项类型
                    appraiseCode: '',//考核项编码【自编】
                    appraiseUnitScore: 0,//扣/加分
                    remarkDes: '',//备注
                },
                treeData: [],
                treeLoading: false, //树加载状态
                defaultProps: {
                    children: 'nodes',
                    label: 'appraiseDes'
                },
                list: [],
                listLoading: false,
                total: 0,
                listQuery: {
                    page: 1,
                    size: 10,
                },
                //添加一级考核项
                addRootForm: {
                    id: null,
                    appraiseLevel: 1,//排序
                    appraiseDes: '',//考核内容
                    appraiseTotalScore: 0,//分数
                    parentId: 0,//父节点id
                    parentName: '',//父节点名字
                    appraiseType: '',//考核项类型
                    appraiseCode: '',//考核项编码【自编】
                    appraiseUnitScore: 0,//扣/加分
                    remarkDes: '',//备注
                    displayOrder: 0,//排序
                },
                //添加下级考核项
                addChildForm: {
                    id: null,
                    appraiseLevel: null,//排序
                    appraiseDes: '',//考核内容
                    appraiseTotalScore: 0,//分数
                    parentId: null,//父节点id
                    parentName: '',//父节点名字
                    appraiseType: '',//考核项类型
                    appraiseCode: '',//考核项编码【自编】
                    appraiseUnitScore: 0,//扣/加分
                    remarkDes: '',//备注
                    displayOrder: 0,//排序

                },
                //存储点击的树节点信息
                selectTreeNode: null,
                //form 表单规则
                addRules: {
                    appraiseDes: [
                        {required: true, message: '请输入考核内容', trigger: 'blur'}
                    ],
                    appraiseTotalScore: [
                        {required: true, message: '请输入考核项满分值', trigger: 'blur'},
                        {validator: validcodeAppraiseTotalScore, trigger: 'blur'}
                    ],
                    appraiseLevel: [
                        {required: true, message: '请输入级别', trigger: 'blur'}
                    ],
                    displayOrder: [
                        {required: true, message: '请输入排序号', trigger: 'blur'}
                    ],
                    appraiseType: [
                        {required: true, message: '请输入考核项类型', trigger: 'blur'}
                    ],
                    appraiseCode: [
                        {required: true, message: '请输入考核项编码', trigger: 'blur'}
                    ],
                    appraiseUnitScore: [
                        {required: true, message: '请输入扣/加分', trigger: 'blur'},
                        {validator: validcodeAppraiseUnitScore, trigger: 'blur'}
                    ],
                },
                //搜索关键字
                searchInput: '',
                appraiseTypeOptions: [
                    {
                        name: '其他',
                        value: '-1'
                    },
                    {
                        name: '记分类目',
                        value: '0'
                    },
                    {
                        name: '选择项',
                        value: '1'
                    },
                    {
                        name: '选择扣分项',
                        value: '2'
                    },
                    {
                        name: '次数扣分项',
                        value: '3'
                    },
                    {
                        name: '加分项',
                        value: '4'
                    },
                ],
            };

        },
        mounted() {
            //获取菜单树结构
            this.getTree();
        },
        watch: {},
        methods: {
            //获取菜单树结构
            getTree() {
                this.treeLoading = true;
                getSysPathTree({id: null}).then(res => {
                    this.treeLoading = false;
                    this.treeData = res.data;
                    this.ruleForm = {};
                    this.selectTreeNode = null;
                }).catch(err => {
                    self.treeLoading = false;
                });
            },
            //保存
            submitForm(formName, role) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (valid) {
                            this.addDisable[role] = true;
                            let params = {};
                            let text = "";
                            if (role == "root") {
                                params = this.addRootForm;
                                text = "新增";
                            } else if (role == "child") {
                                params = this.addChildForm;
                                text = "新增";
                                if(this.addChildForm){
                                    text = "编辑";
                                }
                            } else {
                                params = this.ruleForm;
                                text = "编辑";
                                if (!this.selectTreeNode) {
                                    this.$message({
                                        message: '请选择树节点！',
                                        type: 'warning'
                                    });
                                    return;
                                }
                            }
                            //新增或者编辑节点
                            saveSysPath(params).then(res => {
                                this.addDisable[role] = false;
                                this.dialogAddVisible[role] = false;
                                //刷新树
                                this.getTree();
                                this.list=[];
                                this.$message({
                                    type: 'success',
                                    message: `${text}成功!`
                                });
                                setTimeout(() => {
                                    this.addDisable[role] = false;
                                }, 1.5 * 1000)
                            }).catch(err => {
                                this.addDisable[role] = false;
                            });
                        } else {
                            return false;
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //选择树节点
            handleNodeClick(data, node) {
                this.ruleForm = data;
                this.selectTreeNode = data;
                //填充到添加下级菜单表单中
                this.addChildForm.parentId = data.id;
                this.addChildForm.parentName = data.appraiseDes;
                //级别
                this.addChildForm.appraiseLevel = node.level + 1;
                //获取子项列表
                this.getList();

            },
            //根据id获取子项列表
            getList() {
                this.listLoading = true;
                //获取节点的详细信息
                getSysPathDetail({id: this.selectTreeNode.id}).then(res => {
                    this.listLoading = false;
                    if (res.code == 1000) {
                        this.list = res.data;
                    }
                }).catch(err => {
                    this.listLoading = false;
                });
            },
            //添加一级或者下级菜单
            addLevelMenu(role,) {
                if (role == "child" && !this.selectTreeNode) {
                    this.$message({
                        message: '请选择树节点！',
                        type: 'warning'
                    });
                    return;
                }
                this.dialogAddVisible[role] = true;

                //重置表单
                /*let formName = '';
                if(role === "root"){
                    formName = 'addRootForm'
                }else{
                   formName = 'addChildForm'
                }
//                console.log('this.$refs',formName,this.$refs,this.$refs[formName]);
                if (this.$refs[formName] != undefined){
                    this.$nextTick(() => {
                        this.$refs[formName].resetFields();//清空表单
                    });
                }*/
            if (role === "root") {
                this.addRootForm.id = null;
                this.addRootForm.appraiseLevel = 1;
                this.addRootForm.appraiseDes = '';
                this.addRootForm.appraiseTotalScore = 0;
                this.addRootForm.parentId = 0;
                this.addRootForm.parentName = '';
                this.addRootForm.appraiseType = '';
                this.addRootForm.appraiseCode = '';
                this.addRootForm.appraiseUnitScore = 0;
                this.addRootForm.remarkDes = '';
                this.addRootForm.displayOrder = 0;

            } else {
                this.addChildForm.id = null;
                this.addChildForm.appraiseDes = '';
                this.addChildForm.appraiseTotalScore = 0;
                this.addChildForm.parentId = this.selectTreeNode.id;
                this.addChildForm.parentName = this.selectTreeNode.appraiseDes;
                this.addChildForm.appraiseType = '';
                this.addChildForm.appraiseCode = '';
                this.addChildForm.appraiseUnitScore = 0;
                this.addChildForm.remarkDes = '';
                this.addChildForm.displayOrder = 0;
            }
        },
        //删除菜单
        deleteMenu(data) {
            if (!data) {
                this.$message({
                    message: '请选择树节点！',
                    type: 'warning'
                });
                return;
            }

            this.$confirm(`确定要删除该节点吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteSysPath({id: data.id}).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.selectTreeNode = null;
                    //刷新列表
                    this.getTree();
                    this.list = [];
                });
            }).catch(() => {
            });

        },
        //编辑考核项信息
        seeDetail(data) {
            this.addChildForm = data;
            this.addChildForm.parentName = this.selectTreeNode.appraiseDes;
            this.dialogAddVisible['child'] = true;
        },
        //检索评分标准
        searchAppraiseDes(){
            /*this.listLoading = true;
            //获取节点的详细信息
            getSysPathDetail({
                id: this.selectTreeNode.id,
                appraiseDes:this.searchInput
                }).then(res => {
                this.listLoading = false;
                if (res.code == 1000) {
                    this.list = res.data;
                }
            }).catch(err => {
                this.listLoading = false;
            });*/
            }
        }

    }
</script>

<style lang="scss" scoped type="text/scss">
    .left-tree-wrap {
        /*height: 750px;*/
        height: calc(100vh - 170px);
        /*border: 1px solid #ddd;*/
        /*border-radius: 5px 0 0 5px;*/
        width: 400px;
        min-width: 400px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        .title-wrap {
            height: 40px;
            line-height: 40px;
            width: 100%;
            /*border-bottom: 1px solid #ddd;*/
        }
        .btn-wrap {
            height: 60px;
            line-height: 60px;
            width: 100%;
            /*border-bottom: 1px solid #ddd;*/
        }
        .tree-wrap {
            padding: 10px 20px;
            /*height: calc(100% - 100px);*/
            height: calc(100% - 80px);
            /deep/ .el-tree-node__label {
                font-size: 14px;
            }
        }
    }

    .right-detail-wrap {
        width: calc(100% - 430px);
        height: calc(100vh - 170px);
        min-width: 400px;
        margin-left: 15px;
        .title-wrap {
            padding-left: 20px;
            height: 40px;
            line-height: 40px;
            width: 100%;
            border-bottom: 1px solid #ddd;
        }
    }

    .width-40 {
        width: 40%;
    }

    .width-90 {
        width: 90%;
    }

    //内容样式
    .el-card {
        border: 0;
        .right-search-input {
            margin-top: 20px;
            .right-input {
                display: flex;
                justify-content: space-between;
            }
            .el-button--success {
                background-color: #60C9C3;
                border-color: #60C9C3;
            }
            /deep/ .el-button--medium {
                padding: 10px 30px;
            }
        }
        /deep/ .el-table th {
            background-color: #308FE4;
            color: #fff;
        }

    }

    .el-card.is-always-shadow {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    }

    .common-subtitle {
        border-bottom: 0;
    }

    //添加、编辑
    //form 表单详情
    .el-radio.is-bordered + .el-radio.is-bordered {
        margin-left: 0;
    }

    .el-radio:after {
        clear: both;
        content: '';
    }
    .el-select{
        width: 100%;
    }
</style>
