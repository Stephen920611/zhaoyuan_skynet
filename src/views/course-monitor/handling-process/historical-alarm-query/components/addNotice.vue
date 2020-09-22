<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info">
                <el-form v-loading="loading" :model="form"  ref="form" class="demo-form-inline" label-position="right" label-width="120px">
                    <el-row :gutter="20">
                        <el-col :span="12" class="margin-t-10">
                            <el-form-item label="企业名称："  prop="company">
                                <el-input v-model="form.company" placeholder="企业名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" class="margin-t-10">
                            <el-form-item label="整改期限：" prop="rectification" >
                                <el-input v-model="form.rectification" placeholder="整改期限"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24" class="margin-t-10">
                            <el-form-item label="整改要求：" prop="claim" >
                                <!--<markdown-editor ref="markdownEditor" v-model="content2" height="200px" />-->
                                <tinymce v-model="form.content" :height="150" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24" class="margin-t-10">
                            <el-form-item label="附件：" prop="escortConclusion">
                                <el-upload
                                        style="width: 100%"
                                        class="upload-demo"
                                        drag
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        multiple>
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                </el-upload>


                                <!--<el-radio-group v-model="form.escortConclusion">
                                    <el-radio label="1" border >装车</el-radio>
                                    <el-radio label="0" border >卸车</el-radio>
                                </el-radio-group>-->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item style="text-align: center;margin-top: 20px">
                        <el-button type="primary" @click="onSubmit">保存</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>

            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonSubtitle from '@/components/CommonSubtitle'
    import MarkdownEditor from '@/components/MarkdownEditor'
    import Tinymce from './Tinymce'

    export default {
        name: 'editNotice',
        props: [''],
        components: {CommonSubtitle,MarkdownEditor,Tinymce},
        data() {
            return {
                disableKey: false,
                form:{
                    company:'',
                    rectification:'',
                    claim: '',
                    escortConclusion:'',
                    content:''
                },
                loading:false,//loading 效果
                fileList: [{name: '附件1', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: '附件2', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],

            }
        },
        methods: {
            //保存功能
            onSubmit(){
                console.log('onSubmit')

            },
            //上传
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            }
        },

    }
</script>
<style lang="scss" type="text/scss" scoped>
    .common-subtitle{
        font-size: 16px;
        border: none;
    }
    .common-subtitle-i{
        margin: -5px 10px -5px 0;
        height: 22px;
    }
    /deep/.el-input {
        width: 100% !important;
    }
    //upload样式
    /deep/.el-upload{
        width: 100%;
    }
    /deep/.el-upload-dragger{
        width: 100%;
    }
    /deep/.mce-statusbar{
        display: none !important;
    }


</style>
