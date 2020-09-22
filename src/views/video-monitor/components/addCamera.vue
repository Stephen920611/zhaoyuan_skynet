<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <div class="el-transfer-panel">
                    <p class="el-transfer-panel__header" style="margin-top: -5px;">
                        <label class="el-checkbox"><span class="el-checkbox__label">摄像机列表</span></label>
                    </p>
                    <div class="el-transfer-panel__body" style="padding: 10px">
                        <div class="tree-list-wrap">
                            <el-form ref="treeForm" :model="treeForm" label-width="90px">
                                <el-form-item label="资源树列表:">
                                    <el-select v-model="treeForm.selectedTreeId" placeholder="请选择资源树" size="small"
                                               @change="handleChangeSelect" class="tree-selector">
                                        <el-option v-for="(item,index) in treeForm.treeList" :key="index"
                                                   :label="item.des" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="tree-container">
                            <create-check-tree
                                ref="initTree"
                                :data="treeData"
                                :isSearch="true"
                                :expandedKeys="expandedKeys"
                                :reqSearchUrl="searchCamera"
                                reqSearchType="post"
                                :reqSearchParam="searchCameraParam"
                                :reqNextNodeUrl="queryCamera"
                                reqNextNodeType="post"
                                :reqNextNodeParam="queryCameraParam"
                                @node-click="handleNodeClick"
                                @node-depart-click="handleDepartNodeClick"
                            >
                            </create-check-tree>
                        </div>
                    </div>
                </div>
                <div class="el-transfer__buttons">
                    <el-button class="el-button el-button--primary el-transfer__button" icon="el-icon-arrow-right"  @click="removeTree" :disabled="treeBtn">右 移</el-button>
                    <el-button class="el-button el-button--primary el-transfer__button" icon="el-icon-arrow-left" @click="removeCameraCode" :disabled="checkedBtn">左 移</el-button>
                </div>
                <div class="el-transfer-panel">
                    <p class="el-transfer-panel__header" style="margin-top: -5px;">
                        <label class="el-checkbox"><span class="el-checkbox__label">{{currentNode.text}}</span></label>
                    </p>
                    <div class="el-transfer-panel__body">
                        <el-checkbox-group v-model="checkedItems">
                            <el-checkbox v-for="camera in groupChecked" :label="camera.code" :key="camera.code">{{camera.text}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center;margin-top:10px">
                <el-button  @click="resetForm()">重 置</el-button>
                <el-button type="primary" @click="submitForm()">保 存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {queryTreeListByRole, queryDepartTree, queryCamCount,addCam,listNodeCam} from '../../../api/video'
    import {newGroupNode} from '@/api/video'
    import CreateCheckTree from "./createCheckTree";
    export default {
        name: "addCamera",
        components: {CreateCheckTree},
        props:['currentNode','rootData'],
        data() {
            return {
                treeForm: {
                    treeList: [],  //资源树列表
                    selectedTreeId: null //资源树列表默认选中的项（默认为第一项）
                },
                treeData: [],
                defaultProps: {
                    children: 'nodes',
                    label: 'text',
//                  icon:'icon'
                },
                expandedKeys: [],   //展开树的节点,默认为根节点
                selectedCameraNode: {},
                maskVisible: false,   //右侧抽屉的遮罩层是否显示
                drawerVisible: false,   //右侧抽屉是否显示
                queryCamera: process.env.VUE_APP_BASE_API+'/customCameraTree/list-camera',
                queryGroupCamera: process.env.VUE_APP_BASE_API+'/groupMain/list-node-cam',//【分组】-节点下摄像机查询
                queryCameraParam:{roleId:1,treeId:null},
                searchCameraParam:{roleId:1,treeId:null},
                searchCamera: process.env.VUE_APP_BASE_API+'/customCameraTree/camera-search',
                groupChecked:[],//tree中移过来的节点
                checkedItems:[],//选中的摄像机
                treeBtn:false,
                checkedBtn:false,
                camCodeList:[],//选中摄像机code
                userInfo:null,  //存储登录用户信息
            };
        },
        mounted(){
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            this.queryCameraParam.roleId = this.userInfo.roleId;
            this.searchCameraParam.roleId = this.userInfo.roleId;
            this.getTreeListByRole();
            this.getNodeCamera();
        },
        methods: {
            getNodeCamera(){
                this.checkedItems=[];//选中的摄像机
                this.groupChecked=[];
                listNodeCam({roleId:this.userInfo.roleId,id:this.currentNode.id}).then(res=>{
                    this.groupChecked=res.data
                }).catch(err=>{

                })
            },
            /**
             *   获取摄像机列表
             *   params:roleId
             */
            removeTree() {
                //将选中的摄像机清空
                this.checkedItems=[];
                //获取所有选中的树节点
                let checkNodes=this.$refs.initTree.$refs.tree.getCheckedNodes();
                let obj={};
                checkNodes.map(item=>{
                    //筛选出摄像机节点
                    if(item.type=='camera'){
                        obj={
                            text:item.text,
                            code:item.code,
                        };
                        this.groupChecked.push(obj);
                    }
                });
                //摄像机去重
                let objCamera = {};
                this.groupChecked = this.groupChecked.reduce((cur,next) => {
                    objCamera[next.code] ? "" : objCamera[next.code] = true && cur.push(next);
                    return cur;
                },[]);
                //如果没有摄像机节点给用户提示
                if(this.groupChecked.length==0){
                    this.$message({
                            showClose: true,
                            message: '请选择摄像机',
                            type: 'warning'
                    });
                }
            },
            /**
             *   移除摄像机列表
             *   params:roleId
             */
            removeCameraCode() {
                this.checkedItems.map(item=>{
                     this.groupChecked.map((camera,i)=>{
                        if(item==camera.code){
                            this.groupChecked.splice(i,1);
                        }
                    });
                });
            },
            //点击树的部门节点获取摄像机
            handleNodeClick(node) {

            },
            /**
             *   获取资源树列表
             *   params:roleId
             */
            getTreeListByRole(){
                queryTreeListByRole({roleId:this.userInfo.roleId}).then(res=>{
                    this.treeForm.treeList = res.data;
                    if(res.data.length > 0){
                        this.treeForm.selectedTreeId = res.data[0].id;
                        //加载对应的资源树
                        this.getResourceTree(res.data[0].id);
                        //点击部门加载摄像机和搜索摄像机时，修改传入的参数值
                        this.queryCameraParam.treeId = res.data[0].id;
                        this.searchCameraParam.treeId = res.data[0].id;
                    }
                }).catch(err=>{

                })
            },
            /**
             * select选择框选择值变化时触发
             */
            handleChangeSelect(value){
                this.queryCameraParam.treeId = value;
                this.searchCameraParam.treeId = value;
            },

            /**
             *   根据选中的资源树列表项，加载资源树
             *   params:roleId
             */
            getResourceTree(id){
                queryDepartTree({roleId:this.userInfo.roleId,treeId:id}).then(res=>{
                    //this.treeData = res.data;
                    if(res.data.length>0){
                        //展开根节点
                        this.expandedKeys.push(res.data[0].code);
                        //递归查找所有的部门节点
                        this.allDepartNodeCodeArray = [];
                        this.recursiveSearchDepartNode(res.data[0]);
                        //查询所有部门对应的摄像机在线数与总数
                        this.getCamCount(this.allDepartNodeCodeArray,res.data);
                    }
                }).catch(err=>{})
            },
            /**
             * //递归查找所有的部门节点,返回节点编码数组
             */
            recursiveSearchDepartNode(data){
                if(data.nodes){
                    data.nodes.map(item=>{
                        this.allDepartNodeCodeArray.push(item.code);
                        this.recursiveSearchDepartNode(item);
                    });
                }
            },
            /**
             * //递归给所有的部门节点添加属性tags
             */
            recursiveAddNodeTags(camInfo,data){
                data.map(item=>{
                    if(item.nodes){
                        item.nodes.map(ktem=>{
                            if(ktem.code == camInfo.code){
                                ktem.tags = camInfo.camCount;
                            }
                        });
                        this.recursiveAddNodeTags(camInfo,item.nodes);
                    }
                });
            },
            /**
             * 查询所有部门对应的摄像机在线数与总数
             */
            getCamCount(departCodeArray,data){
                const param={
                    roleId:this.userInfo.roleId,
                    treeId:this.treeForm.selectedTreeId,
                    departCodes:departCodeArray.join(',')
                };
                queryCamCount(param).then(res=>{
                    if(res.data.camInfo){
                        res.data.camInfo.map(item=>{
                            this.recursiveAddNodeTags(item,data)
                        });
                        this.treeData = data;
                    }
                })

            },
            //点击树的部门节点
            handleDepartNodeClick(node) {
                this.cameraId = "";
                this.cameraName = "";
            },
            submitForm() {
                this.camCodeList=[];
                this.groupChecked.map(item=>{
                    this.camCodeList.push(item.code);
                });
                let obj={rootId:this.rootData.id,camCodeList:this.camCodeList.join(","),id:this.currentNode.id,roleId:this.userInfo.roleId};
                addCam(obj).then(res=>{
                    this.$message({
                        type: 'success',
                        message: res.msg,
                    });
                    this.$emit('showHiddenAddCamera', false, true);
                }).catch(err=>{

                })
            },
            resetForm(){
                this.$refs.initTree.$refs.tree.setCheckedKeys([]);
                this.getNodeCamera();
            },
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .el-transfer-panel {
        width: 430px;
        height: 570px;
        max-height: 100%;
        /deep/ .el-transfer-panel__body {
            height: calc(100% - 56px);
            /deep/ .el-transfer-panel__list.is-filterable {
                height: calc(100% - 32px);
            }
        }
    }
    .tree-container{
        height: calc(100% - 40px);
    }
    /deep/ .el-checkbox {
        display:block;
        margin: 5px 10px;
    }
    /deep/ .el-form-item {
        margin-bottom: 10px;
    }
    /deep/ .el-select {
        width: 100%;
    }
</style>
