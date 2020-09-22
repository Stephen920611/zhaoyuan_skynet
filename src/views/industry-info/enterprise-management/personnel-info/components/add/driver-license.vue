<template>
    <div>
        <div class="container fa-border">
            <el-row class="qualify-item margin-d-10" v-for="(item,index) in qualifys" :key="index">
                <el-col :span="isDisabled?24:23" class="fa-border padding-t-10">
                    <driver-license-form :ref="'form_'+index" :isDisabled="isDisabled" :workerId="CurrentWorkerId" :workerName="CurrentWorkerName"></driver-license-form>
                </el-col>
                <el-col :span="1" class="margin-t-15 padding-lr-20" v-show="!isDisabled">
                    <el-button type="primary" icon="el-icon-plus" title="添加" size="small" circle @click="addQualify" v-if="index==0"></el-button>
                    <el-button type="danger" icon="el-icon-close" title="删除" size="small" circle @click="delQualify(index)" v-if="index>0"></el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import DriverLicenseForm from "./driver-license-form";
    export default {
        name: "driver-license",
        props:['isDisabled','workerId','workerName'],
        components: {DriverLicenseForm, ElImageViewer },
        data() {
            return {
                qualifys:[{}],
                CurrentWorkerId:this.workerId,
                CurrentWorkerName:this.workerName,
            }
        },
        watch:{
            'workerId':{
                handler(value){
                    this.CurrentWorkerId = value;
                }
            },
            'workerName':{
                handler(value){
                    this.CurrentWorkerName = value;
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
                this.qualifys.splice(index,1)
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
