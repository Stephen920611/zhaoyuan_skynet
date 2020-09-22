/**
 * Created by 9527 on 2018/2/8.
 * 负责实现业务中的天气查询、显示功能
 */
window.emap = window.emap || {};
emap.weather = emap.weather || {};

emap.weather = {
    _weather : null,//天气数据缓存
    /*获取天气信息*/
    getTodayWeather : function(location){
        $.ajax({
            //url: "https://free-api.heweather.com/s6/weather/forecast",//和风天气
            url: "./weather.json",
            type: "GET",
            data: {
                "location" : location,
                "key" : "51bd63e2b4bd489289785a8af9d5bd69"//和风天气要求传输的key
            },
            dataType: "json",
            success: function(data) {
                emap.weather._weather = data;
                //console.log('今日天气:'+emap.weather._weather);
                //更改城市信息
                $("div#citybox>div.city-title>b").html(location.split(",")[0]);
                //获取天气数据
                $.each(data['HeWeather6'],function(i,item){
                    var res = item['daily_forecast'][0];
                    //天气
                    var weather = res['cond_txt_d'];
                    //最低温/最高温
                    var tmp = res['tmp_min'] +'/'+ res['tmp_max'] +'℃';
                    $("div#citybox span#weather").html(weather);
                    $("div#citybox span#temperature").html(tmp);
                });
            }
        });
    },
    //天气预报
    weatherForecast : function(location){
        $.ajax({
            //url: "https://free-api.heweather.com/s6/weather/forecast",//和风天气
            url: "./weather.json",
            type: "GET",
            data: {
                "location" : location,
                "key" : "51bd63e2b4bd489289785a8af9d5bd69"//和风天气要求传输的key
            },
            dataType: "json",
            success: function(data) {
                emap.weather._weather = data;
                //获取天气数据
                $.each(data['HeWeather6'],function(i,item){
                    var content = '<div class="weather"><ul class="t">';
                    $.each(item['daily_forecast'],function(j,jtem){
                        //风速km/h转换为m/s
                        var windsp = Math.round(jtem['wind_spd']/3.6);
                        content +=
                            '       <li class="sky">' +
                            '           <h1>'+jtem.date+'</h1>'+
                            '           <p class="wea">白天'+jtem['cond_txt_d']+'</p>'+
                            '           <p><img src="../../static/img/weatherIcon/'+jtem['cond_code_d']+'.png"></p>'+
                            '           <p class="wea">夜间'+jtem['cond_txt_n']+'</p>'+
                            '           <p><img src="../../static/img/weatherIcon/'+jtem['cond_code_n']+'.png"></p>'+
                            '           <p class="tem">' +
                            '               <span>'+jtem['tmp_min']+'</span>/'+
                            '               <span>'+jtem['tmp_max']+'℃</span>'+
                            '           </p>'+
                            '           <p class="win">' +
                            '               <em>'+jtem['wind_dir']+jtem['wind_sc']+'级</em>'+
                            '               <i>风速'+windsp+'米/秒</i>'+
                            '           </p>'+
                            '       </li>'
                    });
                    content += '</ul></div>';
                    $("div#weatherBox div.modal-body").html(content);
                });
            }
        });
    }

};