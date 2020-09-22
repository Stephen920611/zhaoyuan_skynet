/*展示地图的基本操作，如放大缩小，缩放的级别显示，鼠标滑过地图时实时显示的经纬度*/
import utility from '../utils/ext.utility'
import passParam from '../utils/ext.passParam'
import emapExtension from '../../public/static/js/emap/emap.extension'

window.mapShowFunc = window.mapShowFunc || {};
// let mapShowFunc = {};
let _this = mapShowFunc;

// 用来存放调用此js的vue组件实例（this）
let vm = null;
_this.sendThis = (_self) => {
    vm = _self
}

_this.mapVariable = {
    menuContext: null,
    mapTileUrl: null,
    map: null,
    mapClickLat: null,
    mapClickLng: null,
    addMarkerTag: null,  //标识--若是不为空字符串则点击地图时不调用方法
    infowin: null,//详细信息气泡窗口
    drawingManager: null,
    maxZoom: 18,
    minZoom: 5,
    style: {
        fillColor: "#13c2f7",
        strokeColor: "#468EF7",
        strokeWeight: 3,
        strokeOpacity: 0.8,
        fillOpacity: 0.1
    },
    options: {
        center: null,
        zoom: 12,
        mapTypeControl: true,//地图类型插件
        streetViewControl: false, //街景插件
        zoomControl: true,//缩放插件
        panControl: true,//平移插件
        scaleControl: true,
        /*scaleControlOptions : { //比例控件,公里、英尺 置于地图的右下角
          position : google.maps.ControlPosition.BOTTOM_LEFT
        },*/
        mapTypeControlOptions: {
            mapTypeIds: ['satel', 'localMap'],//包括两种地图类型
            position: 3,  //地图类型插件放于地图的右上角
            // position : google.maps.ControlPosition.TOP_RIGHT,//地图类型插件放于地图的右上角
        }
    },
    _eventHandler: '',     //绘制句柄
    _allOverlays: [],      //存储所有绘制的图形
    _markerArr: [],        //存储点位经纬度
    _tunnelMarker: [],     //存储隧道所有的轨迹，点位
    _tunnelLine: null,     //存储隧道所有的轨迹，点位
    _cameraShowMarkers: new utility.hashTable(),   //存储选中区域的摄像机marker，key为区域编号areaCode,value为该区域下的所有摄像机
    _componentShowMarkers: new utility.hashTable(),   //存储选中区域的wifi围栏的marker，key为区域编号areaCode,value为该区域下的所有wifi围栏
    _earthRadius: 6378137.0,//单位M
    _infowin: null,    //弹出的信息窗口对象
    _selectedMarkersByDrawTool: [],   //通过绘图工具选择的摄像机marker
    _selectedMarkerByClick: null,    //点击标记点得到的marker数据
    _dragMarker:null,   //拖拽的marker
    _markerLatLngByDragend:null,  //拖拽后的marker经纬度
};

_this.initMap = (container, tileUrl, lat, lng) => {
    _this.mapVariable.mapTileUrl = tileUrl;
    let localMap = new _this.MapEntity(tileUrl, 'map', _this.mapVariable.maxZoom, _this.mapVariable.minZoom);
    localMap.name = '电子地图';
    let satel = new _this.MapEntity(tileUrl, 'satellite', _this.mapVariable.maxZoom, _this.mapVariable.minZoom);
    satel.name = '卫星影像';
    
    _this.mapVariable.options.center = new google.maps.LatLng(lat, lng);
    let map = new google.maps.Map(container, _this.mapVariable.options);
    map.mapTypes.set('localMap', localMap);
    map.mapTypes.set('satel', satel);
    map.setMapTypeId('satel');
    _this.mapVariable.map = map;
    _this.setupEvents();   //初始化绘制工具
    _this.initEvent();   //初始化事件
    
};

_this.MapEntity = function (baseTileUrl, tileType, maxZoom, minZoom) {
    const self = this;
    self.tileSize = new google.maps.Size(256, 256);
    self.maxZoom = maxZoom;
    self.minZoom = minZoom;
    
    self.getTile = function (coord, zoom, ownerDocument) {
        let img = ownerDocument.createElement("img");
        img.style.width = this.tileSize.width + "px";
        img.style.height = this.tileSize.height + "px";
        let strURL = baseTileUrl + tileType + '/';
        strURL += zoom + "/" + coord.x + "/" + coord.y + '.png';
        img.src = strURL;
        img.onerror = function () {
            img.src = baseTileUrl + "images/noimg.jpg";
        };
        return img;
    };
};

//工具类：监听事件及绘制工具
_this.setupEvents = () => {
    let map = _this.mapVariable.map;
    // 绘画工具 设置
    _this.mapVariable.drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        polylineOptions: _this.mapVariable.style,
        circleOptions: _this.mapVariable.style,
        rectangleOptions: _this.mapVariable.style,
        polygonOptions: _this.mapVariable.style
    });
    _this.mapVariable.drawingManager.setMap(map);
    const drawingManager = _this.mapVariable.drawingManager;
    
    // 矩形、折线绘制完成后触发的事件
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (shape) {
        _this.overlayComplete(shape);
    });
};

