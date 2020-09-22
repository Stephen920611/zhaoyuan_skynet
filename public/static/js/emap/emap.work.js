/**
 * Created by 9527 on 2018/1/30.
 */
window.emap = window.emap || {};
emap.work = emap.work || {};

emap.work = {
    _testhash:new ext.utility.hashTable(),//测试用哈希表
    _pointHash : new ext.utility.hashTable(),//存储点位的哈希表
    _cameraHash : new ext.utility.hashTable(),//存储摄像机点位的哈希表
    _componentHash : new ext.utility.hashTable(),//存储部件（围栏、wifi）点位的哈希表
    _deviceHash : new ext.utility.hashTable(),//存储设备（车辆、单兵、无人机）点位的哈希表
    _caseHash : new ext.utility.hashTable(),//存储案件的哈希表
    _policeHash : new ext.utility.hashTable(),//存储警情的哈希表
    _personHash : new ext.utility.hashTable(),//存储人员的哈希表
    _bellHash : new ext.utility.hashTable(),//存储布控管理中警报的哈希表
    _bayonetHash : new ext.utility.hashTable(),//存储卡口的哈希表
    _tempOverlay : null,
    defaultCheckedMarkerImg: 'greenMarker', //选中marker的样式
    defaultUncheckedMarkerImg: '8', //未选中marker的样式
    _clusterRange : new ext.utility.hashTable(),//地图级别聚合范围哈希表
    _clusterMarkers : [],//用于暂存聚合点位
    _currentLabel : [],//用于暂存地图标签
    _clusterSubMarkers : [],
    _markIcon : null,//用于暂存标记图标
    _markChangeIcon : new Array(),//用于暂存切换图标的标记
    _test:null,//测试页面用
    isFlag:true,
    searchByRect : function(){//画矩形选择摄像机
        emap.event._eventHandler = 'searchByRectComplete';
        emap.main.setDrawModel('rectangle');
    },
    searchByCircle : function(){//画圆形选择摄像机
        emap.event._eventHandler = 'searchByCircleComplete';
        emap.main.setDrawModel('circle');
    },
    searchByLine : function(){//画线选择摄像机
        emap.event._eventHandler = 'searchByLineComplete';
        emap.main.setDrawModel('polyline');
    },
    searchByPolygon : function(){//画多边形选择摄像机
        emap.event._eventHandler = 'searchByPolygonComplete';
        emap.main.setDrawModel('polygon');
    },
    //清除在地图上画出的覆盖物
    clearOverlays : function(overlay) {
        var self = this;
        overlay = overlay || self._tempOverlay;
        if(overlay){
            //若是数组
            if($.isArray(overlay)){
                $.each(overlay,function (i,item) {
                    item.setMap(null);
                    item = null;
                })
            }else{
                //若是对象
                overlay.setMap(null);
                overlay = null;
            }
        }
    },
    addMarker : function(id, lat, lng, icon, title,type,flag,showFlag,callback) {//添加点位
        // flag标识是否要展开右侧信息收缩栏，true：展开，false：不展开
        // showFlag标识是否要在地图显示图标，true：显示，false：不显示
        var originalPosition = new google.maps.LatLng(lat, lng);//保存marker的原坐标，用于拖拽结束时使用
        var marker = emap.main.getMarker(id, lat, lng, icon, title);
        if(icon=="cameras32"){
            marker.number = callback();
            marker.iconName = "cameras32";
            emap.work.getClusterMarker(marker,showFlag);
        }
        var self = this;
        //将点位存储进哈希表，以便根据id删除marker
        self._pointHash.add(id,marker);
        var hash = self.markTypeRel(type);
     //   console.log('aa',self._cameraHash.getValues());
        if(hash){
            hash.add(id,marker);
        }
     //   console.log('bb',self._cameraHash.getValues());
        if((type=="person" || type=="device"||type=="case"||type=="police" ||type=="bell"||type=="3d")&&callback){
            var content = callback();
            var label = emap.drawEvent.addLabelWithFont(lat,lng,title,15);
            marker.label = label;
            marker.content = content;
            self._currentLabel.push(label);
        }
        if(showFlag){
            marker.setMap(emap.main.getMap());
        }else{
            marker.setMap(null);
        }
        //单击显示信息窗口
        google.maps.event.addListener(marker, 'click', function(event) {
            emap.main.move2PointByEvent(event);//定位至地图中央
            emap.event.doGetMapBounds();
            $('div.layerbox_item div.departSelectPanel').addClass("display-none");
          //  var isFlag = true;
            if(type == "camera" || type == "component" || type== 'ar'||type=="HIGH"){
                self.showMarkerInfo(id,marker,flag);//显示点位信息
            }else if(type=="person" || type=="device"||type=="case"||type=="police" ||type=="policeAlarm" ||type=="bell"||type=="3d" ||type=="bayonet"){
                emap.main.showInfoWin(marker, marker.content);
            }else if(type== "point"){
                self.showPointMarkerInfo(marker,flag);
            }
            /*else if(type=='test'){
               var  img = emap.main.getIcon(self.defaultCheckedMarkerImg);
                //更换icon图片
                emap.main.setMarkerIcon(marker,img);
            }*/
        });
        //双击显示危险源周边点位(应急资源、监控)
        google.maps.event.addListener(marker, 'dblclick', function(event) {
            console.log("test");
        });
        //右键点击事件
        google.maps.event.addListener(marker, 'rightclick', function(e) {
//**********以下代码为图标拖拽代码，已完成，勿删除*****************************************************
//			var content = '<button id="dragmarker" class="gray medium button">拖拽图标</button>';
//			mapPage.main.showInfoWin(marker,content);
//	    	$('body').on('click','#dragmarker',function  (event) {
//	    		marker.setDraggable(true);
//	    		mapPage.main.closeInfoWinDelay(100);
//	    	});
//***********************************************************************************************
            if(emap.work._followType && emap.work._markerRightClkCallback){
                emap.work._markerRightClkCallback(marker.id,marker.title);
            }
        });

        google.maps.event.addListener(marker, 'mouseover', function(event) {});
        //拖拽结束事件
        google.maps.event.addListener(marker, 'dragend', function(e) {
            var content = '<button id="savelatlng'
                + id
                + '" class="gray medium button">保存新位置</button><button id="goondrag" class="gray medium button">继续拖拽</button><button id="stopdrag" class="gray medium button">取消操作</button>';
            emap.main.showInfoWin(marker,content);
            //单击保存后关闭infowindow;
            $('body').on('click','#savelatlng'+id,function  (event) {
                marker.setDraggable(false);
                emap.main.closeInfoWinDelay(100);

                /*$.post('../mapPage/changelatlng.do',{id:id,lat:lat,lng:lng},function  (data) {
                 alert(data);
                 });*/
            });
            //单击后关闭infowindow继续拖拽;
            $('body').on('click','#goondrag',function  (event) {
                marker.setDraggable(true);
                emap.main.closeInfoWinDelay(100);
            });
            //单击后关闭infowindow取消拖拽;
            $('body').on('click','#stopdrag',function  (event) {
                marker.setDraggable(false);
                marker.setPosition(originalPosition);
                emap.main.closeInfoWinDelay(100);
            });
        });

        return marker;
    },
    clusterCameraPoints : function() {
        // 当发生缩放级别变化时，进行点位聚合操作
        var markerHash = this._pointHash;
        var count = markerHash.getSize();

        if (count > 0) {
            var resultHash = new ext.utility.hashTable();
            var markers = markerHash.getValues();
            var clusterPoints = new Array();
            var range = emap.work.getClusterRange(emap.main.getLevel());

            for (var i = 0; i < markers.length; i++) {
                var thisMarker = markers[i];
                var flag = false;
//				for(var j = 0; j < clusterPoints.length; j++) {
//					if(mapPage.util.getRoughlyDistance(clusterPoints[j],thisMarker.position,10) == true){
//						resultHash.getValue(clusterPoints[j]).push(thisMarker);
//						flag = true;
//						break;
//					}
//				}

                var tmpMin = range;//用于暂存最小的距离值
                var tmpIndex = -1;//用于暂存最小距离的索引号
                for(var j = 0; j < clusterPoints.length; j++) {
                    var distance = emap.util.getDistance(clusterPoints[j],thisMarker.position);
                    if(distance < range && distance < tmpMin){
                        tmpMin = distance;
                        tmpIndex = j;
                    }
                }

                if(tmpIndex != -1){
                    resultHash.getValue(clusterPoints[tmpIndex]).push(thisMarker);
                    flag = true;
                }

                if(!flag){//如果不存在已有的聚合点，则将当前的点作为新的聚合点
                    var children = new Array();
                    children.push(thisMarker);
                    resultHash.add(thisMarker.position,children);
                    clusterPoints.push(thisMarker.position);
                }
            }
            if(clusterPoints.length > 0) {
                this.clearClusterMarkers();
                this.clearClusterSubMarkers();
                this.clearCamMarkerIcon();
                var $this = this;
                for (var i = 0; i < clusterPoints.length; i++) {
                    var cameras = resultHash.getValue(clusterPoints[i]);
                    if(cameras.length==1){//如果聚合点的子节点为1，则显示原图标
                        cameras[0].setMap(emap.main.getMap());
                    }else{
                        var marker = emap.main.getGatherMarker(clusterPoints[i].lat(),clusterPoints[i].lng(),cameras);
                        this._clusterMarkers.push(marker);
                    }

//					google.maps.event.addListener.call(this,marker, 'mouseover', function(event) {
//						alert(cameras.length);
//					});
//					google.maps.event.addListener(marker, 'rightclick', function(event) {
//						alert('右键点击！');
//					});
//					google.maps.event.addListener(marker, 'mouseout', function(event) {
//						console.log('鼠标移出！');
//					});
                }
            }
        }
    },
    initHashTables : function() {
        this._clusterRange.add(19,0);
        this._clusterRange.add(18,0);
        this._clusterRange.add(17,100);
        this._clusterRange.add(16,200);
        this._clusterRange.add(15,300);
        this._clusterRange.add(14,400);
    },
    clearClusterMarkers : function() {
        if(this._clusterMarkers.length > 0){
            for(var i = 0; i < this._clusterMarkers.length; i++){
                this._clusterMarkers[i].setMap(null);
            }
            this._clusterMarkers.length = 0;
        }
    },
    clearClusterSubMarkers : function(){
        if(this._clusterSubMarkers.length > 0){
            for(var i = 0; i < this._clusterSubMarkers.length; i++){
                this._clusterSubMarkers[i].setMap(null);
            }
            this._clusterSubMarkers.length = 0;
        }
    },
    clearCamMarkerIcon:function(){//只清空点位在地图上的图标，不请空变量
        var allmarkers = this._pointHash.getValues();
        for (var i = 0; i < allmarkers.length; i++) {
            allmarkers[i].setMap(null);
        }
    },
    getClusterRange : function(key) {
        var result = 1000;
        if(this._clusterRange.containsKey(key)){
            result = this._clusterRange.getValue(key);
        }
        return result;
    },
    setClusterSubMarkers : function(markers) {
        this._clusterSubMarkers = markers;
    },
    changePointIcon : function(icon,marker){
        this._markIcon = marker.icon;
        this._markChangeIcon.push(marker);
        this.restorePointIcon();
        marker.setMap(null);
        marker.icon = emap.main.getIcon(icon);
        marker.setMap(emap.main.getMap());
    },
    //还原标记图标
    restorePointIcon : function(){
        var marker = this._markChangeIcon;
        if(marker){
            if(marker.length>1) {
                marker[0].setMap(null);
                marker[0].icon = this._markIcon;
                marker[0].setMap(emap.main.getMap());
                marker.shift();
            }
        }
    },
    clearAllLabel : function(){
        if(this._currentLabel){
            for (var i = 0; i < this._currentLabel.length; i++) {
                this._currentLabel[i].setMap(null);
            }
        }
    },
    /*根据id清除单个marker*/
    clearMarker : function(id){
        var marker = this._pointHash.getValue(id);
        marker.setMap(null);
    },
    /**
     * 清除固定的marker或者是label
     * @param {array} markerArr
     */
    clearSpecialMarker : function(markerArr){
        if(markerArr){
            for (var i = 0; i < markerArr.length; i++) {
                markerArr[i].setMap(null);
            }
        }
    },
    /*清除所有marker*/
    clearAllMarker : function(){
        if(this._pointHash){
            var allMarkers = this._pointHash.getValues();
            for (var i = 0; i < allMarkers.length; i++) {
                allMarkers[i].setMap(null);
            }
        }
    },
    /*根据type清除一类marker*/
    clearMarkerByGroup : function(type){
        var hash = this.markTypeRel(type);
        var allMarkers = hash.getValues();
        for (var i = 0; i < allMarkers.length; i++) {
            allMarkers[i].setMap(null);
        }
    },
    //根据定义的hash类型获取hash的所有values
    getAllMarkers : function(type){
        var self = this;
        var hash = self.markTypeRel(type);
        var rtn = new Array();
        if(hash && hash!=null){
            rtn =  hash.getValues();
        }
        return rtn;
    },
    //根据定义的hash类型获取hash
    markTypeRel : function(type){
        var hash = null;
        var self = this;
        switch (type){
            case "camera":
                hash = self._cameraHash;
                break;
            case "component":
                hash = self._componentHash;
                break;
            case "device":
                hash = self._deviceHash;
                break;
            case "case":
                hash = self._caseHash;
                break;
            case "police":
                hash = self._policeHash;
                break;
            case "person":
                hash = self._personHash;
                break;
            case "bell":
                hash = self._bellHash;
                break;
            case "bayonet":
                hash = self._bayonetHash;
                break;
            case "text":
                hash = self._testhash;
                break;
        }
        return hash;
    },
    /*视频播放函数*/
    playVideo : function(which,title){
        var videoTitle = null;
        if(title){
            videoTitle = title;
        }else{
            videoTitle = $(which).parent().children("p").html();
        }
        //var cameraName = $(which).parent().children("p").html();
        //console.log($(which).sibling('p').innerHTML);
        $("#videoArea h4.modal-title").html(videoTitle);
        $("#videoArea").draggable();
        $("#videoArea").modal({
            backdrop : false,
            show : true
        });
    },
    //显示点位信息
     showMarkerInfo: function(id,marker,flag){
        $.ajax({
            url: ext.impor.ajaxUrl + "/position/getInfoById",//json文件位置
            type: "GET",//请求方式为get
            data:{id:id},
            dataType: "json", //返回数据格式为json
            success: function(data) {
                console.log("@@@@",data,$.parseJSON(localStorage.getItem("power")));
                var lat = parseFloat(data.lat).toFixed(4);
                var lng = parseFloat(data.lng).toFixed(4);
                var isTagShow = '';
                if(localStorage.getItem("power")){
                    var tagPower = $.parseJSON(localStorage.getItem("power")).addDeviceTag;
                    isTagShow = (!tagPower || tagPower == 0)?"none":"inline-block";
                }

                var content = '<div class="loc-content"><div class="loca-info">位置信息</div>'
                    +'<div class="msg-content"><p class="msg-info"><span>地理位置：</span><span class="loc-txt camera-des" title="'+data.des+'">'+data.des+'</span></p>'
                    +'<p>所属区域：<span class="user-txt">'+data.areaName+'</span></p>'
                    +'<p><span class="loca"><i class="fa fa-square"></i>E<span class="loc-lng">'+lng+'</span></span>'
                    +'<span class="loca"><i class="fa fa-square"></i>N<span class="loc-lat">'+lat+'</span></span></p></div>';
                if(data.cameras.length!=0){
                    var domStr = '';
                    if($(".map-apply").attr("id") == "mapApply"){
                        domStr = '<i class="fa fa-exclamation-triangle" title="纠错" data-id="'+data.cameras[0].id+'" onclick="func.mapOperation.correctError(this)"></i>' +
                            '<i class="fa fa-cogs" title="添加预案" data-code="'+data.cameras[0].code+'" data-text="'+data.cameras[0].des+'" data-id="'+data.cameras[0].id+'" data-type="'+data.cameras[0].type+'"  onclick="func.mapOperation.addTv(this)"></i>';
                    }
                    if($(".main-content").attr("id") == "structPoint"){
                        domStr = '<i class="fa fa-paper-plane" title="申请" data-id="'+data.cameras[0].id+'"  data-code="'+data.cameras[0].code+'" data-des="'+data.cameras[0].des+'" onclick="func.mapOperation.applyStructPoint(this)"></i>';
                    }
                    if($(".main-content").attr("id") == "commandControl"){
                        domStr = '<i class="fa fa-tags" style="display: '+isTagShow+'" title="标签设定" data-id="'+data.cameras[0].id+'"  data-code="'+data.cameras[0].code+'" data-des="'+data.cameras[0].des+'" onclick="func.mapOperation.addCamToLabel(this)"></i>'
                            +'<i class="fa info-monitor"  title="信息监测" data-id="'+data.cameras[0].code+'" onclick="func.commandControl.infoMonitor(this)"></i>';
                    }
                    var camArry = [];
                    $.each(data.cameras, function (i, item) {
                        camArry.push(item.code+"&"+item.des+"&"+item.type);
                    });
                    var camera = camArry.join(",");
                    $("#videoCfg .all-video").data("camera",camera);
                    $("#videoCfg .all-playback").data("camera",camera);
                    var iconShow = (marker.buildStatus !=1)?"none":"block";
                    content+='<div class="icon-wrap" style="display: '+iconShow+'">';
                    if(camArry.length==1){
                        content+='<i class="fa fa-eye" title="查看" data-id="'+data.cameras[0].id+'"  onclick="func.mapOperation.viewCameraInfo(this)"></i>'
                            +'<i class="fa fa-play-circle" title="实时预览" data-camera="'+camera+'" onclick="func.mapOperation.clickRealPlay(this)"></i>'
                            +'<i class="fa fa-youtube-play" title="录像回放" data-code="'+data.cameras[0].code+'" data-name="'+data.cameras[0].des+'" data-type="'+data.cameras[0].type+'" onclick="func.mapOperation.clickPlayBack(this)"></i>'
                            +'<i class="fa fa-undo" title="单路多轨回放" data-code="'+data.cameras[0].code+'" data-name="'+data.cameras[0].des+'" data-type="'+data.cameras[0].type+'" onclick="func.mapOperation.clickMultPlay(this)"></i>'
                            +'<i class="fa fa-video-camera" title="周边视频" onclick="func.mapOperation.clickRoundVideo()"></i>'+domStr
                            +'</div>'
                    }
                }
                content+='</div>';
                $('div.layerbox_item div.departSelectPanel').addClass("display-none");
                emap.main.showInfoWin(marker,content);
                $('#pointInfo .loc-txt').html(data.areaName);
                $('#pointInfo .user-txt').html(data.des);
                $('#pointInfo .loc-lat').html(lat);
                $('#pointInfo .loc-lng').html(lng);
                var cameras = data.cameras;
                var deviceType = data.type;
                if($(".main-content").attr("id") == "commandControl" && deviceType == "AR"){
                    //触发url地址，打开客户端
                    var clientArUrl = localStorage.getItem('cloud_defense');
                    func.mapOperation.openARClient(clientArUrl)
                }
                var currentDom = "";
                $.each(cameras, function (i, item) { // 场景信息
                    //筛选出符合建设状态的的摄像机数据
                    if(item.buildStatus == marker.buildStatus){
                        var status = item.status==1? "在线":"离线";
                        var arShow = (item.DHDeviceCode && item.DHDeviceCode != "")? "inline-block":"none";
                        var domStr1 = '',arStr='';
                        if($(".map-apply").attr("id") == "mapApply"){
                            domStr1 = '<i class="fa fa-exclamation-triangle" title="纠错" data-id="'+item.id+'" onclick="func.mapOperation.correctError(this)"></i>' +
                                '<i class="fa fa-cogs" title="添加预案"  data-code="'+item.code+'" data-text="'+item.des+'" data-id="'+item.id+'" data-type="'+item.type+'"  onclick="func.mapOperation.addTv(this)"></i>';
                        }
                        if($(".main-content").attr("id") == "structPoint"){
                            domStr1 = '<i class="fa fa-paper-plane" title="申请" data-id="'+data.cameras[0].id+'"  data-code="'+data.cameras[0].code+'" data-des="'+data.cameras[0].des+'" onclick="func.mapOperation.applyStructPoint(this)"></i>';
                        }
                        if($(".main-content").attr("id") == "commandControl"){
                            domStr1 = '<i class="fa fa-tags" style="display: '+isTagShow+'" title="标签设定" data-id="'+data.cameras[0].id+'"  data-code="'+data.cameras[0].code+'" data-des="'+data.cameras[0].des+'" onclick="func.mapOperation.addCamToLabel(this)"></i>'
                                +'<i class="info-monitor" title="信息监测" data-id="'+item.code+'" onclick="func.commandControl.infoMonitor(this)"></i>';
                        }
                        if($(".main-content").attr("id") == "commandControl" && deviceType == "AR"){
                            arStr = '<i class="ar-icon" style="display: '+arShow+'" title="AR视频" data-code="'+item.DHDeviceCode+'" onclick="func.mapOperation.openARCLientVideo(this)"></i>';
                        }
                        currentDom += '<div>' +
                            '<div class="check-cameras"  data-code="'+item.code+'" data-des="'+item.des+'" data-type="'+item.type+'">' +
                            '<input type="checkbox" checked></div>' +
                            '<div class="check-content">' +
                            '<div class="dev-wrap">' +
                            '<div class="pic-wrap"><img src="'+(item.pic==undefined? '../../static/img/dev_pic.png' : item.pic)+'"></div>' +
                            '<div class="info-wrap">'
                            +'<p><span>点位名称：</span><span title="'+item.des+'" class="camera-des">'+item.des+'</span></p>'
                            +'<p><span>点位类别：</span><span>'+item.monitorType+'</span></p>'
                            +'<p><span>设备状态：</span><span>'+status+'</span></p>'
                            +'<p><span>国标编码：</span><span>'+item.code+'</span></p>'
                            +'</div>' +
                            '</div>' +
                            '<div class="icon-wrap" style="display: '+iconShow+'">'
                            +arStr
                            +'<i class="fa fa-eye" title="查看" data-id="'+item.id+'"  onclick="func.mapOperation.viewCameraInfo(this)"></i>'
                            +'<i class="fa fa-play-circle" title="实时预览" data-camera="'+item.code+'&'+item.des+'&'+item.type+'" onclick="func.mapOperation.clickRealPlay(this)"></i>'
                            +'<i class="fa fa-youtube-play" title="录像回放" data-code="'+item.code+'" data-name="'+item.des+'" data-type="'+item.type+'" onclick="func.mapOperation.clickPlayBack(this)"></i>'
                            +'<i class="fa fa-undo" title="单路多轨回放" data-code="'+item.code+'" data-name="'+item.des+'" data-type="'+item.type+'" onclick="func.mapOperation.clickMultPlay(this)"></i>'
                            +'<i class="fa fa-video-camera" title="周边视频" onclick="func.mapOperation.clickRoundVideo()"></i> '+domStr1
                            +'</div></div></div>'
                    }

                });
                $('#devList').html(currentDom);
                if(cameras.length==0){
                    $("#videoCfg").hide();
                }else{
                    $("#videoCfg").show();
                }
                var components = data.components;
                var str = "";
                $.each(components, function (i, item) { // 场景信息
                    str += '<div><div class="check-cameras" ></div><div class="check-content"><div class="dev-wrap"><div class="pic-wrap">'
                        +'<img src="'+(item.type==2? '../../static/img/wifi.png' : '../../static/img/wl.png')+'"></div><div class="info-wrap">'
                        +'<p><span>点位名称：</span><span title="'+item.des+'" class="camera-des">'+item.des+'</span></p>'
                        +'<p><span>部件类别：</span><span>'+item.typeName+'</span></p>'
                        +'<p><span>点位状态：</span><span>'+item.buildStatus+'</span></p>'
                        +'</div></div><div class="icon-wrap">'
                        +'<i class="fa fa-eye" title="查看" style="display: none"></i></div></div></div>'
                });
                $('#devList').append(str);
                if(flag){
                    $('.drawer-content').animate({
                        right:'-11px'
                    });
                    $('.drawer-handle>ul>li>a').toggleClass('click');
                    $('#pointTab').click();
                }
            }
        });
         if($(".manager-sys").attr("id") == "mapResJud"){
             func.mapOperation.camArry = emap.work.getAreaCamera(500,marker);
         }

        //球机+地图应用
        if(marker.type == 'spherical32' && func.videoPlan){
            var pos = marker.position;
            // func.videoPlan.showAngleControl(marker.id,pos.lat(),pos.lng());   //可视域
        }
    },
    //显示结构化点位信息-（视频分析-实时结构化分析点位）
    showPointMarkerInfo: function(marker,flag){
        var data = marker.data;
        var content = "";
        var camArry = [];
        $.each(data.cameras,function(j,jtem){
            var statusName = func.analysisPoint.pointInfoHash.getValue(jtem.id).statusName;
            var time = func.analysisPoint.pointInfoHash.getValue(jtem.id).updateTime.substring(0,19);
            var userName = func.analysisPoint.pointInfoHash.getValue(jtem.id).userName;
            content += '<div><div class="check-cameras" data-code="'+jtem.code+'" data-des="'+jtem.des+'" data-type="'+jtem.type+'" ><input type="checkbox" checked=""></div><div class="check-content"><div class="loc-cont dev-info">'
                + '<div class="msg-cont"><p class="camera-info"><span class="loc-label">摄像机名称：</span><span class="loc-txt" title="' + jtem.des + '">' + jtem.des + '</span></p>'
                + '<p class="camera-info"><span class="loc-label">所属部门：</span><span class="loc-txt">' + jtem.organName + '</span></p>'
                + '<p class="camera-info"><span class="loc-label">状态：</span><span class="camera-state-1">' + statusName + '</span></p>'
                + '</div><div class="msg-btn"><span data-name="实时展示" data-camera="'+userName+'&'+time.substring(0,19)+'&'+jtem.code+'&'+jtem.des+'&'+jtem.type+'"  onclick="func.analysisPoint.getRealTimeDetail(this)">实时展示</span>' +
                '<span data-name="历史结果" data-camera="'+jtem.code+'&'+jtem.des+'" onclick="func.analysisPoint.getHistoryResultDetail(this)">历史结果</span></div></div></div></div>';
            camArry.push(jtem.code+"&"+jtem.des+"&"+jtem.type);
        });
        $('#devList').html(content);
        var camera = camArry.join(",");
        $("#videoCfg .all-video").data("camera",camera);
        $("#videoCfg .all-playback").data("camera",camera);
        emap.main.showInfoWin(marker,marker.content);
        if(flag){
            $('.drawer-content').animate({
                right:'-11px'
            });
            $('.drawer-handle>ul>li>a').toggleClass('click');
            $('#pointTab').click();
        }
    },
    getAreaCamera:function (radius,marker) {
        // 地图周边选摄像机
        var markers = emap.work._cameraHash;
        var keys = markers.getKeys();
        var distance,curMarker;
        var idArry = [];
        var camArr = [];
        for (var i = 0; i < keys.length; i++) {
            curMarker = markers.getValue(keys[i]);
            distance = emap.util.getDistance(marker.getPosition(),curMarker.getPosition());
            if(distance < radius){
                idArry.push(keys[i]);
            }
        }
        $.ajax({
            url: ext.impor.ajaxUrl+"/position/getInfoByIds",
            type: "GET",
            dataType: "json",
            data: {id:idArry.join(",")},
            success: function (data) {
                var cameras = data.cameras;
                $.each(cameras,function (i,item) {
                    camArr.push({
                        code: item.code,
                        text: item.des,
                        typeCode: item.type
                    });
                });
            }
        });
        return camArr;
    },
    // 圈选地图指定范围的摄像机显示
    getRoundCamera:function (radius,marker) {
        // 地图研判警情周边画圆圈选摄像机
        emap.drawEvent.clearCircle();
        var markers = emap.work._cameraHash;
        var keys = markers.getKeys();
        var distance,curMarker;
        var idArry = [];
        for (var i = 0; i < keys.length; i++) {
            curMarker = markers.getValue(keys[i]);
            distance = emap.util.getDistance(marker.getPosition(),curMarker.getPosition());
            if(distance < radius){
                curMarker.setMap(emap.main.getMap());
				if(curMarker.iconName == "cameras32"){
                    curMarker.labelMarker.setVisible(true);
				}
                idArry.push(keys[i]);
            }else{
                curMarker.setMap(null);
				if(curMarker.iconName == "cameras32"){
                    curMarker.labelMarker.setVisible();
				}
            }
        }
        if(idArry.length==0){
            alert("周边"+radius+"米无摄像机")
        }else{
            ext.main.initLoading("读取中，请稍等...");
            $('.drawer-content').animate({
                right:'-11px'
            });
            $('.drawer-handle>ul>li>a').toggleClass('click');
            $('#choosenTab').click();
            var camArr = [];
            $.ajax({
                url: ext.impor.ajaxUrl+"/position/getInfoByIds",
                type: "GET",
                dataType: "json",
                data: {id:idArry.join(",")},
                success: function (data) {
                    var num = 0;
                    var cameras = data.cameras;
                    var dataArr = [];  //将摄像机和点位部件统一存放
                    var img="";
                    $.each(cameras,function (i,item) {
                        if(item.status==1){
                            num ++;
                        }
                        var icon = "";
                        if(item.type==1){
                            icon = item.status==1? "icon-spherical32":"icon-spherical32-n";//球机
                        }else if(item.type==3){
                            icon = item.status==1? "icon-rifle32":"icon-rifle32-n";//枪机
                        }
                        if(!item.sceneUrl){
                            img="";
                        }else{
                            img=item.sceneUrl;
                        }
                        var time=$(".case-info:first").siblings().text();
                        var id = $(".loc-txt").data("code");
                        var content = $(".alarm-cont").data("content");
                        item.icon = '<span class="'+icon+'" id="'+item.code+'" data-type="'+item.type+'" data-time="'+time+'" data-content="'+content+'" data-id="'+id+'" data-positionId="'+item.positionId+'" data-img="'+img+'" data-name="'+item.des+'"></span>';
                        dataArr.push(item);
                        camArr.push({
                            code: item.code,
                            text: item.des,
                            typeCode: item.type,
                            type: "camera"
                        });
                    });
                    $(".cam-total").html(num+"/"+data.number);
                    if(dataArr.length != 0){
                        var option ={
                            data:dataArr,
                            columns: [{
                                width:"20px",
                                align:"center",
                                field: 'checkbox',
                                checkbox:true,
                                checkboxHeader:false,
                            }, {
                                width:"30px",
                                field: 'icon',
                            },{
                                field: 'des',
                                align:"left",
                            }],
                            //singleSelect:true,
                            locale:'zh-CN',//使用中文
                            onCheck: function (row, dom) {
                                //console.log('@@@@@@@',row,dom);
                            },
                            "pagination":true,
                            "pageSize":10,
                            "pageList":[10],
                        };
                        $(".point-table").bootstrapTable(option);
                        $(".point-table").bootstrapTable('load', dataArr);  //根据数据变化重新加载table
                        ext.main.removeLoading();
                    }
                }
            });
        }
        var option = {
            radius: radius,
            center: marker.getPosition(),
        };
        emap.drawEvent.drawCircle(option);
        return camArr;
    },
    //只获取聚合样式图标
    getClusterMarker : function(marker,flag){
        var MarkerWithLabel = emap.extension.getMarkerLabel(google.maps);
        var iconDefault = emap.main.getIcon('blank');
        var latLng = marker.getPosition();
        var pictureDiv =  document.createElement('span');
        pictureDiv.title='摄像机数量：'+marker.number;
        pictureDiv.style['color']='white';
        pictureDiv.style['font-size']='13px';
        pictureDiv.style['text-align'] = 'center';
        pictureDiv.innerHTML=marker.number;
        var labelMarker = new MarkerWithLabel({
            position: latLng,
            map: emap.main.getMap(),
            draggable: false,
            raiseOnDrag: true,
            icon : iconDefault,
            labelContent: pictureDiv,
            labelAnchor: new google.maps.Point(-12,40),
            labelClass: "marker-label", // the CSS class for the label
            labelInBackground: false
        });
        marker.labelMarker = labelMarker;
        if(flag){
            marker.labelMarker.setVisible(true);
        }else{
            marker.labelMarker.setVisible();
        }
    },
};
emap.work.initHashTables();