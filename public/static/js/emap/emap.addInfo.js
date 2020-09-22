/**
 * Created by 9527 on 2018/2/9.
 * 负责实现业务中的通过工具框录入各项基础数据信息的功能
 */
window.emap = window.emap || {};
emap.addInfo = emap.addInfo || {};

emap.addInfo = {
    //_districtCN : new utility.hashTable(),//行政区中英对应哈希表
    _districtCN : new ext.utility.hashTable(),//行政区中英对应哈希表
    /*动态生成港口树*/
    createPortTree: function(){
        //console.log('动态生成港口树');
        var self = this;
        $.ajax({
            url: "./tree.json",//json文件位置
            type: "GET",
            dataType: "json",
            success: function (data) {
                var treeData = data.tree;   //待生成tree的数据
                var tree = self.treeIteration(treeData);
                //console.log(data.tree);
                self.showTreeView(tree);
            }
        });
    },
    /*树迭代*/
    treeIteration : function(data){
        var self = this;
        var node = '[';
        for(var i=0;i<data.length;i++){
            node += '{' +
                '"text":"'+ data[i].text +'",'+
                '"href":"'+ data[i].href +'"';
            if(data[i].nodes){//说明有子节点
                node += ',"tags":["'+data[i].nodes.length+'"]';
                //迭代
                node += ',"nodes":' + self.treeIteration(data[i].nodes);
            }else{//没有子节点=>tag=0
                node += ',"tags":["0"]';
            }
            //判断nodes是否结束
            if(i==data.length-1){
                node += "}]";
            }else{
                node += "},";
            }
        }
        return node;
    },
    /*展示树*/
    showTreeView : function(tree){
        $('#treeview').treeview({
            data: tree,
            showTags: true
        }).on('nodeSelected', function(event, node) {
            console.log('树被选择：'+node.text);
            var parentNode = $('#treeview').treeview('getParent', node);
            //console.log('树被选择(父节点)：'+parentNode.href);
            //画当前区域
            emap.drawEvent.drawPortBlock(node.text,node.href);
            //画当前区域下一级的区域或点位
            emap.drawEvent.drawNextLevelBlock(node.href,parentNode.href);
            //显示单个点位
            emap.drawEvent.showSingleMarker(node.href);
            //test
            //console.log(node.nodeId);
        });
    },

    /*通过工具录入信息*/
    addInfoByTool : function(portId){
        var portNameCN = null;  //区域中文名
        if(portId){
            portNameCN = this._districtCN.getValue(portId);
        }
        if(portNameCN){
            $("div.map div#details h4.modal-title").html('录入'+portNameCN+'堆场信息');
        }else{
            $("div.map div#details h4.modal-title").html('录入堆场信息');
        }
        //录入堆场信息
        var content =   '<form class="form-horizontal">'+
            '<div class="form-group">'+
            '<label class="col-sm-3 control-label">港口经营人</label>'+
            '<div class="col-sm-9">'+
            '<input type="text" name="company" class="form-control" placeholder="港口经营人">'+
            '</div>'+
            '</div>'+
            '<div class="form-group">'+
            '<label class="col-sm-3 control-label">堆场名称</label>'+
            '<div class="col-sm-9">'+
            '<input type="text" name="yardName" class="form-control" placeholder="堆场名称">'+
            '</div>'+
            '</div>'+
            '<div class="form-group">'+
            '<label class="col-sm-3 control-label">港区名称</label>'+
            '<div class="col-sm-9">'+
            '<input type="text" name="block" class="form-control" placeholder="港区名称">'+
            '</div>'+
            '</div>'+
            '<div class="form-group">'+
            '<label class="col-sm-3 control-label">总面积（平方米）</label>'+
            '<div class="col-sm-9">'+
            '<input type="text" name="area" class="form-control" placeholder="总面积（平方米）">'+
            '</div>'+
            '</div>'+
            '<div class="form-group">'+
            '<label class="col-sm-3 control-label">放置货物类别</label>'+
            '<div class="col-sm-9">'+
            '<input type="text" name="goodsType" class="form-control" placeholder="类别">'+
            '</div>'+
            '</div>'+
            '</form>';
        $("div.map div#details div.modal-body").html(content);
        //显示信息录入框
        $("div.map div#details").modal('show');
        //在弹出框中进行信息录入
        /*$("div.map div#details").on('shown.bs.modal',function(){
         console.log('录入');

         });*/
    },
    /*初始化*/
    initHashTables : function() {
        this._districtCN.add('YTG','烟台港');
        this._districtCN.add('ZFW','芝罘湾港区');
        this._districtCN.add('XGQ','烟台西港区');
        this._districtCN.add('LZG','莱州港区');
        this._districtCN.add('LKG','龙口港区');
        this._districtCN.add('LJK','栾家口港区');
        this._districtCN.add('PLX','蓬莱西港区');
        this._districtCN.add('CDG','长岛港区');
        this._districtCN.add('PLD','蓬莱东港区');
        this._districtCN.add('MPG','牟平港区');
        this._districtCN.add('HYG','海洋港区');
    }
};
emap.addInfo.initHashTables();