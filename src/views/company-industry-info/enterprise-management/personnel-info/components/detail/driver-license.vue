<template>
    <div>
        <div class="container fa-border">
            <!--编辑时，数据表中已存在的数据展示-->
            <el-row class="qualify-item margin-d-10" v-for="(item,index) in driversData" :key="index">
                <el-col :span="22" class="padding-t-10">
                    <driver-license-form :ref="'form_'+index" :isDisabled="isDisabled" :workerId="workerId" :workerName="workerName" :driverData="item"></driver-license-form>
                </el-col>
            </el-row>
            <div v-if="driversData.length === 0" class="no-data" style="height: 50px">
                <div>暂无数据</div>
            </div>
        </div>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import DriverLicenseForm from "./driver-license-form";
    import {workerDriveLicenseDelete} from '@/api/industry'
    export default {
        name: "driver-license",
        props:['isDisabled','workerId','workerName','driverData'],
        components: {DriverLicenseForm, ElImageViewer },
        data() {
            return {
                driversData:[{}],
            }
        },
        watch:{
            'driverData':{
                handler(value){
                    this.driversData = value;
                }
            }
        },
        methods: {
            addQualify(){
                const qualify = {};
                this.qualifys.push(qualify);
            },
            delQualify(index){
                //删除已存在的运输资质数据
                if(this.driverData[index] && this.driverData[index].id){
                    this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        workerDriveLicenseDelete({id:this.driverData[index].id}).then(res=>{
                            this.$message({
                                showClose: true,
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.driverData.splice(index,1);
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
    /deep/ .el-form-item {
        width: calc(33% - 20px)!important;
    }
    .text-area{
        width: 100%!important;
        /deep/ .el-form-item__content {
            width: calc(100% - 151px)!important;
        }
    }
</style>
