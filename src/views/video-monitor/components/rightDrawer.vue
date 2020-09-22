<!--右侧抽屉-->
<template>
    <div class="drawer-container">
      <transition name="slide-fade">
        <div class="detail-box" >
            <el-tabs tab-position="left" class="tabs-container">
                <el-tab-pane label="手动抓拍">
                    <video-capture></video-capture>
                </el-tab-pane>
            </el-tabs>
        </div>
      </transition>
    </div>
</template>
<script>
    import videoCapture from '../drawer-video-capture.vue'
    export default {
        data(){
          return{

          }
        },
        components:{
            videoCapture
        },
    }
</script>
<style lang="less">
  @import "../styles/video-right-drawer.less";
</style>
