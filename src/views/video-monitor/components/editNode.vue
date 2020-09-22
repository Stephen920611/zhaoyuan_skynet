<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form :inline="true" :model="formInline" :rules="rules"  ref="ruleForm" class="demo-form-inline">
                    <el-form-item label="节点名称:" prop="des">
                        <el-input v-model="formInline.des" placeholder="请输入节点名称"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button  @click="resetForm('ruleForm')">重 置</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 认</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    /*引入api接口*/
    import {updateGroupNode} from '@/api/video'
    export default {
        name: "EditNode",
        props:['currentNode'],
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
            }
        },
        mounted(){
            this.formInline.des=this.currentNode.text;
        },
        watch: {
            'currentNode':{
                deep: true, //深度监听设置为 true
                handler(value){
                    this.formInline.des=value.text;
                },
                immediate: true
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let obj={id: this.currentNode.id,des:this.formInline.des};
                        updateGroupNode(obj).then(res=>{
                            this.$message({
                                type: 'success',
                                message: res.msg,
                            });
                            this.$emit('showHiddenEdit', false, true);
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
                this.formInline.des="";
            }
        }
    }
</script>

<style scoped>

</style>
