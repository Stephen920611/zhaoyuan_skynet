<template>
    <div>
        <div class="container fa-border">
            <el-row class="qualify-item margin-d-10" v-for="(item,index) in qualifys" :key="index">
                <el-col :span="23" class="fa-border padding-t-10">
                    <qualify-info-form :ref="'form_'+index" :companyId="companyId" :companyName="companyName"></qualify-info-form>
                </el-col>
                <el-col :span="1" class="margin-t-15 padding-lr-20">
                    <el-button type="primary" icon="el-icon-plus" title="添加" size="small" circle @click="addQualify" v-if="index==0"></el-button>
                    <el-button type="danger" icon="el-icon-close" title="删除" size="small" circle @click="delQualify(index)" v-if="index>0"></el-button>
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
    import {batchSaveOrUpdate} from '@/api/industry'
    export default {
        name: "AddQualifyInfo",
        props:['companyId','companyName'],
        components: { ElImageViewer,qualifyInfoForm },
        data() {
            return {
                qualifys:[{}]
            }
        },
        methods: {
            addQualify(){
                const qualify = {};
                this.qualifys.push(qualify);
            },
            delQualify(index){
                this.qualifys.splice(index,1);
            }

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
            width: 97%;
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
