<template>
    <div>
        <div class="container">
            <el-row class="qualify-item margin-d-10" v-for="(item,index) in existData" :key="index">
                <el-col :span="isDisabled?24:23" class="fa-border padding-t-10">
                    <driver-license-form :ref="'form_'+index" :isDisabled="isDisabled" :carInfo="carInfo" :data="existData[index]" role="edit" ></driver-license-form>
                </el-col>
                <el-col :span="1" class="margin-t-15 padding-lr-20" v-show="!isDisabled">
                    <el-button type="danger" icon="el-icon-close" title="删除" size="small" circle @click="delQualify(index)"></el-button>
                </el-col>
            </el-row>
            <el-row class="qualify-item margin-d-10" v-for="(item,index) in qualifys" :key="'info_'+index">
                <el-col :span="isDisabled?24:23" class="fa-border padding-t-10">
                    <driver-license-form :ref="'form_'+index" :isDisabled="isDisabled" :carInfo="carInfo" role="add" ></driver-license-form>
                </el-col>
                <el-col :span="1" class="margin-t-15 padding-lr-20" v-show="!isDisabled">
                    <el-button type="primary" icon="el-icon-plus" title="添加" size="small" circle @click="addQualify" v-if="index==0"></el-button>
                    <el-button type="danger" icon="el-icon-close" title="删除" size="small" circle @click="delQualify(index)" v-if="index>0"></el-button>
                </el-col>
            </el-row>
            <!--<el-row>
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
    import DriverLicenseForm from './driver-license-form.vue';
    import {fetchCarDrivingLicense,deleteCarDrivingLicense} from '@/api/industryInfo/vehicleInfo'
    import {mapGetters} from 'vuex'
    export default {
        name: "driverLicense",
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
           //添加一栏
            addQualify(){
                const qualify = {

                };
                this.qualifys.push(qualify);
            },
            //删除
            delQualify(index){
                //删除已存在的运输资质数据
                if(this.existData[index] && this.existData[index].id){
                    this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteCarDrivingLicense({id:this.existData[index].id}).then(res=>{
                            this.$message({
                                showClose: true,
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.existData.splice(index,1);
                        })
                    }).catch(() => {

                    });
                }else{
                    //删除未保存到数据表中的运输资质数据
                    this.qualifys.splice(index,1);
                }
            },

            //获取详情
            getData() {
                let params = {
                    carId: this.carDetail.hasOwnProperty('id') ? this.carDetail.id : null
                };
                this.listLoading = true;
                fetchCarDrivingLicense(params).then(res => {
                    this.existData = res.data;
                    /*res.data.map((item,index)=>{
                        this.$refs.form[index].ruleForm = item;
                        /!*this.$refs.form[index].validate(ktem=>{
                            console.log('111111',ktem)
                        })*!/
                    });*/

                    this.listLoading = false;
//                        this.$emit('showHiddenAdd', false, true);
                }).catch((err) => {
                    this.listLoading = false;
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
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
            width: 100%;
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
    .fa-border {
        padding-right: 15px;
    }
</style>
