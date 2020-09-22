<!--右侧抽屉-->
<template>
    <div class="tab-container">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="绘制工具：">
                <el-select v-model="form.drawTool" placeholder="请选择活动区域" style="z-index: 60000" @change="handleDraw">
                    <el-option :label="item.des" :value="item.code" v-for="item in form.drawBtnItems"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="btn-wrap text-center margin-d-10">
            <el-button-group>
                <el-button type="primary" @click="checkAll">全选</el-button>
                <el-button type="primary" @click="unCheckAll">全不选</el-button>
                <el-button type="primary" @click="videoPlay">播放</el-button>
            </el-button-group>
        </div>

        <div class="content">
            <div class="title">
                <p>
                    <span>摄像机统计（在线/总数）：</span>
                    <span><span style="color: #0F6FDE">{{cameraOnlineNum}}</span> / {{cameraTotal}}</span>
                </p>
            </div>
            <div class="camera-list" v-scrollBar>
                <el-checkbox-group v-model="checkedCameraCodeArray" class="checkbox-wrap" v-for="(item,index) in selectedCameraArrayByTool" :key="index">
                    <el-checkbox :label="item.code" class="checkbox-item" border>{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <!--<el-row class="camera-item active" @click="handleSelect">
                    <el-col :span="3" class="margin-l-10">
                        <el-checkbox checked></el-checkbox>
                    </el-col>
                    <el-col :span="2" class="margin-r-10">
                        <img src="../image/rifle32.png" alt="" width="19" height="22">
                    </el-col>
                    <el-col :span="17">
                        <span>南环路小区门口枪机北</span>
                    </el-col>
                </el-row>-->
            </div>
        </div>
    </div>
</template>
<script>
    import mapShowFunc from '@/utils/mapShowFunc'
    import passParam from '@/utils/ext.passParam'

    export default {
        data() {
            return {
                form: {
                    drawBtnItems: [
                        {
                            des: '框选',
                            icon: 'fa fa-square-o',
                            code: 'rect'
                        },
                        {
                            des: '圈选',
                            icon: 'fa fa-circle-thin',
                            code: 'circle'
                        },
                        {
                            des: '线选',
                            icon: 'fa fa-italic',
                            code: 'line'
                        },
                        {
                            des: '多边形',
                            icon: 'fa fa-bookmark-o',
                            code: 'polygon'
                        },
                        {
                            des: '清除所有',
                            icon: 'fa fa-trash-o',
                            code: 'clear'
                        }
                    ],
                    drawTool: '',
                },
                checkedCameraArray: [],  //选择的摄像机数组
                checkedCameraCodeArray:[],  //选中的摄像机code数组
                selectedCameraArrayByTool:[],
                cameraTotal:0,
                cameraOnlineNum:0
            }
        },
        watch:{
            checkedCameraCodeArray(value){
                value.map(item=>{
                    this.selectedCameraArrayByTool.map(jtem=>{
                        if(item == jtem.code){
                            this.checkedCameraArray.push({code:jtem.code,text:jtem.name});
                        }
                    })
                })
            }
        },
        mounted(){
            //清除区域
            mapShowFunc.clearAllOverlay();
            this.selectedCameraArrayByTool = [];
            //绘制工具选择后的回调函数，获取区域内的摄像机点位
            passParam.$on('selectedCameras',(arr)=>{
                this.selectedCameraArrayByTool = [];
                arr.map(item=>{
                    const info = item.info.split('&');
                   if(info.length>0){
                       let camera = {
                           code:info[0],
                           lat:info[1],
                           lng:info[2],
                           name:info[3],
                           type:info[4],
                           status:info[5],
                       };
                       this.selectedCameraArrayByTool.push(camera);
                       if(info[5] == 1){
                           //摄像机在线
                           this.cameraOnlineNum++;
                       }
                   }
                });
                this.cameraTotal = this.selectedCameraArrayByTool.length;
            })
        },
        beforeDestroy(){
            //页面销毁之前，清除地图上所有的绘制区域和摄像机列表
            mapShowFunc.clearAllOverlay();
            this.selectedCameraArrayByTool = [];
        },
        methods: {
            //打开绘制按钮
            handleDraw(code) {
                let drawType = "";
                this.form.drawBtnItems.forEach(item => {
                    if (item.code == code) {
                        drawType = item.code;
                    }
                });
                //先清空所有的绘制区域
                mapShowFunc.clearAllOverlay();
                switch (drawType) {
                    case 'polygon':
                        mapShowFunc.searchByPolygon();	//画多边形
                        break;
                    case 'circle':
                        mapShowFunc.searchByCircle();   //画圆
                        break;
                    case 'rect':
                        mapShowFunc.searchByRect();		//画矩形
                        break;
                    case 'line':
                        mapShowFunc.searchByLine();		//画线
                        break;
                    case 'clear':
                        mapShowFunc.clearAllOverlay();		//清除绘制
                        this.selectedCameraArrayByTool = [];
                        break;
                    default :
                        this.$message({message: '绘制类型错误！', type: 'warning'});
                        break;
                }
            },
            //全选
            checkAll(){
                this.checkedCameraCodeArray = [];
                this.selectedCameraArrayByTool.map(item=>{
                    this.checkedCameraCodeArray.push(item.code);
                })
            },
            //全不选
            unCheckAll(){
                this.checkedCameraCodeArray = [];
            },
            //播放
            videoPlay(){
                if(this.checkedCameraCodeArray.length == 0){
                    this.$message({message:'请选择播放的摄像机！',type:'warning'});
                    return
                }else{
                    passParam.$emit('openDialog',true,'video',this.checkedCameraArray)
                }
            }
        }
    }
</script>
<style lang="less">
    .el-select-dropdown {
        z-index: 60000 !important;
    }
</style>
<style lang="less" scoped>
    @import "../style/style.around-monitor.less";
</style>
