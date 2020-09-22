<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form :inline="true" :model="formInline" :rules="rules"  ref="ruleForm" label-width="120px" class="demo-form-inline">
                    <el-form-item label="根节点:">
                        <el-input v-model="formInline.rootName" :disabled=true></el-input>
                    </el-form-item>
                    <el-form-item label="上级节点:" v-show="formInline.rootName!=this.formInline.parentName">
                        <el-input v-model="formInline.parentName" :disabled=true></el-input>
                    </el-form-item>
                    <el-form-item label="节点名称:" prop="des">
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
    import {newGroupNode} from '@/api/video'
    export default {
        props:['currentNode','rootData','GroupParentNode'],
        name: "add-node",
        data(){
           return{
               formInline: {
                   rootName:'',
                   parentName:'',
                   des: '',
               },
               rules: {
                   des: [
                       { required: true, message: '请输入节点名称', trigger: 'blur' }
                   ]
               },
               ifDisplayParent:true,
           }
        },
        mounted(){
          this.formInline.rootName=this.rootData.text;
          this.formInline.parentName=this.currentNode.text;
        },
        watch: {
            rootData: {
                deep: true, //深度监听设置为 true
                handler: function (newV) {
                    this.formInline.rootName=newV.text;
                },
                immediate: true
            },
            'currentNode':{
                handler(value){
                    this.formInline.parentName=value.text;
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let obj={rootId:this.rootData.id,parentId:this.currentNode.id,userId:this.currentNode.userId,des:this.formInline.des};
                        newGroupNode(obj).then(res=>{
                            this.$message({
                                type: 'success',
                                message: res.msg
                            });
                            this.$emit('showHiddenAddNode', false, true);
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

<style scoped>

</style>
