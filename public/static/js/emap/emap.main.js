import emapEvent from './emap.event'
export default {
  menuContext : null,
  mapTileUrl : null,
  map : null,
  infowin : null,//详细信息气泡窗口
  drawingManager : null,
  maxZoom : 18,
  minZoom : 5,

  style : {
    fillColor : "#13c2f7",
    strokeColor : "#468EF7",
    strokeWeight : 3,
    strokeOpacity : 0.8,
    fillOpacity : 0.1
  },
  options : {
    center : null,
    zoom : 14,
    mapTypeControl : true,//地图类型插件
    streetViewControl : false, //街景插件
    zoomControl : true,//缩放插件
    panControl : true,//平移插件
    scaleControl : true
    /*scaleControlOptions : { //比例控件,公里、英尺 置于地图的右下角
      position : google.maps.ControlPosition.BOTTOM_LEFT
    },
    mapTypeControlOptions : {
      mapTypeIds : [ 'satel', 'localMap' ],//包括两种地图类型
      position : google.maps.ControlPosition.TOP_RIGHT,//地图类型插件放于地图的右上角
    }*/
  },

  init:function(container, tileUrl, lat , lng) {
    const _this = this;
    _this.mapTileUrl = tileUrl;
    let localMap = new _this.MapEntity(tileUrl, 'map', _this.maxZoom, _this.minZoom);
    localMap.name = '电子地图';
    let satel = new _this.MapEntity(tileUrl, 'satellite', _this.maxZoom, _this.minZoom);
    satel.name = '卫星影像';

    _this.options.center = new google.maps.LatLng(lat,lng);
    let map = new google.maps.Map(container, _this.options);
    map.mapTypes.set('localMap', localMap);
    map.mapTypes.set('satel', satel);
    map.setMapTypeId('localMap');

    _this.map = map;
    _this.setupEvents();
    //设置右键上下文
    _this.menuContext = new MenuControl(map);
    _this.menuContext.sender = map;
    _this.initMenuContext(map, _this.menuContext);

    // 注册全局事件
    // 鼠标移动、单击显示当前坐标，滚轮显示地图等级
    google.maps.event.addListener(map, 'mousemove', function(event) {
      emapEvent.mouseMove(event);
    });
    //		google.maps.event.addListener(map,'click',function (event){
    //	        alert(event.latLng.lng()+','+event.latLng.lat());
    //	    });
    google.maps.event.addListener(map, 'zoom_changed', function(event) {
      emapEvent.zoomChanged(map, event);
    });
    google.maps.event.addListener(map, 'bounds_changed', function(event) {
      //mapPage.event.boundsChanged(map, event);
    });
  },

  initMenuContext:function(thismap,context) {
    const _this = this;
    context.addSeparator("map");
    context.addItem(new MenuItem({
      text : "放大一级",
      icon : "images/zoomax.png",
      groupName : "map",
      handler : function(coor) {
        _this.zoomIn(1);
      }
    }));
    context.addItem(new MenuItem({
      text : "缩小一级",
      icon : "images/zoomin.png",
      groupName : "map",
      handler : function(coor) {
        _this.zoomOut(1);
      }
    }));

    google.maps.event.addListener(thismap, "rightclick", function(e) {
      if (context.isEnable) {
        context.coordinate = {
          point : e.pixel,
          latlng : e.latLng
        };
        context.container.style.left = e.pixel.x + "px";
        context.container.style.top = e.pixel.y + "px";
        context.show("map");
      }
    });
  },
  setupEvents(){
    var _this = this;
    let map = _this.map;
    // 绘画工具 设置
    _this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl : false,
      polylineOptions : _this.style,
      circleOptions : _this.style,
      rectangleOptions : _this.style,
      polygonOptions : _this.style
    });
    _this.drawingManager.setMap(map);



    var drawingManager = this.drawingManager;
    // 注册多边形绘制完成事件
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {

    });
    // 矩形、折线绘制完成后触发的事件
    google.maps.event.addListener(drawingManager, 'overlaycomplete',function(shape) {
      emapEvent.overlayComplete(shape);
    });
  },

  MapEntity : function(baseTileUrl,tileType,maxZoom,minZoom) {
    var self = this;
    self.tileSize = new google.maps.Size(256, 256);
    self.maxZoom = maxZoom;
    self.minZoom = minZoom;

    self.getTile = function(coord, zoom, ownerDocument) {
      var img = ownerDocument.createElement("img");
      img.style.width = this.tileSize.width + "px";
      img.style.height = this.tileSize.height + "px";
      var strURL = baseTileUrl + tileType +'/';
      strURL += zoom + "/" + coord.x + "/" + coord.y + '.png';
      img.src = strURL;
      img.onerror = function() {
        img.src = baseTileUrl + "images/noimg.jpg";
      };
      return img;
    };
  },


  getMarker : function(id, lat, lng, icon, title) {
    var makerlatlng = new google.maps.LatLng(lat, lng);
    //var img = this.mapTileUrl + 'icon/' + icon + '.png';
    var img = this.getIcon(icon);
    var marker = new google.maps.Marker({
      id : id,
      position : makerlatlng, // 标注点的坐标位置
      icon : img,
      type : icon,//摄像机类型
//			icon: {
//		    url: icon,
//		    size: new google.maps.Size(71, 71),
//		    origin: new google.maps.Point(50, 50),
//		    anchor: new google.maps.Point(100, 100),
//		    scaledSize: new google.maps.Size(25, 25)
//	        },

      draggable : false,
      visible : true,
      title : title
    });

    return marker;
  },

  getMarkerWithMap : function(id, lat, lng, icon, title) {
    var marker = this.getMarker(id, lat, lng, icon, title);
    marker.setMap(this.map);
    return marker;
  },
  /*****************************************************************
   * 本代码用于测试gps车辆图标方向变化，暂时未用
   getMarkerWithMapWithDegree : function(id, lat, lng, icon, title) {
		var makerlatlng = new google.maps.LatLng(lat, lng);
		var img = this.getIconWithDegree(icon);
		var marker = new google.maps.Marker({
			id : id,
			position : makerlatlng, // 标注点的坐标位置
			icon : img,
			type : icon,//摄像机类型
			draggable : false,
			visible : true,
			title : title
		});
		marker.setMap(this.map);
		return marker;
	},
   *********************************************************************/
  getIcon : function(icon){
    return this.mapTileUrl + 'icon/' + icon + '.png';
  },

  /**
   * 设置marker的图片
   * @param {object} marker google自己创建的marker
   * @param {string} img 图片
   */
  setMarkerIcon: function (marker, img) {
    marker.setIcon(img);
  },
  /*****************************************************************
   * 本代码用于测试gps车辆图标方向变化，暂时未用
   getIconWithDegree : function(iconName){
		var img = {
				path:this.getIcon(iconName),
				scale:1,
				rotation:[50]
		}
		return img;
	},
   *********************************************************************/
  getMap : function(){
    return this.map;
  },

  addLabel : function(lat, lng, text) {
    var makerlatlng = new google.maps.LatLng(lat, lng);
    var mapLabel = new MapLabel({
      text: text,
      position: makerlatlng,
      map: this.map,
      fontSize: 22,
      fontColor: '#ef5a08',
      strokeColor: '#f9f9f9',
      align: 'left'
    });
    return mapLabel;
  },

  zoomIn : function(num){ //放大指定的级数
    var zoom = map.getZoom() + num;
    if(zoom < this.maxZoom){
      map.setZoom(zoom);
    }else{
      map.setZoom(this.maxZoom);
    }
  },
  zoomOut : function(num){//缩小指定的级数
    var zoom = map.getZoom() - num;
    if(zoom > this.minZoom){
      map.setZoom(zoom);
    }else{
      map.setZoom(this.minZoom)
    }
  },
  getLevel : function(){//获取当前的缩放级别
    return map.getZoom();
  },
  pan2Point : function (lat,lng){
    var centlatlng = new google.maps.LatLng(lat,lng);
    map.panTo(centlatlng);
  },
  setZoom : function (level) {
    map.setZoom(level);
  },
  move2PointByEvent : function(event){
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    var centlatlng = new google.maps.LatLng(lat, lng);
    map.panTo(centlatlng);
  },
  move2PointByMarker : function(marker){
    this.map.panTo(marker.position);
  },
  showInfoWin : function(marker,content) {
    this.closeInfoWin();
    infowin = new google.maps.InfoWindow({
      content : content
    });
    this.infowin = infowin;
    this.infowin.open(this.map, marker);
  },
  closeInfoWin : function() {
    var win = this.infowin;
    if (win) {
      win.close();
    }
  },
  closeInfoWinDelay : function(delay) {
    setTimeout(function  (event) {
      emap.main.closeInfoWin();
    },delay);
  },
  drawLine : function(pointsArray,color,opacity,weight) {
    var line = new google.maps.Polyline({
      path:pointsArray,
      map:this.map,
      strokeColor: color || '#468EF7',
      strokeOpacity:opacity || '0.8',
      strokeWeight:weight || '3',
    });
    return line;
  },
  getMapPoint : function(lat,lng){
    return new google.maps.LatLng(lat,lng);
  },
  setDrawModel : function(type){
    switch(type){
      case 'rectangle':
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
        break;
      case 'polyline':
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
        break;
      case 'polygon':
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        break;
      case 'circle':
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
        break;
      case 'marker':
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
        break;
      default :
        alert('绘制类型错误！');
    }
  },
  //根据要显示的内容在地图上画出图标
  getGatherMarkerWithContent : function(lat,lng,content){
    var $this = this;
    var MarkerWithLabel = emap.extension.getMarkerLabel(google.maps);
    var icon = emap.main.getIcon(22);
    var latLng = new google.maps.LatLng(lat, lng);
    var marker = new MarkerWithLabel({
      position: latLng,
      map: this.map,
      draggable: false,
      raiseOnDrag: true,
      icon : icon,
      labelContent: content,
      labelAnchor: new google.maps.Point(21, 37),
      labelClass: "marker-label", // the CSS class for the label
      labelInBackground: false
    });
    return marker;
  },

  /*	drawPolygon : function(pointsArray,option) {
   var polygon = new google.maps.Polygon({
   paths : pointsArray,
   strokeColor : '#FF0000',
   strokeOpatity : 0.8,
   strokeWeight : 2,
   fillColor : '#FF0000',
   fillOpacity : 0.35
   });
   polygon.setMap(this.map);
   return polygon;
   },*/
  drawPolygon : function(pointsArray,option) {
    var polygon = new google.maps.Polygon({
      paths : pointsArray,
      strokeColor : option.strokeColor || '#FF0000',
      strokeOpatity : option.strokeOpatity || 0.8,
      strokeWeight : option.strokeWeight || 2,
      fillColor : option.fillColor || '#FF0000',
      fillOpacity : option.fillOpacity || 0.35
    });
    polygon.setMap(this.map);
    return polygon;
  },

