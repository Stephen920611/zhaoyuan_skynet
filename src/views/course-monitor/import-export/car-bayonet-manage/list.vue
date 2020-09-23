<template>
    <div class="container">
        <el-card class="box-card box-left">
            <div class="content" v-scrollBar>
                <div class="search-wrap">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="企业名称：">
                            <el-input placeholder="请输入企业名称" v-model="companyName"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="line-item" :class="{'active':index==selectedItemIndex}" v-for="(item,index) in list"
                     :key="index" @click="handleSelect(index)">
                    <div class="base-info">
                        <el-row class="margin-td-10">
                            <el-col :span="14" class="text-left">进出目的：{{item.areaName}}</el-col>
                            <el-col :span="10" class="text-right">货物数量：{{item.number}}吨</el-col>
                        </el-row>
                        <el-row class="margin-td-10">企业名称：<span class="ellipsis-l1"
                                                                :title="item.companyName">{{item.companyName}}</span>
                        </el-row>
                        <el-row class="margin-td-10">进出时间：{{item.createTime}}</el-row>
                    </div>
                </div>
            </div>
        </el-card>
        <el-card class="box-card box-right" ref="container">
            <el-row class="car-wrap margin-d-20" ref="carInfo">
                <el-col :offset="2" :span="8" class="fa-border" style="padding: 10px 20px">
                    <el-row class="text-center car-item">
                        <el-image style="width:100%; height: 200px;margin-bottom: 10px"
                                  :src="require('@/assets/image/login_bg.png')"></el-image>
                        <el-tag>进</el-tag>
                    </el-row>
                    <el-row>
                        <p class="margin-td-10 font-size-14">地点：龙口工业园A区南大门</p>
                        <p class="margin-td-10 font-size-14">
                            <span class="text-left">称重：35吨</span>
                            <span class="text-right float-right">时间：2020-07-08 14:20:23</span>
                        </p>
                    </el-row>
                </el-col>
                <el-col :offset="2" :span="8" class="fa-border" style="padding: 10px 20px">
                    <el-row class="text-center car-item">
                        <el-image style="width:100%; height: 200px;margin-bottom: 10px"
                                  :src="require('@/assets/image/login_bg.png')"></el-image>
                        <el-tag type="warning">出</el-tag>
                    </el-row>
                    <el-row>
                        <p class="margin-td-10 font-size-14">地点：龙口工业园A区南大门</p>
                        <p class="margin-td-10 font-size-14">
                            <span class="text-left">称重：35吨</span>
                            <span class="text-right float-right">时间：2020-07-08 14:20:23</span>
                        </p>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="info-wrap" :style="{height:tabHeight}">
                <el-tabs type="border-card">
                    <el-tab-pane label="运单信息">
                        <div class="waybill-wrap" v-scrollBar>
                            <el-form label-position="right" ref="ruleForm" :inline="true" label-width="125px">
                                <!-------------------------运单发起----------------------------------->
                                <CommonSubtitle title="基本信息" :isBold="true"></CommonSubtitle>
                                <el-form-item label="托运方单位名称:" prop="consignorCompanyName" style="margin-right: 20px">
                                    <el-input v-model="rowData.consignorCompanyName" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="装货方单位名称:" prop="loadCompanyName" style="margin-right: 20px">
                                    <el-input v-model="rowData.loadCompanyName" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="收货方单位名称:" prop="receiverCompanyName" style="margin-right: 20px">
                                    <el-input v-model="rowData.receiverCompanyName" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="托运方联系电话:" prop="consignorTelephone" style="margin-right: 20px">
                                    <el-input v-model="rowData.consignorTelephone" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="装货方联系电话:" prop="loadTelephone" style="margin-right: 20px">
                                    <el-input v-model="rowData.loadTelephone" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="收货方联系电话:" prop="receiverTelephone" style="margin-right: 20px">
                                    <el-input v-model="rowData.receiverTelephone" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="危险货物名称:" prop="cargoName" style="margin-right: 20px">
                                    <el-input v-model="rowData.cargoName" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="数量(吨/立方):" prop="cargoNum" style="margin-right: 20px">
                                    <el-input v-model="rowData.cargoNum" disabled></el-input>
                                </el-form-item>

                                <!-------------------------运输信息----------------------------------->
                                <CommonSubtitle title="运输信息" :isBold="true"></CommonSubtitle>
                                <el-form-item label="承运方单位名称:" prop="carrierCompanyName" style="margin-right: 20px">
                                    <el-input v-model="rowData.carrierCompanyName" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="经营许可证号:" prop="carrierCompanyLicenseNo" style="margin-right: 20px">
                                    <el-input v-model="rowData.carrierCompanyLicenseNo" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="联系电话:" prop="carrierCompanyTelephone" style="margin-right: 20px">
                                    <el-input v-model="rowData.carrierCompanyTelephone" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="应急联系方式:" prop="emergencyTelephone" style="margin-right: 20px">
                                    <el-input v-model="rowData.emergencyTelephone" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="拖车车牌号码:" prop="carNo" style="margin-right: 20px">
                                    <el-input v-model="rowData.carNo" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="道路运输证号:" prop="carTransportLicenseNo" style="margin-right: 20px">
                                    <el-input v-model="rowData.carTransportLicenseNo" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="挂车车牌号码:" style="margin-right: 20px">
                                    <el-input v-model="rowData.trailerNo" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="道路运输证号:" style="margin-right: 20px">
                                    <el-input v-model="rowData.trailerTransportLicenseNo" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="驾驶员姓名:" prop="driverName" style="margin-right: 20px">
                                    <el-input v-model="rowData.driverName" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="驾驶员身份证号:" prop="driveridCardNo" style="margin-right: 20px">
                                    <el-input v-model="rowData.driveridCardNo" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="从业资格证:" prop="driverLicenseNo" style="margin-right: 20px">
                                    <el-input v-model="rowData.driverLicenseNo" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="驾驶员联系电话:" prop="driverTelephone" style="margin-right: 20px">
                                    <el-input v-model="rowData.driverTelephone" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="押运员姓名:" prop="escortName" style="margin-right: 20px">
                                    <el-input v-model="rowData.escortName" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="押运员身份证号:" prop="escoridCardNo" style="margin-right: 20px">
                                    <el-input v-model="rowData.escoridCardNo" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="从业资格证:" prop="escorLicenseNo" style="margin-right: 20px">
                                    <el-input v-model="rowData.escorLicenseNo" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="押运员联系电话:" prop="escorTelephone" style="margin-right: 20px">
                                    <el-input v-model="rowData.escorTelephone" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="装货日期:" prop="loadDate" style="margin-right: 20px">
                                    <el-input v-model="rowData.loadDate" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="预计到达日期:" prop="expectedArrivalDate" style="margin-right: 20px">
                                    <el-input v-model="rowData.expectedArrivalDate" disabled></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="仓库信息"></el-tab-pane>
                </el-tabs>
            </el-row>
        </el-card>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/Subtitle/CommonSubtitle.vue'


    export default {
        name: 'OrderTrackList',
        components: {Pagination, CommonSubtitle},
        data() {
            return {
                companyName:'',
                list: [{
                    "id": 1,
                    "areaId": 2,
                    "companyId": 1,
                    "lng": 121.4484,
                    "lat": 37.4815,
                    "aim": "装货",
                    "updateTime": null,
                    "createTime": "2020-06-17 11:11:16",
                    "areaName": "芝罘区",
                    "companyName": "安徽迅捷物流有限责任公司运输分公司",
                    "name": "斗神停车场",
                    "number": 22
                }, {
                    "id": 2,
                    "areaId": 2,
                    "companyId": 1,
                    "lng": 121.3484,
                    "lat": 37.4615,
                    "aim": "装货",
                    "updateTime": null,
                    "createTime": "2020-06-17 11:11:16",
                    "areaName": "芝罘区",
                    "companyName": "安徽迅捷物流有限责任公司运输分公司",
                    "name": "斗星停车场",
                    "number": 35
                }, {
                    "id": 3,
                    "areaId": 2,
                    "companyId": 1,
                    "lng": 121.3584,
                    "lat": 37.4515,
                    "aim": "装货",
                    "updateTime": null,
                    "createTime": "2020-06-17 11:11:16",
                    "areaName": "芝罘区",
                    "companyName": "安徽迅捷物流有限责任公司运输分公司",
                    "name": "斗华停车场",
                    "number": 35
                }, {
                    "id": 4,
                    "areaId": 2,
                    "companyId": 1,
                    "lng": 121.3784,
                    "lat": 37.4015,
                    "aim": "装货",
                    "updateTime": null,
                    "createTime": "2020-06-17 11:11:16",
                    "areaName": "芝罘区",
                    "companyName": "安徽迅捷物流有限责任公司运输分公司",
                    "name": "斗牛停车场",
                    "number": 30
                }],
                rowData: {
                    "id": 161,
                    "wayBillNo": "1361703501",
                    "wayBillStatus": 1,
                    "consignorCompanyName": "山东齐鲁物流有限公司",
                    "consignorTelephone": "15063532651",
                    "receiverCompanyName": "山东省龙口市化工厂",
                    "receiverTelephone": "15063532653",
                    "loadTelephone": "15063532652",
                    "loadCompanyName": "山东省烟台万丰药业有限公司",
                    "loadPlace": null,
                    "loadDate": "2020-07-07 10:33:11",
                    "transportDestination": null,
                    "expectedArrivalDate": "2020-07-10 00:00:00",
                    "carrierCompanyId": 3,
                    "carrierCompanyName": "山东省烟台鑫润精细化工有限公司",
                    "carrierCompanyLicenseNo": "D552000052",
                    "carrierCompanyTelephone": "13145567889",
                    "emergencyTelephone": "0535-8625324",
                    "carId": 50,
                    "carNo": "鲁F76299",
                    "carTransportLicenseNo": "115065319",
                    "trailerNo": "鲁F26461",
                    "trailerTransportLicenseNo": "382032791",
                    "escortId": 70,
                    "escortName": "李一一",
                    "escoridCardNo": "522425198910202000",
                    "escorLicenseNo": "12121555",
                    "escorTelephone": "17856562542",
                    "cargoId": null,
                    "cargoName": "硝酸",
                    "cargoNum": 45.0,
                    "transportPrecautions": null,
                    "updateTime": null,
                    "createTime": "2020-07-07 10:33:14",
                    "waitLoadTime": null,
                    "transportTime": null,
                    "waitUnloadTime": null,
                    "transportCompleteTime": null,
                    "consignorCompanyId": 4,
                    "receiverCompanyId": 1,
                    "loadCompanyId": 2,
                    "trailerId": 97,
                    "eleWaybillCheck": null,
                    "driverInfo": null,
                    "trailerInfo": null,
                    "carInfo": null,
                    "escortInfo": null
                },
                selectedItemIndex: null,
                tabHeight:0, //动态给tabs容器赋值高度
            }
        },

        created() {
            this.$nextTick(()=>{
                const boxHeight = this.$refs.container.$el.offsetHeight;
                const topHeight = this.$refs.carInfo.$el.offsetHeight;
                this.tabHeight = boxHeight - topHeight - 60 + 'px';
//                console.log(boxHeight,topHeight,"##");
            })


        },
        methods: {
            handleSelect(index){
                this.selectedItemIndex = index;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        height: calc(100vh - 110px);
        padding: 15px;
        .box-left {
            width: 25%;
            height: 100%;
            display: inline-block;
            float: left;
        }
        .box-right {
            width: calc(75% - 20px);
            height: 100%;
            display: inline-block;
            margin-left: 20px;
        }
    }
    /deep/ .el-card__body,.el-tabs,.el-tab-pane{
        height: 100%;
    }
    /deep/ .el-tabs__content{
        height: calc(100% - 40px);
    }
    .car-item{
        position: relative;
        .el-tag{
            position: absolute;
            top: 0;
            right: 0;
        }
    }
    .waybill-wrap{
        height: 100%;
        position: relative;
    }
    .content {
        width: 100%;
        height: 100%;
        padding-right: 12px;
        position: relative;
    }

    .min-content {
        height: calc(100% - 178px);
    }

    .line-item {
        padding: 10px 18px 5px 15px;
        border: 1px solid #eee;
        border-radius: 5px;
        margin-bottom: 15px;
        cursor: pointer;
        &.active {
            border: 1px solid #1a70dc;
            background-color: #f7fcff;
        }
        .hr-line {
            width: 100%;
            height: 1px;
            background: #eee;
            margin: 8px 0;
        }
        p {
            font-size: 15px;
            &.title {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 15px;
            }
            &:not(.title) {
                margin-bottom: 8px;
                color: #525252;
            }
        }
        .base-info {
            font-size: 14px;
        }
        .des-info {
            margin-bottom: 12px;
            p {
                line-height: 22px;
            }
        }
        .btn-wrap {
            span {
                cursor: pointer;
            }
            i.fa {
                margin-left: 8px;
                font-size: 16px;
                color: #1296DB;
            }
        }

    }
</style>
