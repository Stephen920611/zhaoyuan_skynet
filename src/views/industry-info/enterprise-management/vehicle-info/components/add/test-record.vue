<template>
    <div>
        <div class="container">
            <el-row class="qualify-item margin-d-10" v-for="(item,index) in qualifys" :key="index">
                <el-col :span="isDisabled?24:23" class="fa-border padding-t-10">
                    <test-record-form :ref="'form_'+index" :isDisabled="isDisabled" :carInfo="carInfo" ></test-record-form>
                </el-col>
                <el-col :span="1" class="margin-t-15 padding-lr-20" v-show="!isDisabled">
                    <el-button type="primary" icon="el-icon-plus" title="添加" size="small" circle @click="addQualify" v-if="index==0"></el-button>
                    <el-button type="danger" icon="el-icon-close" title="删除" size="small" circle @click="delQualify(index)" v-if="index>0"></el-button>
                </el-col>
            </el-row>
           <!-- <el-row>
                <div class="margin-td-10" style="text-align: center; width: 100%;">
                    <el-button @click="resetForm('ruleForm')">重 置</el-button>
                    <el-button type='primary' @click="submitForm('ruleForm')">保 存</el-button>
                </div>
            </el-row>-->
            <el-tag type="success" class="tag-wrap" v-show="isDisabled">有效</el-tag>
            <!--<el-tag type="danger">无效</el-tag>-->
        </div>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import TestRecordForm from './test-record-form.vue';
    import {carPressureRecordSaveOrUpdate} from '@/api/industryInfo/vehicleInfo'
    export default {
        name: "textRecord",
        props:['isDisabled','carInfo'],
        components: { ElImageViewer,TestRecordForm },
        data() {
            return {
                qualifys:[{}],
                showViewer: false, // 显示查看器
                url:'http://localhost:9527/static/img/qualify.27e02f59.jpg'
            }
        },
        methods: {
           //添加
            addQualify(){
                const qualify = {

                };
                this.qualifys.push(qualify);
            },
            //删除
            delQualify(index){
                this.qualifys.splice(index,1)
            }
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
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
            width: calc(100% - 130px)!important;
        }
    }
    .fa-border{
        padding-right: 15px;
    }
</style>
