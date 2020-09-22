<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <CommonSubtitle title="运单发起(基本信息)" :isBold="true"></CommonSubtitle>
                <el-form label-position="right" :rules="rules" ref="ruleForm" :inline="true" label-width="125px" :model="ruleForm">
                    <el-form-item label="托运方单位名称:" prop="consignorCompanyName" style="margin-right: 40px">
                        <el-select v-model="ruleForm.consignorCompanyName" filterable placeholder="请选择" @change="changeConsignorCompany">
                            <el-option
                                v-for="item in options"
                                :key="item.companyName"
                                :label="item.companyName"
                                :value="item.companyName">
                            </el-option>
                        </el-select>
                       <!-- <el-input v-model="ruleForm.consignorCompanyName"></el-input>-->
                    </el-form-item>
                    <el-form-item label="收货方单位名称:" prop="receiverCompanyName" style="margin-right: 40px">
                        <el-select v-model="ruleForm.receiverCompanyName" filterable placeholder="请选择" @change="changeReceiverCompany">
                            <el-option
                                v-for="item in options"
                                :key="item.companyName"
                                :label="item.companyName"
                                :value="item.companyName">
                            </el-option>
                        </el-select>
                       <!-- <el-input v-model="ruleForm.receiverCompanyName"></el-input>-->
                    </el-form-item>
                    <el-form-item label="托运方联系电话:" prop="consignorTelephone" style="margin-right: 40px">
                        <el-input v-model="ruleForm.consignorTelephone"></el-input>
                    </el-form-item>
                    <el-form-item label="收货方联系电话:" prop="receiverTelephone" style="margin-right: 40px">
                        <el-input v-model="ruleForm.receiverTelephone"></el-input>
                    </el-form-item>
                    <el-form-item label="装货方单位名称:" prop="loadCompanyName" style="margin-right: 40px">
                        <el-select v-model="ruleForm.loadCompanyName" filterable placeholder="请选择" @change="changeLoadCompany">
                            <el-option
                                v-for="item in options"
                                :key="item.companyName"
                                :label="item.companyName"
                                :value="item.companyName">
                            </el-option>
                        </el-select>
                       <!-- <el-input v-model="ruleForm.loadCompanyName"></el-input>-->
                    </el-form-item>
                    <el-form-item label="运输目的地:" prop="transportDestination" style="margin-right: 40px">
                        <el-input v-model="ruleForm.transportDestination"></el-input>
                    </el-form-item>
                    <el-form-item label="装货日期:" prop="loadDate" style="margin-right: 40px">
                        <el-date-picker
                            v-model="ruleForm.loadDate"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="预计到达日期:" prop="expectedArrivalDate" style="margin-right: 40px">
                        <el-date-picker
                            v-model="ruleForm.expectedArrivalDate"
                            type="datetime"
                            placeholder="选择日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <CommonSubtitle title="承运方信息" :isBold="true"></CommonSubtitle>
                    <el-form-item label="承运方单位名称:" prop="carrierCompanyName" style="margin-right: 40px">
                        <el-select v-model="ruleForm.carrierCompanyName" filterable placeholder="请选择" @change="changeCarrierCompany">
                            <el-option
                                v-for="item in options"
                                :key="item.companyName"
                                :label="item.companyName"
                                :value="item.companyName">
                            </el-option>
                        </el-select>
                        <!--<el-input v-model="ruleForm.carrierCompanyName"></el-input>-->
                    </el-form-item>
                    <el-form-item label="经营许可证号:" prop="carrierCompanyLicenseNo" style="margin-right: 40px">
                        <el-input v-model="ruleForm.carrierCompanyLicenseNo"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话:" prop="carrierCompanyTelephone" style="margin-right: 40px">
                        <el-input v-model="ruleForm.carrierCompanyTelephone"></el-input>
                    </el-form-item>
                    <el-form-item label="应急联系方式:" prop="emergencyTelephone" style="margin-right: 40px">
                        <el-input v-model="ruleForm.emergencyTelephone"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button  @click="resetForm('ruleForm')">重 置</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">创 建</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {saveOrUpdate} from '@/api/industry'
    import {getCompanyDetail} from '@/api/industry'
    import dateTime from '@/utils/ext.dateTime'
    export default {
        components: {CommonSubtitle},
        name: 'add-waybill',
        data() {
            let validateNumber = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入联系人电话'));
                } else{
                    let regPone = null;
                    let mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //最新16手机正则
                    let tel = /^(0[0-9]{2,3}\-)([2-9][0-9]{4,7})+(\-[0-9]{1,4})?$/; //座机
                    if (value.charAt(0) == 0) {    // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
                        regPone = tel;
                    } else {
                        regPone = mobile;
                    }
                    if (!regPone.test(value) && regPone==tel) {
                        return callback(
                            new Error("格式错误(座机'区号-座机号码')")
                        );
                    }else if (!regPone.test(value) && regPone==mobile) {
                        return callback(
                            new Error("错误输入，请重新输入")
                        );
                    } else{
                        callback();
                    }
                }
            };
            let validateTime = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择预计到达日期'));
                } else if(value<this.ruleForm.loadDate){
                    callback(new Error('抵达时期必须大于装货日期'));
                }else{
                    callback();
                }
            };
            return {
                ruleForm: {
                    consignorCompanyName: '',
                    receiverCompanyName: '',
                    consignorTelephone: '',
                    receiverTelephone: '',
                    loadCompanyName: '',
                    transportDestination: '',
                    loadDate: '',
                    expectedArrivalDate: '',
                    carrierCompanyName: '',
                    carrierCompanyLicenseNo: '',
                    carrierCompanyTelephone: '',
                    emergencyTelephone: '',
                    carrierCompanyId:null,
                    consignorCompanyId:null,
                    loadCompanyId:null,
                    receiverCompanyId:null,
                },
                rules: {
                    consignorCompanyName: [
                        { required: true, message: '请输入托运方单位名称', trigger: 'change' }
                    ],
                    receiverCompanyName: [
                        { required: true, message: '请输入收货方单位名称', trigger: 'change' },
                    ],
                    consignorTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                    receiverTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                    loadCompanyName: [
                        { required: true, message: '请输入装货方单位名称', trigger: 'change' },
                    ],
                    transportDestination: [
                        { required: true, message: '请输入运输目的地', trigger: 'change' },
                    ],
                    loadDate: [
                        { required: true, message: '请选择装货日期', trigger: 'change' },
                    ],
                    expectedArrivalDate: [
                        { required: true, validator:validateTime, trigger: 'blur' },
                    ],
                    carrierCompanyName: [
                        { required: true, message: '请输入承运方单位名称', trigger: 'change' },
                    ],
                    carrierCompanyLicenseNo: [
                        { required: true, message: '请输入经营许可证号', trigger: 'change' },
                    ],
                    carrierCompanyTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                    emergencyTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                },
                options:[],
            };
        },
        created(){
            this.getCompanyData();
        },
        methods: {
            submitForm(formName) {
                let self=this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.wayBillStatus=1;
                        saveOrUpdate(this.ruleForm).then(res => {
                            this.$message({
                                showClose: true,
                                message: '新增成功！',
                                type: 'success'
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
            getCompanyData() {
                let self = this
                getCompanyDetail({}).then(res => {
                    self.options=res.data.list
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            //选择托运、承运、装货、收货公司的名称后，获取公司对应的id
            changeConsignorCompany(value){
                this.options.map(item=>{
                    if(item.companyName == value){
                        this.ruleForm.consignorCompanyId = item.id
                    }
                })
            },
            changeCarrierCompany(value){
                this.options.map(item=>{
                    if(item.companyName == value){
                        this.ruleForm.carrierCompanyId = item.id
                    }
                })
            },
            changeLoadCompany(value){
                this.options.map(item=>{
                    if(item.companyName == value){
                        this.ruleForm.loadCompanyId = item.id
                    }
                })
            },
            changeReceiverCompany(value){
                this.options.map(item=>{
                    if(item.companyName == value){
                        this.ruleForm.receiverCompanyId = item.id
                    }
                })
            }
        }
    }
</script>

<style lang="scss"scoped>
    /deep/ .el-form-item {
      width: 325px;
    }
    /deep/.el-input,.el-input__inner {
        width: 200px;
    }
</style>
