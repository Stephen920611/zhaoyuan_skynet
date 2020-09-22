<template>
    <div>
        <div class="form-container">
            <el-form label-position="right" ref="ruleForm" :inline="true" label-width="150px" :model="ruleForm"
                     :rules="rules" class="padding-t-10">
                <div class="form-add-container">
                    <div class="add-container" >
                        <el-row :gutter="20" >
                            <el-col :span="8">
                                <el-form-item label="24小时报警电话:" prop="emergencyCall">
                                    <el-input v-model="ruleForm.emergencyCall" :disabled="isDisabled"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="联系人姓名:" prop="name">
                                    <el-input v-model="ruleForm.name" :disabled="isDisabled"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="联系人电话:" prop="phone">
                                    <el-input v-model="ruleForm.phone" :disabled="isDisabled"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="add-icon">
                        <i class="el-icon-circle-plus-outline" style="cursor: pointer;" @click="addRow"></i>
                    </div>
                </div>
                <template>
                    <div class="form-add-container" v-for="(val,idx) in rowOtherData" :key="idx">
                        <div class="add-container" >
                            <el-row :gutter="20" >
                                <el-col :span="8">
                                    <el-form-item label="24小时报警电话:" prop="emergencyCall">
                                        <el-input v-model="val.emergencyCall" :disabled="isDisabled"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="联系人姓名:" prop="name">
                                        <el-input v-model="val.name" :disabled="isDisabled"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="联系人电话:" prop="phone">
                                        <el-input v-model="val.phone" :disabled="isDisabled"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="add-icon">
                            <i class="el-icon-remove-outline" style="cursor: pointer;" @click="reduceRow" ></i>
                        </div>
                    </div>
                </template>

                <el-row>
                    <el-col :span="24" >
                        <el-form-item label="主要职责：" prop="duty">
                            <el-input type="textarea" v-model="ruleForm.duty" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写主要职责"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" >
                        <el-form-item label="注意事项：" prop="precautions">
                            <el-input type="textarea" v-model="ruleForm.precautions" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入注意事项"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注：" prop="des">
                            <el-input type="textarea" v-model="ruleForm.des" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import passParam from '@/utils/ext.passParam'

    export default {
        name: "DriverLicenseForm",
        props: ['isDisabled',],
        data() {
            return {
                ruleForm: {
                    emergencyCall:'',
                    name:'',
                    phone:'',
                    duty:'',
                    des:'',
                    precautions:'',

                },
                rules: {
                    emergencyCall:[
                        {required: true, message: '请填写24小时报警电话', trigger: 'change'},
                    ],
                    name:[
                        {required: true, message: '请填写联系人姓名', trigger: 'change'},
                    ],
                    phone:[
                        {required: true, message: '请填写联系人电话', trigger: 'change'},
                    ],
                    duty:[
                        {required: true, message: '请填写主要职责', trigger: 'change'},
                    ]
                },
                rowOtherData: [],//增添条件数组
                rowOtherDataTotal: 1,
            }
        },
        watch: {
            /*carInfo: {
                deep: true, //深度监听设置为 true
                handler: function (newV, oldV) {
                    this.ruleForm.carId = this.carInfo.id;
                },
                immediate: true
            }*/
        },
        mounted() {
        },
        methods: {
            //重置：清除表单数据
            resetForm() {
                //重置默认表单
                this.$refs['ruleForm'].resetFields();
                //重置添加的行的内容
                this.rowOtherData=[];
                this.rowOtherDataTotal=1;
            },
            //条件检索 - 增加一行
            addRow(e) {
                //添加的行数不能多于可选择项的长度
                    this.rowOtherDataTotal++;
                    this.rowOtherData.push({
                        emergencyCall:'',
                        name:'',
                        phone:'',
                        key: this.rowOtherDataTotal
                    })

            },
            //条件检索 - 减少一行
            reduceRow(e,index) {
                //如果是第一行，带加号的
                this.rowOtherData.splice(index,1);
            },


        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .container {
        padding: 10px;
        position: relative;
        .qualify-item {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .tag-wrap {
            position: absolute;
            top: 0;
            right: 0;
        }
        .text-area {
            width: 100%;
            /deep/ .el-form-item__content {
                width: calc(100% - 180px);
            }
        }
        /deep/ .el-select, .el-date-editor {
            display: inline-block;
            position: relative;
            /*width: 185px;*/
            width: 100%;
        }

        .file-item {
            display: inline-block;
            float: left;
            margin-right: 15px;
        }
        /*上传附件的样式*/
        .upload-item {
            width: 100%;
            margin-right: 0!important;
            .container{
                padding: 0;
            }
        }

    }

    /*form表单样式*/
    .form-container {
        /deep/ .el-form-item {
            width: 100% !important;
        }
        /deep/ .el-form-item__content {
            width: calc(100% - 150px) !important;
        }
        /deep/ .el-textarea {
            width: 100%;
        }
        .form-add-container{
            display: flex;
            justify-content: space-between;
            .add-container{
                width: calc(100% - 80px);
            }
            .add-icon{
                width: 80px;
                text-align: center;
                line-height:36px
            }
        }
    }

</style>
