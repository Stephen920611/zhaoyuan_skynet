<template>
    <div id="playBackContainer" ref="playBackContainer">
        <div class="multiple-win-wrap" :class="{'full-screen':$store.state.video.isFullScreen}">
            <video-comm
                    ref="videoComm"
                    :playState="playState"
                    :rowNumStyle="curRowCls.join('')"
                    :winNum="winCount"
                    :curWinNum="curWinCount"
                    :winSelectData="winSelectData"
                    @update-data="updateData"
                    @toggle-win="handleToggleWin"
            ></video-comm>
        </div>
        <div id="multiple-channel-choose" v-show="(!$store.state.video.isFullScreen && isShowBtn)">
            <!--<df-drop-down name="窗口选择" type="primary" :data="winSelectData" :defaultValue="curVideoRowCls"
                          @command="handleChooseWin"></df-drop-down>-->
            <div class="video-btn-group play-back">
                <!--<el-button size="medium" type="primary" @click="pauseAllVideo">暂停全部</el-button>-->
                <!--<el-button size="medium" type="primary" @click="playAllVideo">播放全部</el-button>-->
                <!--<el-button size="medium" type="primary" @click="closeAllVideo">关闭全部</el-button>-->
                <!--<el-button size="medium" type="primary" @click="handleFullScreen">全屏</el-button>-->
                <!--<el-button size="medium" type="primary">1/4倍速</el-button>
                <el-button size="medium" type="primary">1/2倍速</el-button>
                <el-button size="medium" type="primary">常速</el-button>
                <el-button size="medium" type="primary">2倍速</el-button>
                <el-button size="medium" type="primary">4倍速</el-button>
                <el-button size="medium" type="primary">异步回放</el-button>
                <el-button size="medium" type="primary">收藏录像</el-button>-->
            </div>
        </div>
        <div ref="timeLineBox" id="timeLineBox">
            <template v-for="(item,index) in timeBarsComp">
                <TimeLine ref="timeline" :isCurrent="item.current" :startTime="startTime" :endTime="endTime"
                          :hoursPerRuler="hoursPerRuler" :width="timeParam.canvasWidth" :height="62" :hasMouseWheel="false"
                          @click-bar="handleClickBar" @click-stop-video="stopVideoPlay(index)"></TimeLine>
            </template>
        </div>
    </div>
