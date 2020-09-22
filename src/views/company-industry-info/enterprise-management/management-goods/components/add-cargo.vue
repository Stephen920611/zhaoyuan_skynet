<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <div class="add-form">
                    <el-form label-position="right" :rules="rules" ref="ruleForm" :inline="true" label-width="185px" :model="ruleForm">
                        <el-form-item label="货物名称:" prop="goodsName" class="long-item">
                            <el-input v-model="ruleForm.goodsName" placeholder="请输入货物名称"></el-input>
                        </el-form-item>
                        <el-form-item label="危险货物品名:" prop="companyName">
                            <el-input v-model="ruleForm.name" placeholder="请选择危险货物品名" clearable @focus="showChemicalTable=true" @change="clearFunc">
                                <el-button slot="append" icon="el-icon-search" @click="showChemicalTable=true"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="类/项名:">
                            <el-input v-model="ruleForm.className " placeholder="" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="危险号:">
                            <el-input v-model="ruleForm.dangerCode" placeholder="" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="联合国编号:">
                            <el-input v-model="ruleForm.unCode" placeholder="" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="英文名称:">
                            <el-input v-model="ruleForm.enName" placeholder="" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="闪点:">
                            <el-input v-model="ruleForm.flashing" placeholder="" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="组成与性状:" class="long-item">
                            <el-input v-html="ruleForm.constitute"  type="textarea" :rows="2" placeholder="" disabled class="textarea-inner"></el-input>
                        </el-form-item>
                        <el-form-item label="运输信息:" class="long-item">
                            <el-input v-html="ruleForm.transport"  type="textarea" :rows="2" placeholder="" disabled class="textarea-inner"></el-input>
                        </el-form-item>
                        <el-form-item label="储运事项:" class="long-item">
                            <el-input v-html="ruleForm.storage"  type="textarea" :rows="2" placeholder="" disabled class="textarea-inner textarea-inner-1"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="防护措施:" class="long-item">
                            <el-input v-html="ruleForm.shelter"  type="textarea" :rows="2" placeholder="" disabled class="textarea-inner"></el-input>
                        </el-form-item>-->
                        <el-form-item label="单位:" prop="unit">
                            <el-select v-model="ruleForm.unit" clearable placeholder="请选择单位" style="width: 100%">
                                <el-option
                                        v-for="item in unitList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="每单位重量（吨）:" prop="unitWeight">
                            <el-input v-model="ruleForm.unitWeight" placeholder="请输入重量" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="包装规格:" prop="packageInfo">
                            <el-input v-model="ruleForm.packageInfo" placeholder="请输入包装规格"></el-input>
                        </el-form-item>
                        <el-form-item class="margin-td-10" style="text-align: center; width: 100%;">
                            <el-button @click="resetForm">重 置</el-button>
                            <el-button type='primary' @click="submitForm('ruleForm')">保 存</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <!--查询危化品的dialog-->
        <el-dialog title="危险货物品名选择" v-if="showChemicalTable" :visible.sync="showChemicalTable" v-elDragDialog width="1000px" :close-on-click-modal="false" append-to-body>
            <search-cargo @showHiddenSearch="showHiddenSearch" @closeDialog="closeDialog"></search-cargo>
        </el-dialog>
    </div>
</template>

