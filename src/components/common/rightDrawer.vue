<!--右侧抽屉-->
<!--调用方法：
（1）配置路由：
children: [
  {
    path: '/home/video/video-play/capture',
    name: 'capture',
    component: videoCapture,
    menuShow: false,
    meta: {
      showTag:false
    },
  },
  {
    path: '/home/video/video-play/case',
    name: 'case',
    component: videoCase,
    menuShow: false,
    meta: {
      showTag:false
    }
  }
]
(2)主组件调用：组件标签后引用 <right-drawer :data="drawerTabsData" :maskVisible="maskVisible" :drawerVisible="drawerVisible" @close="closeDrawerDialog"></right-drawer>
data：数组，存储的是tab标签的名称及对应的路由组件的地址；maskVisible:是否显示遮罩，true为显示；drawerVisible是否显示抽屉窗口，true为显示
data:[{
         label:'手动抓拍',
         path:'capture'
      }]
-->
<template>
    <div class="drawer-container">
      <div class="modal-mask" v-show="maskVisible"></div>
      <transition name="slide-fade">
        <div class="detail-box" v-show="drawerVisible">
          <div class="take-up fa fa-angle-double-right" @click="closeDrawerDialog"></div>
          <el-tabs tab-position="left" class="tabs-container" @tab-click="tabClick($event.index)">
            <el-tab-pane v-for="(item,index) in data" :key="index" :label="item.label">
              <keep-alive>
                <router-view></router-view>
              </keep-alive>
            </el-tab-pane>
          </el-tabs>
        </div>
      </transition>
    </div>
</template>
<script>
    export default {
        props:{
          data:{
            type: Array,
            default: function() {
              return []
            }
          },
          maskVisible:{
            type: Boolean,
            default: false
          },
          drawerVisible:{
            type: Boolean,
            default: false
          }
        },
        mounted(){
          this.$router.push({name:this.data[0].path});    //默认显示第一个tab页面
        },
        methods:{
          // 关闭详情弹窗
          closeDrawerDialog() {
            this.$emit("close")
          },
          tabClick(index){
            console.log(index,"@@");
            if(this.data.length>0){
                this.$router.push({name:this.data[index].path})
              }
          }
        }
    }
</script>
<style lang="less" scoped>
  @import "./style/right-drawer.less";
</style>
