<template>
    <div class="container" v-scrollBar>
        <el-row class="device-item margin-d-10" v-for="(item,index) in devices" :key="index">
            <el-col :span="22" class="fa-border padding-t-10">
                <device-info-form :companyId="companyId" :ref="'form_'+index"></device-info-form>
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
    import {batchSaveOrUpdateCamera} from '@/api/industry'
    export default {
        name: "DeviceInfo",
        props:['companyId'],
        data() {
            return {
                devices:[{
                    cameraName: '',
                    cameraType: '',
                    positionType: '',
                    companyId: null,
                }]
            }
        },
        components: {deviceInfoForm},
        mounted(){

        },
        methods:{
            addDevice(){
                const device = {
                    cameraName: '',
                    cameraType: '',
                    positionType: '',
                    companyId: null,
                };
                this.devices.push(device);
            },
            delDevice(index){
                this.devices.splice(index,1)
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
