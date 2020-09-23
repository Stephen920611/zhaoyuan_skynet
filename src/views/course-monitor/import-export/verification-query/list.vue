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
                            <el-button type="primary" @click="getCompanyData">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="height: 615px">
                    <div class="line-item" :class="{'active':index==selectedItemIndex}" v-for="(item,index) in list"
                         :key="index" @click="handleSelect(index)"   v-loading="loading">
                        <div class="base-info">
                            <el-row class="margin-td-10">企业名称：<span class="ellipsis-l1"
                                                                    :title="item.toCompanyName">{{item.toCompanyName}}</span>
                            </el-row>
                            <el-row class="margin-td-10">进出时间：{{item.departPortDate}}</el-row>
                        </div>
                    </div>
                </div>
                <!-- 分页控件 -->
                <pagination
                    v-show="total > 0"
                    :total="total"
                    :page.sync="listQuery.page"
                    :limit.sync="listQuery.size"
                    style="padding:0px !important"
                    class="pagination"
                    :pageSizes="[7]"
                    :pagerCount="7"
                    @pagination="getCompanyData"
                />
            </div>
        </el-card>
        <el-card class="box-card box-right" ref="container">
            <el-row class="car-wrap margin-d-20" ref="carInfo">
                <el-col :offset="2" :span="8" class="fa-border" style="padding: 10px 20px">
                    <el-row class="text-center car-item">
                        <el-image style="width:100%; height: 200px;margin-bottom: 10px"
                                  :src="carPhoto"></el-image>
                        <el-tag>车</el-tag>
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
                                  :src="personnelPhoto"></el-image>
                        <el-tag type="warning">人</el-tag>
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
                    <el-tab-pane label="车辆信息">
                        <div class="waybill-wrap" v-scrollBar>
                            <el-form label-position="right"  ref="ruleForm" :inline="true" label-width="150px" :model="ruleForm">
                                <el-form-item label="企业名称:" prop="companyName">
                                    <el-input v-model="ruleForm.companyName" disabled></el-input>
                                </el-form-item>
                                <el-form-item  prop="creditCode" class="other-form-item">
                            <span slot="label">
                                <el-row style="float: right;line-height: 22px">
                                    <label>工商注册号：</label>
                                </el-row>
                                <el-row style="float: right;line-height: 12px">
                                    <label>(统一社会信用码)</label>
                                </el-row>
                            </span>
                                    <el-input v-model="ruleForm.creditCode" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="行政区划:" prop="areaId">
                                   <!-- <el-select v-model="ruleForm.areaId" placeholder="请选择行政区划" @change="handleChangeArea" disabled>
                                        <el-option
                                            v-for="item in regions"
                                            :label="item.des"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>-->
                                    <el-input v-model="ruleForm.areaName" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="行业类别:" prop="industry">
                                   <!-- <el-select v-model="ruleForm.industry" placeholder="请选择行业类别" disabled>
                                        <el-option
                                            v-for="item in industrys"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>-->
                                    <el-input v-model="ruleForm.industry" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="企业类型:" prop="companyType">
                                   <!-- <el-select multiple v-model="ruleForm.companyType" placeholder="请选择企业类型" disabled>
                                        <el-option
                                            v-for="item in companyTypes"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>-->
                                    <el-input v-model="ruleForm.companyType" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="企业状态:" prop="businessStatus">
                                  <!--  <el-select v-model="ruleForm.businessStatus" placeholder="请选择企业状态" disabled>
                                        <el-option
                                            v-for="item in businessStatus"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>-->
                                    <el-input v-model="ruleForm.businessStatus" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="经济类型:" prop="companyEconomicType">
                                    <!--<el-select v-model="ruleForm.companyEconomicType" placeholder="请选择经济类型" disabled>
                                        <el-option
                                            v-for="item in companyEconomicTypes"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>-->
                                    <el-input v-model="ruleForm.companyEconomicType" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="企业电话:" prop="companyPhone">
                                    <el-input v-model="ruleForm.companyPhone" disabled></el-input>
                                </el-form-item>

                                <el-form-item label="责任人姓名:" prop="header">
                                    <el-input v-model="ruleForm.header" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="主要责任人电话:" prop="headerPhone">
                                    <el-input v-model="ruleForm.headerPhone" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="安全主管:" prop="safetySupervisorName">
                                    <el-input v-model="ruleForm.safetySupervisorName" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="安全主管电话:" prop="safetySupervisorTelephone">
                                    <el-input v-model="ruleForm.safetySupervisorTelephone" disabled></el-input>
                                </el-form-item>

                                <el-form-item label="办公地址:" prop="officeAddress">
                                    <el-input v-model="ruleForm.officeAddress" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="生产经营地址:" prop="produceAddress">
                                    <el-input v-model="ruleForm.produceAddress" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="传真号码:" prop="faxNumber">
                                    <el-input v-model="ruleForm.faxNumber" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="注册发证日期:" prop="certificationDate">
                                    <el-date-picker
                                        :disabled="true"
                                        v-model="ruleForm.certificationDate"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>

                                <el-form-item label="危险货物品名:" prop="chemicalId" class="text-area">
                                    <!--<el-select multiple v-model="ruleForm.chemicalId" placeholder="请选择危险货物品名" disabled>
                                        <el-option
                                            v-for="item in chemicals"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>-->
                                    <el-input v-model="ruleForm.chemicalId" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="备注:" prop="otherInfo" class="text-area">
                                    <el-input
                                        disabled
                                        type="textarea"
                                        v-model="ruleForm.otherInfo"
                                        :autosize="{ minRows: 2, maxRows: 4}"
                                    >
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="人员信息">
                        <el-form label-position="right" ref="ruleForm" :inline="true" label-width="85px" :model="ruleForm">
                            <el-form-item label="姓名:">
                                <el-input v-model="ruleFormPersonnel.name" :disabled="isDisabled"></el-input>
                            </el-form-item>
                            <el-form-item label="所属企业:">
                                <el-input v-model="ruleFormPersonnel.companyName" :disabled="isDisabled"></el-input>
                            </el-form-item>
                            <el-form-item label="性别:">
                               <!-- <el-select v-model="ruleFormPersonnel.gender" placeholder="请选择" :disabled="isDisabled">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>-->
                                <el-input v-model="ruleFormPersonnel.gender" :disabled="isDisabled"></el-input>
                            </el-form-item>
                            <el-form-item label="身份证号:">
                                <el-input v-model="ruleFormPersonnel.personNum" :disabled="isDisabled"></el-input>
                            </el-form-item>
                            <el-form-item label="资格类型:">
                               <!-- <el-select v-model="ruleFormPersonnel.type" placeholder="请选择" :disabled="isDisabled">
                                    <el-option
                                        v-for="item in optionsType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>-->
                                <el-input v-model="ruleFormPersonnel.type" :disabled="isDisabled"></el-input>
                            </el-form-item>
                            <el-form-item label="联系方式:">
                                <el-input v-model="ruleFormPersonnel.phoneNum" :disabled="isDisabled"></el-input>
                            </el-form-item>
                            <el-form-item label="备注:" class="text-area">
                                <el-input
                                    type="textarea"
                                    v-model="ruleFormPersonnel.remarks"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    :disabled="isDisabled">
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </el-card>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import CommonSubtitle from '@/components/Subtitle/CommonSubtitle.vue'
    import {getCheckByPage} from '@/api/courseMonitor/importExport'

    export default {
        name: 'OrderTrackList',
        components: {Pagination, CommonSubtitle},
        data() {
            return {
                list: [],
                ruleForm: {
                    companyName: '山东省龙口市化工厂',
                    creditCode:'56894126852233',
                    areaId:'',
                    areaName:'芝罘区',
                    industry:'危化品道路运输',
                    companyType: '营业',
                    businessStatus: '国企',
                    companyEconomicType: '外商投资',
                    companyPhone:'18686951245',
                    header:'张珊',
                    headerPhone:'18256694597',
                    safetySupervisorName:'路宝妮',
                    safetySupervisorTelephone:'18298744562',
                    officeAddress:'山东烟台芝罘区',
                    produceAddress:'山东烟台芝罘区化工厂',
                    faxNumber:'@254579612',
                    certificationDate:'2020-15-26',
                    chemicalId:'盐酸',
                    otherInfo:'无',
                },
                ruleFormPersonnel: {
                    name: '黄奖池',
                    companyId:'111',
                    companyName: '山东烟台芝罘区化工厂',
                    gender: '女',
                    personNum:'612326199512110526',
                    type:'运输企业',
                    phoneNum:'18245975648',
                    remarks:'哈哈',
                },
                selectedItemIndex: null,
                tabHeight:0, //动态给tabs容器赋值高度
                loading:false,
                listQuery: {
                    page: 1,
                    size: 7,
                },
                total:0,//总数
                isDisabled:true,
                companyName:'',
                carPhoto:require('@/assets/image/other/no_car_image.png'),
                personnelPhoto:require('@/assets/image/other/no_personnel_image.png')
            }
        },

        created() {
            this.$nextTick(()=>{
                const boxHeight = this.$refs.container.$el.offsetHeight;
                const topHeight = this.$refs.carInfo.$el.offsetHeight;
                this.tabHeight = boxHeight - topHeight - 60 + 'px';
//                console.log(boxHeight,topHeight,"##");
            })
            this.getCompanyData()
        },
        methods: {
            handleSelect(index){
                this.selectedItemIndex = index;
                this.carPhoto=require('@/assets/image/other/no_car_image.png');
                this.personnelPhoto=require('@/assets/image/other/no_personnel_image.png');
                if(this.list[index].carCapture.length!=0 || this.list[index].personCapture.length!=0){
                    this.carPhoto=this.list[index].carCapture[0].bigCaptureUrl;
                    this.personnelPhoto=this.list[index].personCapture[0].bigCaptureUrl;
                }
            },
            getCompanyData(){
                this.loading = true;
                const param = Object.assign(this.listQuery,{companyName:this.companyName});
                this.list=[];
                getCheckByPage(param).then(res => {
                    this.list=res.data.list;
                    this.total = res.data.total;
                    this.loading = false
                }).catch((err) => {
                        // 公共方法有，所以不需要加提示了
                        // this.$message.error(err.msg)
                        this.loading = false
                    })
            },
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
    //分页按钮样式
    .pagination {
        /deep/ .el-pagination {
            display: flex;
            justify-content: center;
        }
        /deep/ .el-pagination__sizes {
            display: none;
        }
        /deep/ .el-pagination__jump {
            display: none;
        }
        /deep/ .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li {

        }
        /deep/ .el-pager li, /deep/ .el-pagination button {
            min-width: 24px;
            height: 22px;
            line-height: 22px;
        }
        /deep/ .el-pagination span:not([class*=suffix]) {
            min-width: 44px;
            height: 22px;
            line-height: 22px;
        }
        /deep/ .el-pager .more::before {
            line-height: 24px;
        }
    }
    /deep/ .el-select,.el-date-editor {
        display: inline-block;
        position: relative;
        width: 185px;
    }
    .text-area{
        width: 100%;
        /deep/ .el-form-item__content{
            width: calc(100% - 150px);
        }
        /deep/ .el-textarea,.el-select{
            width: 93.33%;
        }
    }

    .other-form-item{
        .label-item{
            width: 150px;
            padding-right: 12px;
            display: inline-block;
        }
        .inp-item{
            width: 185px;
            float: right;
            display: inline-block;
        }
    }
</style>
