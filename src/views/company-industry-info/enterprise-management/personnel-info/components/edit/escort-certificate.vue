<template>
    <div>
        <div class="container fa-border">
            <!--编辑时，数据表中已存在的数据展示-->
            <el-row class="qualify-item margin-d-10" v-for="(item,index) in escortData" :key="index">
                <el-col :span="23" class="padding-t-10">
                    <escort-certificate-form :ref="'form_'+index" :isDisabled="isDisabled" :workerId="workerId" :workerName="workerName" :escortData="item"  role="edit"></escort-certificate-form>
                </el-col>
                <el-col :span="1" class="margin-t-15 padding-lr-20">
                    <el-button type="danger" icon="el-icon-close" title="删除" size="small" circle @click="delQualify(index)"></el-button>
                </el-col>
            </el-row>
            <!--编辑使用，手动增删条目-->
            <el-row class="qualify-item margin-d-10" v-for="(item,index) in qualifys" :key="'info_'+index">
                <el-col :span="23" class="padding-t-10">
                    <escort-certificate-form :ref="'form_'+index" :isDisabled="isDisabled" :workerId="workerId" :workerName="workerName" :escortData="item" role="add"></escort-certificate-form>
                </el-col>
                <el-col :span="1" class="margin-t-15 padding-lr-20">
                    <el-button type="primary" icon="el-icon-plus" title="添加" size="small" circle @click="addQualify" v-if="index==0"></el-button>
                    <el-button type="danger" icon="el-icon-close" title="删除" size="small" circle @click="delQualify(index)" v-if="index>0"></el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import {workerQualificatLicenseDelete} from '@/api/industry'
    import EscortCertificateForm from "./escort-certificate-form";
    export default {
        name: "escort-certificate",
        props:['isDisabled','workerId','workerName','escortData'],
        components: {ElImageViewer,EscortCertificateForm},
        data() {
            return {
                qualifys:[{}],
            }
        },
        watch:{
            'escortData':{
                handler(value){
                    this.escortData = value;
                }
            }
        },
        methods: {
            addQualify(){
                const qualify = {

                };
                this.qualifys.push(qualify);
            },
            delQualify(index){
                //删除已存在的运输资质数据
                if(this.escortData[index] && this.escortData[index].id){
                    this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        workerQualificatLicenseDelete({id:this.escortData[index].id}).then(res=>{
                            this.$message({
                                showClose: true,
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.escortData.splice(index,1);
                        })
                    }).catch(() => {

                    });
                }else{
                    //删除未保存到数据表中的运输资质数据
                    this.qualifys.splice(index,1);
                }

            },
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        padding: 10px;
        position: relative;
        .qualify-item{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .tag-wrap{
            position: absolute;
            top:0;
            right: 0;
        }
        .text-area{
            width: 100%;
            /deep/ .el-form-item__content{
                width: calc(100% - 150px);
            }
        }
        /deep/ .el-textarea{
            width: 97%;
        }
        .file-item{
            display: inline-block;
            float: left;
            margin-right: 15px;
        }
        /*上传附件的样式*/
        .upload-item{
            width: 97%;
            .upload-demo{
                width: 100%;
                /deep/ .el-upload{
                    width: 100%;
                    &>.el-upload-dragger{
                        width: 100%;
                    }
                }
            }
        }
    }

</style>
