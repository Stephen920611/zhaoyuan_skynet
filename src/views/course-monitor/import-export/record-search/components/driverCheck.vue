<template>
    <div>
        <!--<common-subtitle title="贫困户满意度"></common-subtitle>-->
        <el-form v-loading="loading" label-position="right" label-width="120px" :model="driverInfo" >
            <div>
                <el-row>
                    <el-col :span="14">
                        <div class="driver-content">
                            <div style="width:150px; height: 210px">
                                <el-image
                                        style="width:150px; height: 190px"
                                        :src="driverInfo.url"
                                        :lazy='true'
                                        :preview-src-list="[driverInfo.url]"
                                >
                                    <div slot="error" class="image-slot el-image__error">
                                        {{driverInfo.url === null || driverInfo.url === '' ? '暂无照片' : '加载失败'}}
                                    </div>
                                </el-image>
                                <!--<div style="height: 20px;line-height: 20px;font-size: 14px">相似度：</div>-->
                            </div>

                            <div class="driver-content-title">
                                <el-form-item label="驾驶员姓名：">
                                    <el-input :disabled="isEdit" v-model="driverInfo.name"
                                              placeholder=""></el-input>
                                </el-form-item>
                                <el-form-item label="身份证号：">
                                    <el-input :disabled="isEdit" v-model="driverInfo.personNum"
                                              placeholder=""></el-input>
                                </el-form-item>
                                <el-form-item label="道路运输驾驶员从业资格证编号:" class="two-label">
                                    <el-input :disabled="isEdit" v-model="workerQualificatLicenseDTO.licenceCode"
                                              placeholder=""></el-input>
                                </el-form-item>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="是否黑名单人员:">
                                            <el-radio-group :disabled="isEdit" v-model="driverInfo.blackList">
                                                <el-radio :label="1">是</el-radio>
                                                <el-radio :label="0">否</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="资质是否过期:">
                                            <el-radio-group :disabled="isEdit"
                                                            v-model="driverInfo.qualificationExpired">
                                                <el-radio :label="1">是</el-radio>
                                                <el-radio :label="0">否</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                                <el-row :gutter="20">
                                    <el-col :span="12" class="margin-t-10">
                                        <el-form-item label="驾驶证号：">
                                            <el-input :disabled="isEdit" v-model="driveLicense.licenceCode"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" class="margin-t-10">
                                        <el-form-item label="准驾车型：">
                                            <el-input :disabled="isEdit" v-model="driveLicense.allowType"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12" class="margin-t-10">
                                        <el-form-item label="初次领证日期：">
                                            <el-input :disabled="isEdit" v-model="driveLicense.givingTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" class="margin-t-10">
                                        <el-form-item label="证件有效期：">
                                            <el-input :disabled="isEdit" v-model="driveLicense.endUseTime"
                                                      placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                    </el-col>
                    <el-col :span="10" style="text-align: center">
                        <el-image
                                style="width:400px; height: 240px"
                                :src="form.personCapture.length > 0 ? form.personCapture[0].bigCaptureUrl : ''"
                                :preview-src-list="form.personCapture.length > 0 ? [form.personCapture[0].bigCaptureUrl] : []"
                        >
                            <div slot="error" class="image-slot el-image__error">
                                {{ form.personCapture.length > 0 ? form.personCapture[0].bigCaptureUrl === null || form.personCapture[0].bigCaptureUrl === '' ? '暂无照片' :
                                '加载失败':'暂无照片'}}
                            </div>
                        </el-image>
                    </el-col>
                </el-row>


            </div>

        </el-form>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {getStorage} from '@/utils/storage'
    import {fetchWorkerCheckInfo} from '@/api/courseMonitor/importExport'

    export default {
        components: {},
        props: ['form','driverInfo','driveLicense','workerQualificatLicenseDTO'],
        data() {
            return {
                isEdit: true,//s是否可编辑，true为不可编辑，false为可编辑
                loading: false,
                personUrl:'',
            }
        },
        watch: {
            'form':{
                handler(value){
                    if(value.hasOwnProperty('personCapture')){
                        this.personUrl = value.personCapture[0].bigCaptureUrl
                    }
                }
            }
        },
        mounted() {
        },
        methods: {


        }
    }
</script>
<style lang="scss" scoped type="text/scss">
    //驾驶员资质情况
    .driver-content {
        display: flex;
        justify-content: space-between;
        .driver-content-title {
            margin-left: 20px;
            width: calc(100% - 170px);
            .el-form-item {
                margin-bottom: 15px
            }

        }
    }

    /deep/.el-input{
        width: calc(100% - 20px) !important;
    }

    .two-label {
        /deep/ .el-form-item__label {
            line-height: 18px !important;
        }
    }

    //下部tab样式
    .tab-groups {
        /deep/ .el-tabs__item {
            font-weight: bold;
            font-size: 15px;
        }
        margin-top: 20px;
        //tab键
        /deep/ .el-tabs__nav-wrap::after {
            height: 2px !important;
        }

        /deep/ .el-tabs__active-bar {
            height: 2px !important;
        }
        /deep/ .el-tabs__item.is-active {
            /deep/ .el-button--primary {
                background: #1890ff !important

            }
        }
        .el-select {
            width: 100%;
        }
        /deep/ .el-input {
            width: 100% !important;
        }
    }

    //.el-divider--horizontal
    .el-divider--horizontal {
        margin: 12px 0;
    }

    .btn-content {
        width: 100%;
        text-align: center;
        margin: 30px 0;
        box-sizing: border-box;
    }

</style>