<script>
    import elDragDialog from '@/directive/el-drag-dialog'
    import SearchCargo from "./search-cargo";
    import {getByCode,addOrEditChemical} from '@/api/industry'
    export default {
        name: "add-cargo",
        components: {SearchCargo},
        directives: {elDragDialog},
        data() {
            return {
                ruleForm: {
                    goodsName: '',
                    chemicalId: null,
                    packageInfo: '',
                    unit: null,
                    unitWeight: '',
                    name:'',
                    enName:'',
                    unCode:'',
                    className:'',
                    dangerCode:'',
                    flashing:'',
                    constitute:'',
                    transport:'',
                    storage:'',
                    shelter:'',

                },
                rules: {
                    goodsName: [
                        {required: true, message: '请输入获取名称', trigger: 'blur'},
                    ],
                    unit: [
                        {required: true, message: '请选择单位', trigger: 'change'}
                    ],
                    unitWeight: [
                        {required: true, message: '请输入每单位重量', trigger: 'blur'},
                    ],
                    packageInfo: [
                        {required: true, message: '请输入包装规格', trigger: 'blur'},
                    ],
                },
                showChemicalTable: false,   //显示危化品table表，默认不显示
                unitList:[],  //单位项
                userInfo:null,    //用户登录信息
            };
        },
        mounted(){
            //获取用户信息
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            //获取单位列表
            this.unitListFunc();
        },
        methods: {
            unitListFunc(){
                //获取单位列表
                getByCode({code: 'CHEMICAL_UNIT_TYPE', enable: 1}).then(res=>{
                    this.unitList = [];
                    res.data.list.map(item=>{
                        this.unitList.push({id:item.value,name:item.name});
                    })
                });
            },
            //将选择的危化品信息填充到表单上
            showHiddenSearch: function (flag, data) {
                this.showChemicalTable = flag;
                const keys = Object.keys(data[0]);
                for(let key of keys){
                    if(Object.keys(this.ruleForm).indexOf(key)>-1){
                        this.ruleForm[key] = data[0][key]
                    }
                }
                this.ruleForm.chemicalId = data[0].id;
            },
            closeDialog(){
                this.showChemicalTable = false;
            },
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const param = {
                            chemicalId:this.ruleForm.chemicalId,
                            companyId:this.userInfo.companyId,
                            goodsName:this.ruleForm.goodsName,
                            packageInfo:this.ruleForm.packageInfo,
                            unit:this.ruleForm.unit,
                            unitWeight:this.ruleForm.unitWeight,
                        }
                        addOrEditChemical(param).then(res=>{
                            if(res.code == 1000){
                                this.$message({
                                    message: '添加成功！',
                                    type: 'success'
                                });
                                this.$emit('closeAddDialog',false)
                            }
                        }).catch(err=>{})
                    } else {
                        return false;
                    }
                });
            },
            resetForm(){
                this.ruleForm.goodsName = '';
                this.ruleForm.packageInfo = '';
                this.ruleForm.unit = null;
                this.ruleForm.unitWeight = '';
            },
            //清空选择的危化品时，相关联的数据清空
            clearFunc(){
                if(this.ruleForm.name.trim() == ''){
                    this.ruleForm.enName = '';
                    this.ruleForm.unCode = '';
                    this.ruleForm.dangerCode = '';
                    this.ruleForm.flashing = '';
                    this.ruleForm.constitute = '';
                    this.ruleForm.transport = '';
                    this.ruleForm.storage = '';
                    this.ruleForm.shelter = '';
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .ps__thumb-x {
        display: none;
    }

    /deep/ .el-form-item__content {
        width: 242px;
    }

    .long-item {
        width: 100%;
        /deep/ .el-form-item__content {
            width: calc(100% - 278px);
        }
    }

    .el-input-group__append button.el-button {
        background-color: #1890ff;
        border-radius: 0;
        color: #fff;
    }

    div[contenteditable]:empty:not(:focus):before {
        content: attr(placeholder);
        color: #aaa;
    }

    div[contenteditable] {
        background-color: #F5F7FA;
        border-color: #dfe4ed;
        color: #C0C4CC;
        cursor: not-allowed;
    }
    .textarea-inner{
        min-height: 55px;
        background-color: #F5F7FA;
        color: #C0C4CC;
        cursor: not-allowed;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        /deep/ p{
            line-height: 24px;
            padding: 0 15px;
        }
    }
    .textarea-inner-1{
        line-height: 24px;
        padding: 0 15px;
    }
</style>
