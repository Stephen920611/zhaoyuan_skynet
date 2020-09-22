<template>
    <div class="mask-add-edit-manage demo-form-inline-input" id="mask"
         style="position: relative;">
        <el-form label-position="right" ref="ruleForm" :inline="true" label-width="150px" :model="ruleForm"
                 :rules="rules" v-loading="listLoading" >
            <CommonSubtitle title="基本信息" :isBold="true" style="line-height: 10px;margin-bottom: 15px"></CommonSubtitle>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="储备点名称:" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入储备点名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="负责人姓名:" prop="liablePerson">
                        <el-input v-model="ruleForm.liablePerson" placeholder="请输入负责人姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="负责人联系电话:" prop="tel">
                        <el-input v-model="ruleForm.tel" placeholder="请输入负责人联系电话"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" class="margin-t-10">
                    <el-form-item label="备注：" prop="mark" >
                        <el-input type="textarea" v-model="ruleForm.mark"
                                  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写备注"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <CommonSubtitle title="从属信息" :isBold="true" style="line-height: 10px;margin-bottom: 15px"></CommonSubtitle>
            <div class="form-item-info">
                <el-row>
                    <el-col :span="12" class="margin-t-10">
                        <el-form-item label="应急储备点归属类别：" prop="type" style="margin-bottom: 12px">
                            <el-select v-model="ruleForm.type" class="filter-item"
                                       placeholder="请选择应急储备点归属类别">
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
               <!-- <el-row>
                    <el-col :span="12" class="margin-t-10">
                        <el-form-item label="所属港口经营人：" prop="personName" style="margin-bottom: 12px">
                            <el-select v-model="ruleForm.personName" class="filter-item"
                                       placeholder="请选择所属港口经营人" disabled>
                                <el-option
                                        v-for="item in typeOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="Number(item.value)"
                                />
                            </el-select>
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
    import {getByCode,emergencyStorageSaveOrUpdate,fetchEmergencyStorage} from '@/api/emergencyManagement/emergencyResource'
    import {mapGetters} from 'vuex'
    import passParam from '@/utils/ext.passParam'


    export default {
        name: "AddMaterialReserve",
        components: {CommonSubtitle},
        props: ['type','companyInfo','detailInfo'],
        data() {
            return {
                id:null,
                ruleForm: {
                    name: '',
                    liablePerson: '',
                    tel: '',
                    mark:'',
                    type:null,
                    unit:'',
//
                },
                typeOptions: [],
                userInfo:{},//用户信息
                rules: {
                    name: [{required: true, message: '请输入储备点名称', trigger: 'change'},],
                    type: [{required: true, message: '请选择应急队伍归属类型', trigger: 'blur'},],
                    unit: [{required: true, message: '请输入所属应急机构名称', trigger: 'change'},],
                },
                listLoading:false,
            }
        },
        watch: {
            'ruleForm.type': {
                handler: function (newV, oldV) {
                    if(this.ruleForm.type === 1 && this.type === 'add'){
                        this.ruleForm.unit = this.companyInfo.text
                    }
                },
            }
        },
        created() {
        },
        mounted() {
            //获取应急归属类型
            this.dictionary();
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            if(this.type === 'edit'){
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
                        emergencyStorageSaveOrUpdate(this.type === 'add' ? params :{...params,id:this.detailInfo.id}).then(res => {
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
                fetchEmergencyStorage({id:this.detailInfo.id}).then(res => {
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
        .el-form-item {
            width: 100%;
        }

        /deep/ .el-form-item__content {
            width: calc(100% - 150px);
        }

        /deep/ .el-textarea {
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