</template>
<script>
    import {doGetVideotape} from '@/api/video';
    import screenfull from 'screenfull';
    import passParam from '@/utils/ext.passParam';
    import utility from '@/utils/ext.utility';
    import dateTime from '@/utils/ext.dateTime';

    import videoComm from './videoComm.vue';
    import dfDropDown from '@/components/common/dropDownMenu.vue';
    import TimeLine from '@/components/common/timeLine.vue';

    export default {
        props: ['playState', 'startTime', 'endTime', 'hoursPerRuler', 'btnShow', 'winCount', 'curWinCount', 'curRowCls','closeVideoWindow'],
        data() {
            return {
                winSelectData: [
                    {code: 'one-row', des: '单窗口', winNum: 1, choosed: false},
                    {code: 'two-row', des: '4窗口', winNum: 4, choosed: true},
                    {code: 'three-row', des: '9窗口', winNum: 9, choosed: false},
                    {code: 'four-row', des: '16窗口', winNum: 16, choosed: false}
                ],
                winNum: 1,    //窗口数量，默认为4窗口
                curWinNum: 1,   //当前的窗口数量
                curVideoRowCls: ['one-row'],  //窗口布局样式
                isShowBtn: this.btnShow,
                timeParam: {
                    canvasWidth: 1300
                },
                timeBarsComp: [],   //存储进度条的timeBar组件
                checkedWinNum: 0,
                ctrlDefaultValue: 90, //云台控制的速度

                _winObjHash: null,
                _videoObjHash: null,
                _browser: null,
                instance: function ($vue, videoId, cameraid, sessionid, authcode, browserInfo) {
                    let self = this;
                    this.cloudCtrlHash = {};
                    this.sourceBuffer; //数据缓冲区
                    this.buffer = [];
                    this.mediaSource;  //h5 videosource
                    this.video;        //video
                    this.videoSocket;     //websocket
                    this.managerSocket;     //websocket
                    this.CheckSourceBufferId;
                    this.keepaliveTimerId;   //心跳包
                    this.emptyBuffCnt = 0;
                    this.lastBuffTime = 0;
                    this.buffTimeSameCnt = 0;
                    this.bNeedReconnect = false;  //是否重连
                    this.bDisConnected = false;   //断开连接
                    this.bVideoConnected = false; //视频连接状
                    this._bGetCodec = false;      //获取codec
                    this._strCodec;

                    //增加远程录像接口
                    this.bStartRecording = false;    //开启录像

                    this._videoId = videoId;        //h5句柄
                    this._cameraid = cameraid;             //cameraid
                    this._sessionid = sessionid;           //sessionid
                    this._stream_type = 0;                //0-主码流，1-子码流
                    this._authcode = authcode;             //授权码

                    this._pauseTime = null; 		//录像回放暂停播放时的时间
                    this._endTime = null; 		//录像回放结束时间

                    this._start_time = 0;             //录像开始时间
                    this._end_time = 0;               //录像结束时间
                    this._playback_speed = 1;

                    this._type = null; 			//视频对象的类型（realPlay,playBack,...）

                    this._reconnectCount = 0; //重连次数
                    this._maxReconnectCount = 10; //最大重连次数  如果重连10次失败则认为失败
                    this._browserInfo = browserInfo; //0 是IE 1其他 谷歌或者其他

                    this._cameraType = null;
                    this._camName = null;

                    this.reconnectTimerId = null;  //重连定时器timer
                    this.append_succed = true;  //appendBuffer设置为成功（true）
                    this._readDataFromBufferCurTime = null;  //从buffer里读取出数据的当前时间戳

                    this.dataStreamHeaderStatus = null;   //数据流返回的header中的状态值

                    console.log('浏览器类型...', this._browserInfo);
                    //重连函数
                    this.ReconnectFunction = function () {
                        console.log('Try Reconnect...', self.bNeedReconnect);
                        if (self.bNeedReconnect === true) {
                            console.log('Reconnect...');
                            self._reconnectCount++;

                            let winIndex = parseInt(self._videoId.substring(5, self._videoId.length)) - 1;
                            self.openOrCloseLoading(false, winIndex);//关闭视频加载动画
                            if (self._reconnectCount > 1) {  //第一次重连不提示，再次重连提示重连信息
                                $vue.showReconnectNotice(winIndex);
                            }
                            if (self._reconnectCount <= self._maxReconnectCount) {//最大重连限制
                                self.ConnectManager("Play"); //注意只有实时预览才重连
                            } else {//显示：超过最大重连次数
                                $vue.hideReconnectNotice(winIndex);
                                $vue.showReconnectExceedNotice(winIndex);
                                clearInterval(self.reconnectTimerId);//清除重连定时器
                            }
                            self.bNeedReconnect = false;
                        }
                    };
                    //创建与SIP代理的Websocket
                    this.H5MWebSocketClient = function () {
                        let socket;
                        console.log("H5SWebSocketClient");
                        try {
                            if (window.location.protocol == "http:") {
//                let h5ServerIp = '172.20.63.79:7002';    //手动修改
                                let h5ServerIp = localStorage.getItem('h5_manager_ip');
                                console.log(h5ServerIp, "h5ServerIp");
                                socket = new WebSocket('ws://' + h5ServerIp);

                            }
                            if (window.location.protocol == "https:") {
                                socket = new WebSocket('wss://' + window.location.host + h5spath);
                            }
                        } catch (e) {
                            alert('create ws error');
                            return;
                        }
                        return socket;
                    };
                    //创建websocket连接
                    this.H5SWebSocketClient = function (h5spath) {
                        let socket;
                        console.log("H5SWebSocketClient");
                        try {
                            if (window.location.protocol == "http:") {
                                socket = new WebSocket(h5spath);
                            }
                            if (window.location.protocol == "https:") {
                                //alert(window.location.host);
                                console.log(window.location.host);
                                socket = new WebSocket('wss://' + window.location.host + h5spath);
                            }
                        } catch (e) {
                            console.log('create H5SWebSocketClient error');
                            return;
                        }
                        return socket;
                    };
                    //读取数据
                    this.ReadFromBuffer = function () {
                        try {
                            if (self.buffer.length == 0 || self.sourceBuffer.updating) {
                                return;
                            }
                        } catch (e) {
                            return;
                        }

                        try {
                            let data = self.buffer.shift();
                            let dataArray = new Uint8Array(data);

                            self.sourceBuffer.appendBuffer(dataArray);
                            self.video.play(); //持续播放
                            self.bVideoConnected = true;

                            //yxm 2018.11.1 增加缓存数据，数据只缓存0.5s
                            //console.log('浏览器类型：',self._browserInfo);
                            let bufer_time;
                            if (self._browserInfo == 1) {
                                bufer_time = 0.5;

                            } else {
                                bufer_time = 5;
                            }
                            // console.log('设置加速时间：',bufer_time);

                            /* let buffEndTime = self.sourceBuffer.buffered.end(0);
                             let buffDiff = buffEndTime - self.video.currentTime;*/

                            if (self._type == "Playback") {
                                //xzyan:20190128，控制录像时间轴播放进度——start
                                let temp = new Date(self._start_time).getTime() + self.video.currentTime * 1000;
                                let dateFormat = dateTime.dateFormat(new Date(temp));
                                self._pauseTime = dateFormat.replace(' ', 'T');//记录暂停时间
                                //控制录像时间轴播放进度——end
                                if (self._playback_speed == 4) {
                                    self.video.playbackRate = self._playback_speed - 1; //当前播放速度，设置后马上改变
                                    /* if (buffDiff > bufer_time) {
                                       self.video.playbackRate = self._playback_speed; //当前播放速度，设置后马上改变
                                     }else
                                     {
                                       self.video.playbackRate = self._playback_speed-1;
                                     }*/
                                } else {
                                    self.video.playbackRate = self._playback_speed; //当前播放速度，设置后马上改变
                                }
                            } else {
                                /*if (buffDiff > bufer_time) {
                                  self.video.playbackRate = 1.5; //当前播放速度，设置后马上改变
                                } else {
                                  self.video.playbackRate = 1; //当前播放速度，设置后马上改变
                                }*/
                            }
                        } catch (e) {
                            console.log("ReadFromBuffer error...", e);
                            //清空sourceBuffer
                            self.append_succed = false;
                        }
                        if (self.append_succed) {
                            self._readDataFromBufferCurTime = new Date().getTime();
                        }
                    };
                    //保活时间
                    this.keepAliveTimer = function () {
                        try {
                            self.managerSocket.send("keepalive");

                        } catch (e) {
                            console.log(e);
                        }
                    };

                    //接收视频数据信息
                    this.OnWebSocketData = function (msg) {
                        //console.log(new Uint8Array(msg.data));
                        //关闭加载动画
                        let winIndex = parseInt(self._videoId.substring(5, self._videoId.length)) - 1;
                        self.openOrCloseLoading(false, winIndex);
                        self._reconnectCount = 0; //清空重连次数
                        if (self.bDisConnected === true) {
                            return;
                        }
                        //创建mediasource源
                        if (self._bGetCodec === false) {
                            self._strCodec = String.fromCharCode.apply(null, new Uint8Array(msg.data));
                            console.log("String Codec", self._strCodec);
                            self.SetupSourceBuffer();

                            self._bGetCodec = true;
                            return;
                        } else {
                            //处理接收数据信息
                            self.buffer.push(msg.data);
                            self.ReadFromBuffer();
                        }
                    };
                    //创建mediasource源
                    this.SetupSourceBuffer = function () {
                        try {
                            window.MediaSource = window.MediaSource || window.WebKitMediaSource;
                            if (!window.MediaSource) {
                                console.log('MediaSource API is not available');
                            }

                            let mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
                            if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
                                console.log('MIME type or codec: ', mimeCodec);
                            } else {
                                console.log('Unsupported MIME type or codec: ', mimeCodec);
                            }

                            self.mediaSource = new window.MediaSource();

                            //self.video = document.getElementById(self._videoId);
                            self.video = document.querySelector("#playBackContainer " + "#" + self._videoId);
                            self.video.autoplay = true;

//                self.video.playbackRate = 0.5;
                            console.log(self._videoId);


                            self.video.src = window.URL.createObjectURL(self.mediaSource);
                            self.video.play();

                            self.mediaSource.addEventListener('sourceopen', self.MediaSourceOpen.bind(self), false);

                        }
                        catch (e) {
                            console.log(e);
                        }
                    };
                    //启动mediansource监听
                    this.MediaSourceOpen = function () {
                        console.log("Add SourceBuffer");
                        //得到视频窗口
                        let winNumber = self._videoId.substring(5, self._videoId.length);
                        let winNum = "win" + winNumber;
                        try {
                            //开启视频加载动画
                            self.openOrCloseLoading(true);
                            //配置视频源
                            self.sourceBuffer = self.mediaSource.addSourceBuffer(self._strCodec);
                            self.mediaSource.duration = Infinity;
                            self.mediaSource.removeEventListener('sourceopen', self.MediaSourceOpen, false);
                            self.sourceBuffer.addEventListener('updateend', self.ReadFromBuffer.bind(self), false);
                            let winIndex = parseInt(winNum.substring(3, winNum.length)) - 1;
                            //隐藏视频资源无法加载提示
                            $vue.$set($vue.$refs.videoComm.showInfo.unavailableSourceShow, winIndex, false);
                            //隐藏重连提示
                            /*$vue.hideReconnectNotice(winIndex);
                            $vue.hideReconnectExceedNotice(winIndex);*/
                        } catch (e) {
                            console.log(e.name + ':' + e.message);
                            //let winObj = ext.player._winObjHash.getValue(winNum);
                            //this.$set(self.$refs.videoComm.showInfo.unavailableSourceShow,winNumber-1,true);  //显示视频资源无法加载提示
                        }
                    };

                    //创建视频websocket
                    // this.SetupWebSocket = function (cameraid, sessionid, authcode,type,startTime,endTime)
                    this.SetupWebSocket = function (req_type, media_ip, media_port, cameraid, callid) {
                        //self.video = document.getElementById(self._videoId);
                        self.video = document.querySelector("#playBackContainer " + "#" + self._videoId);
                        self.video.autoplay = true;
                        //yxm 2018.11.1 增加
                        self._type = req_type;
                        let h5spath = "/h5ss";

                        if (req_type == "Play") {
                            h5spath = "ws://" + media_ip + ":" + media_port + h5spath + "?type=realplay&cameraid=" + cameraid + "&callid=" + callid;
                        } else if (req_type == "Playback") {
                            h5spath = "ws://" + media_ip + ":" + media_port + h5spath + "?type=playback&cameraid=" + cameraid + "&callid=" + callid;
                        }
                        console.log("@@@@@@@@@@h5spath", h5spath);

                        self.videoSocket = self.H5SWebSocketClient(h5spath);

                        console.log("SetupWebSocket", self.managerSocket);
                        self.videoSocket.binaryType = 'arraybuffer';
                        self.videoSocket.h5 = self;
                        self.videoSocket.onmessage = self.OnWebSocketData.bind(self);

                        this.videoSocket.onopen = function () {
                            console.log("managerSocket.onopen", this.h5);
                            this.h5.CheckSourceBufferId = setInterval(this.h5.CheckSourceBuffer.bind(this.h5), 1000);
                            // this.h5.keepaliveTimerId = setInterval(this.h5.keepAliveTimer.bind(this.h5), 1000);
                            //开启视频加载动画
                            let winIndex = parseInt(self._videoId.substring(5, self._videoId.length)) - 1;
                            self.openOrCloseLoading(true, winIndex);
                        };
                        this.videoSocket.onclose = function () {
                            console.log("managerSocket.onclose", this.h5);
                            if (this.h5.bDisConnected === true) {
                                console.log("managerSocket.onclose disconnect");
                            } else {
                                this.h5.bNeedReconnect = true;
                            }
                            this.h5.bVideoConnected = false;

                            this.h5.CleanUpSourceBuffer(this.h5);

                            this.h5._strCodec = "";
                            this.h5._bGetCodec = false;
                            //断开sip代理端数据信息

                            this.h5.managerSocket.send("close");
                            this.h5.managerSocket.close();

                            this.h5.CleanUpWebSocket(this.h5);
                        }
                    };

                    this.CleanUpSourceBuffer = function () {
                        console.log('Cleanup Source Buffer', self);

                        try {
                            self.sourceBuffer.removeEventListener('updateend', self.ReadFromBuffer, false);
                            self.sourceBuffer.abort();

                            if (document.documentMode || /Edge/.test(navigator.userAgent)) {
                                console.log('IE or EDGE!');
                            } else {
                                self.mediaSource.removeSourceBuffer(self.sourceBuffer);
                            }
                            self.sourceBuffer = null;
                            self.mediaSource = null;
                            self.buffer = [];
                        }
                        catch (e) {
                            console.log(e);
                        }
                    };
                    this.CleanUpWebSocket = function (self) {
                        console.log('CleanUpWebSocket', self);
                        // clearInterval(self.keepaliveTimerId);
                        clearInterval(self.CheckSourceBufferId);
                        self.emptyBuffCnt = 0;
                        self.lastBuffTime = 0;
                        self.buffTimeSameCnt = 0;
                    };

                    //检测流数据
                    this.CheckSourceBuffer = function () {
                        if (self.bDisConnected === true) {
                            // console.log("CheckSourceBuffer has been disconnect", self);
                            clearInterval(self.keepaliveTimerId);
                            clearInterval(self.CheckSourceBufferId);
                            //clearInterval(self.reconnectTimerId);
                        }
                        try {
                            //console.log("CheckSourceBuffer size" + self.sourceBuffer.buffered.length)
                            if (self.sourceBuffer == null) {
                                self.bNeedReconnect = true;

                            }
                            if (self.sourceBuffer.buffered.length <= 0) {
                                self.emptyBuffCnt++;
                                if (self.emptyBuffCnt > 8) {
                                    // console.log("CheckSourceBuffer Close 1");
                                    self.videoSocket.send("close");
                                    self.videoSocket.close();
                                    return;
                                }
                            } else {
                                let curTime = new Date().getTime();
                                if (self._readDataFromBufferCurTime > 0 && (curTime - self._readDataFromBufferCurTime) > 10 * 1000) {
                                    // console.log("var curTime = new Date().getTime(); 1");
                                    this.videoSocket.send("close");
                                    this.videoSocket.close();
                                    return;
                                }
                            }
                        }
                        catch (e) {
                            console.log("CheckSourceBuffer error...", e);
                        }
                    };
                    //发动控制指令,增加扩展字段，speed 速度控制，预置位
                    this.doCmd = function (cameraid, cmd, speed, param1, param2) {
                        if (self.managerSocket != null) {
                            let data = {
                                "Header": {
                                    "Version": "1.0",
                                    "CSeq": "1",
                                    "MsgType": "H5_PLAY_CTL",
                                    "Status": "200"
                                },
                                "Body": {
                                    "Camera_id": cameraid,
                                    "Ctl_type": cmd,
                                    "Ctl_speed": speed,
                                    "Ctl_param1": param1,
                                    "Ctl_param2": param2,
                                    "Ctl_param3": '0',
                                    "Ctl_param4": '0',
                                    "Ctl_param5": '0',
                                    "Ctl_param6": '0'
                                }
                            };
                            let jsondata = JSON.stringify(data); //将JSON对象序列化为JSON字符串
                            self.managerSocket.send(jsondata);
                        }
                    };
                    //3D定位
                    this.do3Dcmd = function (param1, param2, param3, param4, param5, param6) {
                        if (self.managerSocket != null) {
                            let data = {
                                "Header": {
                                    "Version": "1.0",
                                    "CSeq": "1",
                                    "MsgType": "H5_PLAY_CTL",
                                    "Status": "200"
                                },
                                "Body": {
                                    "Camera_id": self._cameraid,
                                    "Ctl_type": "200",
                                    "Ctl_speed": "150",
                                    "Ctl_param1": param1,
                                    "Ctl_param2": param2,
                                    "Ctl_param3": param3,
                                    "Ctl_param4": param4,
                                    "Ctl_param5": param5,
                                    "Ctl_param6": param6
                                }
                            };
                            let jsondata = JSON.stringify(data); //将JSON对象序列化为JSON字符串
                            self.managerSocket.send(jsondata);
                        }
                    };
                    //与sip代理通信发送数据,发送json数据信息
                    this.SendManager = function (req_type) {
                        if (self.managerSocket != null) {
                            //组合请求json信息
                            if (req_type == "Play") {
                                let data = {
                                    "Header": {
                                        "Version": "1.0",
                                        "CSeq": "1",
                                        "MsgType": "H5_PLAY_REQ",
                                        "Status": "200"
                                    },
                                    "Body": {
                                        "Session_id": this._sessionid,
                                        "Camera_id": self._cameraid,
                                        "Stream_type": this._stream_type
                                    }
                                };
                                let jsondata = JSON.stringify(data); //将JSON对象序列化为JSON字符串
                                self.managerSocket.send(jsondata);
                                console.log(jsondata);

                            } else if (req_type == "Playback") {
                                let data = {
                                    "Header": {
                                        "Version": "1.0",
                                        "CSeq": "1",
                                        "MsgType": "H5_PLAYBACK_REQ",
                                        "Status": "200"
                                    },
                                    "Body": {
                                        "Session_id": this._sessionid,
                                        "Camera_id": self._cameraid,
                                        "Start_time": this._start_time,
                                        "End_time": this._end_time
                                    }
                                };
                                let jsondata = JSON.stringify(data); //将JSON对象序列化为JSON字符串
                                self.managerSocket.send(jsondata);
                            }
                        }
                    };
                    //接收sip代理数据信息
                    this.RecvManager = function (evt) {
                        let received_msg = evt.data;
                        console.log(received_msg);

                        if (received_msg == "")
                            return;

                        let jsondata = JSON.parse(received_msg);
                        self.dataStreamHeaderStatus = jsondata.Header.Status;
                        //获取数据流的状态，200的时候启动时间轴定时器
                        if(self.dataStreamHeaderStatus == '200'){
                            $vue.$refs.timeline[$vue.checkedWinNum].setTimeMoveFunc(true);
                        }else{
                            $vue.$refs.timeline[$vue.checkedWinNum].setTimeMoveFunc(false);
                        }
                        //根据提示码修改提示信息
                        var errorContent = "";
                        switch (jsondata.Header.Status) {
                            case '400':
                                errorContent = "平台不在线 、下级请求失败";
                                break;
                            case '404':
                                errorContent = " 无设备或平台信息";
                                break;
                            case '410':
                                errorContent = "设备不在线";
                                break;
                            case '408':
                                errorContent = "请求超时";
                                break;
                            case '500':
                                errorContent = "SIP服务自身异常";
                                break;
                            case '502':
                                errorContent = "无可用SIP";
                                break;
                            case '503':
                                errorContent = "无流媒体";
                                break;
                            case '504':
                                errorContent = "流媒体连接或请求失败、流媒体不响应";
                                break;
                        }
                        let winIndx = parseInt(self._videoId.substring(5, self._videoId.length)) - 1;
                        if ('200' != jsondata.Header.Status) {//设置错误提示码
                            $vue.$refs.videoComm.showInfo.errorCode[winIndx] = jsondata.Header.Status;
                            $vue.$refs.videoComm.showInfo.errorContent[winIndx] = errorContent;
                            self._maxReconnectCount = 2;	//设置最大重连次数为2
                        }

                        if (jsondata.Header.Status == "400" || jsondata.Header.Status == "410" || jsondata.Header.Status == "408" || jsondata.Header.Status == "504") {
                            this.managerSocket.send("close");
                            this.managerSocket.close();
                            self.bNeedReconnect = true;
                            return;
                        }
                        //console.log(jsondata.Body.Call_id);


                        if (jsondata.Header.MsgType == "H5_PLAY_RES" && jsondata.Body) {
                            this.SetupWebSocket("Play", jsondata.Body.Media_ip, jsondata.Body.Media_port, this._cameraid, jsondata.Body.Call_id);

                            //赋值call_id
                            this._Call_id = jsondata.Body.Call_id;
                        } else if (jsondata.Header.MsgType == "H5_PLAYBACK_RES" && jsondata.Body) {

                            this.SetupWebSocket("Playback", jsondata.Body.Media_ip, jsondata.Body.Media_port, this._cameraid, jsondata.Body.Call_id);

                            //赋值call_id
                            this._Call_id = jsondata.Body.Call_id;
                        }
                    };
                    //开启连接视频请求
                    this.ConnectManager = function (req_type) {
                        this.managerSocket = this.H5MWebSocketClient();

                        this.managerSocket.h5 = this;
                        this.managerSocket.onopen = function () {
                            this.h5.SendManager(req_type);
                        };
                        this.managerSocket.onmessage = function (evt) {
                            this.h5.RecvManager(evt);
                        };
                        this.managerSocket.onclose = function () {
                            console.log("flow.html:WebSocket失效连接关闭");
                            //清除时间轴的定时器
                            clearInterval($vue.$refs.timeline[$vue.checkedWinNum].setTimeMove);
                            let winIndex = parseInt(self._videoId.substring(5, self._videoId.length)) - 1;
                            self.openOrCloseLoading(false, winIndex);
                            if (this.videoSocket != null) {
                                this.videoSocket.send("close");
                            }

                            self.bNeedReconnect = true;
                            this.managerSocket = null;
                        };
                    };
                    /**
                     camera_id  摄像机id
                     session_id web端登陆session
                     stream_type  码流类型
                     */
                    this.StartRealPlay = function (stream_type) {
                        this._stream_type = stream_type;
                        this.ConnectManager("Play");
                        this.reconnectTimerId = setInterval(this.ReconnectFunction.bind(this), 5000);
                        //  this.reconnectTimerId = setInterval(this.ReconnectFunction.bind(this), 1000);
                    };
                    //断开实时视频连接
                    this.StopRealPlay = function () {
                        console.log("disconnect", this);
                        this.bDisConnected = true;

                        clearInterval(this.reconnectTimerId);

                        if (this.managerSocket != null) {
                            this.managerSocket.send("close");
                            this.managerSocket.close();
                        }
                        if (this.videoSocket != null) {
                            this.videoSocket.send("close");
                            this.videoSocket.close();
                        }
                        console.log("disconnect", this);
                    };
                    //录像回放控制
                    self.doPlayBackCtrl = function (speed) {
                        if (this.bVideoConnected == false) {
                            return;
                        }
                        if (this.managerSocket != null) {
                            let data = {
                                "Header": {
                                    "Version": "1.0",
                                    "CSeq": "1",
                                    "MsgType": "H5_PLAYBACK_CTL_REQ",
                                    "Status": "200"
                                },
                                "Body": {
                                    "Camera_id": this._cameraid,
                                    "Ctl_type": "BackCtrl",
                                    "Ctl_speed": speed,
                                    "Ctl_param": "0",
                                    "Call_id": this._Call_id
                                }
                            };

                            let jsondata = JSON.stringify(data); //将JSON对象序列化为JSON字符串

                            console.log(jsondata, this);
                            this._playback_speed = speed;

                            this.managerSocket.send(jsondata);
                        }
                    };
                    //开始录像回放
                    this.StartPlayback = function (start_time, end_time) {
                        this._start_time = start_time;
                        this._end_time = end_time;
                        this.ConnectManager("Playback");
                    };
                    //断开录像回放
                    this.StopPlayback = function () {
                        console.log("disconnect", this);
                        this.bDisConnected = true;

                        clearInterval(this.reconnectTimerId);
                        if (this.managerSocket != null) {
                            this.managerSocket.send("close");
                            this.managerSocket.close();
                        }
                        if (this.videoSocket != null) {
                            this.videoSocket.send("close");
                            this.videoSocket.close();
                        }

                        console.log("disconnect", this);
                    };
                    //加载动画开启/关闭
                    this.openOrCloseLoading = (open, winIndex) => {
                        //得到视频窗口
                        if ($vue.$refs.videoComm) {
                            if (open) {
                                $vue.$set($vue.$refs.videoComm.showInfo.loadingShow, winIndex, true);
                            } else {
                                $vue.$set($vue.$refs.videoComm.showInfo.loadingShow, winIndex, false);
                            }
                        }
                    };
                }
            }
        },
        components: {
            videoComm,
            dfDropDown,
            TimeLine
        },
        watch: {
            //监听是否全屏，只要操作就要重新给时间轴赋值宽度
            '$store.state.video.isFullScreen': {
                handler(newValue) {
                    if (this.$refs.videoComm.playState == 'playBack') {
                        setTimeout(() => {
                            //重新给时间轴赋值宽度
                            this.timeParam.canvasWidth = this.$refs.playBackContainer.clientWidth;
                        }, 300)
                    }
                }
            },
            'winCount': {
                handler(newValue) {
                    this.winNum = newValue;
                }
            },
            'curWinCount': {
                handler(newValue) {
                    this.curWinNum = newValue;
                    this.initTimeBarFunc();
                }
            },
            'curRowCls': {
                handler(newValue) {
                    this.curVideoRowCls = newValue;
                }
            }
        },
        mounted() {
            this.winNum = this.winCount;    //窗口数量，默认为4窗口
            this.curWinNum = this.curWinCount;   //当前的窗口数量
            this.curVideoRowCls = this.curRowCls;  //窗口布局样式

            this._winObjHash = new utility.hashTable();
            this._videoObjHash = new utility.hashTable();
            this._browser = utility.getBrowserInfoForVideo();
            //页面加载完毕后，初始化时间轴的宽度
            this.$nextTick(() => {
                if (document.getElementById("realPlayContainer")) {
                    this.timeParam.canvasWidth = document.getElementById("realPlayContainer").offsetWidth;
                } else {
                    this.timeParam.canvasWidth = document.getElementById("playBackContainer").offsetWidth;
                }
            });
            passParam.$on('get-ctrl-value', (value) => {
                this.ctrlDefaultValue = value;
            });
            //根据窗口初始化时间轴对象
            this.initTimeBarFunc();
        },
        methods: {
            //切换窗口显示的数量
            handleChooseWin(command) {
                this.winSelectData.forEach(item => {
                    item.choosed = false;
                    if (item.code == command) {
                        item.choosed = true;
                        /*this.winNum = item.winNum;
                        this.curWinNum = item.winNum;
                        this.curVideoRowCls = [item.code];*/
                        this.$emit('change-win-num', item.winNum, item.winNum, [item.code], 'playBack');
                    }
                });
                this.refreshPauseStyle();

            },
            //根据当前窗口，刷新暂停图标的样式
            refreshPauseStyle() {
                passParam.$emit('change-win', this.winNum);
            },
            //双击子组件的窗口改变窗口数量的同时，更新父组件的数据
            updateData(value1, value2) {
                /*this.winNum = value1;
                this.curVideoRowCls = [value2];*/
                this.$emit('change-win-zoom', value1, value2, 'playBack')
            },
            handleFullScreen() {
                //全屏显示
                if (!screenfull.enabled) {
                    this.$message({
                        message: '浏览器不支持全屏显示！',
                        type: 'warning'
                    });
                    return false
                }
                //获取选中的窗口元素
                //let winInx = this.$refs.videoComm.checkedVideoWin + 1;
                //let domObj = document.querySelector("#playBackContainer #win"+winInx);
                let domObj = document.querySelector("#playBackContainer");
                screenfull.toggle(domObj);
                this.$store.dispatch('video/videoIsFullScreen', true);
                //重新给时间轴赋值宽度
                setTimeout(() => {
                    this.timeParam.canvasWidth = this.$refs.playBackContainer.clientWidth;
                }, 500)

                //this.$refs.timeline[this.checkedWinNum].setTimeMoveFunc(false);
            },

            /*
            * 初始化时间轴组件
            *  根据窗口数量，初始化进度条timeBar对象
            */
            initTimeBarFunc() {
                this.timeBarsComp = [];
                //初始化进度条timeBar对象
                const winCount = this.curWinNum;
                let timeBars = [];
                for (let i = 0; i < winCount; i++) {
                    const timeBar = {
                        startTime: '',//时间轴默认开始时间
                        endTime: '',   //时间轴默认结束时间 = 0;
                        _speed: 1000,
                        cameraId: '',
                        cameraName: '',
                        camObj: {},
                        cells: []  //录像块
                    };
                    timeBars.push(timeBar);
                }
                //初始化时间轴组件
                for (let i = 0; i < 1; i++) {
                    const timeBarComp = {
                        id: i,
                        current: false
                    };
                    if (i == 0) {
                        timeBarComp.current = true
                    }
                    timeBarComp.timeBars = timeBars;
                    this.timeBarsComp.push(timeBarComp);
                }
            },
            /**
             * 根据选中的当前窗口，
             */
            getCurrProgressBar() {
                //获取当前时间轴组件的时间轴对象
                let winInx = this.$refs.videoComm.checkedVideoWin;
                return this.timeBarsComp[this.checkedWinNum].timeBars[winInx];
            },
            /**
             * 为当前进度条设置待播放的摄像机对象
             * @param camNode   摄像机对象
             */
            setCameraId(camNode) {
                let timeBar = this.getCurrProgressBar();
                timeBar.cameraId = camNode.code;
                timeBar.cameraName = camNode.text;
                timeBar.camObj = {
                    'code': camNode.code,
                    'text': camNode.text,
                    'cameraType': camNode.typeCode
                };
                let winInx = this.$refs.videoComm.checkedVideoWin;
                this.$set(this.timeBarsComp[this.checkedWinNum].timeBars, winInx, timeBar);
            },
            /**
             * 选择日期并回放,时间格式：2001-01-01T00:00:00
             * @param startDate
             * @param startT   查询录像的开始时间
             * @param endT     查询录像的结束时间
             */
            chooseDateAndPlayBack(startDate, startT, endT) {
                //获取时间轴对象
                let currInstance = this.getCurrProgressBar();
                currInstance._startT = startDate;
                currInstance.startTime = startT;
                currInstance.endTime = endT;
                currInstance.cells = [];
                let winInx = this.$refs.videoComm.checkedVideoWin;
                this.$set(this.timeBarsComp[this.checkedWinNum].timeBars, winInx, currInstance);

                //查询当前的录像
                this.queryPlayBack(currInstance, true);
            },

            initCanvas(start_timestamp, timecell, end_timestamp, returnTime) {
                this.$refs.timeline[this.checkedWinNum].initCanvas(start_timestamp, timecell, end_timestamp, returnTime)
            },

            /**
             * 查询录像
             * @param timeBar  当前的进度条对象
             * @param flag  是否需要重置进度条状态
             */
            queryPlayBack(timeBar, flag) {
                const self = this;
                if (!timeBar.cameraId) {
                    self.$message({message: "请重新选择摄像机点位", type: 'warning'});
                    return false;
                }
                const param = {
                    "camCode": timeBar.cameraId,
                    "startT": timeBar.startTime,
                    "endT": timeBar.endTime
                };
                doGetVideotape(param).then(res => {
                    const data = res.data;
                    if (JSON.stringify(data) === '{}') {
                        self.$message({message: "服务异常", type: 'warning'});
                        return;
                    }
                    const response = JSON.parse(data.result);
                    console.log('@2019录像', response);
                    if (response.Header['Status'] === "500") {//服务异常
                        self.$message({message: "服务异常", type: 'warning'});
                        return;
                    }
                    //请求成功时处理
                    if (!response || !response.Body || response.Body['Num'] < 1) {
                        self.$message({message: "暂无录像", type: 'warning'});
                        //重置进度条状态
                        this.initCanvas(new Date(timeBar.startTime).getTime(), [], new Date(timeBar.endTime).getTime(), 0);
                        return;
                    }
                    if (!flag) {
                        //重置进度条状态
                        this.initCanvas(new Date(timeBar.startTime).getTime(), [], new Date(timeBar.endTime).getTime(), 0);
                    }
                    //绘制录像块
                    const recordData = response.Body['Record_info'];
                    let timeCells = [];
                    recordData.forEach(item => {
                        timeCells.push({
                            "beginTime": new Date(item.Start_time.replace('T', ' ')).getTime(),
                            "endTime": new Date(item.End_time.replace('T', ' ')).getTime(),
                            "style": {
                                "background": "rgba(132, 244, 180, 0.498039)"
                            }
                        });
                    });
                    timeBar.cells = timeCells;
                    let winInx = this.$refs.videoComm.checkedVideoWin;
                    this.$set(this.timeBarsComp[this.checkedWinNum].timeBars, winInx, timeBar);
                    this.$refs.timeline[this.checkedWinNum].updateTimeCell(timeCells);
                    this.$refs.timeline[this.checkedWinNum].setTimeMoveFunc(false);
                }).catch((res) => {
                    self.$message({message: res.data.message, type: 'error'})
                })
            },
            /**
             *  切换窗口时，将已查询到的录像块添加到对应的时间轴上
             *
             */
            handleToggleWin(winNum) {
                //获取timeBar对象
                this.checkedWinNum = winNum;
                this.timeBarsComp.forEach(item => {
                    if (item.id == winNum) {
                        item.current = true
                    } else {
                        item.current = false
                    }
                })
                const timeBar = this.timeBarsComp[this.checkedWinNum].timeBars[winNum];
                const timeCells = timeBar.cells;
                this.$refs.timeline[winNum].updateTimeCell(timeCells);
                //this.$refs.timeline[winNum].setTimeMoveFunc(true);
            },

            /**
             * 点击时间轴的回调函数--播放录像
             *
             */
            handleClickBar(clickTime) {

                //获取当前的timeBar对象
                const timeBar = this.getCurrProgressBar();
                const startPlayT = clickTime.replace(' ', 'T');
                this.playSingleVideo(timeBar.camObj, startPlayT, timeBar.endTime, 'playBack');
            },

            playSingleVideo(camObj, startTime, endTime, type) {
                const self = this;
                const cameraId = camObj.code;
                const camName = camObj.text;
                const cameraType = camObj.typeCode;
                const win = this.getWinNumByCameraId(cameraId);
                if (win) {//说明目前在播
                    //有录像在播放-》应停止
                    self.videoPause(true, win);
                    const winInx = self.$refs.videoComm.checkedVideoWin + 1;
                    document.querySelector("#video" + winInx).pause();
                }

                //2.查找被选中的窗口是否正在播放
                let videoWinSelectArr = self.$refs.videoComm.videoWinSelect;
                let videoCheckedWinSelect;
                let winInx;
                videoWinSelectArr.forEach((item, index) => {
                    if (item.checked) {
                        videoCheckedWinSelect = item;
                        winInx = index;
                    }
                });
                if (videoCheckedWinSelect) {
                    self.videoPlay(videoCheckedWinSelect, type, camName, cameraType, cameraId, startTime, endTime);
                }
            },

            /**
             * 播放视频逻辑方法
             * @param videoWinSelect   视频窗口信息
             * @param type  播放类型：实时视频/录像回放
             * @param camName   摄像机名称
             * @param cameraType    摄像机类型(1-球机，52-全景摄像机)，通过摄像机类型判断是否显示云台
             */
            videoPlay(videoWinSelect, type, camName, cameraType, cameraId, startTime, endTime) {
                let self = this;
                let videoId = videoWinSelect.videoId;
                let winNum = videoWinSelect.winId;
                let playState = videoWinSelect.playState;
                self._aimWinNum = winNum;
                //判断是否有视频正在播放
                if (playState === 'Play') {//有视频在播放-》应停止
                    //停止播放
                    self.videoPause(true, winNum, type);
                    //document.getElementById(videoId).pause();
                    document.querySelector("#playBackContainer " + "#" + videoId).pause();
                }
                let winIndex = parseInt(winNum.substring(3, winNum.length)) - 1;
                //判断视频是否已暂停
                if (document.querySelector("#playBackContainer " + "#" + videoId).paused) {
//              document.getElementById(videoId).play();
                    /*setTimeout(() => {
                        self.play(videoId, cameraId, "1", "v1", winNum, type, cameraType, camName, startTime, endTime);
                    }, 1000)*/
                    self.play(videoId, cameraId, "1", "v1", winNum, type, cameraType, camName, startTime, endTime);
                    this.$set(self.$refs.videoComm.showInfo.playPauseShow, winIndex, false);  //该窗口中的隐藏暂停图标
                }
                //更改视频窗口状态
                self.$refs.videoComm.videoWinSelect[winIndex].playState = "Play";
                //self.$refs.videoComm.videoWinSelect[winIndex].checked = false;
                /* if (winIndex == self.$refs.videoComm.curWinNum - 1) {
                   self.$refs.videoComm.checkedVideoWin = 0;   //更新选中视频窗口的索引值
                   self.$refs.videoComm.videoWinSelect[0].checked = true;  //更新下一个待播放视频窗口的选中信息
                 } else {
                   self.$refs.videoComm.checkedVideoWin = winIndex + 1;
                   self.$refs.videoComm.videoWinSelect[winIndex + 1].checked = true;
                 }*/

                //在播放窗口显示摄像机名称
                this.$set(self.$refs.videoComm.showInfo.cameraName, winIndex, camName);
                this.$set(self.$refs.videoComm.showInfo.cameraCode, winIndex, cameraId);

                //将窗口对象添加至_winObjHash
                let winValue = {'cameraId': cameraId};
                self._winObjHash.add(winNum, winValue);

            },
            //视频播放
            play(videoId, cameraid, sessionid, authcode, winNum, type, cameraType, camName, startTime, endTime) {
                console.log("@@@@@@@@@@@@@params", videoId + "@" + cameraid + "@" + sessionid + "@" + authcode + "@" + winNum + "@" + type);
                let self = this;
                //let flag = self.getH5ServerIp(cameraid);
                let instance = self._videoObjHash.getValue(winNum);
                if (instance != null) {
                    if (instance._type == "Play") {
                        instance.StopRealPlay();
                    } else {
                        instance.StopPlayback();
                    }
                    self.h5sPlayerDelete(instance);
                    instance = null;
                }
                self.initInstance(videoId, cameraid, sessionid, authcode, winNum, self._browser, cameraType, camName); //暂无主码流和子码流
                instance = self._videoObjHash.getValue(winNum);
                let winIndex = parseInt(winNum.substring(3, winNum.length)) - 1;
                instance.openOrCloseLoading(true, winIndex);//开启视频加载动画
                this.$set(self.$refs.videoComm.showInfo.playPauseShow, winIndex, false);

                if (type == "playBack") {//录像回放
                    instance._type = "Playback";
                    instance._endTime = endTime;

                    //调用录像回放
                    instance.StartPlayback(startTime, endTime);
                    //启动时间轴的定时器
                    //self.$refs.timeline[self.checkedWinNum].setTimeMoveFunc(true);

                }
                console.log("@@@@@@@@@@@@@params连接");
            },
            //停止播放
            stop(winNum) {
                let self = this;
                let instance = self._videoObjHash.getValue(winNum);
                if (instance != null) {
                    if (instance._type == "Play") {
                        instance.StopRealPlay();
                    } else {
                        instance.StopPlayback();
                    }
                    self.h5sPlayerDelete(instance);
                    //instance = null;
                }

            },
            /**
             * 创建H5Player
             * @param videoId   用于播放视频的video标签的id
             * @param cameraid  摄像机20位编码
             * @param sessionid
             * @param authcode
             * @param winNum    当前播放视频的窗口号
             * @param browserInfo
             * @param cameraType    摄像机类型
             * @param camName   摄像机名称
             */
            initInstance(videoId, cameraid, sessionid, authcode, winNum, browserInfo, cameraType, camName) {
                let self = this;
                let instance = new self.instance(this, videoId, cameraid, sessionid, authcode, browserInfo);
                if (cameraType) {
                    instance._cameraType = cameraType;
                }
                if (camName) {
                    instance._camName = camName;
                    instance._cameraid = cameraid;
                }
                this._videoObjHash.add(winNum, instance);
                console.log('@@@@@@@@@@@@@创建H5Player：', winNum, instance);
            },
            h5sPlayerDelete(player) {
                this._videoObjHash.remove(player);
                return true;
            },

            /**
             * 通过摄像机code获取正在播放该摄像机的窗口号
             * @param value 摄像机20位code
             * @returns {*} 正在操作该摄像机的窗口号
             */
            getWinNumByCameraId(value) {
                let entry = this._winObjHash.getobject();
                for (let prop in entry) {
                    if (entry[prop].cameraId == value) {
                        return prop;
                        break;
                    }
                }
                return null;
            },
            /**
             * 播放指定视频
             * @param winNum    待播放的视频窗口
             * @param type  播放类型：实时视频/录像回放
             */
            playAppointVideo(winNum, type) {
                this.videoPlaySubFunc(winNum, type);
            },
            /**
             * 播放视频逻辑
             * @param winNum    待播放的视频窗口
             * @param type  播放类型：实时视频/录像回放
             */
            videoPlaySubFunc(winNum, type) {
                let self = this;
                let videoObj;
                let winsArr = self._videoObjHash.getKeys();
                if (winNum) {//播放指定视频
                    videoPlayInWin(winNum);
                } else {
                    for (let i = 0; i < winsArr.length; i++) {
                        videoPlayInWin(winsArr[i]);
                    }
                }

                /**
                 * 在指定窗口中播放视频
                 * @param num   窗口号
                 */
                function videoPlayInWin(num) {
                    let instance = self._videoObjHash.getValue(num);
                    if(instance){
                        if (type == "playBack") {
                            //启动暂停的时间轴
                            self.$refs.timeline[self.checkedWinNum].setTimeMoveFunc(true);
                            instance.doPlayBackCtrl(1);
                        }
                        const winIndex = parseInt(winNum.substring(3, winNum.length)) - 1;
                        self.$set(self.$refs.videoComm.showInfo.playPauseShow, winIndex, false);   //隐藏暂停按钮
                    }
                }
            },
            /**
             * 暂停指定视频
             * @param winNum    待关闭的视频窗口
             * @param type  播放类型：实时视频/录像回放
             */
            pauseAppointVideo(winNum, type) {
                let self = this;
                self.videoPause(false, winNum, type);
            },
            /**
             * 关闭指定视频
             * @param winSelect 视频窗口选择器（精确到li）
             * @param winNum    待关闭视频的窗口号
             * @param type  播放类型：实时视频/录像回放
             */
            closeAppointVideo(winNum, type) {
                let self = this;
                if (winNum) {
                    self.videoPause(true, winNum, type);
                    //清空视频对象状态hash
                    let index = winNum.substring(3) - 1;
                    self.$refs.videoComm.videoWinSelect[index].playState = 'noPlay';
                    self.$refs.timeline[index].updateTimeCell([]);
                    self.$refs.timeline[index].updateReturnTime(this.startTime - 1000 * 24 * 60 * 60);
                    self.$refs.timeline[index].setTimeMoveFunc(false);
                }
            },

            //播到查询所有的视频播放完毕后自动暂停
            stopVideoPlay(index){
                this.$refs.videoComm.handleOperBtn(1,index);
            },

            /**
             * （暂停/关闭）指定窗口的视频的逻辑
             * @param close 是否关闭（true-是）
             * @param winNum    窗口号
             * @param type  播放类型：实时视频/录像回放
             * @param notCheckFirst 是否默认选中第一个窗口（true-不默认选中第一个）
             */
            videoPause(close, winNum, type, notCheckFirst) {
                let self = this;
                let videoObj;
                let winsArr = self._videoObjHash.getKeys();
                if (winNum) {//暂停指定
                    videoPause(winNum);
                } else {
                    for (let i = 0; i < winsArr.length; i++) {
                        videoPause(winsArr[i]);
                    }
                }

                /**
                 * （暂停/关闭）视频
                 * @param num   窗口号
                 */
                function videoPause(num) {
                    if (!num) {
                        return;
                    }
                    let winIndex = parseInt(num.substring(3, num.length)) - 1;
                    videoObj = document.querySelector("#playBackContainer " + "#" + "video" + (winIndex + 1));
                    //videoObj = document.getElementById("video" + (winIndex + 1));
                    self.videoPauseSubFunc(close, num, videoObj, type);
                    //获取关闭加载动画的实例
                    let instance = self._videoObjHash.getValue(num);
                    //如果存在实例
                    if(instance){
                        instance.openOrCloseLoading(false, winIndex);
                        //暂停时间轴的定时器
                        self.$refs.timeline[self.checkedWinNum].setTimeMoveFunc(false, false);
                    }
                    //clearInterval(self.$refs.timeline[self.checkedWinNum].setTimeMove)
                    //self.$refs.timeline[self.checkedWinNum].setTimeMove = null;
                    //关闭视频逻辑
                    if (close) {
                        //instance.managerSocket.close();
                        //document.getElementById("video" + (winIndex + 1)).setAttribute('src', ''); //关闭视频画面
                        document.querySelector("#playBackContainer " + "#" + "video" + (winIndex + 1)).setAttribute('src', ''); //关闭视频画面
                        self.$refs.videoComm.videoWinSelect[winIndex].playState = "noPlay";
                        /*self.hideReconnectExceedNotice(winIndex);//关闭超过最大重连次数的提示
                        self.hideReconnectNotice(winIndex);//关闭重连提示*/
                        clearObj(num, winIndex);
                    }

                    /**
                     * 清空指定视频对象，关闭视频时使用
                     * @param key   待关闭视频所在的窗口号
                     */
                    function clearObj(key, winIndex) {
                        //清空指定视频对象的状态hash
                        self._winObjHash.remove(key);
                        //清空对应的videoObj
                        self._videoObjHash.remove(key);
                        self.$set(self.$refs.videoComm.showInfo.unavailableSourceShow, winIndex, false);    //隐藏视频资源无法加载提示
                        //删除timeBar对应窗口的录像块
                        let timeBar = self.timeBarsComp[self.checkedWinNum].timeBars[winIndex];
                        timeBar.cells = [];
                        self.$set(self.timeBarsComp[self.checkedWinNum].timeBars, winIndex, timeBar);

                        //清空时间轴的定时器、录像块、播放标记，重置到原始时间轴状态
                        self.$refs.timeline[winIndex].setTimeMoveFunc(false);
                    }
                }
            },
            /**
             * （暂停/关闭）视频子方法
             * @param close 是否关闭（true-是）
             * @param winNum    窗口号，如win1
             * @param winObj    窗口video元素对象
             * @param type  播放类型：实时视频/录像回放
             */
            videoPauseSubFunc(close, winNum, winObj, type) {//窗口号、窗口对象
                let videoObj = this._videoObjHash.getValue(winNum);
                if (videoObj) {  //若是该窗口有播放的视频
                    if (!close && type == "playBack") {
                        videoObj.doPlayBackCtrl(0);
                    } else {
                        this.stop(winNum); //关闭视频连接
                    }
                    let winIndex = parseInt(winNum.substring(3, winNum.length)) - 1;
                    winObj.pause(); //视频暂停
                    this.$set(this.$refs.videoComm.showInfo.playPauseShow, winIndex, true); //显示播放按钮
                    if (close) {
                        this.$set(this.$refs.videoComm.showInfo.cameraName, winIndex, "");
                    }
                }
            },
            /**
             * 暂停所有的视频
             */
            pauseAllVideo() {
                this.videoPause(false, false, 'playBack');
            },
            /**
             * 播放所有的视频
             */
            playAllVideo() {
                this.videoPlaySubFunc(false, 'playBack');
            },
            /**
             * 关闭所有的视频
             */
            closeAllVideo() {
                //重置所有时间轴
                this.checkedWinNum = 0;
                this.$refs.videoComm.checkedVideoWin = 0;
                //this.initTimeBarFunc();
                //关闭所有视频
                this.videoPause(true, null, 'playBack');
                this.$refs.videoComm.videoWinSelect.forEach(item => {
                    item.playState = 'noPlay';
                });
                //选中窗口定位到第一个
                this.$refs.videoComm.checkedVideoWin = 0;
                let videoWinSelectArr = this.$refs.videoComm.videoWinSelect;
                videoWinSelectArr.forEach((item, index) => {
                    if (index == 0) {
                        item.checked = true;
                    } else {
                        item.checked = false;
                    }
                });
                //重置所有时间轴
                this.$refs.timeline.forEach((item, index) => {
                    item.updateTimeCell([]);
                    item.updateReturnTime(this.startTime - 1000 * 24 * 60 * 60);
                    item.setTimeMoveFunc(false);
                })
            },
            /**
             * 云台控制
             * @param winSelect   窗口号，如win1
             * @param cmd   控制指令
             * @param speed 速度
             * @param dir   方向
             */
            handleCtrl(winSelect, cmd, dir) {
                var self = this;
                let instance = self._videoObjHash.getValue(winSelect);
                let speed = this.ctrlDefaultValue ? this.ctrlDefaultValue : 90;
                if (instance) {
                    let cameraCode = instance._cameraid;
                    instance.doCmd(cameraCode, cmd, speed + '', '0', '0');
                } else {
                    this.$message({
                        message: '请先选择摄像机！',
                        type: 'warning'
                    });
                }
            },
        }
    }
</script>
<style lang="less">
    @import "../styles/play-back.less";
</style>
