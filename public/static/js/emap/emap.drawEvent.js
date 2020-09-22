/**
 * Created by 9527 on 2018/1/31.
 * 负责实现业务中的地图绘制功能，包括：港口辖区、港区、各点位的绘制等
 */
window.emap = window.emap || {};
emap.drawEvent = emap.drawEvent || {};

emap.drawEvent = {
    _pointArry : [],//追踪点位集合
    _circleArry : [],//部件圆圈集合
    _pointPath : [],//追踪点位线段
    _portBlock : [],//港区港界图形
    _infCircle : null,//暂存危险源影响范围
    _portBlockName : [],//港区名称
    _zoomRange : new ext.utility.hashTable(),//港区显示地图级别哈希表
    _portData : new ext.utility.hashTable(),//港区<==>数据对应哈希表
    _districtCN4Weather : new ext.utility.hashTable(),//行政区中英对应哈希表，用于天气模块

    _shipHash : new ext.utility.hashTable(),//船舶位置hash
    _shipFlag : new ext.utility.hashTable(),//控制某船是否画轨迹的hash
    _shipTimer : null,//船舶定时器
    _shipLat : [],//暂存船舶纬度，测试使用，后期若有船舶位置数据接口可删
    _shipLng : [],//暂存船舶经度，测试使用，后期若有船舶位置数据接口可删

    _shipMarkerHash : new ext.utility.hashTable(),//船舶标记hash

    _bounds : [],   //暂存边界

    addMarkerByData : function(key){/*添加标记*/
        // $('div#layerbox_item>div.show-list>a#'+key+'').addClass('active');
        var self = this;
        $.ajax({
            url: "./mapJson.json",//json文件位置
            type: "GET",//请求方式为get
            dataType: "json", //返回数据格式为json
            success: function(data) {//请求成功完成后要执行的方法
                if(data[key]){
                    $.each(data[key].sub, function(i, item) {
                        var res = data[item.id];
                        if(res.bounds){//判断是否为区域
                            //遍历bounds
                            console.log(res);
                            // self.drawBlock(res,'drawPolygon',res.name);
                        }
                        emap.work.addMarker(res.id,res.lat,res.lng,res.icon,res.title);
                    });
                    //emap.work.clusterCameraPoints();//聚合
                }
            }
        });
    },
    //画当前区域
    drawPortBlock : function(text,key,drawFunc){
        /*
        * @param text : 区域名称
        * @param key : 区域数据在json文件中的对应项
        * */
        var portBlock = null;
        var self = this;
        var drawType = 'drawLine';
        self.removePortBlock();//清除上一次画的区域边界
        self.removePortBlockName();//清除上一次画的区域名称
        emap.work.clearAllMarker();//清除上一次所画所有点位
        self.clearInfScope();//清除上一次所画影响范围

        console.log('画当前区域:'+key);

        if(drawFunc){//画区域的方式,默认为画边界
            drawType = drawFunc;
        }
        $.ajax({
            url: "../GIS/mapJson.json",//json文件位置
            type: "GET",//请求方式为get
            dataType: "json", //返回数据格式为json
            success: function(data) {//请求成功完成后要执行的方法
                //判断是否含有数据以及有下属节点
                if(!data[key]){
                //if(!data[key]||!data[key][0].sub){
                    return;
                }
                self.drawBlock(data[key],drawType,text);
                //显示搜索结果
                self.showPortBlockInfo(key);
                //改搜索框内容
                $("#searchipt").val(text);
                //console.log(text);
            }
        });
        //设置缩放
        var zoom = self._zoomRange.getValue(self.markerDataRel(key));
        if(!zoom){
            zoom = self._zoomRange.getValue(key);
        }
        if(zoom){
            emap.main.setZoom(zoom);
        }
        //获取天气
        var loc = this._districtCN4Weather.getValue(key);
        if(loc){
            emap.weather.getTodayWeather(loc);
        }
        return portBlock;
    },
    //清除港区港界
    removePortBlock : function(){
        var portBlock = this._portBlock;
        if(portBlock){
            for (var i = 0; i < portBlock.length; i++) {
                portBlock[i].setMap(null);
            }
        }
    },
    //清除港区名称
    removePortBlockName : function(){
        var portBlockName = this._portBlockName;
        if(portBlockName){
            for (var i = 0; i < portBlockName.length; i++) {
                portBlockName[i].setMap(null);
            }
        }
    },
    //显示搜索结果
    showPortBlockInfo : function(ref){
        var url =  "./mapJson.json";//json文件位置
        var node = $("div#amapBox>div.translate-box");
        this.showPortSearchResult(url,ref+'_info',node);
    },
    //通过标记显示港区信息
    showPortBlockInfoByMarker : function(key,position){
        //showPointInfo的参数
        //var marker = emap.main.getMarkerWithMap("ZFW",position.lat(),position.lng(),"4","芝罘湾港区");
        //marker.setVisible(false);
        emap.work.showPointInfo(1,marker,3);
    },

    //点击位置添加标记
    addMarkerByClick : function(){
        //var lat = event.latLng.lat();
        //var lng = event.latLng.lng();
        //var marker = emap.main.getMarkerWithMap("test",lat,lng,"4","test");
        emap.event._eventHandler = 'markPointComplete';
        emap.main.setDrawModel('marker');
    },
    /*切换状态*/
    showOrHidden : function(node,className){
        if(node.hasClass(className)){
            node.removeClass(className);
        }else{
            node.addClass(className);
        }
    },
    /*搜索展示*/
    showPortSearchResult : function(url,key,node){
        /*
         * @param url：数据的url地址
         * @param key：数据在json文件中对应的项
         * @param node：添加搜索信息的html树节点
         * */
        $("div#amapBox").removeClass("display-none");
        console.log('搜索展示=========='+key);
        $.ajax({
            url: url,//json文件位置
            type: "GET",//请求方式为get
            dataType: "json", //返回数据格式为json
            success: function(data) {//请求成功完成后要执行的方法
                var content = '<div id="#serp"><div class="serp-body"><ul>';
                if(!data[key]){
                    return;
                }
                //显示关闭搜索详情按钮
                $("#closeSearch").css('display','block');
                $.each(data[key], function(i, item) {//需要遍历，比如：后期开发时显示多条搜索结果
                    i++;
                    content +=  '<li class="poibox" onclick="emap.drawEvent.drawPortBlock(\''+item.name+'\',\''+item.id+'\')">' +//绑定画区域函数
                        '   <div id="'+item.id+'" class="poi-imgbox" data-toggle="modal" data-target="#details" onclick="emap.drawEvent.showDetail(this);">' +
                        '       <span>详情</span>' +
                        '       <span id="name" style="display: none">'+item.name+'</span>' +
                        '   </div>'+
                        '   <div class="poi-info-left">' +
                        '       <h3 class="poi-title">'+
                        '           <span class="poi-name">' + i +'.'+ item.name + '</span>'+
                        '       </h3>'+
                        '       <div class="poi-info">' +
                        '           <p class="poi-addr">'+item.local+'</p>' +
                        '       </div>'+
                        '   </div>' +
                        '</li>';
                });
                content += '</ul></div></div>';
                node.html(content);
            }
        });
    },
    /*搜索详情*/
    showDetail : function(which){
        //emap.drawEvent.showOrHidden($('div.showPointInfo'),'display-none');
        var key = $(which).attr("id");
        var title = $('#'+key+' span#name').html();
        this.drawPortBlock(title,key);
        this.drawNextLevelBlock(key);
        $.ajax({
            url: "./mapJson.json",//json文件位置
            type: "GET",//请求方式为get
            dataType: "json", //返回数据格式为json
            success: function(data) {//请求成功完成后要执行的方法
                if(!data[key]){
                    return;
                }
                console.log('搜索详情');
                console.log(data[key]);
                var content = '';
                $("div#details h4#title").html(data[key].name);
                var index = 0;
                $.each(data[key].info, function(j, jtem) {
                    for(var k in jtem){
                        if(index%2==0){
                            content += '<div class="row"><div class="col-sm-3">'+ jtem[k] +'</div>';
                            //content += '<div class="form-group"><label class="col-sm-3 control-label">'+ item[k] +'</label>';
                        }else{
                            content += '<div class="col-sm-9">'+ jtem[k] +'</div></div>';
                        }
                        index++;
                    }
                });
                $("div#details div.modal-body").html(content);
            }
        });
    },

    /*画影响范围*/
    drawInfScope : function(marker){
        /*
        * @param marker：目标点位
        * */
        var target = marker.id;
        var key = null;
        var self = this;
        if(!target.match('DANGER')){//通过id判断是否为危险源
            return;
        }else{
            this.clearInfScope();//清除上一次所画影响范围
            key = 'DANGER';
        }
        $.ajax({
            url: "./mapJson.json",
            type: "GET",
            dataType: "json",
            success: function(data) {
                $.each(data[key].sub, function(i, item) {
                    var res = data[item.id];
                    if(target == res.id){
                        self._infCircle = emap.drawEvent.drawCircle(res.radius,marker.getPosition(),'#FF0000');
                        self.drawMarkerInScope(res);
                        return;
                    }
                });
            }
        });
    },
    /*画影响范围内的点位*/
    drawMarkerInScope : function(spot){
        if(spot.scope){
            var self = this;
            $.each(spot.scope,function(i,item){
                //根据id获取对应的数据
                self.showSingleMarker(item.id);
            });
        }
    },
    /*清除影响范围*/
    clearInfScope : function(){
      var infScope = this._infCircle;
      if(infScope){
          infScope.setMap(null);
      }
    },

    /*添加标注*/
    addLabelWithFont : function(lat, lng, text, fontSize) {
        var makerLatLng = new google.maps.LatLng(lat, lng);
        var mapLabel = new MapLabel({
            text: text,
            position: makerLatLng,
            map: emap.main.getMap(),
            fontSize: fontSize,
            fontColor: '#009cf9 ',
            strokeColor: '#f9f9f9',
            align: 'center'
        });
        return mapLabel;
    },
    /*画矩形*/
    drawRect : function(bounds,option) {
        var rectangle  = new google.maps.Rectangle({
            bounds:bounds,
            strokeColor: option.color || '#468EF7',//描边颜色
            strokeOpacity: option.strokeOpacity || 1.0,//描边透明度
            strokeWeight:  option.strokeWeight || 2, //描边线的像素
            fillColor:  option.fillColor || '#468EF7',//填充颜色
            fillOpacity: option.fillOpacity || 0.2,//填充透明度
            map:emap.main.getMap()
        });
        // this._circleArry.push(circle);
        return rectangle ;
    },
    /*画圆*/
    drawCircle : function(option) {
        var circle = new google.maps.Circle({
            radius: option.radius,//半径
            center: option.center,//中心点
            strokeColor: option.strokeColor || '#468EF7',//描边颜色
            strokeOpacity: option.strokeOpacity || 1.0,//描边透明度
            strokeWeight:  option.strokeWeight || 2, //描边线的像素
            fillColor:  option.fillColor || '#468EF7',//填充颜色
            fillOpacity: option.fillOpacity || 0.2,//填充透明度
            map:emap.main.getMap()
        });
        this._circleArry.push(circle);
        return circle;
    },
/*    drawCircle : function(r,center,color) {
        var circle = new google.maps.Circle({
            radius: r,//半径
            center: center,//中心点
            strokeColor: color,//描边颜色
            strokeOpacity: 1.0,//描边透明度
            strokeWeight: 1, //描边线的像素
            fillColor: '#FF0000',//填充颜色
            fillOpacity: 0,//填充透明度
            map:emap.main.getMap()
        });
        this._circleArry.push(circle);
        return circle;
    },*/
    /*清除圆圈*/
    clearCircle : function(){
        var circleArry = this._circleArry;
        if(circleArry){
            for (var i = 0; i < circleArry.length; i++) {
                circleArry[i].setMap(null);
            }
        }
    },
    /*初始化*/
    initHashTables : function() {
        this._zoomRange.add('YTG',12);
        this._zoomRange.add('ZFW',14);
        this._zoomRange.add('XGQ',14);
        this._zoomRange.add('WHARF',16);
        this._zoomRange.add('STORAGE',16);
        this._zoomRange.add('YARD',16);
        this._portData.add('YTG','data[key]');
        this._portData.add('ZFW','data["YTG"].sub');
        this._districtCN4Weather.add('YTG','烟台');
        this._districtCN4Weather.add('ZFW','芝罘,烟台');
        this._districtCN4Weather.add('XGQ','福山,烟台');
    },
    /*画当前区域下一级的区域或点位*/
    drawNextLevelBlock : function(key,parentId){
        /*
        * @param key ：港口信息树当前节点id
        * @param parentId ：港口信息树当前节点的父节点id
        * */
        console.log("画港口下一级包含内容:"+key);
        $('div#layerbox_item>div.show-list>a').removeClass('active');//清除上一次为a添加的active状态
        var self = this;
        $.ajax({
            url: "./mapJson.json",//json文件位置
            type: "GET",//请求方式为get
            dataType: "json", //返回数据格式为json
            success: function(data) {//请求成功完成后要执行的方法
                //判断是否含有数据以及有下属节点
                if(!data[key]){
                    return;
                }else if(!data[key].sub){//针对港区以下的信息树
                    //self.drawBlockOrMarkerByData(data[key],key,data[key].name,data[key].id,'drawLine');
                    $.each(data[key],function(j,jtem){
                        console.log("针对港区以下的信息树---进来了：");
                        //console.log(jtem);
                        //console.log(data[key]);
                        self.drawBlockOrMarkerByData(jtem,key,jtem.name,jtem.id,'drawLine');
                    });
                }else{
                    $.each(data[key].sub, function(i, item) {
                        //console.log(item);
                        self.drawBlockOrMarkerByData(data[item.id],key,item.name,item.type,'drawPolygon');
                    });
                }

            }
        });
    },
    /*根据数据类型，选择是否加画区域*/
    drawBlockOrMarkerByData : function(data,key,blockName,toolsId,func){
        /*
        * @Param jtem ：遍历的数据
        * @Param key ：港口信息树种港口/区id
        * @Param blockName：区域名称
        * @Param toolsId ：工具条的id
        * @Param func ：选择绘制区域的方式（区域/边界）
        * */
        var self = this;
        if(data.bounds){//判断是否为区域
            //遍历bounds
            self.drawBlock(data,func,blockName);
        }
        if(toolsId){
            //console.log('根据数据类型，选择是否加画区域：'+toolsId);
            $('div#layerbox_item>div.show-list>a#'+toolsId+'').addClass('active');
        }
        emap.work.addMarker(data.id,data.lat,data.lng,data.icon,data.title);

    },
    /*画区域*/
    drawBlock : function(jtem,func,text){
        var pointsArray = new Array();//港区港界数组
        var LatLngBounds = new google.maps.LatLngBounds();//API地图边界

        var portBlock = null;//暂存港区港界（覆盖物或边界）
        var self = this;

        //2018-3-3，判断是否有区域
        if(!jtem.bounds){
            return;
        }

        console.log('画区域');

        $.each(jtem.bounds, function(k, ktem) {
            var temp = new google.maps.LatLng(ktem.lat, ktem.lng);
            pointsArray.push(temp);
            LatLngBounds.extend(temp);
        });
        //得到中心点
        var latLng = LatLngBounds.getCenter();
        //添加区域说明
        var portBlockName = self.addLabelWithFont(latLng.lat(),latLng.lng(),text,14);
        //选择画区域还是画线
        if(func.match('drawPolygon')){
            portBlock = emap.main.drawPolygon(pointsArray);
            //emap.main.pan2Point(latLng.lat(),latLng.lng());
        }else if(func.match('drawLine')){
            portBlock = emap.main.drawLine(pointsArray);
            //emap.main.pan2Point(latLng.lat(),latLng.lng());
        }
        emap.main.pan2Point(latLng.lat(),latLng.lng());
        //赋值
        self._portBlock.push(portBlock);
        self._portBlockName.push(portBlockName);
        //单击显示港区+放大地图
        google.maps.event.addListener(portBlock, 'click', function() {
            console.log("我被点击了");
            console.log(jtem.id);
            //画区域
            self.drawPortBlock(jtem.name,jtem.id);
            //画下一级区域或点位
            self.drawNextLevelBlock(jtem.id);
        });
    },
    /*点击信息树显示单个点位*/
    showSingleMarker : function(id){
        $.ajax({
            url: "./mapJson.json",//json文件位置
            type: "GET",
            dataType: "json",
            success: function(data) {
                //根据id获取对应的数据
                var key = emap.drawEvent.markerDataRel(id);
                console.log('点击信息树显示单个点位:'+key);
                if(!key){//若key无对应数据，直接返回
                    return;
                }
                $.each(data[key].sub, function(i, item) {
                    var res = data[item.id];
                    //console.log('key:'+key);
                    //console.log('id:'+id);
                    //console.log(res.id);
                    if(id.match(res.id)){//判断id是否相等
                        //console.log('点击信息树显示单个点位进来了');
                        $('div#layerbox_item>div.show-list>a').removeClass('active');//移除工具条中的蓝色显示
                        emap.work.addMarker(res.id,res.lat,res.lng,res.icon,res.title);
                        return;
                    }
                });
            }
        });
    },
    /*点位与数据对应关系，后期使用数据库时可删*/
    markerDataRel : function(target){
        var key = null;
        if(target.match('DANGER')){//通过id判断需要哪种数据
            key = 'DANGER';
        }else if(target.match('CAMERA')){
            key = 'CAMERA';
        }else if(target.match('EMERGENCY')){
            key = 'EMERGENCY';
        }else if(target.match('COMPANY')){
            key = 'COMPANY';
        }else if(target.match('BERTH')){
            key = 'BERTH';
        }else if(target.match('WHARF')){
            key = 'WHARF';
        }else if(target.match('STORAGE')){
            key = 'STORAGE';
        }else if(target.match('YARD')){
            key = 'YARD';
        }else if(target.match('STATION')){
            key = 'STATION';
        }else if(target.match('PASSERBY')){
            key = 'PASSERBY';
        }else{
            key = false;
        }
        return key;
    },
    /*开始接收船舶位置*/
    startAcceptShipLoc : function(node){
        var self = this;
        self._shipTimer = window.setInterval(function(){
            //self.shipTrajectory();
            self.shipTrajectory2();
        },1000);
        node.addClass('active');
    },
    /*停止接收船舶位置*/
    stopAcceptShipLoc : function(node){
        var timer = this._shipTimer;
        if(timer){
            window.clearInterval(timer);
        }
        node.removeClass('active');
    },
    /*船舶信息展示*/
    showShipInfo : function(){
        $.ajax({
            url: "./ship.json",
            type: "GET",
            dataType: "json",
            success: function(data) {//请求成功完成后要执行的方法
                var content = '<div><div class="serp-body"><ul>';
                $.each(data['ship'], function(i, item) {
                    console.log('船舶信息展示:'+item.id);
                    i++;
                    content +=  '<li class="poibox">' +
                        '   <div id="'+item.id+'" class="poi-imgbox" data-toggle="modal">' +
                        '       <span onclick="emap.drawEvent.trajectory(this);">历史轨迹</span><br>' +
                        '       <span onclick="emap.work.playVideo(this,\''+item.name+'\')">视频监控</span>' +
                        '   </div>'+
                        '   <div class="poi-info-left">' +
                        '       <h3 class="poi-title">'+
                        '           <span class="poi-name">' + i +'.'+ item.name + '</span>'+
                        '       </h3>'+
                        '       <div class="poi-info">' +
                        '           <p class="poi-addr">'+item.channel+'</p>' +
                        '       </div>'+
                        '   </div>' +
                        '</li>';
                });
                content += '</ul></div></div>';
                $(".map div#shipInfoPanel>div#infoArea").html(content);
            }
        });
    },
    /*船舶点位测试*/
    shipTrajectory : function(flag){//参数flag是否画所有船舶轨迹的总控
        var self = this;
        var shipHash = this._shipHash;
        $.ajax({
            url: "./ship.json",//json文件位置
            type: "GET",
            dataType: "json",
            success: function(data) {
                //获取船舶数据
                $.each(data['ship'], function(i, item) {
//********************数据准备工作，后期有船舶实时位置数据后可删***********************
                    //赋初值
                    if(!self._shipLat[i]){
                        //console.log('赋值'+i);
                        self._shipLat.push(item.lat);
                        self._shipLng.push(item.lng);
                    }
                    //console.log('_shipLat:'+self._shipLat[i]+',_shipLng:'+self._shipLng[i]);
                    //正负随机
                    var flag = 1;
                    /*if(Math.random()-0.5>0){
                        flag = -1;
                    }*/
                    var randx = flag * Math.random()/100;
                    //正负随机
                    /*if(Math.random()-0.5>0){
                        flag = -1;
                    }*/
                    var randy = flag * Math.random()/100;

                    var lat = eval(self._shipLat[i] +'+'+ randx);
                    var lng = eval(self._shipLng[i] +'+'+ randy);
                    //console.log('lat:'+lat+',lng:'+lng);
//***************************************************************************************
                    //1.添加船舶标记
                    emap.work.addMarker(item.id,lat,lng,item.icon,item.title);
                    //2.画线段
                    if(shipHash.getValue(item.id)){//表示已经有轨迹数组
                        //得到iShipArr(其中存储的是item.id对应的历史轨迹数组)
                        var myShipArr = shipHash.getValue(item.id);
                        var newLatLng = new google.maps.LatLng(lat, lng);
                        //画轨迹，只要最新的2点
                        if(self._shipFlag.getValue(item.id)){
                            var start = myShipArr[myShipArr.length-1];
                            var latLng = new Array();
                            latLng.push(start);
                            latLng.push(newLatLng);
                            self.drawASetOfLines(latLng,"#000");
                        }
                        //为myShipArr添加新的位置数据
                        myShipArr.push(newLatLng);
                    }else{//首次
                        //为该船新建一个用于保存LatLng的数组
                        var iShipArr = new Array();
                        var latLng = new google.maps.LatLng(lat, lng);
                        //为该数组添加元素
                        iShipArr.push(latLng);
                        //以该船id为key，保存数组
                        shipHash.add(item.id,iShipArr);
                    }
//**********************后期有船舶实时位置数据后可删****************
                    //4.更新值
                    self._shipLat[i] = lat;
                    self._shipLng[i] = lng;

                    //console.log('shipHash:'+shipHash);
//******************************************************************
                });
            }
        });
    },
    /*画船舶轨迹*/
    drawShipTrajectory : function(id){
        var self = this;
        var shipHash = this._shipHash;
        if(id){
            var iShipArr = shipHash.getValue(id);
            for(var j=0;j<iShipArr.length-1;j++){//遍历单个位置数组
                var latLng = new Array();//暂存位置数组，用于画线段
                latLng.push(iShipArr[j]);
                latLng.push(iShipArr[j+1]);
                self.drawASetOfLines(latLng,"#000");
            }
        }else{//画所有
            var allIShipArr = shipHash.getValues();
            for(var i=0;i<allIShipArr.length;i++){//遍历所有位置数组
                var iShipArr = allIShipArr[i];
                for(var j=0;j<iShipArr.length-1;j++){//遍历单个位置数组
                    var latLng = new Array();//暂存位置数组，用于画线段
                    latLng.push(iShipArr[j]);
                    latLng.push(iShipArr[j+1]);
                    self.drawASetOfLines(latLng,"#000");
                    latLng = new Array();
                }
            }
        }
    },
    /*在地图上画一组带箭头的线*/
    drawASetOfLines : function(LatLngArr,color,title,lineSymbol){
        //1.箭头
        if(!lineSymbol){
            var lineSymbol = {
                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,  //google给定的预定于图标，可以换成自己的图标
                scale:2  //箭头大小比例
            };
        }else{
            var lineSymbol = {
                path: ""//google给定的预定于图标，可以换成自己的图标
            };
        }

        //2.在地图上划线
        var line = new google.maps.Polyline({
            path: LatLngArr,
            strokeColor: color,
            map: emap.main.getMap(),
            icons: [{
                icon: lineSymbol,//给直线添加箭头
                offset: '100%'
            }]
        });
        google.maps.event.addListener(line, 'mouseover', function(event) {
            var marker = new google.maps.Marker({
                position : event.latLng, // 标注点的坐标位置
                icon : "",
                map: emap.main.getMap(),
                draggable : false,
                visible : false
            });
            if(title != ''){
                emap.main.showInfoWin(marker,title);
                emap.main.closeInfoWinDelay(1000);
            }
        });
        return line;
    },
    /*轨迹重现模态框*/
    trajectory : function(which){
        //清空模态框之前选择的日期数据
        $("#trajectory .modal-body div.yyMMDd input").val("");
        //为模态框绑定id
        var id = $(which).parent().attr("id");
        $("#trajectory .btn-primary").attr("id",id);
        //显示模态框
        $("#trajectory").modal('show');

        //this.showSingleTrajectory(which);
    },
    /*控制是否绘制单个船舶的轨迹*/
    showSingleTrajectory : function(id){
        this._shipFlag.add(id,'true');
        this.drawShipTrajectory(id);
    },


    /*船舶信息展示2,只显示当前标记*/
    shipTrajectory2 : function(){
        var self = this;
        var shipHash = this._shipHash;
        $.ajax({
            url: "./ship.json",//json文件位置
            type: "GET",
            dataType: "json",
            success: function(data) {
                //获取船舶数据
                $.each(data['ship'], function(i, item) {
//********************数据准备工作，后期有船舶实时位置数据后可删***********************
                    //赋初值
                    if(!self._shipLat[i]){
                        //console.log('赋值'+i);
                        self._shipLat.push(item.lat);
                        self._shipLng.push(item.lng);
                    }
                    //console.log('_shipLat:'+self._shipLat[i]+',_shipLng:'+self._shipLng[i]);
                    //正负随机
                    var flag = 1;
                    /*if(Math.random()-0.5>0){
                     flag = -1;
                     }*/
                    var randx = flag * Math.random()/100;
                    //正负随机
                    /*if(Math.random()-0.5>0){
                     flag = -1;
                     }*/
                    var randy = flag * Math.random()/100;

                    var lat = eval(self._shipLat[i] +'+'+ randx);
                    var lng = eval(self._shipLng[i] +'+'+ randy);
                    //console.log('lat:'+lat+',lng:'+lng);
//***************************************************************************************
                    //1.添加船舶标记
                    var marker =  emap.work.addMarker(item.id,lat,lng,item.icon,item.title);
                    if(self._shipMarkerHash.getValue(item.id)){
                        self._shipMarkerHash.getValue(item.id).setMap(null);
                    }
                    self._shipMarkerHash.add(item.id,marker);
                    //2.画线段
                    if(shipHash.getValue(item.id)){//表示已经有轨迹数组
                        //得到iShipArr(其中存储的是item.id对应的历史轨迹数组)
                        var myShipArr = shipHash.getValue(item.id);
                        var newLatLng = new google.maps.LatLng(lat, lng);
                        //画轨迹，只要最新的2点
                        if(true){
                            var start = myShipArr[myShipArr.length-1];
                            var latLng = new Array();
                            latLng.push(start);
                            latLng.push(newLatLng);
                            self.drawDottLines(latLng,"#000");
                        }
                        //为myShipArr添加新的位置数据
                        myShipArr.push(newLatLng);
                    }else{//首次
                        //为该船新建一个用于保存LatLng的数组
                        var iShipArr = new Array();
                        var latLng = new google.maps.LatLng(lat, lng);
                        //为该数组添加元素
                        iShipArr.push(latLng);
                        //以该船id为key，保存数组
                        shipHash.add(item.id,iShipArr);
                    }
//**********************后期有船舶实时位置数据后可删****************
                    //4.更新值
                    self._shipLat[i] = lat;
                    self._shipLng[i] = lng;
                    //console.log('shipHash:'+shipHash);
//******************************************************************
                });
            }
        });
    },
    /*在地图上画一组虚线*/
    drawDottLines : function(LatLngArr,color){
        //1.箭头
        var lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 1
        };
        //2.在地图上划线
        var line = new google.maps.Polyline({
            path: LatLngArr,
            strokeColor: color,
            strokeOpacity: 0,
            map: emap.main.getMap(),
            icons: [{
                icon: lineSymbol,//给直线添加箭头
                offset: '0',
                repeat: '20px'
            }]
        });
        return line;
    },
    /*画追踪轨迹*/
    drawPointTrajectory : function(arry,title,defaultColor = "#ff0000",lineSymbol){
        var lineArry = [];
        for(var j=0;j<arry.length-1;j++){//遍历单个位置数组
            var latLng = [];//暂存位置数组，用于画线段
            latLng.push(arry[j]);
            latLng.push(arry[j+1]);
            var line = this.drawASetOfLines(latLng,defaultColor,title,lineSymbol);
            this._pointPath.push(line);
            lineArry.push(line);
        }
        return lineArry;
    },
    /*清除某点位轨迹*/
    clearPointTrajectory : function(){
        var pointPath = this._pointPath;
        if(pointPath){
            for (var i = 0; i < pointPath.length; i++) {
                pointPath[i].setMap(null);
            }
        }
    },

    /**
     * 清除某条点位轨迹
     * @param pointPath
     */
    clearSpecialTrajectory : function(pointPath){
        if(pointPath){
            for (var i = 0; i < pointPath.length; i++) {
                pointPath[i].setMap(null);
            }
        }
    },

    /**********xzyan:20190308***********/
    //绘制辖区
    drawBounds : function(bounds,drawType,labelText){
        var self = this;
        var tempBounds = null;
        //选择画区域还是画线
        if(drawType.match('drawPolygon')){
            tempBounds = emap.main.drawPolygon(bounds,{});
        }else if(drawType.match('drawLine')){
            tempBounds = emap.main.drawLine(bounds);
        }
        self._bounds.push(tempBounds);
        //添加区域说明
        //var portBlockName = emap.drawEvent.addLabelWithFont(latLng.lat(),latLng.lng(),labelText,14);
    },
    //清空辖区
    cleanBoundsInMap : function(){
        var bounds = this._bounds;
        for (var i = 0; i < bounds.length; i++) {
            bounds[i].setMap(null);
        }
        this._bounds = [];
    }
};
emap.drawEvent.initHashTables();