//监听地图的点击事件
_this.initEvent = () => {
    let map = _this.mapVariable.map;
    google.maps.event.addListener(map, 'click', (event) => {
        _this.mapClickLat = event.latLng.lat();
        _this.mapClickLng = event.latLng.lng();
        if (_this.mapVariable.addMarkerTag) {
            let tunnelInfo = _this.mapVariable.addMarkerTag.split("&");
            _this.addMarkerByTag(map, tunnelInfo);
        }
    });
};
//通过标注添加点位，根据标识addMarkerTag进行区分
_this.addMarkerByTag = (map, tunnelInfo) => {
    let markerTunnel = _this.addMarker(map, tunnelInfo[1], _this.mapClickLat, _this.mapClickLng, tunnelInfo[0], null, "device", true, true, () => {
    });
    _this.mapVariable._tunnelMarker.push(markerTunnel);
    let marker = {
        lat: mapShowFunc.mapClickLat,
        lng: mapShowFunc.mapClickLng,
    };
    _this.mapVariable._markerArr.push(marker);
    if (_this.mapVariable._markerArr.length > 1) {
        if (_this.mapVariable._tunnelLine) {
            _this.mapVariable._tunnelLine.setMap(null);
        }
        _this.mapVariable._tunnelLine = _this.drawLine(map, _this.mapVariable._markerArr, null, '#5d1dfe', '1')
    }
    _this.mapVariable.addMarkerTag = '';  //标识置为初始值
    passParam.$emit('resetSwitchActive', false);//改变标注激活状态
    passParam.$emit('marker', _this.mapVariable._tunnelMarker, _this.mapVariable._tunnelLine);//将点位信息和隧道信息传给父页面
    passParam.$emit('latLng', _this.mapVariable._markerArr)//将经纬度信息以数组的形式传给父节点
};
_this.zoomIn = (thismap, num) => { //放大指定的级数
    let map = thismap || _this.mapVariable.map;
    const zoom = map.getZoom() + num;
    if (zoom < _this.mapVariable.maxZoom) {
        map.setZoom(zoom);
    } else {
        map.setZoom(_this.mapVariable.maxZoom);
    }
};
_this.zoomOut = (thismap, num) => {//缩小指定的级数
    let map = thismap || _this.mapVariable.map;
    const zoom = map.getZoom() - num;
    if (zoom > _this.mapVariable.minZoom) {
        map.setZoom(zoom);
    } else {
        map.setZoom(_this.mapVariable.minZoom)
    }
};
_this.getLevel = (thismap) => {//获取当前的缩放级别
    let map = thismap || _this.mapVariable.map;
    return map.getZoom();
};

