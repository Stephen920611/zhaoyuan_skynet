/**
 * 全局注册哈希表
 */

export default {
    //哈希表定义
    hashTable : function() {
        var size = 0;
        var entry = new Object();
        this.add = function (key , value) {
            if(!this.containsKey(key)) {
                size ++ ;
            }
            entry[key] = value;
        };
        this.getValue = function (key) {
            return this.containsKey(key) ? entry[key] : null;
        };
        this.remove = function (key) {
            if( this.containsKey(key) && (delete entry[key])) {
                size --;
            }
        };
        this.containsKey = function(key) {
            return (key in entry);
        };
        this.containsValue = function(value) {
            for(var prop in entry) {
                if(entry[prop] == value) {
                    return true;
                }
            }
            return false;
        };
        this.getValues = function () {
            var values = new Array();
            for(var prop in entry) {
                values.push(entry[prop]);
            }
            return values;
        };
        this.getKeys = function () {
            var keys = new Array();
            for(var prop in entry) {
                keys.push(prop);
            }
            return keys;
        };
        this.getSize = function () {
            return size;
        };
        this.clear = function () {
            size = 0;
            entry = new Object();
        };
        this.getobject= function (){
            return entry;
        };
        this.getKeyByValue = function(value) {//根据value得到key
            for(var prop in entry) {
                for(var i=0;i<entry[prop].length;i++){
                    if(entry[prop][i] == value){
                        return prop;
                        break;
                    }
                }
            }
            return null;
        };
    },
	getBrowserInfo: function browserInfo(){
            var rMsie = /(msie\s|trident\/7)([\w.]+)/;
            var rTrident = /(trident)\/([\w.]+)/;
            var rFirefox = /(firefox)\/([\w.]+)/;
            var rOpera = /(opera).+version\/([\w.]+)/;
            var rNewOpera = /(opr)\/(.+)/;
            var rEdge = /(edge)\/([\w.]+)/;
            var rChrome = /(chrome)\/([\w.]+)/;
            var rSafari = /version\/([\w.]+).*(safari)/;
            var ua = navigator.userAgent.toLowerCase();
            var matchBS, matchBS2;
            matchBS = rMsie.exec(ua);
            if (matchBS != null) {
                matchBS2 = rTrident.exec(ua);
                if (matchBS2 != null) {
                    switch (matchBS2[2]) {
                        case "4.0":
                            return {
                                browser:
                                        "IE",
                                version: "8"
                            };
                        case "5.0":
                            return {
                                browser:
                                        "IE",
                                version: "9"
                            };
                        case "6.0":
                            return {
                                browser:
                                        "IE",
                                version: "10"
                            };
                        case "7.0":
                            return {
                                browser:
                                        "IE",
                                version: "11"
                            };
                        default:
                            return {
                                browser:
                                        "IE",
                                version: "Undefined"
                            };
                    }
                } else {
                    return {
                        browser: "IE",
                        version: matchBS[2] || "0"
                    };
                }
            }
            matchBS = rEdge.exec(ua);
            if ((matchBS != null)) {
                return {
                    browser: matchBS[1] || "",
                    version: matchBS[2] || "0"
                };
            }
            matchBS = rFirefox.exec(ua);
            if ((matchBS != null) && (!(window.attachEvent)) && (!(window.chrome)) && (!(window.opera))) {
                return {
                    browser: matchBS[1] || "",
                    version: matchBS[2] || "0"
                };
            }
            matchBS = rOpera.exec(ua);
            if ((matchBS != null) && (!(window.attachEvent))) {
                return {
                    browser: matchBS[1] || "",
                    version: matchBS[2] || "0"
                };
            }
            matchBS = rChrome.exec(ua);
            if ((matchBS != null) && ( !! (window.chrome)) && (!(window.attachEvent))) {
                matchBS2 = rNewOpera.exec(ua);
                if (matchBS2 == null) {
                    return {
                        browser: matchBS[1] || "",
                        version: matchBS[2] || "0"
                    };
                } else {
                    return {
                        browser: "Opera",
                        version: matchBS2[2] || "0"
                    };
                }
            }
            matchBS = rSafari.exec(ua);
            if ((matchBS != null) && (!(window.attachEvent)) && (!(window.chrome)) && (!(window.opera))) {
                return {
                    browser: matchBS[2] || "",
                    version: matchBS[1] || "0"
                };
            }
        },
		getBrowserInfoForVideo: function(){//获取浏览器版本给视频使用，如果是ie返回0，如果是其他浏览器返回1
			var info=this.getBrowserInfo();
			if(info.browser=='IE'||info.browser==''){
				return 0;
			}else{
				return 1;
			}
		}

};
