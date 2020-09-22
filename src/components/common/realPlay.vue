<template>
    <div id="realPlayContainer">
        <div class="multiple-win-wrap" :class="{'full-screen':isFullScreen}">
            <video-comm
                    ref="videoComm"
                    :playState="playState"
                    :rowNumStyle="curRowCls.join('')"
                    :winNum="winCount"
                    :curWinNum="curWinCount"
                    :winSelectData="winSelectData"
                    @update-data="updateData"
            ></video-comm>
        </div>
        <div id="multiple-channel-choose" v-show="btnShow">
            <df-drop-down name="窗口选择" type="primary" :data="winSelectData" :defaultValue="curVideoRowCls"
                          @command="handleChooseWin"></df-drop-down>
            <div class="video-btn-group real-play">
                <el-button size="medium" type="primary" @click="handleCloseAllVideo">关闭全部</el-button>
                <el-button size="medium" type="primary" @click="handleFullScreen">全屏</el-button>
                <!--<el-button size="medium" type="primary">视频回放</el-button>-->
                <div class="block ctrl-slider">
                    <span class="demonstration">云台控速：</span>
                    <el-slider v-model="ctrlDefaultValue" show-input></el-slider>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import screenfull from 'screenfull'
    import videoComm from './videoComm.vue'
    import dfDropDown from './dropDownMenu.vue'
    import utility from '@/utils/ext.utility'
    import passParam from '@/utils/ext.passParam'

    export default {
        //btnShow:按钮是否显示；winCount窗口数量；curWinCount：当前的窗口数量；curRowCls：一行多少个视频播放窗口
        props: ['playState', 'btnShow', 'winCount', 'curWinCount', 'curRowCls'],
        data() {
            return {
                winSelectData: [
                    {code: 'one-row', des: '单窗口', winNum: 1, choosed: false},
                    {code: 'two-row', des: '4窗口', winNum: 4, choosed: true},
                    {code: 'three-row', des: '9窗口', winNum: 9, choosed: false},
                    {code: 'four-row', des: '16窗口', winNum: 16, choosed: false}
                ],
                winNum: 4,    //窗口数量，默认为4窗口
                curWinNum: 4,   //当前的窗口数量
                curVideoRowCls: ['two-row'],
                ctrlDefaultValue: 90,     //云台控速的默认值
                isFullScreen: false,  //是否显示全屏
                _winObjHash: null,
                _videoObjHash: null,
                _aimWinNum: null,
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
                        console.log('Try Reconnect...', self.bNeedReconnect, '@_reconnectCount:', self._reconnectCount);
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
                            let buffEndTime = self.sourceBuffer.buffered.end(0);
                            let buffDiff = buffEndTime - self.video.currentTime;

                            if (self._type == "Playback") {
                                //xzyan:20190128，控制录像时间轴播放进度——start
                                let temp = new Date(self._start_time).getTime() + self.video.currentTime * 1000;
                                let dateFormat = ext.dateTime.dateFormat(new Date(temp));
                                ext.progressBar.selectBarTime2(self._videoId.substring(5), dateFormat.split(' ')[1], temp);
                                self._pauseTime = dateFormat.replace(' ', 'T');//记录暂停时间
                                //控制录像时间轴播放进度——end
                                if (self._playback_speed == 4) {
                                    self.video.playbackRate = self._playback_speed - 1; //当前播放速度，设置后马上改变
                                    if (buffDiff > bufer_time) {
                                        self.video.playbackRate = self._playback_speed; //当前播放速度，设置后马上改变
                                    } else {
                                        self.video.playbackRate = self._playback_speed - 1;
                                    }
                                } else {
                                    self.video.playbackRate = self._playback_speed; //当前播放速度，设置后马上改变
                                }
                            } else {
                                if (buffDiff > bufer_time) {
                                    self.video.playbackRate = 1.5; //当前播放速度，设置后马上改变
                                } else {
                                    self.video.playbackRate = 1; //当前播放速度，设置后马上改变
                                }
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
                            self.video = document.querySelector("#realPlayContainer " + "#" + self._videoId);
                            self.video.autoplay = true;

                            self.video.playbackRate = 0.5;

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
                            $vue.hideReconnectNotice(winIndex);
                            $vue.hideReconnectExceedNotice(winIndex);
                        } catch (e) {
                            console.log(e.name + ':' + e.message);
                            //let winObj = ext.player._winObjHash.getValue(winNum);
                            //this.$set(self.$refs.videoComm.showInfo.unavailableSourceShow,winNumber-1,true);  //显示视频资源无法加载提示
                        }
                    };

                    //创建视频websocket
                    // this.SetupWebSocket = function (cameraid, sessionid, authcode,type,startTime,endTime)
                    this.SetupWebSocket = function (req_type, media_ip, media_port, cameraid, callid) {
                        self.video = document.querySelector("#realPlayContainer " + "#" + self._videoId);
                        //self.video = document.getElementById(self._videoId);
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
                            // console.log("CheckSourceBuffer", self);
                            console.log("CheckSourceBuffer size" + self.sourceBuffer.buffered.length)
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
            dfDropDown
        },
        watch: {
            'ctrlDefaultValue': {
                handler(newValue) {
                    passParam.$emit('get-ctrl-value', newValue);
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
                }
            },
            'curRowCls': {
                handler(newValue) {
                    this.curVideoRowCls = newValue;
                }
            },

        },
        mounted() {
            this.$refs.videoComm.realPlayBtnShow = true;   //显示实时视频的操作按钮
            this.$refs.videoComm.playBackBtnShow = false;
            this._winObjHash = new utility.hashTable();
            this._videoObjHash = new utility.hashTable();
            this._browser = utility.getBrowserInfoForVideo();
            //监听屏幕的全屏事件
            screenfull.on('change', () => {
                if (!screenfull.isFullscreen) {
                    //取消全屏时，要执行的操作
                    this.isFullScreen = false;
                    this.$store.dispatch('video/videoIsFullScreen', false);

                }
            });


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
                        this.$emit('change-win-num', item.winNum, item.winNum, [item.code], 'realPlay');
                    }
                });
                this.refreshPauseStyle();

            },
            //双击子组件的窗口改变窗口数量的同时，更新父组件的数据
            updateData(value1, value2) {
                /*this.winNum = value1;
                this.curVideoRowCls = [value2];*/
                this.$emit('change-win-zoom', value1, value2, 'realPlay')
            },
            handleCloseAllVideo() {
                //关闭所有已在播放的视频
                this.closeAllVideo();
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
                let winInx = this.$refs.videoComm.checkedVideoWin + 1;
                //let domObj = document.querySelector("#realPlayContainer #win"+winInx);
                let domObj = document.querySelector(".multiple-win-wrap");
                screenfull.toggle(domObj);
                this.isFullScreen = true;
                this.$store.dispatch('video/videoIsFullScreen', true);
            },

            //根据当前窗口，刷新暂停图标的样式
            refreshPauseStyle() {
                passParam.$emit('change-win', this.winNum);
            },

            /**
             * player对象
             * @param videoId   供播放视频的video标签的id
             * @param cameraid  摄像机20位编码
             * @param sessionid
             * @param authcode
             * @param browserInfo   0-IE；1-谷歌或者其他
             */
            playVideoByCameraId(camObj, winSelect, type, startTime, endTime, ifSkipFindAlreadyPlayWin, ifAutoPlayBackMult) {
                let self = this;
                let cameraId = camObj.code;
                let camName = camObj.text;
                let cameraType = camObj.typeCode;
                if (!cameraId) {
                    this.$message({
                        showClose: true,
                        message: '摄像机不存在',
                        type: 'error'
                    });
                    return;
                }
                //待播放视频目前已在播放后的操作
                let win = null;
                if (!ifSkipFindAlreadyPlayWin) {
                    win = this.getWinNumByCameraId(cameraId);
                }
                if (win) {//说明目前在播(win为窗口号,直接将其选中就可以了)
                    //通过win得到当前视频窗口的索引值
                    const indx = parseInt(win.substring(3, win.length)) - 1;
                    //document.getElementById('video'+(index+1)).setAttribute('src', '');  //关闭视频画面
                    this.$refs.videoComm.videoWinSelect[indx].playState = 'Play';
                    this.$refs.videoComm.checkedVideoWin = indx;
                    this.$refs.videoComm.videoWinSelect.forEach((item, index) => {
                        if (indx == index) {
                            item.checked = true
                        } else {
                            item.checked = false
                        }
                    });
                    //console.log('该视频已在播放');
                    return;
                }
                //2.查找被选中的窗口是否正在播放
                let videoWinSelectArr = this.$refs.videoComm.videoWinSelect;
                let videoCheckedWinSelect;
                let winInx;
                videoWinSelectArr.forEach((item, index) => {
                    if (item.checked) {
                        videoCheckedWinSelect = item;
                        winInx = index;
                    }
                });
                if (videoCheckedWinSelect) {
                    self.videoPlay(videoCheckedWinSelect, type, camName, cameraType, cameraId);
                }
            },
            /**
             * 播放视频逻辑方法
             * @param videoWinSelectArr   视频窗口信息数组
             * @param type  播放类型：实时视频/录像回放
             * @param camName   摄像机名称
             * @param cameraType    摄像机类型(1-球机，52-全景摄像机)，通过摄像机类型判断是否显示云台
             */
            videoPlay(videoWinSelect, type, camName, cameraType, cameraId) {
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
                    document.querySelector("#realPlayContainer " + "#" + videoId).pause();
                }
                let winIndex = parseInt(winNum.substring(3, winNum.length)) - 1;
                //判断视频是否已暂停
                if (document.querySelector("#realPlayContainer " + "#" + videoId).paused) {
//              document.getElementById(videoId).play();
                    setTimeout(() => {
                        self.play(videoId, cameraId, "1", "v1", winNum, type, cameraType, camName);
                    }, 1000)
                    this.$set(self.$refs.videoComm.showInfo.playPauseShow, winIndex, false);  //该窗口中的隐藏暂停图标
                }
                //更改视频窗口状态
                self.$refs.videoComm.videoWinSelect[winIndex].checked = false;
                self.$refs.videoComm.videoWinSelect[winIndex].playState = "Play";
                if (winIndex == self.$refs.videoComm.curWinNum - 1) {
                    self.$refs.videoComm.checkedVideoWin = 0;   //更新选中视频窗口的索引值
                    self.$refs.videoComm.videoWinSelect[0].checked = true;  //更新下一个待播放视频窗口的选中信息
                } else {
                    self.$refs.videoComm.checkedVideoWin = winIndex + 1;
                    self.$refs.videoComm.videoWinSelect[winIndex + 1].checked = true;
                }

                //在播放窗口显示摄像机名称
                this.$set(self.$refs.videoComm.showInfo.cameraName, winIndex, camName);
                this.$set(self.$refs.videoComm.showInfo.cameraCode, winIndex, cameraId);

                //将窗口对象添加至_winObjHash
                let winValue = {'cameraId': cameraId};
                self._winObjHash.add(winNum, winValue);

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
                    videoObj = document.querySelector("#realPlayContainer " + "#video" + (winIndex + 1));
                    //videoObj = document.getElementById("video" + (winIndex + 1));
                    self.videoPauseSubFunc(close, num, videoObj, type);
                    //关闭加载动画
                    let instance = self._videoObjHash.getValue(num);
                    if(instance){
                        instance.openOrCloseLoading(false, winIndex);
                    }

                    //关闭视频逻辑
                    if (close) {
                        //断开重连定时器
                        if(instance){
                            instance.StopRealPlay();
                        }
                        document.querySelector("#realPlayContainer " + "#video" + (winIndex + 1)).setAttribute('src', ''); //关闭视频画面
                        //document.getElementById("video" + (winIndex + 1)).setAttribute('src', ''); //关闭视频画面
                        self.$refs.videoComm.videoWinSelect[winIndex].playState = "noPlay";
                        self.hideReconnectExceedNotice(winIndex);//关闭超过最大重连次数的提示
                        self.hideReconnectNotice(winIndex);//关闭重连提示
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
             * 关闭全部视频
             * @param winSelect 视频窗口选择器（精确到li）
             * @param type  播放类型：实时视频/录像回放
             */
            closeAllVideo(type) {
                let self = this;
                self.videoPause(true, null, type);
                self.$refs.videoComm.videoWinSelect.forEach(item => {
                    item.playState = 'noPlay';
                });
                //选中窗口定位到第一个
                self.$refs.videoComm.checkedVideoWin = 0;
                let videoWinSelectArr = this.$refs.videoComm.videoWinSelect;
                videoWinSelectArr.forEach((item, index) => {
                    if (index == 0) {
                        item.checked = true;
                    } else {
                        item.checked = false;
                    }
                })
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
            successPlay(instance) {
                //调用实时预览
                instance._type = "Play";
                //获取窗口数量
                let showWinCount = this.$refs.videoComm.curWinNum;
                /*let ifHasMaxWin = document.querySelector('li.win').hasClass("max");*/
                if (showWinCount <= 4) {
                    instance.StartRealPlay(0);//默认主码流
                } else {
                    instance.StartRealPlay(1);//默认子码流
                }
            },
            //视频播放
            play(videoId, cameraid, sessionid, authcode, winNum, type, cameraType, camName) {
                console.log("@@@@@@@@@@@@@params", videoId + "@" + cameraid + "@" + sessionid + "@" + authcode + "@" + winNum + "@" + type);
                let self = this;
                //let flag = self.getH5ServerIp(cameraid);
                let instance = self._videoObjHash.getValue(winNum);
                console.log("@@@@@@@@@@@@@params" + winNum);
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
                if(instance){
                    instance.openOrCloseLoading(true, winIndex);//开启视频加载动画
                }
                this.$set(self.$refs.videoComm.showInfo.playPauseShow, winIndex, false);

                if (type == "Play" || type == undefined) {//实时预览
                    self.successPlay(instance);
                }

                if (type == "playBack") {//录像回放
                    instance._type = "Playback";
//         instance._endTime = endTime;

                    //调用录像回放
//        instance.StartPlayback(startTime, endTime);
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
             * 全部暂停
             * @param type  播放类型：实时视频/录像回放
             */
            pauseAllVideo(type) {
                let self = this;
                self.videoPause(false, false, type);
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
             * 全部播放
             * @param type  播放类型：实时视频/录像回放
             */
            playAllVideo(type) {
                let self = this;
                self.videoPlaySubFunc(false, type);
            },
            /**
             * 播放指定视频
             * @param winNum    待播放的视频窗口
             * @param type  播放类型：实时视频/录像回放
             */
            playAppointVideo(winNum, type) {
                let self = this;
                self.videoPlaySubFunc(winNum, type);
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
                    if (type == "playBack") {
                        //启动暂停的时间轴
                        instance.doPlayBackCtrl(1);
                    } else {
                        self.play(instance._videoId, instance._cameraid, instance._sessionid, instance._authcode, num, "Play", null, null, instance._cameraType, instance._camName);
                    }
                    const winIndex = parseInt(winNum.substring(3, winNum.length)) - 1;
                    this.$set(self.$refs.videoComm.showInfo.playPauseShow, winIndex, false);   //隐藏暂停按钮
                }
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
                let speed = this.ctrlDefaultValue;
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
            /**
             * 显示视频重连提示
             * @param liObj 视频窗口选择器，精确到div[data-win="xxx"]一级
             */
            showReconnectNotice(winIndex) {
                this.$set(this.$refs.videoComm.showInfo.exceedShow, winIndex, false);
                this.$set(this.$refs.videoComm.showInfo.errorShow, winIndex, false);
                this.$set(this.$refs.videoComm.showInfo.connectingShow, winIndex, true);
            },
            /**
             * 隐藏视频重连提示
             * @param liObj 视频窗口选择器，精确到div[data-win="xxx"]一级
             */
            hideReconnectNotice(winIndex) {
                this.$set(this.$refs.videoComm.showInfo.connectingShow, winIndex, false);
            },
            /**
             * 显示超出视频最大重连数限制提示
             * @param liObj 视频窗口选择器，精确到div[data-win="xxx"]一级
             */
            showReconnectExceedNotice(winIndex) {
                this.$set(this.$refs.videoComm.showInfo.exceedShow, winIndex, false);
                this.$set(this.$refs.videoComm.showInfo.errorShow, winIndex, true);
                this.$set(this.$refs.videoComm.showInfo.connectingShow, winIndex, false);
            },
            /**
             * 隐藏超出视频最大重连数限制提示
             * @param liObj 视频窗口选择器，精确到div[data-win="xxx"]一级
             */
            hideReconnectExceedNotice(winIndex) {
                this.$set(this.$refs.videoComm.showInfo.errorShow, winIndex, false);
                this.$set(this.$refs.videoComm.showInfo.exceedShow, winIndex, false);
            },
            //播放一組視頻
            playAGroupOfVideo(cameraArr){
                console.log(cameraArr,"cameraArr");
                cameraArr.map(item=>{
                    this.playVideoByCameraId(item, '#video-content>li');
                });

            }
        },
        beforeDestroy() {
            // 组件销毁的时候断开websocket
            this.closeAllVideo();
        },

    }
</script>
<style lang="less">
    @import "style/real-play.less";
</style>
