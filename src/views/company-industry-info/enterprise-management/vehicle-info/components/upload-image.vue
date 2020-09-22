<template>
    <div class="container">
        <el-upload
                ref="upload"
                class="upload-demo"
                drag
                action=""
                :multiple="false"
                accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :before-upload="beforeUpload"
                :on-preview="handlePictureCardPreview"
                :http-request="httpRequest"
                :on-remove="removeHandler"
                :on-change="onChange"
                :file-list="filePath"
                list-type="picture"
                :limit=limit
                :disabled="isLate"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将照片拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-image-viewer
                v-if="dialogVisible"
                :on-close="closeViewer"
                :url-list="dialogImageUrl"
                :initial-index="dialogImageIndex"
        />
    </div>
</template>

<script>
    import {compressImage, uploadImage} from '@/utils/upload_image'
    import passParam from '@/utils/ext.passParam'
    import elImageViewer from 'element-ui/packages/image/src/image-viewer'

    export default {
        name: "",
        props: {
            limit: {
                type: Number,
//            default: ''
            },
            isLate: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dialogImageUrl: [],
                dialogImageIndex: [],
                dialogVisible: false,
                fileReader: '',
                filePath: [],  //上传的图片文件
            }
        },
        components: {elImageViewer},
        watch: {
            'filePath': {
                handler(files) {
                    let fileUrls = [];
                    files.map(file => {
                        fileUrls.push(file.url);
                    });
                    //不一定是字符串，可能是数组
//                  passParam.$emit('fileUrls',fileUrls.join(','))
//                  passParam.$emit('fileUrls',fileUrls)
                    this.$emit('setFileUrl', fileUrls);

                }
            }
        },
        mounted() {
            if (!window.FileReader) {
                console.error('Your browser does not support FileReader API!')
            }
            this.fileReader = new FileReader();
        },
        methods: {
            //文件上传成功时
            uploadSuccess(res, file, fileList) {
                this.$message.success('上传成功');
            },

            //文件上传失败时
            uploadError(res, file, fileList) {
                this.$message.error('上传失败，请重新上传');
            },
            //上传文件之前
            beforeUpload(file) {
                let isIMAGE = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
//                const isLt10M = file.size < 10 * 1024 * 1024;
//                if (this.fileList.length >= 3) {
//                    alert('At most 3 files')
//                    return false
//                }
                if (!isIMAGE) {
                    this.$message.error('上传文件只能是图片格式!');
                    return false
                }
//                if (!isLt10M) {
//                    alert('请上传小于10M的照片');
//                    return false
//                }
            },
            //自定义上传
            httpRequest(options) {
                let file = options.file;
                let filename = file.name;
//                let reader = new FileReader();
                if (file) {
                    this.fileReader.readAsDataURL(file)
                }
                this.fileReader.onload = () => {
                    let base64Str = this.fileReader.result;
                    //造成base 64位
                    let config = {
                        ...options,
                        content: "data:image/jpeg;base64," + base64Str.split(',')[1],
                        timeout: 10000,
                    };

                    // 压缩图片
                    compressImage(config).then(res => {
                        // 组合 formdata
                        const formdata = new FormData()
                        formdata.append('file', res.file)
                        formdata.append('fileType', 1)

                        // 上传
                        uploadImage('/upload/image', formdata, res).then(resp => {
                            if (resp.code === 1000 && resp.data !== '' && resp.data !== null) {
                                //保存返回地址
                                res.url = resp.data;
                                res.status = 'success';
                                options.onSuccess(res);
                            } else {
                                options.onError(res, {
                                    url: resp.data,
                                    status: 'fail',
                                })
                            }
                        }).catch(err => {
//                        this.$message.error('上传失败,删除后请重新上传');
                            options.onError(res)
                        })
                    });
                }
            },
            //文件列表移除文件时
            removeHandler(file, fileList) {
                //如果上传的是照片，才触发这个事件
                /*if (file.raw.type === 'image/jpeg' || file.raw.type === 'image/jpg' || file.raw.type === 'image/png') {
                    let index = this.filePath.indexOf(file);
                    this.filePath.splice(index, 1)
                }*/
                let index = this.filePath.indexOf(file);
                this.filePath.splice(index, 1)
            },
            //在成功以后改变原数组
            onChange(file, fileList) {
                if (file.status === 'success') {
                    let cloneData = fileList.map(val => {
                        if (val.uid === file.uid) {
                            return {
                                ...file,
                                url: file.response.url,
                                uid: file.uid,
                                status: 'success',
                                name: file.name
                            }
                        } else {
                            return val
                        }
                    });
                    this.filePath = cloneData;
                }
            },
            //图片预览
            handlePictureCardPreview(file) {
                let dialogImageUrlArr = [];
                this.filePath.map((item) => {
                    dialogImageUrlArr.push(item.url);
                });
                this.dialogImageUrl = dialogImageUrlArr;//存图片显示地址
                this.dialogImageIndex = dialogImageUrlArr.indexOf(file.url);//存点击的那个
                this.dialogVisible = true;
            },
            // 关闭查看器
            closeViewer() {
                this.dialogVisible = false;
            },
            //清除文件列表
            clearFiles() {
                this.$refs.upload.clearFiles();
                this.filePath = [];
            }
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .container {
        width: 100%;
    }

    .upload-demo {
        width: 100%;
        /deep/ .el-upload {
            width: 100%;
            & > .el-upload-dragger {
                width: 100%;
            }
        }
    }

    /deep/ .el-upload-dragger {
        height: 185px !important;
    }

</style>
