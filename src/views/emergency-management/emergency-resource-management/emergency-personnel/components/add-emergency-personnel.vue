<template>
    <div class="mask-add-edit-manage demo-form-inline-input" id="mask" style="position: relative;">
        <el-form label-position="right" ref="ruleForm" :inline="true" label-width="120px" :model="ruleForm"
                 :rules="rules" v-loading="listLoading" >
            <CommonSubtitle title="基本信息" :isBold="true" style="line-height: 10px;margin-bottom: 15px"></CommonSubtitle>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="姓名:" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="职务:" prop="duty">
                        <el-input v-model="ruleForm.duty" placeholder="请输入职务"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >

                <el-col :span="12">
                    <el-form-item label="办公电话:" prop="tel">
                        <el-input v-model="ruleForm.tel" placeholder="请输入办公电话"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="移动电话:" prop="mobile">
                        <el-input v-model="ruleForm.mobile" placeholder="请输入移动电话"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >

                <el-col :span="12">
                    <el-form-item label="生日:" prop="birthday">
                        <el-date-picker
                                v-model="ruleForm.birthday"
                                type="date"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="学历:" prop="education">
                        <el-input v-model="ruleForm.education" placeholder="请输入学历"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row  >
                <el-col :span="24" class="margin-t-10">
                    <el-form-item label="专业：" prop="major">
                        <el-input v-model="ruleForm.major" placeholder="请填写专业"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <CommonSubtitle title="从属信息" :isBold="true" style="line-height: 10px;margin-bottom: 15px"></CommonSubtitle>
            <div class="form-item-info">
                <el-row >
                    <el-col :span="12" class="margin-t-10">
                        <el-form-item label="应急人员归属类别：" prop="type" style="margin-bottom: 12px">
                            <el-select v-model="ruleForm.type" class="filter-item"
                                       placeholder="请选择应急人员归属类别">
                                <el-option
                                        v-for="item in typeOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="Number(item.value)"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="margin-t-10">
                        <el-form-item label="所属应急机构名称:" prop="unit">
                            <el-input v-model="ruleForm.unit" placeholder="请输入所属应急机构名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--<el-row >
                    <el-col :span="12" class="margin-t-10">
                        <el-form-item label="所属港口经营人：" prop="personName" style="margin-bottom: 12px" disabled >
                            <el-select v-model="ruleForm.personName" class="filter-item"
                                       placeholder="请选择所属港口经营人">
                                <el-option
                                        v-for="item in attributionOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="margin-t-10">
                        <el-form-item label="所属应急机构名称:" prop="organization">
                            <el-input v-model="ruleForm.organization" placeholder="请输入所属应急机构名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>-->

            </div>

            <el-form-item class="margin-td-10" style="text-align:center; width: 100%;">
                <el-button @click="resetForm">重 置</el-button>
                <el-button type='primary' @click="submitForm">保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {getByCode,emergencyPersonSaveOrUpdate,fetchEmergencyPerson} from '@/api/emergencyManagement/emergencyResource'
    import {mapGetters} from 'vuex'
    import passParam from '@/utils/ext.passParam'
    import D from '@/utils/DFDZ';


    export default {
        name: "AddEmergencyPersonnel",
        components: {CommonSubtitle},
        props: ['type','companyInfo','detailInfo'],
        data() {
            return {
                id: null,
                ruleForm: {
                    name: '',
                    duty: '',
                    tel: '',
                    mobile: '',
                    birthday:'',
                    education:'',
                    major:'',
                    unit:'',
                    type:null,
//
                },
                //应急预案归属
                attributionOptions: [
                    {
                        name: '港航管理局',
                        value: 0,
                    },
                    {
                        name: '港口经营人',
                        value: 1,
                    },
                    {
                        name: '其他',
                        value: 2,
                    },],
                rules: {
                    name: [{required: true, message: '请输入应急人员姓名', trigger: 'change'},],
//                    duty: [{required: true, message: '请输入应急人员职务', trigger: 'change'},],
//                    tel: [{required: true, message: '请输入负责人联系电话', trigger: 'change'},],
//                    dutyTel: [{required: true, message: '请输入应急队伍值班电话', trigger: 'change'},],
                    major:[{required: true, message: '请输入应急人员专业名称', trigger: 'change'},],
//                    mark:[{required: true, message: '请填写其他情况说明', trigger: 'change'},],
                    type: [{required: true, message: '请选择应急人员归属类别', trigger: 'blur'},],
                    unit: [{required: true, message: '请输入所属应急机构名称', trigger: 'change'},],

                },
                //应急预案归属
                typeOptions: [],
                userInfo:{},//用户信息
                listLoading:false,
            }
        },
        watch: {
            'ruleForm.type': {
                handler: function (newV, oldV) {
                    console.log('this.type',this.ruleForm.type,this.type);

                    if(this.ruleForm.type === 1 && this.type === 'add'){
                        this.ruleForm.unit = this.companyInfo.text
                    }
                },
            }
        },
        created() {
        },
        mounted() {
            //获取应急专业队伍归属类型
            this.dictionary();
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            if(this.type==='edit'){
                this.fetchDetail();
            }
        },
        methods: {
            dictionary(){
                //车辆类型
                getByCode({code: 'EMERGENCY_RESOURCE_TYPE', enable: 1}).then(res => {
                    this.typeOptions = [];
                    res.data.list.map(item => {
                        this.typeOptions.push(item);
                    })
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
                        params.birthday = this.ruleForm.birthday === '' ? this.ruleForm.birthday : D.helper.dateFormat(this.ruleForm.birthday)
                        emergencyPersonSaveOrUpdate(this.type === 'add' ? params :{...params,id:this.detailInfo.id}).then(res => {
                            this.$message({
                                showClose: true,
                                message: this.type === 'add' ? '新增成功！':'编辑成功！',
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
                fetchEmergencyPerson({id:this.detailInfo.id}).then(res => {
                    const keys = Object.keys(self.ruleForm);
                    for(let key of keys){
                        self.ruleForm[key] = res.data[key];
                    }
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
                width: calc(100% - 120px);
            }

        /deep/ .el-textarea{
            width: 100%;
        }
        //从属信息，label过长，单独设置样式
        /deep/ .form-item-info .el-form-item__label {
            width: 170px !important;
        }
        /deep/ .form-item-info .el-form-item__content {
            width: calc(100% - 170px);
        }
    }


</style>
