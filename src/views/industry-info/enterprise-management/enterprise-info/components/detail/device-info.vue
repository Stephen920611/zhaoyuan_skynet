<template>
    <div class="container" v-scrollBar>
        <el-row class="device-item margin-d-10" v-for="(item,index) in existData" :key="index">
            <el-col :span="24" class="fa-border padding-t-10">
                <device-info-form :companyId="companyId" :ref="'form_'+index" :data="existData[index]" role="edit"></device-info-form>
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
