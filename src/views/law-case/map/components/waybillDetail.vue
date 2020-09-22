<!--右侧抽屉-->
<template>
    <div class="detail-content">
        <div class="info-wrap">
            <CommonSubtitle :title="wayBillNoTitle" :isBold="true"></CommonSubtitle>
            <el-divider></el-divider>
            <el-steps :active="rowData.wayBillStatus" align-center>
                <el-step title="运单发起" :description="rowData.createTime"></el-step>
                <el-step title="已装车" :description="rowData.loadDate"></el-step>
                <el-step title="运输途中" :description="rowData.loadDate"></el-step>
                <el-step title="已卸车" :description="rowData.loadDate"></el-step>
                <el-step title="运输完成" :description="rowData.loadDate"></el-step>
            </el-steps>
        </div>
        <div class="info-wrap">
            <CommonSubtitle title="运单发起(基本信息)" :isBold="true"></CommonSubtitle>
            <el-divider></el-divider>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">托运方单位名称：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.consignorCompanyName" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">收货方单位名称：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverCompanyName" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">托运方联系电话：</label></el-col>
                <el-col :span="4"><el-input  v-model="rowData.consignorTelephone" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">收货方联系电话：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">装货地点：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.loadDate" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">运输目的地：</label></el-col>
                <el-col :span="4"><el-input  v-model="rowData.transportDestination" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content text-right">装货日期：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.loadDate" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content text-right">预计到达日期：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.expectedArrivalDate" :disabled="true"></el-input></el-col>
            </el-row>
        </div>
        <div class="info-wrap">
            <CommonSubtitle title="运单发起(承运方信息)" :isBold="true"></CommonSubtitle>
            <el-divider></el-divider>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">单位名称：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.consignorCompanyName" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">联系电话：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverCompanyName" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">经营许可证号：</label></el-col>
                <el-col :span="4"><el-input  v-model="rowData.consignorTelephone" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">应急联系方式：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">车牌号码：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.loadDate" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">道路运输证号：</label></el-col>
                <el-col :span="4"><el-input  v-model="rowData.transportDestination" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">挂车车牌号码：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">道路运输证号：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.loadDate" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">驾驶员姓名：</label></el-col>
                <el-col :span="4"><el-input  v-model="rowData.transportDestination" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">身份证号：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">从业资格证号：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.loadDate" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">联系电话：</label></el-col>
                <el-col :span="4"><el-input  v-model="rowData.transportDestination" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">驾驶员姓名：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">身份证号：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.loadDate" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">从业资格证号：</label></el-col>
                <el-col :span="4"><el-input  v-model="rowData.transportDestination" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">联系电话：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" :disabled="true"></el-input></el-col>
            </el-row>
        </div>
        <div class="info-wrap">
            <CommonSubtitle title="装车信息" :isBold="true"></CommonSubtitle>
            <el-divider></el-divider>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">进厂时间：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.consignorCompanyName" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">进厂称重：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverCompanyName" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">联合国编码：</label></el-col>
                <el-col :span="4"><el-input  v-model="rowData.consignorTelephone" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">危险货物名称：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">类/项别：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.loadDate" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">包装类别：</label></el-col>
                <el-col :span="4"><el-input  v-model="rowData.transportDestination" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">规格：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">数量(吨/立方)：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.loadDate" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">危险货物特征：</label></el-col>
                <el-col :span="20" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" type="textarea" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">急救措施：</label></el-col>
                <el-col :span="20" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" type="textarea" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">消防措施：</label></el-col>
                <el-col :span="20" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" type="textarea" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">泄露应急措施：</label></el-col>
                <el-col :span="20" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" type="textarea" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">次生环境污染措施：</label></el-col>
                <el-col :span="20" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" type="textarea" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">运输注意事项：</label></el-col>
                <el-col :span="20" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" type="textarea" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">出厂时间：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">出厂称重间：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.loadDate" :disabled="true"></el-input></el-col>
            </el-row>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">联系电话：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverTelephone" :disabled="true"></el-input></el-col>
            </el-row>
        </div>
        <div class="info-wrap">
            <CommonSubtitle title="卸车信息" :isBold="true"></CommonSubtitle>
            <el-divider></el-divider>
            <el-row class="row-margin">
                <el-col :span="3"><label class="grid-content">出厂时间：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.consignorCompanyName" :disabled="true"></el-input></el-col>
                <el-col :span="3"><label class="grid-content">进厂称重：</label></el-col>
                <el-col :span="5" style="margin-right: 25px"><el-input  v-model="rowData.receiverCompanyName" :disabled="true"></el-input></el-col>
            </el-row>
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
