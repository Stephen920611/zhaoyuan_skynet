<template>
    <div class="form-container">
        <el-form label-position="right" ref="ruleForm" :inline="true" label-width="120px" :model="ruleForm"
                 :rules="rules">
            <el-form-item label="摄像机名称:" prop="cameraName">
                <el-input v-model="ruleForm.cameraName"></el-input>
            </el-form-item>
            <el-form-item label="摄像机编码:" prop="cameraCode">
                <el-input v-model="ruleForm.cameraCode"></el-input>
            </el-form-item>
            <el-form-item label="摄像机类型:" prop="cameraType">
                <el-select v-model="ruleForm.cameraType" placeholder="请选择">
                    <el-option
                            v-for="item in cameraTypes"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="摄像机位置:" prop="positionType">
                <el-select v-model="ruleForm.positionType" placeholder="请选择">
                    <el-option
                            v-for="item in positionTypes"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-row>
                <div class="margin-td-10" style="text-align: center; width: 100%;">
                    <el-button @click="resetForm('ruleForm')">重 置</el-button>
                    <el-button type='primary' @click="submitForm('ruleForm')">保 存</el-button>
                </div>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    import {batchSaveOrUpdateCamera} from '@/api/industry'
    export default {
        name: "DeviceInfoForm",
        props:['companyId','data','role'],
        data() {
            return {
                ruleForm: {
                    id:null,
                    cameraName: '',
                    cameraCode: '',
                    cameraType: '',
                    positionType: '',
                    companyId: this.companyId,
                },
                rules: {
                    cameraName: [
                        {required: true, message: '请填写摄像机名称', trigger: 'blur'},
                    ],
                    cameraCode: [
                        {required: true, message: '请填写20位摄像机编码', trigger: 'blur'},
                    ],
                    cameraType: [
                        {required: true, message: '请填写摄像机类型', trigger: 'change'},
                    ],
                    positionType: [
                        {required: true, message: '请填写摄像机位置', trigger: 'change'},
                    ]
                },
                cameraTypes: [{
                        name: '车辆摄像头',
                        value: '1'
                    },
                    {
                        name: '人脸摄像头',
                        value: '2'
                    }],
                positionTypes: [{
                        name: '进口',
                        value: '1'
                    },
                    {
                        name: '出口',
                        value: '2'
                    }],
            }
        },
        watch:{
            'data':{
                handler(value){
                    if(value && JSON.stringify(value) != "{}"){
                        const keys = Object.keys(this.ruleForm);
                        for(let key of keys){
                            if(value[key] == null){
                                value[key] = '';
                            }
                            this.ruleForm[key] = value[key];
                        }
                        this.ruleForm.cameraType =  this.ruleForm.cameraType + '';
                        this.ruleForm.positionType =  this.ruleForm.positionType + '';
                    }
                }
            }
        },
        mounted(){
            if(this.data && JSON.stringify(this.data) != "{}"){
                const keys = Object.keys(this.ruleForm);
                for(let key of keys){
                    if(this.data[key] == null){
                        this.data[key] = '';
                    }
                    this.ruleForm[key] = this.data[key];
                }
                this.ruleForm.cameraType =  this.ruleForm.cameraType + '';
                this.ruleForm.positionType =  this.ruleForm.positionType + '';
            }

        },

        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.role == 'add' || !this.ruleForm.id){
                            delete this.ruleForm.id
                        }
                        this.ruleForm.companyId = this.companyId;
                        batchSaveOrUpdateCamera([this.ruleForm]).then(res => {
                            this.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                        }).catch((err) => {

                        });
                    }
                });

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }

        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-input{
        width: 200px;
    }
</style>
