<template>
    <div>
        <div class="container fa-border">
            <!--编辑时，数据表中已存在的数据展示-->
            <el-row class="qualify-item margin-d-10" v-for="(item,index) in existData" :key="index">
                <el-col :span="24" class="fa-border padding-t-10">
                    <qualify-info-form :ref="'form_'+index" :companyId="companyId" :companyName="companyName" :data="existData[index]" role="edit"></qualify-info-form>
                </el-col>
            </el-row>
            <!--<el-tag type="success" class="tag-wrap">有效</el-tag>-->
            <!--<el-tag type="danger">无效</el-tag>-->
        </div>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import qualifyInfoForm from './qualify-info-form.vue';
    import passParam from '@/utils/ext.passParam'
    import {deleteCompanyLincence} from '@/api/industry'
    export default {
        name: "EditQualifyInfo",
        props:['companyId','companyName','data'],
        components: { ElImageViewer,qualifyInfoForm },
        data() {
            return {
                existData:[],

            }
        },
        mounted(){},
        watch:{
            'data':{
                handler(value){
                    this.existData = value;
                }
            }
        },
        methods: {

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
        /deep/ .el-select,.el-date-editor {
            display: inline-block;
            position: relative;
            width: 185px;
        }
        /deep/ .el-textarea{
            width: 96%;
        }
        .file-item{
            display: inline-block;
            float: left;
            margin-right: 15px;
        }
        /*上传附件的样式*/
        .upload-item{
            width: 98%;
        }
    }

</style>
