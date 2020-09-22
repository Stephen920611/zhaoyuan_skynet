<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" :rules="rules" ref="ruleForm" label-width="125px" :model="ruleForm">
                    <el-form-item label="装卸区名称:" prop="name">
                         <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="所属区域:" prop="areaId">
                        <el-select v-model="ruleForm.areaId" filterable placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.des"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述:" prop="desc" style="margin-right: 40px">
                        <el-input type="textarea" v-model="ruleForm.des" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
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
    import {ladeArea} from '@/api/industry'
    import {queryAreaList} from '@/api/map'
    export default {
        components: {CommonSubtitle},
        name: 'add-waybill',
        data() {
            return {
                ruleForm: {
                    name: '',
                    areaId: '',
                    des:'',
                },
                rules: {
                    name: [
                        { required: true, message: '请输入装卸区名称', trigger: 'blur' }
                    ],
                    areaId: [
                        { required: true, message: '请选择所属区域', trigger: 'change' },
                    ],
                },
                options:[],
            };
        },
        created(){
            this.getAllRegions();
        },
        methods: {
            submitForm(formName) {
                let self=this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
                        const params = Object.assign(this.ruleForm,{companyId:userInfo.companyId});
                        ladeArea(params).then(res => {
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
            //获取烟台市的行政区域
            getAllRegions() {
                queryAreaList({parent:'370600'}).then(res=>{
                    this.options = res.data;
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-form-item {
        width: 88%;
    }
    /deep/ .el-select {
        display: inline-block;
        position: relative;
        width: 100%;
    }
</style>
