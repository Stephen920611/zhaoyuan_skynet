<template>
    <div>
        <div class="container">
            <el-row class="qualify-item margin-d-10" v-if="existData.length > 0" v-for="(item,index) in existData" :key="index">
                <el-col :span="isDisabled?24:23" class="fa-border padding-t-10">
                    <driver-license-form :ref="'form_'+index" :isDisabled="isDisabled" :carInfo="carInfo" :data="existData[index]" ></driver-license-form>
                </el-col>
            </el-row>
            <div v-if="existData.length === 0" class="no-data" style="height: 50px">
                <div>暂无数据</div>
            </div>

            <!--<el-tag type="success" class="tag-wrap" v-show="isDisabled">有效</el-tag>-->
            <!--<el-tag type="danger">无效</el-tag>-->
        </div>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import DriverLicenseForm from './driver-license-form.vue';
    import {fetchCarDrivingLicense,deleteCarDrivingLicense} from '@/api/industryInfo/vehicleInfo'
    import {mapGetters} from 'vuex'
    export default {
        name: "driver-license",
        props:['isDisabled','carInfo'],
        components: { ElImageViewer,DriverLicenseForm },
        data() {
            return {
                qualifys:[{}],
                existData:[],
                showViewer: false, // 显示查看器
                url:'http://localhost:9527/static/img/qualify.27e02f59.jpg'
            }
        },
        computed: {
            ...mapGetters([
                'companyDetail',
                'carDetail',
            ])
        },
        mounted(){
            this.getData();
        },
        methods: {
            onPreview() {
                this.showViewer = true
            },
            // 关闭查看器
            closeViewer() {
                this.showViewer = false
            },
            addQualify(){
                const qualify = {

                };
                this.qualifys.push(qualify);
            },
            delQualify(index){
                this.qualifys.splice(index,1)
            },
            //获取详情
            getData() {
                let params = {
                    carId: this.carDetail.hasOwnProperty('id') ? this.carDetail.id : null
                };
                this.listLoading = true;
                fetchCarDrivingLicense(params).then(res => {
                    this.existData = res.data;

                    this.listLoading = false;
                }).catch((err) => {
                    this.listLoading = false;
                })

            },
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
</style>