_this.pan2Point = (lat, lng, thismap) => {  //根据经纬度定位
    const centlatlng = new google.maps.LatLng(lat, lng);
    const map = thismap || _this.mapVariable.map;
    map.panTo(centlatlng);
};
_this.move2PointByEvent = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const centlatlng = new google.maps.LatLng(lat, lng);
    _this.mapVariable.map.panTo(centlatlng);
};
_this.move2PointByMarker = (marker) => {
    _this.mapVariable.map.panTo(marker.position);
};
//绘制线路
_this.drawLine = (map, pointsArray, title, color, opacity, weight) => {
    let line = new google.maps.Polyline({
        path: pointsArray,
        map: map || _this.getMap(),
        strokeColor: color || '#468EF7',
        strokeOpacity: opacity || '0.8',
        strokeWeight: weight || '3',
    });
    //若是传入title不为null或者不为空，则悬浮上线显示内容
    google.maps.event.addListener(line, 'mouseover', (event) => {
        console.log("event", event)
        const marker = new google.maps.Marker({
            position: event.latLng, // 标注点的坐标位置
            icon: "",
            map: map,
            draggable: false,
            visible: false
        });
        if (title && title != '') {
            _this.showInfoWin(map, marker, title);
            _this.closeInfoWinDelay(3000);
        }
    });
    return line;
};
//infoWindow的窗口延迟关闭
_this.closeInfoWinDelay = (delay) => {
    setTimeout(function (event) {
        _this.closeInfoWin();
    }, delay);
};
//生成随机颜色，线路使用
_this.colorRandom = () => {
    const colorStr = "#" + ("00000" + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
    return colorStr;
}

_this.getMarker = (id, lat, lng, icon, title) => {
    const makerlatlng = new google.maps.LatLng(lat, lng);
    const img = _this.getIcon(icon);
    const marker = new google.maps.Marker({
        id: id,
        position: makerlatlng,  // 标注点的坐标位置
        icon: img,
        type: icon,   //摄像机类型
        /*icon: {
          url: icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(50, 50),
          anchor: new google.maps.Point(100, 100),
          scaledSize: new google.maps.Size(25, 25)
        },*/
        draggable: false,
        visible: true,
        title: title
    });
    return marker;
};
_this.getIcon = (icon) => {
    return _this.mapVariable.mapTileUrl + 'icon/' + icon + '.png';
};
/*添加标注*/
_this.addLabelWithFont = (lat, lng, text, fontSize) => {
    const makerLatLng = new google.maps.LatLng(lat, lng);
    const mapLabel = new MapLabel({
        text: text,
        position: makerLatLng,
        map: _this.getMap(),
        fontSize: fontSize,
        fontColor: '#009cf9 ',
        strokeColor: '#f9f9f9',
        align: 'center'
    });
    return mapLabel;
};
_this.getMap = () => {
    return _this.mapVariable.map;
};
/**
 *  添加标记点
 * @param map
 * @param id
 * @param lat
 * @param lng
 * @param icon
 * @param title
 * @param type
 * @param flag
 * @param showFlag
 * @param callback
 */
_this.addMarker = (map, id, lat, lng, icon, title, type, flag, showFlag, callback) => {//添加点位
    // flag标识是否要展开右侧信息收缩栏，true：展开，false：不展开
    // showFlag标识是否要在地图显示图标，true：显示，false：不显示
    let marker = _this.getMarker(id, lat, lng, icon, title);
    marker._originalPosition = new google.maps.LatLng(lat, lng);//保存marker的原坐标，用于拖拽结束时使用
    if (icon == "cameras32") {
        marker.number = callback();
        marker.iconName = "cameras32";
        _this.getClusterMarker(map, marker, showFlag);
    }
    
    if ((type == "device" || type == "car") && callback) {
        const content = callback();
        const label = _this.addLabelWithFont(lat, lng, title, 15);
        marker.label = label;
        marker.content = content;
    }
    if (showFlag) {
        marker.setMap(map);
    } else {
        marker.setMap(null);
    }
    //单击显示信息窗口
    google.maps.event.addListener(marker, 'click', (event) => {
        _this.mapVariable._selectedMarkerByClick = marker;
        _this.move2PointByEvent(event);//定位至地图中央
        if (type == "camera" || type == 'car' || type == 'device') {
            _this.showMarkerInfo(map, id, marker, type);   //显示点位信息
        }
        if (type == 'company') {
            vm.map.setZoom(15);
            setTimeout(() => {
                _this.showMarkerInfo(map, id, marker, type);   //显示点位信息
            }, 300)
            
        }
    });
    
    //拖拽结束事件
    google.maps.event.addListener(marker, 'dragend', (e) => {
        _this.mapVariable._dragMarker = marker;
        //停止拖拽
        marker.setDraggable(false);
        //弹出窗口
        const content = '<button id="savelatlng" class="gray medium button" onclick="mapShowFunc.saveNewLocFunc()">保存新位置</button>' +
            '<button id="goondrag" class="gray medium button"  onclick="mapShowFunc.continueDragFunc()">继续拖拽</button>' +
            '<button id="stopdrag" class="gray medium button"  onclick="mapShowFunc.cancelDragFunc()">取消操作</button>';
        
        _this.showInfoWin(map, marker, content);
    });
    
    return marker;
};
//保存拖拽后的位置
_this.saveNewLocFunc = () => {
    _this.mapVariable._dragMarker.setDraggable(false);
    _this.closeInfoWinDelay(100);
    //保存方法
    const lat = _this.mapVariable._dragMarker.internalPosition.lat();
    const lng = _this.mapVariable._dragMarker.internalPosition.lng();
    //将移动后的经纬度存放在LatLng类中
    _this.mapVariable._markerLatLngByDragend = new google.maps.LatLng({lat: lat, lng: lng});
    vm.$refs.toggleGoogleMap.updateMarkerLatLng(_this.mapVariable._dragMarker._originalPosition,_this.mapVariable._markerLatLngByDragend);
};

//继续拖拽
_this.continueDragFunc = () => {
    _this.mapVariable._dragMarker.setDraggable(true);
    _this.closeInfoWinDelay(100);
};

//取消拖拽
_this.cancelDragFunc = () => {
    _this.mapVariable._dragMarker.setDraggable(false);
    _this.mapVariable._dragMarker.setPosition(_this.mapVariable._dragMarker._originalPosition);
    //将原始的经纬度存放在LatLng类中
    _this.mapVariable._markerLatLngByDragend = _this.mapVariable._dragMarker._originalPosition;
    _this.closeInfoWinDelay(100);
};

//获取聚合样式图标--多点聚合
_this.getClusterMarker = (map, marker, flag) => {
    const MarkerWithLabel = emapExtension.getMarkerLabel(google.maps);
    const iconDefault = _this.getIcon('blank');
    const latLng = marker.getPosition();
    const pictureDiv = document.createElement('span');
    pictureDiv.title = '摄像机数量：' + marker.number;
    pictureDiv.style['color'] = 'white';
    pictureDiv.style['font-size'] = '13px';
    pictureDiv.style['text-align'] = 'center';
    pictureDiv.innerHTML = marker.number;
    const labelMarker = new MarkerWithLabel({
        position: latLng,
        map: map,
        draggable: false,
        raiseOnDrag: true,
        icon: iconDefault,
        labelContent: pictureDiv,
        labelAnchor: new google.maps.Point(-12, 40),
        labelClass: "marker-label", // the CSS class for the label
        labelInBackground: false
    });
    marker.labelMarker = labelMarker;
    if (flag) {
        marker.labelMarker.setVisible(true);
    } else {
        marker.labelMarker.setVisible();
    }
};
//点击地图上的marker，弹出信息窗口
_this.showMarkerInfo = (map, id, marker, type) => {
    let content = '';
    const info = marker.info.split('&');
    if (type == "camera") {
        content = '<div class="loc-content loc-content-1"><div class="loca-info">信息展示</div>'
            + '<div class="msg-content"><p class="msg-info title"><span>' + info[3] + '</span></p>'
            + '<p class="msg-info"><span class="location"><i class="square"></i><span class="loc loc-lng">E' + parseFloat(info[2]).toFixed(2) + '</span></span>'
            + '<span class="location"><i class="square"></i><span class="loc loc-lat">N' + parseFloat(info[1]).toFixed(2) + '</span></span></p>'
            // +'<p class="msg-info"><span>所属区域：'+info[4]+'</span></p>'
            + '</div>';
        content += '<div class="icon-wrap">'
            + '<span class="icon">查看   </span>|'
            + '<span class="icon">实时预览   </span>|'
            + '<span class="icon">录像回放   </span>'
            + '</div>';
        content += '</div>';
    } else if (type == 'car') {
        content = '<div class="loc-content"><div class="loca-info">信息展示</div>'
            + '<div class="msg-content"><p class="msg-info title"><span>烟台市芝罘区机场路98号</span></p>'
            + '<p class="msg-info"><span class="location"><i class="square"></i>E<span class="loc loc-lng">121.4308</span></span>'
            + '<span class="location"><i class="square"></i>N<span class="loc loc-lat">37.5253</span></span></p>'
            + '<p class="msg-info"><span class="info">莱山区</span><span class="info">由西向东</span><span class="info">120km/h</span></p>'
            + '<p class="msg-info"><span class="camera">车载：<a href="#" class="margin-r-10 underline" >摄像机1</a><a href="#" class="underline">摄像机2</a></span></p>'
            + '</div>';
        content += '<div class="icon-wrap">'
            + '<span class="icon">视频播放</span>|'
            + '<span class="icon">车辆信息</span>|'
            + '<span class="icon">驾驶员信息</span>|'
            + '<span class="icon">押运员信息</span>|'
            + '<span class="icon" onclick="mapShowFunc.openDialog(\'waybill\')">电子运单</span>'
            + '</div>';
        content += '</div>';
    } else if (type == 'company') {
        content = '<div class="loc-content loc-content-1">'
            + '<div class="loca-info">信息展示</div>'
            + '<div class="msg-content">'
            + '<p class="msg-info title"><span>' + info[0] + '</span></p>'
            + '<p class="msg-info">地址：<span>' + info[1] + '</span></p>'
            + '</div>'
            + '<div class="icon-wrap">'
            + '<span class="icon" onclick="mapShowFunc.openBayonet()">进出卡口</span>|'
            + '<span class="icon" onclick="mapShowFunc.loadingPlace()">装卸区</span>|'
            + '<span class="icon" onclick="mapShowFunc.openRoundMonitor()">厂区监控</span>|'
            + '<span class="icon" onclick="mapShowFunc.openDangerSource()">重大危险源</span>'
            + '</div>';
        +'</div>';
    } else if (type == 'device') {
        content = '<div class="loc-content loc-content-2">'
            + '<div class="msg-content">'
            + '<p class="msg-info title"><span>' + info[0] + '</span></p>'
            + '</div>'
            + '</div>';
    }
    
    _this.showInfoWin(map, marker, content);
};
/**
 * 打开进出卡口
 */
_this.openBayonet = () => {
    //打开右侧弹窗
    _this.openRightPanel('bayonet', () => {
        //下拉列表选中对应的企业
        const companyId = _this.mapVariable._selectedMarkerByClick.id.split('-')[0];
        const bayonetComponent = vm.$refs.rightDrawer.$refs.bayonet;
        vm.$set(bayonetComponent.form, 'companyId', parseInt(companyId));  //必须要用 $set 来赋值
        // vm.$refs.rightDrawer.$refs.bayonet.form.companyId = parseInt(companyId);
        
        //查询该企业下的所有进出卡口
        bayonetComponent.bayonetList();
    });
    
};
/**
 * 打开装卸区
 */
_this.loadingPlace = () => {
    //打开右侧弹窗
    _this.openRightPanel('siteLade', () => {
        //下拉列表选中对应的企业
        const companyId = _this.mapVariable._selectedMarkerByClick.id.split('-')[0];
        const loadingPlaceComponent = vm.$refs.rightDrawer.$refs.loadingPlace;
        vm.$set(loadingPlaceComponent.form, 'companyId', parseInt(companyId));  //必须要用 $set 来赋值
        // vm.$refs.rightDrawer.$refs.bayonet.form.companyId = parseInt(companyId);
        
        //查询该企业下的所有装卸区
        loadingPlaceComponent.ladeSiteList();
    });
};

/**
 * 周边监控
 */
_this.openRoundMonitor = () => {
    //打开右侧弹窗
    _this.openRightPanel('camera', () => {
        const boundsAry = JSON.parse(_this.mapVariable._selectedMarkerByClick.info.split('&')[2]);
        //若是企业有自己的区域，则获取区域内的摄像机
        if (boundsAry && boundsAry.length > 0) {
            boundsAry.map(boundPoints => {
                if (boundPoints.length == 2) {
                    //说明企业区域时矩形
                    const showMarkersHash = _this.mapVariable._cameraShowMarkers;
                    if (showMarkersHash.getSize() > 0) {
                        const bounds = new google.maps.LatLngBounds({
                            lat: boundPoints[0].lat,
                            lng: boundPoints[0].lng
                        }, {lat: boundPoints[1].lat, lng: boundPoints[1].lng});
                        console.log(bounds.getNorthEast(), bounds.getSouthWest(), "@@@@@@@@bounds");
                        const selectedMarkers = _this._getCamMarkersInRect(showMarkersHash, bounds.getNorthEast(), bounds.getSouthWest());
                        _this.mapVariable._selectedMarkersByDrawTool = selectedMarkers;
                        passParam.$emit("selectedCameras", selectedMarkers)
                        // extMain.notice('框选的点位数量：'+selectedMarkers.length+"个",'success');
                    }
                } else if (boundPoints.length > 2) {
                    //说明企业区域时多边形
                    const showMarkersHash = _this.mapVariable._cameraShowMarkers;
                    const selectedMarkers = [];
                    let flag;
                    const latLngPoints = [];
                    boundPoints.map(point => {
                        const myLatLng = new google.maps.LatLng(point);
                        latLngPoints.push(myLatLng);
                    });
                    if (showMarkersHash.getSize() > 0) {
                        const allMarkersArrs = showMarkersHash.getValues();
                        let allMarkers = [];
                        allMarkersArrs.forEach(ktem => {
                            allMarkers = allMarkers.concat(ktem);
                        });
                        allMarkers.forEach(item => {
                            flag = _this.isPointInPolygon(latLngPoints, item);
                            if (flag) {
                                selectedMarkers.push(item);
                            }
                        });
                        _this.mapVariable._selectedMarkersByDrawTool = selectedMarkers;
                        passParam.$emit("selectedCameras", selectedMarkers)
                        // extMain.notice('多边形内选择的点位数量：'+selectedMarkers.length+"个",'success');
                    }
                    
                }
            })
        }
    });
    
};
/**
 * 重大危险源
 */
_this.openDangerSource = () => {
    //打开右侧弹窗
    _this.openRightPanel('dangerSource', () => {
        //下拉列表选中对应的企业
        const companyId = _this.mapVariable._selectedMarkerByClick.id.split('-')[0];
        const dangerSourceComponent = vm.$refs.rightDrawer.$refs.dangerSource;
        vm.$set(dangerSourceComponent.form, 'companyId', parseInt(companyId));  //必须要用 $set 来赋值
        // vm.$refs.rightDrawer.$refs.bayonet.form.companyId = parseInt(companyId);
        
        //查询该企业下的所有重大危险源
        dangerSourceComponent.dangerSourceList();
    });
};

/**
 * 打开右侧窗口，并定为到对应的tab页上
 *
 */
_this.openRightPanel = (type, callback) => {
    //打开右侧弹窗
    vm.$refs.rightPanel.show = true;
    //定位到周边监控页面
    vm.$refs.rightDrawer.activeName = type;
    for (let key in vm.$refs.rightDrawer.tabRefresh) {
        if (key == type) {
            vm.$refs.rightDrawer.tabRefresh[key] = true
        } else {
            vm.$refs.rightDrawer.tabRefresh[key] = false
        }
    }
    setTimeout(() => {
        callback();
    }, 500)
    
};

/**
 * 打开信息窗口
 * @param map
 * @param marker
 * @param content
 */
_this.showInfoWin = (map, marker, content) => {
    _this.closeInfoWin();
    _this.mapVariable._infowin = new google.maps.InfoWindow({
        content: content
    });
    _this.mapVariable._infowin.open(map, marker);
};
//关闭信息窗口
_this.closeInfoWin = () => {
    const win = _this.mapVariable._infowin;
    if (win) {
        win.close();
    }
};
//绘制点/线/圆/多边形
_this.searchByRect = () => {//画矩形选择摄像机
    _this.mapVariable._eventHandler = 'searchByRectComplete';
    _this.setDrawModel('rectangle');
};
_this.searchByCircle = () => {//画圆形选择摄像机
    _this.mapVariable._eventHandler = 'searchByCircleComplete';
    _this.setDrawModel('circle');
};
_this.searchByLine = () => {//画线选择摄像机
    _this.mapVariable._eventHandler = 'searchByLineComplete';
    _this.setDrawModel('polyline');
};
_this.searchByPolygon = () => {//画多边形选择摄像机
    _this.mapVariable._eventHandler = 'searchByPolygonComplete';
    _this.setDrawModel('polygon');
};
_this.setDrawModel = (type) => {
    switch (type) {
        case 'rectangle':
            _this.mapVariable.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
            break;
        case 'polyline':
            _this.mapVariable.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
            break;
        case 'polygon':
            _this.mapVariable.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
            break;
        case 'circle':
            _this.mapVariable.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
            break;
        case 'marker':
            _this.mapVariable.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
            break;
        default :
            alert('绘制类型错误！');
    }
};
//绘制完成后，调用绘制完成后的方法
_this.overlayComplete = (shape) => {
    var handler = _this.mapVariable._eventHandler;
    _this.mapVariable.drawingManager.setDrawingMode(null);// 将十字绘制图标取消掉，变为小手，取消绘制模式
    if (handler && _this._eventCallback[handler]) {
        _this._eventCallback[handler].call(_this, shape);
    } else {
        alert('未找到对应的形状类型！');
    }
};
//调用绘制完成后回调函数
_this._eventCallback = {
    searchByRectComplete: (shape) => {
        const overlay = shape.overlay;
        _this.mapVariable._allOverlays.push(overlay);
        const bounds = shape.overlay.getBounds();
        const showMarkersHash = _this.mapVariable._cameraShowMarkers;
        if (showMarkersHash.getSize() > 0) {
            const selectedMarkers = _this._getCamMarkersInRect(showMarkersHash, bounds.getNorthEast(), bounds.getSouthWest());
            _this.mapVariable._selectedMarkersByDrawTool = selectedMarkers;
            passParam.$emit("selectedCameras", selectedMarkers)
            // extMain.notice('框选的点位数量：'+selectedMarkers.length+"个",'success');
        }
    },
    searchByCircleComplete: (shape) => {
        const overlay = shape.overlay;
        _this.mapVariable._allOverlays.push(overlay);
        const radius = shape.overlay.getRadius();
        const pt = shape.overlay.getCenter();
        const showMarkersHash = _this.mapVariable._cameraShowMarkers;
        const selectedMarkers = [];
        if (showMarkersHash.getSize() > 0) {
            const allMarkersArrs = showMarkersHash.getValues();
            let allMarkers = [];
            allMarkersArrs.forEach(ktem => {
                allMarkers = allMarkers.concat(ktem);
            });
            allMarkers.forEach(item => {
                const distance = _this.getDistance(pt, item.getPosition());
                if (distance < radius) {
                    selectedMarkers.push(item);
                }
            });
            _this.mapVariable._selectedMarkersByDrawTool = selectedMarkers;
            passParam.$emit("selectedCameras", selectedMarkers)
            // extMain.notice('圈选的点位数量：'+selectedMarkers.length+"个",'success');
        }
        
    },
    searchByLineComplete: (shape) => {
        const overlay = shape.overlay;
        _this.mapVariable._allOverlays.push(overlay);
        const paths = shape.overlay.getPath();
        let latLngArray = [];//存储所有的顶点坐标
        for (let i = 0; i < paths.length; i++) {
            latLngArray.push(paths.getAt(i));
        }
        const pointArray = _this.getPointArrayInLine(latLngArray);
        console.log(pointArray, "pointArray");
        const showMarkersHash = _this.mapVariable._cameraShowMarkers;
        const selectedMarkers = [];
        let flag;
        if (showMarkersHash.getSize() > 0) {
            const allMarkersArrs = showMarkersHash.getValues();
            let allMarkers = [];
            allMarkersArrs.forEach(ktem => {
                allMarkers = allMarkers.concat(ktem);
            });
            allMarkers.forEach(item => {
                flag = _this.isPointInPolygon(pointArray, item);
                if (flag) {
                    selectedMarkers.push(item);
                }
            });
            _this.mapVariable._selectedMarkersByDrawTool = selectedMarkers;
            passParam.$emit("selectedCameras", selectedMarkers)
            // extMain.notice('线及周边10米范围内的点位数量：'+selectedMarkers.length+"个",'success');
        }
        
    },
    searchByPolygonComplete: (shape) => {
        const overlay = shape.overlay;
        _this.mapVariable._allOverlays.push(overlay);
        const paths = shape.overlay.getPath();
        const showMarkersHash = _this.mapVariable._cameraShowMarkers;
        const selectedMarkers = [];
        let flag;
        const latLngPoints = [];
        if (paths) {
            for (let j = 0; j < paths.length; j++) {
                latLngPoints.push(paths.getAt(j));
            }
        }
        console.log(latLngPoints, "latLngPoints");
        if (showMarkersHash.getSize() > 0) {
            const allMarkersArrs = showMarkersHash.getValues();
            let allMarkers = [];
            allMarkersArrs.forEach(ktem => {
                allMarkers = allMarkers.concat(ktem);
            });
            allMarkers.forEach(item => {
                flag = _this.isPointInPolygon(latLngPoints, item);
                if (flag) {
                    selectedMarkers.push(item);
                }
            });
            _this.mapVariable._selectedMarkersByDrawTool = selectedMarkers;
            passParam.$emit("selectedCameras", selectedMarkers)
            // extMain.notice('多边形内选择的点位数量：'+selectedMarkers.length+"个",'success');
        }
    },
};
//清除所有轨迹
_this.clearAllOverlay = () => {
    _this.mapVariable._allOverlays.forEach(overlay => {
        overlay.setMap(null);
        overlay = null;
    });
    _this.mapVariable._allOverlays = [];
};
//清除指定的所有轨迹
_this.clearOverlay = (overlay) => {
    overlay.setMap(null);
    overlay = null;
};
//获取 2个经纬度之间的距离
_this.getDistance = (point1, point2) => {
    const radLat1 = _this.getRadius(point1.lat());
    const radLat2 = _this.getRadius(point2.lat());
    const a = radLat1 - radLat2;
    const b = _this.getRadius(point1.lng()) - _this.getRadius(point2.lng());
    const s = _this.getTwoPointDistance(radLat1, radLat2, a, b);
    return s;
};
//求弧度
_this.getRadius = (d) => {
    const PI = Math.PI;//π
    return d * PI / 180.0;
};
// 数学计算两点距离
_this.getTwoPointDistance = (radLat1, radLat2, a, b) => {
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
        + Math.cos(radLat1) * Math.cos(radLat2)
        * Math.pow(Math.sin(b / 2), 2)));
    s = s * _this.mapVariable._earthRadius;
    s = (Math.round(s * 10000) / 10000.0).toFixed(2);
    return s;
};
/*获取线及周围10米范围的点坐标*/
_this.getPointArrayInLine = (latLngArray) => {
    let array1 = [];//线上方多边形范围的点数组
    let array2 = [];//线下方多边形范围的点数组
    for (let j = 0; j < latLngArray.length - 1; j++) {
        const degreeResult1 = 0.0001134;//10米范围对应的经纬度范围，
        const degreeResult2 = 0.0001134;//10米范围对应的经纬度范围
        let a = 0;//线的角度
        if (latLngArray[j + 1].lng() == latLngArray[j].lng()) {//如果垂直，则为90度
            a = 3.14 / 2;
        } else {
            a = Math.atan((latLngArray[j + 1].lat() - latLngArray[j].lat()) / (latLngArray[j + 1].lng() - latLngArray[j].lng()));//求线的角度a
        }
        const x1 = latLngArray[j].lng() - degreeResult1 * Math.sin(a);
        const y1 = latLngArray[j].lat() + degreeResult1 * Math.cos(a);
        const x2 = latLngArray[j + 1].lng() - degreeResult2 * Math.sin(a);
        const y2 = latLngArray[j + 1].lat() + degreeResult2 * Math.cos(a);
        const x3 = latLngArray[j + 1].lng() + degreeResult2 * Math.sin(a);
        const y3 = latLngArray[j + 1].lat() - degreeResult2 * Math.cos(a);
        const x4 = latLngArray[j].lng() + degreeResult1 * Math.sin(a);
        const y4 = latLngArray[j].lat() - degreeResult1 * Math.cos(a);
        const point1 = new google.maps.LatLng(y1, x1);
        const point2 = new google.maps.LatLng(y2, x2);
        const point3 = new google.maps.LatLng(y3, x3);
        const point4 = new google.maps.LatLng(y4, x4);
        
        const f = (latLngArray[j + 1].lng() - latLngArray[j].lng()) * (y1 - latLngArray[j].lat()) -
            (x1 - latLngArray[j].lng()) * (latLngArray[j + 1].lat() - latLngArray[j].lat());
        if (f > 0) {
            array1.push(point1);
            array1.push(point2);//将线上方的点放入array1
            
            array2.push(point4);
            array2.push(point3);//将线下方的点放入array2
        } else {
            array1.push(point4);
            array1.push(point3);//将线上方的点放入array1
            
            array2.push(point1);
            array2.push(point2);//将线下方的点放入array2
        }
    }
    let multi = "";//多边形点的坐标字符串
    const length1 = array1.length;
    const length2 = array2.length;
    if (length1 == 2) {//如果只有一条线则无需求交点
        multi = array1[0].lng() + "," + array1[0].lat() + "," + array1[1].lng() + "," + array1[1].lat() + ","
            + array2[1].lng() + "," + array2[1].lat() + "," + array2[0].lng() + "," + array2[0].lat() + ","
            + array1[0].lng() + "," + array1[0].lat();
    }
    else {
        for (let i = 0; i < length1 / 2 - 1; i++) {//求线上方的点的交点，并加入到multi中
            const p = 2 * i;
            multi = multi + array1[p].lng() + "," + array1[p].lat() + ",";
            const k1 = (array1[p].lat() - array1[p + 1].lat()) / (array1[p].lng() - array1[p + 1].lng());
            const k2 = (array1[p + 2].lat() - array1[p + 3].lat()) / (array1[p + 2].lng() - array1[p + 3].lng());
            const x = (k1 * array1[p].lng() - k2 * array1[p + 2].lng() + array1[p + 2].lat() - array1[p].lat()) / (k1 - k2);
            const y = array1[p].lat() + (x - array1[p].lng()) * k1;
            multi = multi + x + "," + y + ",";
        }
        multi = multi + array1[length1 - 1].lng() + "," + array1[length1 - 1].lat() + ",";
        for (let j = length2 / 2 - 2; j > -1; j--) {//求线下方的点的交点，并加入到multi中
            const q = j * 2 + 3;
            multi = multi + array2[q].lng() + "," + array2[q].lat() + ",";
            const k1 = (array2[q].lat() - array2[q - 1].lat()) / (array2[q].lng() - array2[q - 1].lng());
            const k2 = (array2[q - 2].lat() - array2[q - 3].lat()) / (array2[q - 2].lng() - array2[q - 3].lng());
            const x = (k1 * array2[q].lng() - k2 * array2[q - 2].lng() + array2[q - 2].lat() - array2[q].lat()) / (k1 - k2);
            const y = array2[q].lat() + (x - array2[q].lng()) * k1;
            multi = multi + x + "," + y + ",";
        }
        multi = multi + array2[0].lng() + "," + array2[0].lat() + "," + array1[0].lng() + "," + array1[0].lat();
    }
    const multiarray = multi.split(",");
    const pointArray = [];
    for (let i = 0; i < multiarray.length; i = i + 2) {
        pointArray.push(new google.maps.LatLng(multiarray[i + 1], multiarray[i]))
    }
    return pointArray
};