//	参考代码
//	getBearings : function(){
//	    var spherical = google.maps.geometry.spherical;
//	    var point1 = markers[0].getPosition();// latlng of point1
//	    var point2 = markers[1].getPosition();
//	    var point3 = markers[2].getPosition();
//	    var bearing1 = google.maps.geometry.spherical.computeHeading(point1,point2);
//	    var bearing2 = google.maps.geometry.spherical.computeHeading(point2,point3);
//	    var angle =getDifference(bearing1, bearing2);
//	    return angle;
//	},
//
//	getDifference : function(a1, a2) {
//	    al = (a1>0) ? a1 : 360+a1;
//	    a2 = (a2>0) ? a2 : 360+a2;
//	    var angle = Math.abs(a1-a2)+180;
//	    if (angle > 180){
//	        angle = 360 - angle;
//	    }
//	   return   Math.abs(angle);
//	},
  //画出聚合点，并绑定事件
  getGatherMarker : function(lat,lng,cameras){
    var $this = this;
    var MarkerWithLabel = emap.extension.getMarkerLabel(google.maps);
    var iconDefault = emap.main.getIcon('blank');
    var iconCluster = emap.main.getIcon('23');
    var latLng = new google.maps.LatLng(lat, lng);
    var pictureDiv =  document.createElement('div');
    pictureDiv.style.background = 'url('+ iconCluster +')';
    pictureDiv.style.width = '30px';
    pictureDiv.style.height = '30px';
    pictureDiv.style['margin-left'] = '-35px';
    pictureDiv.style['margin-top'] = '15px';

    var pictureSpan =  document.createElement('span');
    pictureSpan.style.display = 'block';
    pictureSpan.style['color']='white';
    pictureSpan.style['font-size']='13px';
    pictureSpan.style.width = '30px';
    pictureSpan.style['text-align'] = 'center';
    pictureSpan.style['padding-top'] = '9px';

    pictureSpan.innerHTML=cameras.length;
    pictureDiv.appendChild(pictureSpan);

    var pictureLabel = document.createElement("img");
    pictureLabel.src = iconCluster;
    var marker = new MarkerWithLabel({
      position: latLng,
      map: this.map,
      draggable: false,
      raiseOnDrag: true,
      icon : iconDefault,
//			icon: {
//			    url: icon,
//			    size: new google.maps.Size(71, 71),
//			    origin: new google.maps.Point(50, 50),
//			    anchor: new google.maps.Point(100, 100),
//			    scaledSize: new google.maps.Size(25, 25)
//	        },
      labelContent: pictureDiv,
//		    labelAnchor: new google.maps.Point(10, 40),
      labelAnchor: new google.maps.Point(0,0),
      labelClass: "marker-label", // the CSS class for the label
      labelInBackground: false
    });

    google.maps.event.addListener(marker, 'click', function(event) {
      $this.pan2Point(lat,lng);
      var point = emap.util.getPixelPoint(lat,lng);
      var count = cameras.length;
      var interval = 2 * Math.PI / count;

      var R = 40;//大图标周围形成小图标的半径，单位为像素
      if(count <= 8){
        emap.work.clearClusterSubMarkers();
        var children = new Array();
        for (var i = 0; i < count; i++) {
          (function(){  //通过闭包和临时变量循环绑定单击事件
              var p = i;
              var x = point.x + R * Math.cos(p * interval);
              var y = point.y + R * Math.sin(p * interval);
              var newpoint = new google.maps.Point(x+20,y+40);
              var latLng = emap.util.getLatLngFromPoint(newpoint);

              var childMarker = $this.getMarker(1, latLng.lat(), latLng.lng(), '2', null);
              children.push(childMarker);
              var temp = cameras[p];
              childMarker.setMap(emap.main.getMap());
              google.maps.event.addListener(childMarker, 'click', function(event){
                //mapPage.work.showCameraInfo(temp.id,childMarker);
              })
            }
          )();

        }
        emap.work.setClusterSubMarkers(children);
      }
    });
    google.maps.event.addListener(marker, "rightclick", function(event) {
      //$this.pan2Point(lat,lng);
    });
    return marker;
  },
  //只获取聚合样式图标
  getClusterMarker : function(lat,lng,num){
    var MarkerWithLabel = emap.extension.getMarkerLabel(google.maps);
    var iconDefault = emap.main.getIcon('blank');
    var latLng = new google.maps.LatLng(lat, lng);
    var pictureDiv =  document.createElement('span');
    pictureDiv.title='摄像机数量：'+num;
    pictureDiv.style['color']='white';
    pictureDiv.style['font-size']='13px';
    pictureDiv.style['text-align'] = 'center';
    pictureDiv.innerHTML=num;
    var marker = new MarkerWithLabel({
      position: latLng,
      map: this.map,
      draggable: false,
      raiseOnDrag: true,
      icon : iconDefault,
      labelContent: pictureDiv,
      labelAnchor: new google.maps.Point(-12,40),
      labelClass: "marker-label", // the CSS class for the label
      labelInBackground: false
    });
  },
};
