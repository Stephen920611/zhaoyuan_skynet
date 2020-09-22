<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" :rules="rules" ref="ruleForm" :inline="true" label-width="125px" :model="ruleForm">
                   <!-- <el-form-item label="公司名称:" prop="companyType">
                        <el-input v-model="ruleForm.companyName"></el-input>
                    </el-form-item>-->
                    <el-form-item label="证件编号:" prop="licenceCode">
                        <el-input v-model="ruleForm.licenceCode" onKeyUp="value=value.replace(/[\W]/g,'')"></el-input>
                    </el-form-item>
                    <el-form-item label="发证机关:" prop="licenceAuthor">
                        <el-input v-model="ruleForm.licenceAuthor"></el-input>
                    </el-form-item>
                    <el-form-item label="发证日期:" prop="givingTime">
                        <el-date-picker
                            v-model="ruleForm.givingTime"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="备案时间:" prop="recordTime">
                        <el-date-picker
                            v-model="ruleForm.recordTime"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="有效期始:" prop="startUseTime">
                        <el-date-picker
                            v-model="ruleForm.startUseTime"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="有效期止:" prop="endUseTime">
                        <el-date-picker
                            v-model="ruleForm.endUseTime"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="经营范围:" prop="businessScope">
                        <el-input v-model="ruleForm.businessScope"></el-input>
                    </el-form-item>
                    <el-form-item label="数据来源:" prop="source">
                        <el-input v-model="ruleForm.source"></el-input>
                    </el-form-item>
                    <el-form-item label="状态:" prop="status">
                        <el-select v-model="ruleForm.status" class="filter-item"
                                   placeholder="请选择状态">
                            <el-option
                                v-for="item in isEnabled"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="危化品:" prop="chemicaId">
                        <el-select v-model="ruleForm.chemicaId" multiple filterable placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button type='primary' @click="submitForm('ruleForm')">确 定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {licenceSaveOrUpdate,basicChemicalsList} from '@/api/industry'
    export default {
        components: {CommonSubtitle},
        name: 'add-company',
        props: ['selectedCompanyId','selectedCompanyName'],
        data() {
            let validateTime = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择有效期止'));
                } else if(value<this.ruleForm.startUseTime){
                    callback(new Error('有效期止必须大于有效期始'));
                }else{
                    callback();
                }
            };
            return {
                ruleForm: {
                    licenceCode: '',
                    licenceAuthor:'',
                    givingTime:'',
                    startUseTime:'',
                    endUseTime:'',
                    status:'',
                    source:'',
                    companyId:'',
                    recordTime:'',
                    businessScope:'',
                    chemicaId:[],
                    companyName:'',
                },
                rules: {
                    licenceCode: [
                        { required: true, message: '请输入证件编号', trigger: 'blur' }
                    ],
                    licenceAuthor: [
                        { required: true, message: '请输入发证机关', trigger: 'blur' }
                    ],
                    givingTime: [
                        { required: true, message: '请选择发证日期', trigger: 'change' }
                    ],
                    startUseTime: [
                        { required: true, message: '请选择有效期始', trigger: 'change' }
                    ],
                    endUseTime: [
                        { required: true,validator:validateTime, trigger: 'change' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                    source: [
                        { required: true, message: '请输入数据来源', trigger: 'blur' }
                    ],
                    recordTime: [
                        { required: true, message: '请选择备案时间', trigger: 'blur' }
                    ],
                    businessScope: [
                        { required: true, message: '请输入经营范围', trigger: 'blur' }
                    ],
                    chemicaId: [
                        { required: true, message: '请选择危化品', trigger: 'change' }
                    ],
                },
                isEnabled:[
                    {'label':'有效',value:1},
                    {'label':'无效',value:2}
                ],
                options:[]
            };
        },
        created() {
            this.ruleForm.companyId=this.selectedCompanyId;
            this.ruleForm.companyName=this.selectedCompanyName;
            this.getChemicaId()
        },
        watch:{
            'selectedCompanyId':{
                handler(newValue){
                    this.ruleForm.companyId=newValue
                }
            },
            'selectedCompanyName':{
                handler(newValue){
                    this.ruleForm.companyName=newValue
                }
            }
        },
        methods: {
            //获取危化品列表
            getChemicaId() {
                let self = this
                basicChemicalsList({}).then(res => {
                    self.options=res.data
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            submitForm(formName) {
                let self=this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.ruleForm.chemicaId=self.ruleForm.chemicaId.join(",");
                        licenceSaveOrUpdate(this.ruleForm).then(res => {
                            this.$message({
                                showClose: true,
                                message: '新增成功！',
                                type: 'success',
                            });
                            self.$emit('showHiddenAdd', false, true);
                            this.$refs[formName].resetFields();
                        }).catch((err) => {
                            // 公共方法有，所以不需要加提示了
                            // this.$message.error(err.msg)
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-form-item {
        width: 48%;
    }
    /deep/ .el-form-item--medium .el-form-item__content {
        width: calc(100% - 125px);
    }
    /deep/ .el-input{
        width: 220px;
    }
</style>
