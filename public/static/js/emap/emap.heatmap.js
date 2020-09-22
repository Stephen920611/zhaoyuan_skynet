window.emap = window.emap || {};
emap.heatmap = emap.heatmap || {};
emap.heatmap = {
		_heatmap:null,
		init:function(){
			var self = this;
			if(self._heatmap){
				clearHeatMap();
				self._heatmap = null;
			}
			self._heatmap = new HeatmapOverlay(emap.main.getMap(), 
					{
					    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
					    "radius": 20,
					    "maxOpacity": 10, 
					    // scales the radius based on map zoom
					    "scaleRadius": false, 
					    // if set to false the heatmap uses the global maximum for colorization
					    // if activated: uses the data maximum within the current map boundaries 
					    //   (there will always be a red spot with useLocalExtremas true)
					    "useLocalExtrema": true,
					    // which field name in your data represents the latitude - default "lat"
					    latField: 'lat',
					    // which field name in your data represents the longitude - default "lng"
					    lngField: 'lng',
					    // which field name in your data represents the data value - default "value"
					    valueField: 'count'
					}
				);
		},
		getHeatMap:function(){
			return this._heatmap;
		},
		clearHeatPoints:function(){
			var self = this;
			var heatData = {max: 0,data: []};
			self._heatmap.setData(heatData);
		},
		clusterHeatPoints:function(pointsArray,range){
			var rtnAry = new Array();
			var markerHash = new utility.hashTable();
			$.each(pointsArray, function(i, item) {
				var marker = emap.main.getMarker(item.id, item.lat, item.lng, '', '');
				markerHash.add(item.id, marker);
			});
			return this.clusterHeatPointsInMarkerHash(markerHash,range);
		},
		clusterHeatPointsInMarkerHash:function(markerHash,range){
			var rtnAry = new Array();
			// 当发生缩放级别变化时，进行点位聚合操作
			if (markerHash.getSize() > 0) {
				var resultHash = new utility.hashTable();
				var markers = markerHash.getValues();
				var clusterPoints = new Array();
				if(!range){
					range = 50
				}
				for (var i = 0; i < markers.length; i++) {				
					var thisMarker = markers[i];
					var flag = false;
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
					var $this = this;
					for (var i = 0; i < clusterPoints.length; i++) {		
						var cameras = resultHash.getValue(clusterPoints[i]);
						var heatPoint = {};
						heatPoint.lat = clusterPoints[i].lat();
						heatPoint.lng = clusterPoints[i].lng();
						heatPoint.count = cameras.length;
						rtnAry.push(heatPoint)
					}
				}	
			}
			return rtnAry;
		},
}