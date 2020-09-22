/**
 * Created by 9527 on 2018/1/31.
 */
window.emap = window.emap || {};
emap.util = emap.util || {};
emap.util = {
    _earthRadius: 6378137.0,//单位M
    // 数学计算两点距离
    getTwoPointDistance:function (radLat1,radLat2,a,b) {
        var self = this;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
                + Math.cos(radLat1) * Math.cos(radLat2)
                * Math.pow(Math.sin(b / 2), 2)));
        s = s * self._earthRadius;
        s = (Math.round(s * 10000) / 10000.0).toFixed(2);
        return s;
    },
    //获取地球 2个经纬度之间的距离
    getDistance: function (point1, point2) {
        var self = this;
        var radLat1 = self.getRadius(point1.lat());
        var radLat2 = self.getRadius(point2.lat());
        var a = radLat1 - radLat2;
        var b = self.getRadius(point1.lng()) - self.getRadius(point2.lng());
        var s = self.getTwoPointDistance(radLat1,radLat2,a,b);
        return s;
    },
    getPointDistance: function (point1, point2) {
        var self = this;
        var lat1 = point1.lat;
        var lng1 = point1.lng;
        var lat2 = point2.lat;
        var lng2 = point2.lng;

        var radLat1 = self.getRadius(lat1);
        var radLat2 = self.getRadius(lat2);
        var a = radLat1 - radLat2;
        var b = self.getRadius(lng1) - self.getRadius(lng2);
        var s = self.getTwoPointDistance(radLat1,radLat2,a,b);
        return s;
    },
    testDistance: function () {
        var self = this;
        var point = ["37.463353075103946,121.44904680296969","37.4631210095353,121.4501442063719","37.463357929552,121.44636306863727","37.46282090459265,121.45014416147424"];
        var lat1 = point[0].split(",")[0];
        var lng1 = point[0].split(",")[1];
        var lat2 = point[3].split(",")[0];
        var lng2 = point[3].split(",")[1];

        var radLat1 = self.getRadius(lat1);
        var radLat2 = self.getRadius(lat2);
        var a = radLat1 - radLat2;
        var b = self.getRadius(lng1) - self.getRadius(lng2);
        var s = self.getTwoPointDistance(radLat1,radLat2,a,b);
        return s;
    },
    //求弧度
    getRadius: function (d) {
        var PI = Math.PI;//π
        return d * PI / 180.0;
    },
    getPixelPoint: function (lat, lng) {
        var latLng = new google.maps.LatLng(lat, lng);

        var overlay = new google.maps.OverlayView();
        overlay.draw = function () {
        };
        overlay.setMap(emap.main.getMap());
        var point = overlay.getProjection().fromLatLngToContainerPixel(latLng);

        return point;
    },
    getLatLngFromPoint: function (point) {
        var overlay = new google.maps.OverlayView();
        overlay.draw = function () {
        };
        overlay.setMap(emap.main.getMap());
        var latLng = overlay.getProjection().fromContainerPixelToLatLng(point);

        return latLng;
    },
    // 射向法判断点是否在多边形内部
    isPointInPolygon: function (latLngPoints, markerPoint) { //latLngPoints：多边形顶点数组，markerPoint：需要比较的点
        /*latLngPoints 多边形顶点 */
        /*latLngPoint  单个顶点*/
//		var latLngPoints = [];
        var latLngPoint;

//		if (polygonPath) {
//			for (var i = 0; i < polygonPath.length; i++) {
//				latLngPoints.push(polygonPath.getAt(i));
//			}
//		}

        if (null != markerPoint) {
            var point = markerPoint.getPosition();
            latLngPoint = point;
        }

        if (null == latLngPoints || latLngPoints.length == 0 || null == latLngPoint) {
            return -1;
        }
        var counter = 0;
        var i;
        var xinters;
        var p1 = null;
        var p2 = null;
        var isPointOnLineFlag = false;
        p1 = latLngPoints[0];

        for (i = 1; i <= latLngPoints.length; i++) { //p2 = latLngPoints + (i % nCount);
            p2 = latLngPoints[i % latLngPoints.length];
            if (emap.util.isPointOnLine(p1, p2, latLngPoint)) {
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
            //$("#relation").html("<b style='color:blue'>点在边上</b>");
            return true;
        }
        if (counter % 2 == 0) {
            //$("#relation").html("<b style='color:red'>点在多边形外</b>");
            return false;
        } else {
            //$("#relation").html("<b style='color:green'>点在多边形内</b>")
            return true;
        }
    },
    /*
     * 参数
     * p1、p2：线段的两个端点
     * p：	被判断点
     * 返回值：	false：点在不在线段上；true：点在线段上
     */
    isPointOnLine: function (p1, p2, p) {
        var self = this;
        var x1, y1, x2, y2;
        x1 = p.lat() - p1.lat();
        x2 = p2.lat() - p1.lat();
        y1 = p.lng() - p1.lng();
        y2 = p2.lng() - p1.lng();
        if (self.FC(x1 * y2 - x2 * y1, 0) == 0) {
            return false;
        }
        if ((Math.min(p1.lat(), p2.lat()) <= p.lat() && p.lat() <= Math.max(p1.lat(), p2.lat())) && (Math.min(p1.lng(), p2.lng()) <= p.lng() && p.lng() <= Math.max(p1.lng(), p2.lng()))) {
            return true;
        } else {
            return false;
        }
    },

    FC: function (x1, x2) {
        if (x1 - x2 < 0.000002 && x1 - x2 > -0.000002) {
            return 1;
        } else {
            return 0;
        }
    },
    // 圆形面积
    circleAreaMeters:function (radius) {
        console.log("所选圆形区域面积为：",Math.PI*radius*radius+"平方米");
        return Math.PI*radius*radius;
    },
    // 矩形面积
    rectAreaMeters:function (bounds) {
        var self = this;
        var point1 = bounds.getNorthEast();
        var point2 = bounds.getSouthWest();
        var radLat1 = self.getRadius(point1.lat());
        var radLat2 = self.getRadius(point2.lat());
        var a = radLat1 - radLat2;
        var b = self.getRadius(point1.lng()) - self.getRadius(point2.lng());
        var s = self.getTwoPointDistance(radLat1,radLat2,0,b);
        var t = self.getTwoPointDistance(radLat1,radLat2,a,0);
        console.log("所选矩形区域面积为：",s*t+"平方米");
        return s*t;
    },
    //多边形面积
    polygonAreaMeters: function (points) {
        var self = this;
        var pointArr = [];
        for (var i = 0; i < points.length; i++) {
            var lng = points[i].lng();
            var lat = points[i].lat();
            var point = new Array();
            point.push(Number(lng), Number(lat));
            pointArr.push(point);
        }
        if (pointArr.length > 2) {
            var a = 0;
            var metersPerDegree = 2.0 * Math.PI * self._earthRadius / 360.0;
            for (var i = 0; i < pointArr.length; ++i) {
                var j = (i + 1) % pointArr.length;
                var xi = pointArr[i][0] * metersPerDegree * Math.cos(pointArr[i][1] * (Math.PI / 180.0));
                var yi = pointArr[i][1] * metersPerDegree;
                var xj = pointArr[j][0] * metersPerDegree * Math.cos(pointArr[j][1] * (Math.PI / 180.0));
                var yj = pointArr[j][1] * metersPerDegree;
                a += xi * yj - xj * yi;
            }
            console.log("所选多边形区域面积为：",Math.abs(a/2)+"平方米");
            return Math.abs(a / 2);
        }
    },
}