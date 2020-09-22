<!--右侧抽屉-->
<template>
    <div class="detail-content">
        <div class="top">
            <el-form v-loading="loading" label-position="right" label-width="150px" :model="form" >
                <el-card class="box-card" >
                    <div slot="header" class="clearfix">
                        <common-subtitle title="基本信息" :isBold="true"></common-subtitle>
                    </div>
                    <div>
                        <el-row>
                            <el-col :span="14">
                                <div class="driver-content">
                                    <div class="driver-content-title">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="主车牌号：">
                                                    <el-input :disabled="isEdit" v-model="form.mainCarNum" placeholder="主车牌号"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="挂车牌号：">
                                                    <el-input :disabled="isEdit" v-model="form.carNum" placeholder="挂车牌号"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>

                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="道路运输证核定载重（吨）：" class="two-label">
                                                    <el-input :disabled="isEdit" v-model="form.load" placeholder="道路运输证核定载重（吨）"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="道路运输证编号：">
                                                    <el-input :disabled="isEdit" v-model="form.roadNum" placeholder="道路运输证编号"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>

                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="最大充装量（m3:常压或承压）：" class="two-label">
                                                    <el-input :disabled="isEdit" v-model="form.amount"
                                                              placeholder="最大充装量（m3:常压或承压）"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="液化气体罐车使用编号：" class="two-label">
                                                    <el-input :disabled="isEdit" v-model="form.carNumber" placeholder="液化气体罐车使用编号"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>

                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="GPS定位系统情况:">
                                                    <el-radio-group :disabled="isEdit" v-model="form.gps">
                                                        <el-radio label="1">正常</el-radio>
                                                        <el-radio label="0">不正常</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="压力容器（罐体）检测有效期：" class="two-label">
                                                    <el-input :disabled="isEdit" v-model="form.containerValidity"
                                                              placeholder="压力容器（罐体）检测有效期"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>

                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="车辆及罐体是否与行驶证照片一致:" class="two-label">
                                                    <el-radio-group :disabled="isEdit" v-model="form.isSame">
                                                        <el-radio label="1">正常</el-radio>
                                                        <el-radio label="0">不正常</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>


                            </el-col>
                            <el-col :span="10" style="text-align: center">
                                <el-image
                                        style="width:400px; height:240px"
                                        :src="require('@/assets/image/login_bg.png')"
                                >
                                </el-image>

                            </el-col>
                        </el-row>

                    </div>
                </el-card>

                <!--<div class="btn-content">
                    <el-button block type="primary" @click="onSubmit">
                        提交修改
                    </el-button>
                </div>-->

            </el-form>
        </div>

    </div>
</template>
<script>
    import CommonSubtitle from '@/components/Subtitle/CommonSubtitle.vue'
    export default {
        data(){
          return{
              rowData:[],
              wayBillNoTitle:"",
          }
        },
        components:{
            CommonSubtitle,
        },
    }
</script>
<style lang="less" scoped>
    @import "../style/style.waybill.less";
</style>
