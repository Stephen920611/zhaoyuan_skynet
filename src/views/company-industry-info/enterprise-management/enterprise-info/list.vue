<template>
    <div class="container" style="height: 100%">
        <edit-company ref="editCompany" :data="companyInfoData"  :companyId="companyId" :companyName="companyName"></edit-company>
    </div>
</template>
<script>
    import {getCompanyList,basicArea,getByCode,companyDelete,getCompanyDetailInfo,companySaveOrUpdate} from '@/api/industry'
    import editCompany from './components/edit/edit-company.vue'
    export default {
        name: 'waybill',
        components: {editCompany},
        data() {
            return {
                companyInfoData:null,
                companyId:null,
                companyName:'',
                userInfo:null,  //登录用户的信息
            }
        },
        created() {
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            this.companyId = this.userInfo.companyId;
            this.getCompanyData();
        },
        methods: {
            //获取公司列表数据
            getCompanyData() {
                //获取所选中的企业信息
                getCompanyDetailInfo({id:this.userInfo.companyId,}).then(res=>{
                    if(res.code == '1000'){
                        if(res.data && JSON.stringify(res.data) != '{}'){
                            this.companyInfoData = res.data;
                            this.companyName = res.data.companyName;
                        }

                    }
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        height: calc(100vh - 110px);
        padding: 20px;
    }
</style>
