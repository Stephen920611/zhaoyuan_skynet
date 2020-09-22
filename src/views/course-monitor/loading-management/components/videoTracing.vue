<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info">
                <el-row :gutter="20">
                    <el-col :span="24" style="text-align: center">
                        <div style="width:100%; height:450px">
                            <!--<play-back ref="playBack"
                                       playState="playBack"
                                       btnShow="true"
                                       :winCount="winNum"
                                       :closeVideoWindow="closeVideoWindow"
                                       :curWinCount="curWinNum"
                                       :curRowCls="curVideoRowCls"
                                       :startTime="startTime"
                                       :endTime="endTime"
                                       :hoursPerRuler="hoursPerRuler"
                            ></play-back>-->
                            <real-play ref="realPlay"
                                       :playState="playState"
                                       :btnShow="false"
                                       :winCount="winNum_play"
                                       :curWinCount="curWinNum_play"
                                       :curRowCls="curVideoRowCls_play"
                            ></real-play>

                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonSubtitle from '@/components/CommonSubtitle'
    import playBack from '@/components/common/playBack.vue'
    import realPlay from '@/components/common/realPlay.vue'
//    import realPlay from './realPlay.vue'

    import {fetchVideoTrackType} from '@/api/courseMonitor/handingProcess';
    import { mapGetters } from 'vuex'
    import D from '@/utils/DFDZ';
    /*引入工具类*/
    import dateTime from '@/utils/ext.dateTime'

    export default {
        name: 'videoTracing',
        props: ['videoCameraInfo'],
        components: {CommonSubtitle, playBack,realPlay},
        data() {
            return {
                disableKey: false,
                listLoading: false,
                viewArr: [],
                activeClass: 0,//选中样式

                //录像相关的
                winNum: 4,    //窗口数量，默认为4窗口
                curWinNum: 1,   //当前的窗口数量
                curVideoRowCls: ['one-row'],  //窗口布局样式
                winNum_play: 1,    //窗口数量，默认为4窗口
                curWinNum_play: 1,   //当前的窗口数量
                curVideoRowCls_play: ['one-row'],  //窗口布局样式
                /*默认初始化当天的时间轴*/
                startTime: new Date(dateTime.curentDate() + " 00:00:00").getTime(),
                endTime: new Date(dateTime.curentDate() + " 23:59:59").getTime(),
                hoursPerRuler: 24,
                videoDetail:{
                    alarmClass: 1,
                    alarmId: 1,
                    alarmName: "人体静电",
                    createTime: null,
                    id: 1,
                    isAlarm: 1,
                    ladeProcessId: 1,
                    operateTime: "2020-06-11 09:05:12",
                    sideCode: "111",
                    sideName: "装载位1",
                    updateTime: null
                },
                playState: 'realPlay',
            }
        },
        created() {

        },
        mounted() {
            //录像回放
//            this.playBackVideo(this.videoDetail);
            //实时视频
            this.handleNodeClick();
        },
        methods: {
            //录像回放窗口
            playBackVideo(item) {
                //前后取的秒数
                let playTimeSecond = 30;
                this.playBackVisible = true;
                //时间轴的开始时间和结束时间
                this.startTime = new Date(dateTime.getTimeSelecttTime(this.startTime, playTimeSecond * -6 * 1000)).getTime();
                this.endTime = new Date(dateTime.getTimeSelecttTime(item.operateTime, playTimeSecond * 6 * 1000)).getTime();
                //每个刻度的精度，1代表一小时，0.1代表6分钟
                this.hoursPerRuler = 0.1;
                //前后播放的时间段， 时间戳
                const playStartT = new Date(dateTime.getTimeSelecttTime(item.operateTime, -playTimeSecond * 1000)).getTime();
                const playEndT = new Date(dateTime.getTimeSelecttTime(item.operateTime, playTimeSecond * 1000)).getTime();
                //时间轴的绿色框
                const timeCells = [
                    {
                        "beginTime": playStartT,
                        "endTime": playEndT,
                        "style": {
                            "background": "rgba(132, 244, 180, 0.498039)"
                        }
                    }
                ];

                setTimeout(() => {
                    //dialog打开后的操作
                    const camNode = {
                        code: "37061290011310000008",
                        text: item.alarmName,
                        cameraType: -1
                    };
                    //给时间轴组件对象附上对应的参数值
                    this.$refs.playBack.setCameraId(camNode);
                    let timeBar = this.$refs.playBack.timeBarsComp[0].timeBars[0];
                    timeBar.cells = timeCells;
                    //时间轴的开始时间："2020-06-17T12:00:00"，需要带T
                    timeBar.startTime = dateTime.getTimeSelecttTime(item.operateTime, playTimeSecond * -6 * 1000).replace(' ', 'T');
                    //时间轴的结束时间："2020-06-17T12:59:59"，需要带T
                    timeBar.endTime = dateTime.getTimeSelecttTime(item.operateTime, playTimeSecond * 6 * 1000).replace(' ', 'T');
                    this.$set(this.$refs.playBack.timeBarsComp[0].timeBars, 0, timeBar);

                    //时间轴上将录像块显示出来
                    this.$refs.playBack.$refs.timeline[0].updateTimeCell(timeCells);
                    this.$refs.playBack.$refs.timeline[0].updateReturnTime(playStartT);
                    this.$refs.playBack.$refs.timeline[0].setTimeMoveFunc(false);
                    //自动播放对应的视频录像
                    this.$refs.playBack.handleClickBar(dateTime.getTimeSelecttTime(item.operateTime, -playTimeSecond * 1000));
                }, 1000)

            },

            //关闭视频窗口
            closeVideoWindow() {
                //录像回放
                //重置时间轴
               /* this.startTime = new Date(dateTime.curentDate() + " 00:00:00").getTime();
                this.endTime = new Date(dateTime.curentDate() + " 23:59:59").getTime();
                this.hoursPerRuler = 24;
                //清空选中标记
                this.activeClass = -1;*/
               //视频播放暂停，关闭播放弹窗
                this.$refs.realPlay.stop(this.winNum);
//                this.$refs.realPlay.closeAppointVideo('win' + this.winNum, this.playState);
            },

            //实时视频播放
            handleNodeClick() {
                this.selectedCameraNode = this.videoCameraInfo;
                this.cameraId = this.videoCameraInfo.cameraCode;
                this.cameraName = this.videoCameraInfo.cameraName;
                //dialog打开后的操作
                const camNode = {
                    code: this.videoCameraInfo.cameraCode,
                    text: this.videoCameraInfo.cameraName,
                    cameraType: -1
                };
                setTimeout(() => {
                    //给时间轴组件对象附上对应的参数值
                    this.$refs.realPlay.playVideoByCameraId(camNode, '#video-content>li');
//                this.$refs.playBack.setCameraId(node);
                },1000)


            },

        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .common-subtitle {
        font-size: 16px;
        border: none;
    }

    .common-subtitle-i {
        margin: -5px 10px -5px 0;
        height: 22px;
    }

    //选中样式
    .active {
        background-color: rgba(233, 242, 251, 0.5);
        border: 1px solid #2794e7;
    }

    /deep/ .el-card__body {
        padding: 15px;
    }

    .tags-item {
        line-height: 26px
    }

    .tags-item-span,
    .tags-item-span-active {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
    }

    .tags-item-span {
        background: red;
    }

    .tags-item-span-active {
        background: #7cff58;
    }

    /*.tags-item:before{
        content: '';
        background: red;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
    }
    .active{
        .tags-item:before{
            background: #7cff58;
        }
    }*/

    //卡片样式
    .role-list-content {
        width: 100%;
        height: calc(100% - 105px);
        /*margin-top: 12px;*/
        overflow-y: auto;
        .el-card__body {
            padding: 10px;
            cursor: pointer;
        }
        .box-card {
            text-align: left;
            margin-top: 10px;
            .role-name {
                width: 100%;
                font-size: 20px;
                font-weight: bold;
            }
            .role-name-des {
                height: 30px;
            }
            .label-name {
                font-size: 14px;
                font-weight: 500;
            }
            .fl-left-label {
                font-size: 14px;
                font-weight: 500;
                float: left;
                width: 60px;
            }
            .fl-left-value {
                font-size: 14px;
                font-weight: 500;
                float: left;
                width: calc(100% - 60px);
            }
        }
    }


</style>