/*获取矩形框内所有显示的摄像机点*/
_this._getCamMarkersInRect = (markers, maxCoordinate, minCoordinate) => {
    let selectedMarkers = [];
    const keys = markers.getKeys();
    const maxLng = maxCoordinate.lng();
    const minLng = minCoordinate.lng();
    const maxLat = maxCoordinate.lat();
    const minLat = minCoordinate.lat();
    let allMarkers;
    let thisLng;
    let thisLat;
    allMarkers = markers.getValues();
    allMarkers.forEach(item => {
        thisLng = item.getPosition().lng();
        thisLat = item.getPosition().lat();
        if (thisLng < maxLng && thisLng > minLng && thisLat < maxLat && thisLat > minLat) {
            selectedMarkers.push(item);
        }
    });
    return selectedMarkers;
};
/*射向法判断点(marker)是否在多边形内部*/
_this.isPointInPolygon = (latLngPoints, markerPoint) => { //latLngPoints：多边形顶点数组，markerPoint：需要比较的点
    /*latLngPoints 多边形顶点 */
    /*latLngPoint  单个顶点*/
    
    let latLngPoint;
    if (markerPoint) {
        const point = markerPoint.getPosition();
        latLngPoint = point;
    }
    
    if (!latLngPoints || latLngPoints.length == 0 || !latLngPoint) {
        return -1;
    }
    let counter = 0;
    let xinters;
    let p1 = null;
    let p2 = null;
    let isPointOnLineFlag = false;
    p1 = latLngPoints[0];
    
    for (let i = 1; i <= latLngPoints.length; i++) { //p2 = latLngPoints + (i % nCount);
        p2 = latLngPoints[i % latLngPoints.length];
        if (_this.isPointOnLine(p1, p2, latLngPoint)) {
            isPointOnLineFlag = true;
        }
        if (latLngPoint.lng() > Math.min(p1.lng(), p2.lng())) {
            if (latLngPoint.lng() <= Math.max(p1.lng(), p2.lng())) {
                if (latLngPoint.lat() <= Math.max(p1.lat(), p2.lat())) {
                    if (p1.lng() != p2.lng()) {
                        xinters = (latLngPoint.lng() - p1.lng()) * (p2.lat() - p1.lat()) / (p2.lng() - p1.lng()) + p1.lat();
                        if ((p1.lat() == p2.lat()) || (latLngPoint.lat() < xinters) || (latLngPoint.lat() == xinters)) {
                            counter++;
                        }
                    }
                }
            }
        }
        p1 = p2;
    }
    if (isPointOnLineFlag) {
        //点在边上
        return true;
    }
    if (counter % 2 == 0) {
        //点在多边形外
        return false;
    } else {
        //点在多边形内
        return true;
    }
};
/*
 * 判断点是否在线段上
 * p1、p2：线段的两个端点
 * p：	被判断点
 * 返回值：	false：点在不在线段上；true：点在线段上
 */
