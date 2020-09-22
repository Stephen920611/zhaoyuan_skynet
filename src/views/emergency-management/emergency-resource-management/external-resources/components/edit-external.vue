<template>
    <div class="mask-add-edit-manage demo-form-inline-input" id="mask" style="position: relative;max-height: calc(100vh - 300px)">
        <el-form label-position="right" ref="ruleForm" :inline="true" label-width="130px" :model="ruleForm" :rules="rules">
            <CommonSubtitle title="基本信息" :isBold="true" style="line-height: 10px;margin-bottom: 15px"></CommonSubtitle>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="机构名称:" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入机构名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="机构地址:" prop="address">
                        <el-input v-model="ruleForm.address" placeholder="请输入机构地址"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row  >
                <el-col :span="24" class="margin-t-10">
                    <el-form-item label="备注：" prop="mark">
                        <el-input type="textarea" v-model="ruleForm.mark"
                                  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写备注"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="form-add-container" v-for="(item,index) in telAry" :key="index">
                <div class="add-container" >
                    <el-row :gutter="20" >
                        <el-col :span="8">
                            <el-form-item label="联系人姓名:" prop="contact">
                                <el-input v-model="item.contact" :disabled="isDisabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人电话:" prop="contactTel">
                                <el-input v-model="item.contactTel" :disabled="isDisabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人邮箱:" prop="email">
                                <el-input v-model="item.email" :disabled="isDisabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="add-icon">
                    <i class="el-icon-circle-plus-outline" style="cursor: pointer;" @click="addRow" v-if="index == 0"></i>
                    <i class="el-icon-remove-outline" style="cursor: pointer;" @click="reduceRow" v-else></i>
                </div>
            </el-row>
            <el-form-item class="margin-td-10" style="text-align:center; width: 100%;">
                <el-button @click="resetForm('ruleForm')">重 置</el-button>
                <el-button type='primary' @click="submitForm('ruleForm')">保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {saveEmergencyExtResources} from '@/api/emergency';

    export default {
        name: "EditMaterialReserve",
        components: {CommonSubtitle},
        props: ['data'],
        data() {
            return {
                ruleForm: {
                    id:null,
                    insertId:null,
                    name: '',
                    address: '',
                    mark: '',
                },
                telAry:[
                    {
                        contact: "",
                        contactTel: "",
                        email: "",
                    }
                ],
                rules: {
                    name: [
                        {required: true, message: '请输入机构名称', trigger: 'blur'},
                    ],
                    address: [
                        {required: true, message: '请输入机构地址', trigger: 'blur'},
                    ],
                },
                isDisabled:false,
                userInfo:null,   //用户信息
            }
        },
        watch:{
            'data':{
                handler(value){
                    const keys = Object.keys(this.ruleForm);
                    for(const key of keys){
                        this.ruleForm[key] = value[key];
                    }
                    this.telAry = value.telAry;
                },
              /*  immediate:true,
                deep:true*/
            }
        },
        mounted() {
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            const keys = Object.keys(this.ruleForm);
            for(const key of keys){
                this.ruleForm[key] = this.data[key];
            }
            this.telAry = this.data.telAry;
        },
        methods: {
            //条件检索 - 增加一行
            addRow(e) {
                this.telAry.push({
                    contact: "",
                    contactTel: "",
                    email: "",
                })

            },
            //条件检索 - 减少一行
            reduceRow(e,index) {
                //如果是第一行，带加号的
                this.telAry.splice(index,1);
            },
            //保存基本信息
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.insertId = this.userInfo.id;
                        this.ruleForm.telAry = this.telAry;
                        saveEmergencyExtResources(this.ruleForm).then(res=>{
                            this.$message({message:'编辑成功！',type:'success'});
                            this.$emit('toggleHidden','edit');
                        })
                    } else {
                        return false;
                    }
                })

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.telAry.map(item=>{
                    const keys = Object.keys(item);
                    for(const key of keys){
                        item[key] = '';
                    }
                });
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
            width: calc(100% - 159px);
        }

        /deep/ .el-textarea{
            width: 100%;
        }
    }
    .form-add-container{
        display: flex;
        justify-content: space-between;
        /deep/ .el-form-item__content{
            width: calc(100% - 130px);
        }
        .add-icon{
            text-align: center;
            line-height:36px
        }
    }
</style>
