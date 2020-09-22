<template>
    <div class="app-container">
        <!--搜索条件-->
        <div class="filter-container">
            <el-form :inline="true" :model="form" ref="form" class="form-inline-search" label-width="100px">
                <el-form-item label="姓名：" class="form-inline-search-item">
                    <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="工作单位：" class="form-inline-search-item">
                    <el-input v-model="form.company" placeholder="请输入工作单位"></el-input>
                </el-form-item>
                <el-form-item label="专业领域:">
                    <el-select v-model="form.major" filterable placeholder="企业状态">
                        <el-option
                                v-for="item in expertMajors"
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
                            style="margin-left: 10px;padding: 10px 30px"
                            @click="handleFilter"
                    >
                        检索
                    </el-button>
                    <el-button
                            class="filter-item"
                            style="margin-left: 10px;"
                            icon="el-icon-refresh"
                            @click="handleReset"
                    >
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--领域条件-->
        <!--<div class="domain-info">
            <el-checkbox-group v-model="domainSelected" class="checkbox-wrap" v-for="(item,index) in selectedDomainItem" :key="index">
                <el-checkbox :label="item.code" class="checkbox-item" border>{{item.name}}</el-checkbox>
            </el-checkbox-group>
        </div>-->
        <el-card class="expert-card">
            <div class="margin-d-10">
                <el-button type="primary" icon="el-icon-document-add" @click="addPlan('add')">新增</el-button>
                <el-button type="primary" icon="el-icon-edit" @click="addPlan('edit')">编辑</el-button>
                <el-button type="primary" icon="el-icon-check" @click="handleCheckAllChange(true)" v-if="showCheckedFlag">全选</el-button>
                <el-button type="primary" icon="el-icon-check" @click="handleCheckAllChange(false)" v-else>全不选</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteAlarmFunc()">删除</el-button>
            </div>
            <div class="expert-list">
                <ul class="exDatabase-ul">
                     <li class="exDatabase-list-li-main" v-for="(item,index) in list" :key="index">
                         <el-checkbox ref="checkedItem" :name="item.id+''" class="checked-style" v-model="checkedExpertStatus[index]"> </el-checkbox>
                         <div class="exDatabase-list-li-content" :class="{'active':checkedExperts.indexOf(index)>-1}" @click.stop="handleSelect(index,item)" ref="checkedExperts">
                             <div class="exDatabase-list-img-content">
                                 <el-image :src="iconMan" @click.stop="showDetail(item.id)"></el-image>
                             </div>
                             <div class="li-name">{{item.name}}</div>
                             <el-divider></el-divider>
                             <div class="info-phone">电话{{item.mobile}}</div>
                         </div>
                     </li>
                    <li v-if="list.length == 0">
                        <div class="padding-10">暂无数据！</div>
                    </li>
                </ul>
            </div>
            <!-- 分页控件 -->
            <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.size"
                style="padding:0px !important;text-align:center"
                class="pagination"
                :pageSizes="[33]"
                @pagination="getList"
            />
        </el-card>
        <!--新增的dialog-->
        <el-dialog title="新增" v-if="addShow" :visible.sync="addShow" width="1100px"
                   :close-on-click-modal="false" append-to-body @close="closeDialog" v-elDragDialog>
            <add-expert @close="closeAddDialog"></add-expert>
        </el-dialog>
        <!--编辑的dialog-->
        <el-dialog title="编辑" :visible.sync="editShow" v-if="editShow"  width="1100px"
                   :close-on-click-modal="false" append-to-body @close="closeDialog" v-elDragDialog>
            <edit-expert :expertId="expertId" @close="closeEditDialog"></edit-expert>
        </el-dialog>
        <!--详情的dialog-->
        <el-dialog title="详情" :visible.sync="detailShow" v-if="detailShow"  width="1100px"
                   :close-on-click-modal="false" append-to-body v-elDragDialog>
            <see-detail :expertId="expertId"></see-detail>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/CommonSubtitle'
    import  AddExpert from './components/add-expert.vue'
    import  EditExpert from './components/edit-expert.vue'
    import elDragDialog from '@/directive/el-drag-dialog'
    import SeeDetail from "./components/see-detail";

    import {serviceExpertPage,deleteServiceExpert} from '@/api/emergency'
    import {getByCode} from '@/api/industry'
    export default {
        name: 'EMMaterialReserveIndex',
        components: {SeeDetail, Pagination, CommonSubtitle,AddExpert,EditExpert,elDragDialog},
        directives: {elDragDialog},
        data() {
            return {
                //要检索的条件
                form: {
                    name: '',
                    company: '', //工作单位
                    major: null, //专业领域
                },
                domainSelected:[],//选择的领域行业
                /*selectedDomainItem:[
                    {code:1,name:'安全法律法规和标准'},
                    {code:2,name:'危险货物作业管理'},
                    {code:3,name:'港口安全技术'},
                    {code:4,name:'港口工程'},
                    {code:5,name:'应急救援'}],*/
                iconMan: require('@/assets/image/other/icon_man.png'),
                listQuery: {
                    page: 1,
                    size: 33,
                },
                expertMajors:[],   //专业领域列表
                list:[],
                total:0,//总数
                addShow: false,
                editShow: false,
                detailShow:false,
                showCheckedFlag:true,//全选与全不选标识
                checkedExperts:[],
                checkedExpertStatus:[],
                expertId:null,
            }
        },
        mounted() {
            this.dictionary();
            //获取列表数据
            this.getList();
        },
        methods: {
            //获取字典表对应的字段(专业领域)
            dictionary(){
                getByCode({code: 'EXPERT_MAJOR', enable: 1}).then(res=>{
                    this.expertMajors = [];
                    res.data.list.map(item=>{
                        this.expertMajors.push(item);
                    })
                })
            },
            //选中
            handleSelect(index,data) {
              /*  let activeExperts=this.$refs.checkedExperts;
                activeExperts.map(item=>{
                    if(item.classList.indexOf('active')>-1){
                        item.parentNode.childNodes[0]
                    }
                });*/
                if(this.checkedExperts.indexOf(index)>-1){
                    let expertsIndex = this.checkedExperts.indexOf(index);
                    this.checkedExperts.splice(expertsIndex, 1);
                    this.checkedExpertStatus[index] = false;
                }else{
                    this.checkedExperts.push(index);
                    this.checkedExpertStatus[index] = true;
                }
            },
            //获取列表
            getList() {
                this.checkedExperts = [];
                this.checkedExpertStatus = [];
                this.expertId = null;
                this.showCheckedFlag = true;  //按钮重置为“全选”字样
                const param = Object.assign(this.form,this.listQuery)
                serviceExpertPage(param).then(res=>{
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.list.map(item=>{
                        this.checkedExpertStatus.push(false);
                    })
                })
            },
            // 条件查询
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            //重置
            handleReset() {
                this.form.name = '';
                this.form.company = '';
                this.form.major = null;
                this.listQuery.page = 1;
                this.getList()
            },
            //查看详情
            seeDialog(row) {
            },
            //添加
            addPlan(type) {
                if(type==='edit'){
                    console.log(this.$refs.checkedItem,'this.$ref.checkedItem');
                    let allCheck=this.$refs.checkedItem;
                    let checkedExpert=[];
                    allCheck.map(item=>{
                        if(item.model==true){
                            checkedExpert.push(item.name)
                        }
                    });
                    if (checkedExpert.length>1 || checkedExpert.length==0) {
                        this.$message({
                            message: '请选择一条待编辑数据',
                            type: 'warning'
                        });
                        return
                    }
                    this.editShow = true;
                    this.expertId = parseInt(checkedExpert.join(','))
                }else{
                    this.addShow = true;
                }
                //弹窗
//                this.$store.dispatch('poorHouseholds/setHouseholdsData', data);

            },
            //全选
            handleCheckAllChange(flag) {
                this.showCheckedFlag=!flag;
                let allCheck=this.$refs.checkedItem;
                allCheck.map(item=>{
                    item.model=flag
                });
            },
            //查看
            showDetail(id) {
                this.detailShow = true;
                this.expertId = id;

            },
            //删除
            deleteAlarmFunc() {
                let allCheck=this.$refs.checkedItem;
                let checkedExpert=[];
                allCheck.map(item=>{
                    if(item.model==true){
                        checkedExpert.push(item.name)
                    }
                });
                this.$confirm('此操作将批量删除勾选的专家, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteServiceExpert({id:checkedExpert.join(',')}).then(res => {
                         this.$message({
                             showClose: true,
                             message: '删除成功！',
                             type: 'success'
                         });
                         this.getList()
                     }).catch((err) => {
                         // 公共方法有，所以不需要加提示了
                         // this.$message.error(err.msg)
                     })
                })
            },

            closeDialog(){
                //刷新列表
                this.getList();
            },
            closeAddDialog(flag){
                this.addShow = flag;
                //刷新列表
                this.getList();
            },
            closeEditDialog(flag){
                this.editShow = flag;
                //刷新列表
                this.getList();
            }

        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .app-container {
        background-color: #FCFCFC;
        height: calc(100vh - 110px);
        .filter-container {
            padding: 10px 15px;
            height: 60px;
            background-color: #fff;
            margin-bottom: 10px;
        }
    }
    .domain-info{
        display: flex;
        margin-bottom: 10px;
        height: 36px;
        /deep/ .el-checkbox-group {
            margin-right: 10px;
        }
    }
    .expert-card{
        height: calc(100% - 70px);
        /deep/.el-card__body{
            height: 100%;
            padding: 15px 20px 10px 20px;
        }
        .expert-list{
            height:calc(100% - 90px);
        }
    }
    .exDatabase-list-li-main {
        padding-top: 15px;
        width: 9%;
        float: left;
        position: relative;
        .checked-style{
            float: right;
            //图片上的多选框
            /deep/ .el-checkbox__input {
                position: absolute;
                right: -10px;
                top: -5px;
                width: 20px;
                height: 20px;
                /deep/ .el-checkbox__inner {
                    width: 20px;
                    height: 20px;
                }
              /*  -ms-transform: scale(1.3); !* IE *!
                -moz-transform: scale(1.3); !* FireFox *!
                -webkit-transform: scale(1.3); !* Safari and Chrome *!
                -o-transform: scale(1.3); !* Opera *!*/
            }
            // 加未选中的 对号 css
            .unselected .el-checkbox__input .el-checkbox__inner::after {
                // 对号
                border: 2px solid red;
                // 不覆盖下面的 会 导致对号变形
                box-sizing: content-box;
                content: "";
                border-left: 0;
                border-top: 0;
                height: 7px;
                left: 6px;
                position: absolute;
                top: 3px;
                width: 3px;
                // }
            }
            /deep/ .el-checkbox__input .el-checkbox__inner::after {
                // 对号
                border: 2px solid #fff;
                // 不覆盖下面的 会 导致对号变形
                box-sizing: content-box;
                content: "";
                border-left: 0;
                border-top: 0;
                height: 7px;
                left: 6px;
                position: absolute;
                top: 3px;
                width: 3px;
                transform: rotate(45deg) scaleY(1.3);
            }
        }
        .exDatabase-list-li-content {
            margin-left: 15px;
            border: 1px solid #ccc;
            border-radius: 10px;
            cursor: pointer;
            background-color: #fff;
            .exDatabase-list-img-content {
                padding: 10px;
                height: 120px;
                text-align: center;
                text-align: -webkit-center;
                position: relative;
            }
            .li-name {
                text-align: center;
                font-weight: bold;
            }
            /deep/ .el-divider--horizontal {
                width: 90%;
                margin: 5px 5%;
            }
            .info-phone {
                margin: 5px 0;
                font-size: 14px;
                text-align: center;
            }
        }
    }
    .pagination-container {
        margin-top: 0;
    }
    .active{
        border: 1px solid #1a70dc!important;
        background-color: #eff2f8!important;
    }
</style>
