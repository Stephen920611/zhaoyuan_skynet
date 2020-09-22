<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar >
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <CommonSubtitle title="基本信息" :isBold="true" style="line-height: 10px"></CommonSubtitle>
                <div class="add-form" style="padding-top: 20px">
                    <el-form label-position="right" ref="ruleForm" :inline="true" label-width="120px" :model="ruleForm"
                             v-loading="listLoading"
                    >
                        <el-form-item label="车牌号码:" prop="carNum">
                            <el-input v-model="ruleForm.carNum" :disabled="isDisabled" placeholder="请输入车牌号码"></el-input>
                        </el-form-item>
                        <el-form-item label="所属企业:" prop="companyName">
                            <el-input v-model="ruleForm.companyName" :disabled="isDisabled" disabled
                                      placeholder="请输入所属企业"></el-input>
                        </el-form-item>
                        <el-form-item label="管辖区域:" prop="areaName">
                            <el-input v-model="ruleForm.areaName" :disabled="isDisabled"
                                      placeholder="请输入管辖区域"></el-input>
                        </el-form-item>
                        <el-form-item label="车籍地:" prop="vehicleOrigin">
                            <el-input v-model="ruleForm.vehicleOrigin" :disabled="isDisabled"
                                      placeholder="请输入车籍地"></el-input>
                        </el-form-item>
                        <el-form-item label="车辆类型:" prop="carType">
                            <el-select v-model="ruleForm.carType" :disabled="isDisabled" placeholder="请选择车辆类型">
                                <el-option
                                        v-for="item in carTypeOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <!--<el-input v-model="ruleForm.carType" placeholder="请输入车辆类型"></el-input>-->
                        </el-form-item>
                        <el-form-item label="注册日期:" prop="registDate">
                            <el-date-picker type="date" placeholder="请选择注册日期" v-model="ruleForm.registDate"
                                            style="width: 100%;" :disabled="isDisabled"></el-date-picker>
                            <!--<el-input v-model="ruleForm.registDate" placeholder="请选择注册日期" ></el-input>-->
                        </el-form-item>
                        <el-form-item label="车辆状态:" prop="workingStatus">
                            <el-select v-model="ruleForm.workingStatus" :disabled="isDisabled" placeholder="请选择车辆状态">
                                <el-option
                                        v-for="item in carWorkingStatusOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <!--<el-input v-model="ruleForm.workingStatus" placeholder="请选择车辆状态"></el-input>-->
                        </el-form-item>
                        <el-form-item label="运输证状态:" prop="transportStatus">
                            <el-select v-model="ruleForm.transportStatus" :disabled="isDisabled" placeholder="请选择运输证状态">
                                <el-option
                                        v-for="item in licenceStatusOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <!--<el-input v-model="ruleForm.transportStatus" placeholder="请选择运输证状态" ></el-input>-->
                        </el-form-item>
                        <el-form-item label="车身颜色:" prop="bodyColor">
                            <el-input v-model="ruleForm.bodyColor" :disabled="isDisabled"
                                      placeholder="请输入车身颜色"></el-input>
                        </el-form-item>
                        <el-form-item label="车辆尺寸:" prop="tankSize">
                            <el-input v-model="ruleForm.tankSize" :disabled="isDisabled"
                                      placeholder="请输入车辆尺寸"></el-input>
                        </el-form-item>
                        <el-form-item label="定位终端:" prop="positionTerminal">
                            <el-input v-model="ruleForm.positionTerminal" :disabled="isDisabled"
                                      placeholder="请输入定位终端"></el-input>
                        </el-form-item>
                        <el-form-item label="定位平台:" prop="positionPlat">
                            <el-input v-model="ruleForm.positionPlat" :disabled="isDisabled"
                                      placeholder="请输入定位平台"></el-input>
                        </el-form-item>
                        <el-form-item class="other-form-item" prop="maxFilling">
                            <span slot="label">
                                <el-row style="float: right;line-height: 22px">
                                    <label>最大充装量：</label>
                                </el-row>
                                <el-row style="float: right;line-height: 12px">
                                    <label>(m3:常压或承压)</label>
                                </el-row>
                            </span>
                            <el-input v-model="ruleForm.maxFilling" :disabled="isDisabled"
                                      placeholder="请输入最大充装量"></el-input>
                        </el-form-item>
                        <!--<el-form-item class="other-form-item two-label" prop="checkLoad" label="道路运输证核定载重(吨):">-->
                        <el-form-item class="other-form-item" prop="checkLoad" >
                            <!--<span slot="label" class="font-bold" style="display: inline-block;line-height: 12px" >
                                道路运输证核定载重(吨):
                            </span>-->
                            <span slot="label">
                                <el-row style="float: right;line-height: 22px">
                                    <label>道路运输证</label>
                                </el-row>
                                <el-row style="float: right;line-height: 12px">
                                    <label>核定载重(吨):</label>
                                </el-row>
                            </span>
                            <el-input v-model="ruleForm.checkLoad" :disabled="isDisabled"
                                      placeholder="请输入道路运输证核定载重"></el-input>
                        </el-form-item>
                        <el-form-item label="危险货物品名:" class="text-area" prop="chemicalId">
                            <el-select
                                    type="textarea"
                                    v-model="ruleForm.chemicalId"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    placeholder="请选择危险货物品名"
                                    :disabled="isDisabled"
                            >
                                <el-option
                                        v-for="item in chemicalOptions"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="add-img" style="padding-top: 20px">
                    <div class="file-item" style="width:400px; height:240px">
                        <img v-if="ruleForm.url !== null && ruleForm.url !== ''"  :src="ruleForm.url" width="400px" height="240px" @click="onPreview" />
                        <div v-if="ruleForm.url === null || ruleForm.url === ''" class="no-data" style="width: 100%;height: 100%">
                            <div>暂无照片</div>
                        </div>
                        <el-image-viewer
                                v-if="showViewer"
                                :on-close="closeViewer"
                                :url-list="[ruleForm.url]"/>
                    </div>
                </div>
                <div class="info-wrap padding-lr-20" style="clear: both;">
                    <el-tabs v-model="tabActive" type="border-card" >
                        <el-tab-pane label="所属企业" name="1">
                            <belong-company :isDisabled="true" :carInfo="ruleForm" :companyData="companyData"></belong-company>
                        </el-tab-pane>
                        <el-tab-pane label="运输资质信息" name="2">
                            <transport-qualification :isDisabled="true" :carInfo="ruleForm"></transport-qualification>
                        </el-tab-pane>
                        <el-tab-pane label="行驶证信息" name="3">
                            <driver-license :isDisabled="true" :carInfo="ruleForm"></driver-license>
                        </el-tab-pane>
                        <el-tab-pane label="液化气体罐车使用证" name="4">
                            <use-certificate :isDisabled="true" :carInfo="ruleForm"></use-certificate>
                        </el-tab-pane>
                        <el-tab-pane label="压力容器(罐体)检测记录" name="5">
                            <test-record :isDisabled="true" :carInfo="ruleForm"></test-record>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import TransportQualification from "./transport-qualification";
    import DriverLicense from "./driver-license";
    import UseCertificate from "./use-certificate";
    import TestRecord from "./test-record";
    import BelongCompany from "./belong-company";
    import {getByCode, basicChemicalsList, carSaveOrUpdate, fetchCompanyCarInfo,fetchBasicCompany} from '@/api/industryInfo/vehicleInfo'
    import {mapGetters} from 'vuex'

    export default {
        name: "SeeDetail",
        props: ['carTypeOptions', 'carWorkingStatusOptions', 'licenceStatusOptions', 'treeData', 'currentRow'],
        components: {ElImageViewer,CommonSubtitle,TestRecord, UseCertificate, DriverLicense, TransportQualification, BelongCompany},
        data() {
            return {
                ruleForm: {
                    id: null,
                    companyName: '',//所属企业
                    companyId: '',//所属企业
                    carNum: '',//车牌号码
                    areaName: '',//区域名字
                    areaId: '',//区域id
                    vehicleOrigin: '',//管辖区域
//                    vehicleOrigin: '',//车籍地
                    carType: '',//车辆类型
                    registDate: '',//注册日期
                    workingStatus: '',//车辆状态
                    transportStatus: '',//运输证状态
                    bodyColor: '',//车身颜色
                    tankSize: '',//车辆尺寸
                    positionTerminal: '',//定位终端
                    positionPlat: '',//定位平台
                    maxFilling: '',//最大充装量
                    checkLoad: '',//核定载重
                    chemicalId: '',//危化品
                    url: '',//车辆图片地址
                },
                tabActive: '1',  //tab页的激活状态
                isDisabled: true,//是否可编辑状态
                listLoading: false,
                chemicalOptions: [],//危险货物品名列表项
                showViewer: false, // 显示查看器
                companyData:{},//公司信息


            }
        },
        computed: {
            ...mapGetters([
                'companyDetail',
                'carDetail',
            ])
        },
        watch: {
            'currentRow': {
                handler(newValue) {
                    this.ruleForm = newValue;
                }
            }
        },
        created() {
            this.ruleForm = this.currentRow;
            //获取危化品列表项
            this.getChemicalList();
        },
        mounted() {
//            console.log('carDetailcarDetailcarDetail',this.carDetail);
            //获取数据详情
            this.getData();
            //获取公司信息
            this.getCompany();
        },
        methods: {
            //获取详情
            getData() {
                let params = {
                    id: this.carDetail.hasOwnProperty('id') ? this.carDetail.id : null
                };
                this.listLoading = true;
                fetchCompanyCarInfo(params).then(res => {
//                    console.log('resres111', res.data);
                    this.ruleForm = res.data;

                    //管辖区域
                    if (this.treeData.length > 0) {
                        this.changeTreeData(this.treeData, res.data.areaId);
                    }

                    //危险货物名称
                    this.ruleForm.chemicalId = [];
                    res.data.carChemicalList.map((item) => {
                        this.ruleForm.chemicalId.push(item.chemicalId);
                    });

                    //车辆类型/车辆状态/运输证状态
                    this.ruleForm.carType = res.data.carType + '';//车辆类型
                    this.ruleForm.workingStatus = res.data.workingStatus + '';//车辆状态
                    this.ruleForm.transportStatus = res.data.transportStatus + '';//运输证状态

                    //处理照片
                    let obj = {
                        name: res.data.hasOwnProperty('url') ? res.data.url.substring(res.data.url.lastIndexOf('/') + 1, res.data.url.lastIndexOf('.')) + '.jpg' : '',
                        url: res.data.hasOwnProperty('url') ? res.data.url : ''
                    };
                    this.$refs.upload.filePath = [obj];


                    this.listLoading = false;
//                        this.$emit('showHiddenAdd', false, true);
                }).catch((err) => {
                    this.listLoading = false;
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })

            },
            //递归获取区域
            changeTreeData(data, areaId) {
                data.map((item, index) => {
                    if (item.type !== 'company') {
                        if (item.id === areaId) {
                            this.ruleForm.areaName = item.text;
                            return;

                        } else if (item.hasOwnProperty("nodes")) {
                            this.changeTreeData(item.nodes, areaId);
                        }
                    }


                });
            },
            //获取危化品列表项
            getChemicalList() {
                basicChemicalsList({}).then(res => {
                    res.data.map(item => {
                        this.chemicalOptions.push({
                            name: item.name,
//                            value: item.id + ''
                            value: item.id
                        })
                    })
                })
            },

            onPreview() {
                this.showViewer = true
            },
            // 关闭查看器
            closeViewer() {
                this.showViewer = false
            },
            //获取详情
            getCompany() {
                let params = {
                    id: this.carDetail.hasOwnProperty('companyId') ? this.carDetail.companyId : null
                };
                fetchBasicCompany(params).then(res => {
                    this.companyData = res.data;
//                        this.$emit('showHiddenAdd', false, true);
                }).catch((err) => {
                })

            },
        }

    }
</script>

<style lang="scss" scoped type="text/scss">
    /deep/ .el-form-item {
        width: calc(50% - 20px);
    }

    /deep/ .el-form-item__content {
        width: calc(100% - 120px);
    }

    .add-form {
        width: 60%;
        float: left;
    }

    .add-img {
        width: 40%;
        float: left;
    }

    /deep/ .el-upload-dragger {
        width: 500px;
        height: 265px;
    }
    /deep/ .el-select{
        width: 100%;
    }

    .text-area {
        width: 100%;
        /deep/ .el-form-item__content {
            width: calc(100% - 120px);
        }
        /deep/ .el-textarea, .el-select {
            width: 96%;
        }
    }

    .other-form-item {
        .label-item {
            width: 150px;
            padding-right: 12px;
            display: inline-block;
        }
        .inp-item {
            width: 185px;
            float: right;
            display: inline-block;
        }
    }

    .file-item {
        display: inline-block;
        float: left;
        margin-right: 15px;
    }
    /deep/.el-image__inner{
        height: 100% !important;
    }
    .two-label {
        /deep/ .el-form-item__label {
            line-height: 22px !important;
        }
    }
</style>
