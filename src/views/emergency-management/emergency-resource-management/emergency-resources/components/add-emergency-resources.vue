<template>
    <div class="mask-add-edit-manage demo-form-inline-input" id="mask" style="position: relative;">
        <el-form label-position="right" ref="ruleForm" :inline="true" label-width="150px" :model="ruleForm"
                 :rules="rules">
            <CommonSubtitle title="基本信息" :isBold="true" style="line-height: 10px;margin-bottom: 15px"></CommonSubtitle>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="物资名称:" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入物资名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="规格型号:" prop="model">
                        <el-input v-model="ruleForm.model" placeholder="请输入规格型号"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >

                <el-col :span="12">
                    <el-form-item label="物资数量:" prop="amount">
                        <el-input v-model="ruleForm.amount" type="number" placeholder="请输入物资数量"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="计量单位:" prop="measure">
                        <el-input v-model="ruleForm.measure" placeholder="请输入计量单位"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row  >
                <el-col :span="24" class="margin-t-10">
                    <el-form-item label="物资技术状况：" prop="technology">
                        <el-input type="textarea" v-model="ruleForm.technology"
                                  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写物资技术状况"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row  >
                <el-col :span="24" class="margin-t-10">
                    <el-form-item label="其他情况说明：" prop="mark">
                        <el-input type="textarea" v-model="ruleForm.mark"
                                  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写其他情况说明"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <CommonSubtitle title="从属信息" :isBold="true" style="line-height: 10px;margin-bottom: 15px"></CommonSubtitle>
            <el-row >
                <el-col :span="12" class="margin-t-10">
                    <el-form-item label="应急物资储备点：" prop="storageId" style="margin-bottom: 12px">
                        <el-select v-model="ruleForm.storageId" class="filter-item"
                                   placeholder="请选择应急物资储备点">
                            <el-option
                                    v-for="item in storageOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="12" class="margin-t-10">
                    <el-form-item label="应急物资大类：" prop="parentType" style="margin-bottom: 12px">
                        <el-select v-model="parentType" class="filter-item"
                                   placeholder="请选择应急物资大类">
                            <el-option
                                    v-for="item in parentTypeOptions"
                                    :key="item.id"
                                    :label="item.mark"
                                    :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="margin-t-10">
                    <el-form-item label="应急物资小类:" prop="type">
                        <el-select v-model="ruleForm.type" class="filter-item"
                                   placeholder="请选择应急物资小类">
                            <el-option
                                    v-for="item in typeOptions"
                                    :key="item.id"
                                    :label="item.mark"
                                    :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-form-item class="margin-td-10" style="text-align:center; width: 100%;">
                <el-button @click="resetForm">重 置</el-button>
                <el-button type='primary' @click="submitForm">保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {getByCode,emergencyMaterialSaveOrUpdate,fetchEmergencyMaterial,fetchEmergencyMaterialType} from '@/api/emergencyManagement/emergencyResource'
    import {mapGetters} from 'vuex'
    import passParam from '@/utils/ext.passParam'

    export default {
        name: "AddEmergencyResources",
        components: {CommonSubtitle},
        props: ['type','companyInfo','detailInfo','storageOptions'],
        data() {
            return {
                id: null,
                parentType:null,//应急物资大类
                parentTypeOptions:[],//应急物资大类
                ruleForm: {
                    name: '',
                    model: '',
                    amount: '',
                    measure: '',
                    technology: '',
                    mark:'',
                    storageId:null,
                    type:null,//应急物资小类
//
                },
                typeOptions:[],//应急物资类别小类
                userInfo:{},//用户信息
                rules: {
                    name: [{required: true, message: '请输入应急物资名称', trigger: 'change'},],
                    amount: [{required: true, message: '请输入应急物资数量', trigger: 'change'},],
                    storageId: [{required: true, message: '请选择应急物资储备点', trigger: 'blur'},],
                    type: [{required: true, message: '请输入应急物资类别小类', trigger: 'change'},],

                },
                listLoading:false,
            }
        },
        watch: {
            parentType(newValue) {
                this.fetchEmergencyMaterialType({parentId:this.parentType});
            }
        },
        created() {
        },
        mounted() {
            //获取类型数组
            this.fetchEmergencyMaterialType({parentId:0});
            //用户信息
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            //编辑，需要获取详情
            if(this.type==='edit'){
                this.fetchDetail();
            }
        },
        methods: {
            //获取类型数组
            fetchEmergencyMaterialType(params){
                fetchEmergencyMaterialType(params).then(res => {
                    if(params.parentId === 0){
                        this.parentTypeOptions = res.data
                    }else{
                        this.typeOptions = res.data
                    }
                }).catch((err) => {
                });
            },
            //保存基本信息
            submitForm() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let params={
                            ...this.ruleForm,
                            companyId:this.companyInfo.id,//企业id
                            insertId:this.userInfo.id,//当前用户id
                        };
                        emergencyMaterialSaveOrUpdate(this.type === 'add' ? params :{...params,id:this.detailInfo.id}).then(res => {
                            this.$message({
                                showClose: true,
                                message: this.type === 'add'?'新增成功！':'编辑成功！',
                                type: 'success'
                            });
                            setTimeout(()=>{
                                this.$emit('toggleHidden',this.type)
                            },600);
                        }).catch((err) => {
                        });
                    } else {
                        return false;
                    }
                });

            },

            //获取详情
            fetchDetail(){
                let self=this;
                self.listLoading= true;
                fetchEmergencyMaterial({id:this.detailInfo.id}).then(res => {
                    const keys = Object.keys(self.ruleForm);
                    for(let key of keys){
                        self.ruleForm[key] = res.data[key];
                    }
                    self.parentType = res.data.hasOwnProperty('parentType')?res.data.parentType : null;
                    self.listLoading= false;
                }).catch((err) => {
                    self.listLoading= false;
                });
            },

            //重置表单
            resetForm() {
                this.$refs['ruleForm'].resetFields();

            },
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .demo-form-inline-input {
        /deep/ .el-input {
            width: 100% !important;
        }
        /deep/ .el-select {
            width: 100%;
        }
        .el-form-item{
            width: 100%;
        }

            /deep/ .el-form-item__content{
                width: calc(100% - 150px);
            }

        /deep/ .el-textarea{
            width: 100%;
        }
    }


</style>