_this.isPointOnLine = (p1, p2, p) => {
    let x1, y1, x2, y2;
    x1 = p.lat() - p1.lat();
    x2 = p2.lat() - p1.lat();
    y1 = p.lng() - p1.lng();
    y2 = p2.lng() - p1.lng();
    if (_this.FC(x1 * y2 - x2 * y1, 0) == 0) {
        return false;
    }
    if ((Math.min(p1.lat(), p2.lat()) <= p.lat() && p.lat() <= Math.max(p1.lat(), p2.lat())) && (Math.min(p1.lng(), p2.lng()) <= p.lng() && p.lng() <= Math.max(p1.lng(), p2.lng()))) {
        return true;
    } else {
        return false;
    }
};
_this.FC = (x1, x2) => {
    if (x1 - x2 < 0.000002 && x1 - x2 > -0.000002) {
        return 1;
    } else {
        return 0;
    }
};

//根据多个坐标点对，绘制区域
_this.drawPolygon = (pointsArray, option, flag = true) => {
    const polygon = new google.maps.Polygon({
        paths: pointsArray,
        strokeColor: option.strokeColor || '#FF0000',
        strokeOpatity: option.strokeOpatity || 0.8,
        strokeWeight: option.strokeWeight || 2,
        fillColor: option.fillColor || '#FF0000',
        fillOpacity: option.fillOpacity || 0.35
    });
    flag == true ? polygon.setMap(_this.mapVariable.map) : polygon.setMap(null);
    return polygon;
};

