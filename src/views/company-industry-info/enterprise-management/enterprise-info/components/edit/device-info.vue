<template>
    <div class="container" v-scrollBar>
        <el-row class="device-item margin-d-10" v-for="(item,index) in existData" :key="index">
            <el-col :span="22" class="fa-border padding-t-10">
                <device-info-form :companyId="companyId" :ref="'form_'+index" :data="existData[index]" role="edit"></device-info-form>
            </el-col>

            <el-col :span="2" class="margin-t-15 padding-lr-20">
                <el-button type="danger" icon="el-icon-close" title="删除" size="small" circle @click="delDevice(index)"></el-button>
            </el-col>
        </el-row>
        <!--编辑使用，若是之前没保存过数据，编辑时数据为空，要显示出表单输入框-->
        <el-row class="device-item margin-d-10"  v-for="(item,index) in devices" :key="'info_'+index">
            <el-col :span="22" class="fa-border padding-t-10">
                <device-info-form  :companyId="companyId" ref="form" role="add"></device-info-form>
            </el-col>

            <el-col :span="2" class="margin-t-15 padding-lr-20">
                <el-button type="primary" icon="el-icon-plus" title="添加" size="small" circle @click="addDevice" v-if="index==0"></el-button>
                <el-button type="danger" icon="el-icon-close" title="删除" size="small" circle @click="delDevice(index)" v-if="index>0"></el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import deviceInfoForm from "./device-info-form.vue"
    import {deleteCompanyCamera} from '@/api/industry'
    export default {
        name: "DeviceInfo",
        props:['companyId','data'],
        data() {
            return {
                devices:[{
                    id:null,
                    cameraName: '',
                    cameraType: '',
                    positionType: '',
                    companyId: null,
                }],
                existData:[]
            }
        },
        components: {deviceInfoForm},
        watch:{
          'data':{
              handler(value){
                  this.existData = value;
              }
          }
        },
        mounted(){
        },
        methods:{
            addDevice(){
                const device = {
                    id:null,
                    cameraName: '',
                    cameraType: '',
                    positionType: '',
                    companyId: null,
                };
                this.devices.push(device);
            },
            delDevice(index){

                //删除已存在的抓拍设备
                if(this.existData[index] && this.existData[index].id){
                    this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteCompanyCamera({id:this.existData[index].id}).then(res=>{
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
                    this.devices.splice(index,1);
                }
            },

        }
    }
</script>

<style lang="scss" scoped>
    .container{
        padding: 10px;
        position: relative;
        /deep/ .el-form-item{
            margin: 15px 0;
        }
    }
</style>
