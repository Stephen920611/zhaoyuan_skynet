$(document).ready(function(){
	$(".btn1").click(function(){
		$("#btn_1").toggle();
	});
	$(".btn2").click(function(){
		$("#btn_2").toggle();
	});
	$(".btn3").click(function(){
		$("#btn_3").toggle();
	});
	$(".add_marker").click(function(){
		var lat=$('#lat').val();
		var lng=$('#lng').val();
		
                //$.post('add.php',{lat:lat,lng:lng,type:'marker'},function  (data) {
                   addMarker(lat,lng,1,' ',null);
                //});
				
	});
	$(".btn4").click(function(){
		$("#btn_4").toggle();
	});	
	$(".btn5").click(function(){
		$("#btn_5").toggle();
	});	
	$(".btn6").click(function(){
		$("#btn_6").toggle();
	});
	$("#con_edi").click(function(){
		$(".manager_add").hide();
		$(".manager_del").hide();
		$(".manager_info").hide();
		$(".manager_edi").fadeIn();
	});
	$("#con_add").click(function(){
		$(".manager_edi").hide();
		$(".manager_del").hide();
		$(".manager_info").hide();
		$(".manager_add").fadeIn();
	});	
	$("#con_del").click(function(){
		$(".manager_add").hide();
		$(".manager_edi").hide();
		$(".manager_info").hide();
		$(".manager_del").fadeIn();
		$.ajax({
			type:'post',
			url:'save_show.php',
			data:{us_list:"us_list"},
			dataType:'text',
			success:function(data){
				document.getElementById("show_user").innerHTML=data;
			}
		});
	});
	$("#del_user").click(function(){
		userlist=$("input[name='Fruit[]']:checked");
		var id=[];
		for (var i = 0; i < userlist.length; i++) {
			id.push($(userlist[i]).val());
		};
		id=id.join(',');
		$.ajax({
			type:'post',
			url:'save_show.php',
			data:{
				list_id:id
			},
			dataType:'text',
			success:function(data){
				if(data>0){
					layer.msg("已成功删除"+data+"个账号");
					userlist.parent().hide('slow');
				}
			}
		});
	});
	$("#cli_cen").click(function(){
		if($("#core_con").val()==""){
			return false;
		}else{
				$.ajax({
				type:'post',
				url:'save_show.php',
				data:{core_con:$("#core_con").val()},
				success:function(data){
					var a=$("#core_con").val();
					var strs= new Array();
					strs=a.split(",");
					// for (i=0;i<strs.length ;i++ ){}
					var v=(strs[1]+','+strs[0]);
					latlng = new google.maps.LatLng(strs[1],strs[0]);
					map.setCenter(latlng);
					document.getElementById("show_core").innerHTML=$("#core_con").val();
					layer.msg(data);
				}
			});
		}
	});
	$(".view").mouseover(function(){
		$(".view").css({"backgroundColor":"#1759CB"});
	});
	$(".view").mouseout(function(){
		$(".view").css({"backgroundColor":"#0D7CF2"});
	});
});

//检测用户输入 的经度和纬度是否正确
function core (number,obj,big) {
	if (number=='') {
		layer.tips('输入不正确',obj);
		return false;
	};
	var isNumber=Math.abs(number);
	if (isNaN(isNumber)||isNumber>big) {
		layer.tips('输入不正确',obj);
		return false;
	};
	return true;
}

function rank(e){
	$.ajax({
		type:'post',
		url:'save_show.php',
		data:{e:e},
		datatype:'text',
	});
	var rank=parseInt($("#rank").val());
	map.setZoom(rank);
}
function title_info(){
	var info_t = {
		title:$("#tit").val(),
	};
	$.ajax({
		type:'post',
		url:'save_show.php',
		data:info_t,
		dataType:'text',
	});
}
function add_user(){
	if($("#add_u").val()==""||$("#add_p").val()==""){
		layer.msg("用户名或密码不能为空！");
		return;
	}
	$.ajax({
		type:'post',
		url:'save_show.php',
		data:{username:$("#add_u").val(),password:$("#add_p").val()},
		success:function(data){
			layer.msg(data);
		}
	});
}
function edit_draw(){
	var draw_color=$("#draw_color").val();
	var fill_color=$("#fill_color").val();
	var draw_height=$("#draw_height").val();
	var draw_hyaline=$("#draw_hyaline").val();
	var draw_hyacon=$("#draw_hyacon").val();
	style.strokeColor=draw_color;
	style.fillColor=fill_color;
	style.strokeWeight=draw_height;
	style.strokeOpacity=draw_hyaline;
	style.fillOpacity=draw_hyacon;
	layer.msg("修改成功");
}
function del_all(e){
	if(e=='point'){a="点标记"}
	if(e=='circle'){a="圆"}
	if(e=='polygon'){a="多边形"}
	if(e=='line'){a="画线"}
	if(e=='rectangle'){a="矩形"}
	layer.confirm('您确定要清除所有"'+a+'"吗？此操<br>作无法撤销！',{
		icon: 0,
		yes:function(){
			layer.close();
				$.ajax({
					type:'post',
					url:'save_show.php',
					data:{del_all:e},
					dataType:'text',
					success:function(data){
						layer.msg(data+"，请刷新页面！");
					}
				});
		}
	})
}