/*画圆*/
_this.drawCircle = (r, center, color, strokeOpacity, fillColor) => {
    return new google.maps.Circle({
        radius: r,//半径
        center: center,//中心点
        strokeColor: color || '#FF0000',//描边颜色
        strokeOpacity: (strokeOpacity != null) ? strokeOpacity : 1.0,//描边透明度
        strokeWeight: 2, //描边线的像素
        fillColor: fillColor || '#FF0000',//填充颜色
        fillOpacity: 0.2,//填充透明度
        map: _this.mapVariable.map
    });
};

/*画矩形*/
_this.drawRect = (bounds, option, flag = true) => {
    const rectangle = new google.maps.Rectangle({
        bounds: bounds,
        strokeColor: option.strokeColor || '#FF0000',//描边颜色
        strokeOpacity: option.strokeOpacity || 1.0,//描边透明度
        strokeWeight: option.strokeWeight || 2, //描边线的像素
        fillColor: option.fillColor || '#FF0000',//填充颜色
        fillOpacity: option.fillOpacity || 0.2,//填充透明度
        map: _this.mapVariable.map
    });
    // this._circleArry.push(circle);
    flag == true ? rectangle.setMap(_this.mapVariable.map) : rectangle.setMap(null);
    return rectangle;
};

export default mapShowFunc;

