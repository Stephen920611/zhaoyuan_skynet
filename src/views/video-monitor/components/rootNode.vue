<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form :inline="true" :model="formInline" :rules="rules"  label-width="120px" ref="ruleForm" class="demo-form-inline">
                    <el-form-item label="节点名称:" prop="des" style="width: 100%">
                        <el-input v-model="formInline.des" placeholder="请输入节点名称"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button  @click="resetForm('ruleForm')">重 置</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">添 加</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    /*引入api接口*/
    import {newGroupRoot} from '@/api/video'
    export default {
        name: "root-node",
        data() {
            return {
                formInline: {
                    des: '',
                },
                rules: {
                    des: [
                        { required: true, message: '请输入节点名称', trigger: 'blur' }
                    ]
                },
                userInfo:null,//用户信息
            }
        },
        mounted() {
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let obj={userId: this.userInfo.id,des:this.formInline.des,isPublic:1};
                        newGroupRoot(obj).then(res=>{
                            this.$message({
                                type: 'success',
                                message: res.msg
                            });
                            this.$emit('showHiddenAdd', false, true);
                        }).catch(err=>{

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .el-form-item__content {
        width: calc(100% - 180px);
    }
</style>
