<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info">
                <el-form v-loading="loading" ref="form" class="demo-form-inline" label-position="right" label-width="120px">
                    <div  class="detail-title">
                        <div class="ellipsis-l1">
                                <span :title="alarmInfo.hasOwnProperty('alarmAddress') ? alarmInfo.alarmAddress : ''">报警地点：{{alarmInfo.hasOwnProperty('alarmAddress') ? alarmInfo.alarmAddress : ''}}</span>
                            <span :title="alarmInfo.hasOwnProperty('alarmTime') ? alarmInfo.alarmTime : ''"> &nbsp;&nbsp;&nbsp;&nbsp;报警时间：{{alarmInfo.hasOwnProperty('alarmTime') ? alarmInfo.alarmTime : ''}}</span>
                        </div>
                        <div>
                            <el-tag type="danger" class="font-bold" >
                                {{alarmInfo.alarmTypeName}}
                            </el-tag>
                        </div>
                    </div>
                    <el-row >
                        <el-col :span="24" class="margin-t-15">
                                <el-image
                                        style="width:100%; height:350px;margin-bottom: 10px"
                                        :src="require('@/assets/image/login_bg.png')"
                                >
                                </el-image>
                        </el-col>
                    </el-row>
                    <div style="text-align: right;margin-top: 10px">
                        <el-button type="primary" @click="">上一条</el-button>
                        <el-button>下一条</el-button>
                    </div>
                </el-form>

            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonSubtitle from '@/components/CommonSubtitle'
    import { mapGetters } from 'vuex'

    export default {
        name: 'alarmDetail',
        props: [''],
        components: {CommonSubtitle},
        data() {
            return {
                disableKey: false,
                loading:false,//loading 效果

            }
        },
        computed: {
            ...mapGetters([
                'alarmInfo',
            ])
        },
        mounted(){
        },
        methods: {
        },

    }
</script>
<style lang="scss" type="text/scss" scoped>
    .common-subtitle{
        font-size: 16px;
        border: none;
    }
    .common-subtitle-i{
        margin: -5px 10px -5px 0;
        height: 22px;
    }
    .detail-title{
        height:20px;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        font-size: 16px;
    }
    .el-tag--medium{
        height:20px;
        line-height: 20px;
    }
    .el-tag{
        border-radius: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        /*width:50%;*/
        /*text-align: center;*/
    }


</style>
