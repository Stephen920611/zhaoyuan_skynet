/**
 * Created by 9527 on 2018/1/30.
 */
window.emap = window.emap || {};
emap.event = emap.event || {};

export default {
    _eventHandler : null,//事件处理句柄
    _currPointArry : {},//当前区域的点位
    _operateCase : null,//操作预案选择
    _hideDayOutNight:null,
    _firstAppear:null,
    _latLngArray:"",
    mouseMove : function(event) {
      this._latLngArray = event.latLng.lng() + ','
            + event.latLng.lat();
    },
    zoomChanged : function(map,event) {
        document.getElementById('showZoom').innerHTML = map.getZoom();
        /*============================================================================
         * xzyan
         * 注释掉，在google.map.self.writer里调用emap.work.clusterCameraPoints();
         * 避免重复
         */
        /*if(emap.main.getFunc()=='mapPage'){//如果是电子地图模块，则进行聚合
            emap.work.clusterCameraPoints();
         }
         ============================================================================*/
    },
    overlayComplete :function (shape) {
        var self = this;
        var handler = self._eventHandler;
        emap.main.drawingManager.setDrawingMode(null);// 将十字绘制图标取消掉，变为小手，取消绘制模式
        if(emap.work._areaLine){

            emap.work._areaLine.setMap(null);
            emap.work._areaLine = shape.overlay;
        }
        if(handler && self._eventCallback[handler]){
       //     alert('bbbb');
           self._eventCallback[handler].call(self,shape);
        }else{
            alert('未找到对应的形状类型！');
        }
    },
    //谷歌地图初始化
    initMap:function(){
            emap.event.doGetMapBounds();
            google.maps.event.addListener(emap.main.map, 'zoom_changed', function(event) {
                console.log("级别变化");
                emap.event.doGetMapBounds();
            });
            google.maps.event.addListener(emap.main.map, 'dragend', function(event) {
                console.log("拖动结束");
                emap.event.doGetMapBounds();
            });
            google.maps.event.addListener(emap.main.map, 'click', function(event) {
                var pageId = $(".main-content").attr("id");
                if(pageId == "commandControl"){
                    var manuallyLocateFlag = $("#manuallyLocate").attr("data-role");
                    if(manuallyLocateFlag == "true"){
                        $("#lat-input").val(event.latLng.lat());
                        $("#lng-input").val(event.latLng.lng());
                    }
                }
                //console.log("点击结束",event,$(".main-content").attr("id"));
            });
    },
    //获取当前显示界面中地图的东北角经纬度与西南角经纬度
    doGetMapBounds:function(arry){
        var mapBoundsObj = emap.main.map.getBounds().toJSON();
        var arry = arry? arry:emap.event._currPointArry;
        console.log("**************",arry);
        var num1 = 0,
            num2 = 0,
            num3 = 0,
            num4 = 0,
            num5 = 0,
            onl1 = 0,
            onl2 = 0;
         var cameraFlag = $("a#cameraMap").hasClass('active');
         var partFlag = $("a#partsMap").hasClass('active');
         var roadFlag = $("a#roadMap").hasClass('active');
         var arFlag = $("a#areaARMap").hasClass('active');
         $.each(arry,function (i,item) {
             if(mapBoundsObj.south<=item.lat&&item.lat<=mapBoundsObj.north&&mapBoundsObj.west<=item.lng&&item.lng<=mapBoundsObj.east){
                 if(item.cameras != undefined && item.cameras.length>0 && item.type == "camera"){
                     $.each(item.cameras,function (j,jtem) {
                         if(jtem.type==1){
                             num1++;
                             if(jtem.status==1){
                                 onl1++;
                             }
                         }else if(jtem.type==3||jtem.type==4||jtem.type==5){
                             num2++;
                             if(jtem.status==1){
                                 onl2++;
                             }
                         }
                     });
                 }
                 if(item.cameras != undefined && item.cameras.length>0 && item.type == "AR" || item.type == "HIGH"){
                     num5++
                 }
                 if(item.components != undefined && item.components.length>0){
                     $.each(item.components,function (k,ktem) {
                         if(ktem.type==1){
                             num3++;
                         }else if(ktem.type==2){
                             num4++;
                         }
                     });
                 }
             }
         });
        if($(".map-apply").attr("id") == "mapApply"){
            $("#firstTypeCamera").html(onl1+"/"+num1);
            $("#secondTypeCamera").html(onl2+"/"+num2);
            return;
        }
         if(cameraFlag){
             $("#firstTypeCamera").html(onl1+"/"+num1);
             $("#secondTypeCamera").html(onl2+"/"+num2);
         }else{
             if(roadFlag&&emap.drawEvent._pointArry.length>0){
                 num1 = 0;
                 num2 = 0;
                 onl1 = 0;
                 onl2 = 0;
                 $.each(emap.drawEvent._pointArry,function (i,item) {
                     if(mapBoundsObj.south<=item.lat&&item.lat<=mapBoundsObj.north&&mapBoundsObj.west<=item.lng&&item.lng<=mapBoundsObj.east){
                         if(item.cameras != undefined && item.cameras.length>0){
                             $.each(item.cameras,function (j,jtem) {
                                 if(jtem.type==1){
                                     num1++;
                                     if(jtem.status==1){
                                         onl1++;
                                     }
                                 }else if(jtem.type==3||jtem.type==4||jtem.type==5){
                                     num2++;
                                     if(jtem.status==1){
                                         onl2++;
                                     }
                                 }
                             });
                         }
                     }
                 });
                 $("#firstTypeCamera").html(onl1+"/"+num1);
                 $("#secondTypeCamera").html(onl2+"/"+num2);
             }else{
                 $("#firstTypeCamera").html(0);
                 $("#secondTypeCamera").html(0);
             }
         }
         if(partFlag){
             $("#wifiMapNum").html(num4);
             $("#wlMapNum").html(num3);
         }else{
             if(roadFlag&&emap.drawEvent._pointArry.length>0){
                 num3 = 0;
                 num4 = 0;
                 $.each(emap.drawEvent._pointArry,function (i,item) {
                     if(mapBoundsObj.south<=item.lat&&item.lat<=mapBoundsObj.north&&mapBoundsObj.west<=item.lng&&item.lng<=mapBoundsObj.east){
                         if(item.components != undefined && item.components.length>0){
                             $.each(item.components,function (k,ktem) {
                                 if(ktem.type==1){
                                     num3++;
                                 }else if(ktem.type==2){
                                     num4++;
                                 }
                             });
                         }
                     }
                 });
                 $("#wifiMapNum").html(num4);
                 $("#wlMapNum").html(num3);
             }else{
                 $("#wifiMapNum").html(0);
                 $("#wlMapNum").html(0);
             }
         }

        if(arFlag){
            $("#ARMapNum").html(num5);
        }else{
            if(roadFlag&&emap.drawEvent._pointArry.length>0){
                num5 = 0;
                $.each(emap.drawEvent._pointArry,function (i,item) {
                    if(mapBoundsObj.south<=item.lat&&item.lat<=mapBoundsObj.north&&mapBoundsObj.west<=item.lng&&item.lng<=mapBoundsObj.east){
                        if(item.cameras != undefined && item.cameras.length>0 && item.type=="AR"||item.type == "HIGH"){
                            num5++
                        }
                    }
                });
                $("#ARMapNum").html(num5);
            }else{
                $("#ARMapNum").html(0);
            }
        }
    },
    _getMarkersInRect : function(markers,maxCoordinate,minCoordinate) { //获取矩形框内的点位marker
        var selectedMarkers = [];
        var keys = markers.getKeys();
        maxLng = maxCoordinate.lng();
        minLng = minCoordinate.lng();
        maxLat = maxCoordinate.lat();
        minLat = minCoordinate.lat();
        var marker;
        var thisLng;
        var thisLat;
        for (var i = 0; i < keys.length; i++) {
            marker = markers.getValue(keys[i]);
            thisLng = marker.getPosition().lng();
            thisLat = marker.getPosition().lat();
            if(thisLng < maxLng && thisLng > minLng && thisLat < maxLat && thisLat > minLat) {
                selectedMarkers.push(marker.id);
            }
        }
       // alert('11111');
        return selectedMarkers;
    },
    //打开右侧的收缩栏
    openDrawHandle: function (markerId) {
        console.log('endid',markerId);
    //   alert('00')
        emap.work.clearOverlays();
        var self = this;
        $('.drawer-content').animate({
            right:'-11px'
        });
        $('.drawer-handle>ul>li>a').toggleClass('click');
        $("#choosenTab").click();
        $(".point-list").show();
        $.ajax({
            url: ext.impor.ajaxUrl+"/position/getInfoByIds",
            type: "GET",
            dataType: "json",
            data: {id:markerId.join(",")},
            success: function (data) {
                var num = 0;
                var cameras = data.cameras;
                console.log('cameras',cameras);
                var dataArr = [];  //将摄像机和点位部件统一存放
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
                    item.icon = '<span class="'+icon+'" id="'+item.code+'" data-type="'+item.type+'" data-name="'+item.des+'"></span>';
                    dataArr.push(item);
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
                }
            }
        });
    },    //打开右侧的收缩栏
    openCaseDraw: function (markerId) {
        var self = this;
        var  isShow = $("#mapApply .info-list-div2").css("display");
        if(isShow=="none"){
            ext.main.notice("请先添加或编辑预案");
            return;
        }
        $('.drawer-content').animate({
            right:'-11px'
        });
        $('.drawer-handle>ul>li>a').toggleClass('click');
        $("#videoCaseTab").click();
        $.ajax({
            url: ext.impor.ajaxUrl+"/position/getInfoByIds",
            type: "GET",
            dataType: "json",
            data: {id:markerId.join(",")},
            success: function (data) {

                var cameras = data.cameras;
                $.each(cameras,function (i,item) {
                    var icon = "";
                    if (item.type == 1) {
                        icon = "../../static/img/spherical32.png";
                    } else {
                        icon = "../../static/img/rifle32.png";
                    }
                    var doms = $(".info-list-div2 .camera-div").find(".camera-one");
                    var index = doms.length+1;
                    var str = '<div class="camera-one"><div class="cam-info" id="'+item.code+'" data-camera="'+item.code+'&'+item.des+'&'+item.type+'"  onclick="func.videoPlan.clickCamera(this)"><span class="cam-inx">'+index+'</span>' +
                        '<img src="'+icon+'"><p class="slh-1h" title="'+item.des+'">'+item.des+'</p><i class="fa fa-play"></i></div></div>';
                    var nodeIds = [];
                    $.each(doms, function (j, jtem) {
                        nodeIds.push(jtem.id);
                    })
                    if($.inArray(item.code,nodeIds)>-1){
                        ext.main.notice("请勿重复添加");
                    }else{
                        $(".info-list-div2 .camera-div").append(str);
                    }
                });
            }
        });
    },
    openHideDayOutNight:function (markerId) {
        console.log('endid',markerId);
        func.hideDayOutNight.tollgateIDs=markerId.join(',');
    },
    openFirstAppear:function (markerId) {
    console.log('endid',markerId);
    func.firstAppear.tollgateIDs=markerId.join(',');
},
    _eventCallback : { //回调事件处理程序
        searchBayonetByPolygonComplete:function(shape){
            console.log('shape',shape);
            emap.work._tempOverlay = shape.overlay;
            var paths = shape.overlay.getPath();
            var selectedMarkers = [];
            var markers = emap.work._bayonetHash;
            var flag;
            var latLngArr = [];
            var latLngPoints = [];
            if (paths) {
                for (var j = 0; j < paths.length; j++) {
                    var json = {};
                    json.lat = paths.getAt(j).lat();
                    json.lng = paths.getAt(j).lng();
                    latLngArr.push(json);
                    latLngPoints.push(paths.getAt(j));
                }
            }
            emap.event.latLngArray = {
                type:"polygon",
                bounds:JSON.stringify(latLngArr)
            };
            if (markers.getSize() > 0) {
                var keys = markers.getKeys();
                for (var i = 0; i < keys.length; i++) {
                    var marker = markers.getValue(keys[i]);
                    flag = emap.util.isPointInPolygon(latLngPoints, marker);
                    if (flag) {
                        selectedMarkers.push(marker.id);
                    }
                }
            //    alert('gg');
                console.log('selectedMarkers1111',selectedMarkers);
                if (selectedMarkers.length > 0) {
                    //打开模态框
                    /*$(".add-jurisdict-modal").modal("show");
                    $(".add-troop-btn").attr("data-index",latLngPoints +"&"+selectedMarkers);*/
                    //func.jurisdictMg      _emapDrawCompleteCallBack
                } else {
                    console.log('选择的区域暂无路口信息，请重新绘制！');
                }
            }
            $.each(window.func, function(i,item){
                if(item['_emapDrawCompleteCallFunc']){
                    var callBackHandler = emap.event._pageCallBackHandler;
                    console.log('callBackHandler',callBackHandler);
                    if(callBackHandler){
                   //     alert('cccc');
                        item._emapDrawCompleteCallFunc[callBackHandler].call(item, JSON.stringify(latLngArr), selectedMarkers);
                    }
                    return false;
                }
            });
        },
        markPointComplete: function (shape) {
            var pt = shape.overlay.getPosition();
            var lng = pt.lng();
            var lat = pt.lat();
            var marker = shape.overlay;
        },
        //画圆
        searchByCircleComplete : function(shape){
            emap.work._tempOverlay = shape.overlay;
            var domId = $(".map-apply").attr("id");
            if(!$("#cameraMap").hasClass("active") && !domId){
                ext.main.notice("请先打开摄像机开关再框选");
                emap.work.clearOverlays();
                return;
            }
            var selectedMarkers = [];
            var selectAllmarker =[];
            var radius = shape.overlay.getRadius();
            var pt = shape.overlay.getCenter();
            emap.event.latLngArray = {
                type:"circle",
                radius:radius,
                center:pt
            };
            var markers = emap.work._cameraHash;
            var keys = markers.getKeys();
            console.log('@searchByCircleComplete-keys',keys);
            if(keys.length > 0){
                var distance;
                var marker;
                for (var i = 0; i < keys.length; i++) {
                    marker = markers.getValue(keys[i]);
                    distance = emap.util.getDistance(pt,marker.getPosition());
                    if(distance < radius){
                        selectedMarkers.push(marker.id);
                        selectAllmarker.push(marker);
                    }
                }
                console.log('selectAllmarker',selectAllmarker);
             //   alert('11111');
                if(emap.event._operateCase){
                    this.openCaseDraw(selectedMarkers);
                    emap.event._operateCase = null;
                }else if(emap.event._hideDayOutNight){
                    this.openHideDayOutNight(selectedMarkers);
                    emap.event._hideDayOutNight = null;
                }else if(emap.event._firstAppear){
                    this.openFirstAppear(selectedMarkers);
                    emap.event._firstAppear = null;
                }else if(selectedMarkers.length>0){
                    this.openDrawHandle(selectedMarkers);
                }
            } else {
                alert('暂无点位信息，请选择框选！');
            }
        },
        //画矩形
        searchByRectComplete : function(shape) {
            console.log('shape',shape);
            emap.work._tempOverlay = shape.overlay;
            var domId = $(".map-apply").attr("id");
            if(!$("#cameraMap").hasClass("active") && !domId){
                ext.main.notice("请先打开摄像机开关再框选");
                emap.work.clearOverlays();
                return;
            }
            var markers = emap.work._cameraHash;
            var bounds = shape.overlay.getBounds();
            emap.event.latLngArray = {
                type:"rect",
                bounds:bounds,
            };
            if(markers.getSize() > 0){
                var selectedMarkers = this._getMarkersInRect(markers,bounds.getNorthEast(),bounds.getSouthWest());
                if(emap.event._operateCase){
                    this.openCaseDraw(selectedMarkers);
                    emap.event._operateCase = null;
                }else if(emap.event._hideDayOutNight){
                    //alert('sss');
                    this.openHideDayOutNight(selectedMarkers);
                    emap.event._hideDayOutNight = null;
                    return false;
                }else if(emap.event._firstAppear){
                    this.openFirstAppear(selectedMarkers);
                    emap.event._firstAppear = null;
                }else if(selectedMarkers.length>0){
                    this.openDrawHandle(selectedMarkers);
                }
            } else {
                alert('暂无小区点位信息，请选择小区后进行框选！');
            }
        },
        //画多边形
        searchByPolygonComplete : function(shape) {
            emap.work._tempOverlay = shape.overlay;
            var domId = $(".map-apply").attr("id");
            if(!$("#cameraMap").hasClass("active") && !domId){
                ext.main.notice("请先打开摄像机开关再框选");
                emap.work.clearOverlays();
                return;
            }
            var paths = shape.overlay.getPath();
            var selectedMarkers = [];
            var markers = emap.work._cameraHash;
            var flag;
            var latLngPoints = [];
            if (paths) {
                for (var j = 0; j < paths.length; j++) {
                    latLngPoints.push(paths.getAt(j));
                }
            }
            emap.event.latLngArray = {
                type:"polygon",
                bounds:latLngPoints,
            };
            if (markers.getSize() > 0) {
                var keys = markers.getKeys();
                for (var i = 0; i < keys.length; i++) {
                    var marker = markers.getValue(keys[i]);
                    flag = emap.util.isPointInPolygon(latLngPoints,marker);
                    if(flag){
                        selectedMarkers.push(marker.id);

                    }
                }
                if(emap.event._operateCase){
                    this.openCaseDraw(selectedMarkers);
                    emap.event._operateCase = null;
                }else if(emap.event._hideDayOutNight){
                    this.openHideDayOutNight(selectedMarkers);
                    emap.event._hideDayOutNight = null;
                }else if(emap.event._firstAppear){
                    this.openFirstAppear(selectedMarkers);
                    emap.event._firstAppear = null;
                }else if(selectedMarkers.length>0){
                    this.openDrawHandle(selectedMarkers);
                }
            } else {
                alert('暂无小区点位信息，请选择小区后进行框选！');
            }

        },
        //画线
        searchByLineComplete : function(shape) {
            emap.work._tempOverlay = shape.overlay;
            var domId = $(".map-apply").attr("id");
            if(!$("#cameraMap").hasClass("active") && !domId){
                ext.main.notice("请先打开摄像机开关再框选");
                emap.work.clearOverlays();
                return;
            }
            var markers = emap.work._cameraHash;
            var flag;

            var selectedMarkers = [];
            if (markers.getSize() > 0) {

                var paths = shape.overlay.getPath();
                var latLngArray = [];//存储所有的顶点坐标
                for (var i = 0; i < paths.length; i++) {
                    latLngArray.push(paths.getAt(i));
                }
                emap.event.latLngArray = {
                    type:"line",
                    bounds:latLngArray,
                };
                var array1 = new Array();//线上方多边形范围的点数组
                var array2 = new Array();//线下方多边形范围的点数组
                for (var j=0;j<latLngArray.length-1;j++){
                    var degreeResult1 = 0.0001134;//10米范围对应的经纬度范围，
                    var degreeResult2 = 0.0001134;//10米范围对应的经纬度范围
                    var a=0;//线的角度
                    if(latLngArray[j+1].lng()==latLngArray[j].lng()){//如果垂直，则为90度
                        a=3.14/2;
                    }else{
                        a = Math.atan((latLngArray[j+1].lat()-latLngArray[j].lat())/(latLngArray[j+1].lng()-latLngArray[j].lng()));//求线的角度a
                    }
                    var x1 = latLngArray[j].lng() - degreeResult1*Math.sin(a);
                    var y1 = latLngArray[j].lat() + degreeResult1*Math.cos(a);
                    var x2 = latLngArray[j+1].lng() - degreeResult2*Math.sin(a);
                    var y2 = latLngArray[j+1].lat() + degreeResult2*Math.cos(a);
                    var x3 = latLngArray[j+1].lng() + degreeResult2*Math.sin(a);
                    var y3 = latLngArray[j+1].lat() - degreeResult2*Math.cos(a);
                    var x4 = latLngArray[j].lng() + degreeResult1*Math.sin(a);
                    var y4 = latLngArray[j].lat() - degreeResult1*Math.cos(a);
                    var point1 = emap.main.getMapPoint(y1,x1);
                    var point2 = emap.main.getMapPoint(y2,x2);
                    var point3 = emap.main.getMapPoint(y3,x3);
                    var point4 = emap.main.getMapPoint(y4,x4);

                    var f =(latLngArray[j+1].lng()-latLngArray[j].lng())*(y1-latLngArray[j].lat())-
                        (x1-latLngArray[j].lng())*(latLngArray[j+1].lat()-latLngArray[j].lat());
                    if(f>0){
                        array1.push(point1);
                        array1.push(point2);//将线上方的点放入array1

                        array2.push(point4);
                        array2.push(point3);//将线下方的点放入array2
                    }else{
                        array1.push(point4);
                        array1.push(point3);//将线上方的点放入array1

                        array2.push(point1);
                        array2.push(point2);//将线下方的点放入array2
                    }
                }
                var multi = "";//多边形点的坐标字符串
                var length1 = array1.length;
                var length2 = array2.length;
                if (length1==2){//如果只有一条线则无需求交点
                    multi =array1[0].lng()+","+array1[0].lat()+","+array1[1].lng()+","+array1[1].lat()+","
                        +array2[1].lng()+","+array2[1].lat()+","+array2[0].lng()+","+array2[0].lat()+","
                        +array1[0].lng()+","+array1[0].lat();
                }
                else{
                    for(var i=0;i<length1/2-1;i++){//求线上方的点的交点，并加入到multi中
                        var p=2*i;
                        multi = multi +array1[p].lng()+","+array1[p].lat()+",";
                        var k1 = (array1[p].lat()-array1[p+1].lat())/(array1[p].lng()-array1[p+1].lng());
                        var k2 = (array1[p+2].lat()-array1[p+3].lat())/(array1[p+2].lng()-array1[p+3].lng());
                        var x=(k1*array1[p].lng()-k2*array1[p+2].lng()+array1[p+2].lat()-array1[p].lat())/(k1-k2);
                        var y=array1[p].lat()+(x-array1[p].lng())*k1;
                        multi =multi +x+","+y+",";
                    }
                    multi =multi +array1[length1-1].lng()+","+array1[length1-1].lat()+",";
                    for(var j=length2/2-2;j>-1;j--){//求线下方的点的交点，并加入到multi中
                        var q=j*2+3;
                        multi = multi +array2[q].lng()+","+array2[q].lat()+",";
                        var k1 = (array2[q].lat()-array2[q-1].lat())/(array2[q].lng()-array2[q-1].lng());
                        var k2 = (array2[q-2].lat()-array2[q-3].lat())/(array2[q-2].lng()-array2[q-3].lng());
                        var x=(k1*array2[q].lng()-k2*array2[q-2].lng()+array2[q-2].lat()-array2[q].lat())/(k1-k2);
                        var y=array2[q].lat()+(x-array2[q].lng())*k1;
                        multi =multi +x+","+y+",";
                    }
                    multi =multi +array2[0].lng()+","+array2[0].lat()+","+array1[0].lng()+","+array1[0].lat();
                }
                var multiarray = multi.split(",");
                var pointArray = [];
                for(var i = 0;i<multiarray.length;i=i+2){
                    pointArray.push(emap.main.getMapPoint(multiarray[i+1],multiarray[i]))
                }
                //画出多边形区域
//	            emap.main.drawLine(pointArray);

                var keys = markers.getKeys();

                for (var i = 0; i < keys.length; i++) {
                    var iMarker = markers.getValue(keys[i]);
                    //判断marker是否在多边形里面
                    flag = emap.util.isPointInPolygon(pointArray,iMarker);
                    if(flag){
                        selectedMarkers.push(iMarker.id);
                    }
                }
                if(emap.event._operateCase){
                    this.openCaseDraw(selectedMarkers);
                    emap.event._operateCase = null;
                }else if(emap.event._hideDayOutNight){
                    this.openHideDayOutNight(selectedMarkers);
                    emap.event._hideDayOutNight = null;
                }else if(emap.event._firstAppear){
                    this.openFirstAppear(selectedMarkers);
                    emap.event._firstAppear = null;
                }else if(selectedMarkers.length>0){
                    this.openDrawHandle(selectedMarkers);
                }
            }else{
                alert('暂无小区点位信息，请选择小区后进行框选！');
            }
        },
    }
};
