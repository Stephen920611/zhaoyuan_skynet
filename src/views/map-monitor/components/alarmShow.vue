<!--右侧抽屉-->
<template>
    <div class="tab-container">
        <div class="btn-wrap margin-d-10">
            <el-button type="primary" @click="">查询历史报警</el-button>
        </div>
        <div class="search-wrap margin-d-10">
            <el-row class="margin-d-10">
                <el-col :span="7" class="search-item">
                    <span class="label">报警信息：</span>
                </el-col>
                <el-col :span="16" class="search-item">
                    <el-select v-model="form.alarmType">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="车辆" value="1"></el-option>
                        <el-option label="进出卡口" value="2"></el-option>
                        <el-option label="装卸区" value="3"></el-option>
                        <el-option label="停车场" value="4"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="17" class="search-item margin-r-10">
                    <el-input v-model="form.name" placeholder="请输入搜索内容"></el-input>
                </el-col>
                <el-col :span="4" class="search-button">
                    <el-button type="primary" @click="">搜索</el-button>
                </el-col>
            </el-row>
        </div>

        <div class="content" v-scrollBar>
            <div class="line-item">
                <div class="image-wrap">
                    <img src="../image/illegalCar.png" alt="">
                    <el-tag type="success">鲁F12TQ3</el-tag>
                </div>
                <div class="base-info">
                    <p><span>报警地点：</span><span class="ellipsis-l1" title="龙口市华星路经贸大厦向西500米路东">龙口市华星路经贸大厦向西500米路东</span></p>
                    <p><span>报警时间：</span><span>2020-03-12 12:59:03</span></p>
                    <p><span>报警原因：</span><span>司机拨打电话</span></p>
                </div>
                <div class="hr-line"></div>
                <div class="btn-wrap">
                    <p>
                        <span class="icon iconfont iconcheliangxinxi" title="车辆信息"></span>
                        <span class="icon iconfont iconjiashiyuanxinxi" title="驾驶员信息"></span>
                        <span class="icon iconfont iconrenyuanbu" title="押运员信息"></span>
                        <span @click="open('openWaybill')"><i class="icon iconfont icondianziyundan" title="电子运单"></i></span>
                        <span class="icon iconfont iconshipinbofangyingpian2" title="视频播放"></span>
                    </p>
                </div>
            </div>
            <div class="line-item">
                <div class="image-wrap">
                    <img src="../image/illegalCar.png" alt="">
                    <el-tag type="success">鲁F12TQ3</el-tag>
                </div>
                <div class="base-info">
                    <p><span>报警地点：</span><span class="ellipsis-l1" title="龙口市华星路经贸大厦向西500米路东">龙口市华星路经贸大厦向西500米路东</span></p>
                    <p><span>报警时间：</span><span>2020-03-12 12:59:03</span></p>
                    <p><span>报警原因：</span><span>司机拨打电话</span></p>
                </div>
                <div class="hr-line"></div>
                <div class="btn-wrap">
                    <p>
                        <span class="icon iconfont iconcheliangxinxi" title="车辆信息"></span>
                        <span class="icon iconfont iconjiashiyuanxinxi" title="驾驶员信息"></span>
                        <span class="icon iconfont iconrenyuanbu" title="押运员信息"></span>
                        <span  @click="open('openWaybill')"><i class="icon iconfont icondianziyundan" title="电子运单"></i></span>
                        <span class="icon iconfont iconshipinbofangyingpian2" title="视频播放"></span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import passParam from '../../../utils/ext.passParam.js'
    export default {
        data(){
          return{
              form:{
                  alarmType:'',
                  name:'',
              },

          }
        },
        components:{

        },
        methods:{
            open(role){
                switch (role){
                    case 'openWaybill':
                        this.$store.dispatch('map/openDialogOfWaybill', true);
                        break;
                }
            }
        }
    }
</script>
<style lang="less">
    .el-select-dropdown{
        z-index: 60000 !important;
    }
</style>
<style lang="less" scoped>
    @import "../style/style.alarm-show.less";
</style>
