google.maps.__gjsload__('drawing_impl', function(_) {
    'use strict';
    var Tea = function(a, b) {
        _.E(b, (0, _.t)(a.unbind, a));
    };
    var O7 = function(a, b) {
        function c(b, c, h, k) {
            var n = _.X("div", a);
            _.ZQ(n, "left");
            n.style.lineHeight = 0;
            c = {
                title: c,
                Of: h,
                th: k,
                padding: [0],
                Yg: !0
            };
            h = _.X("span");
            h.style.display = "inline-block";
            a.style.marginLeft = "70px";
            var p = b || "hand",
                q = Uea[p],
                r = _.qC(d, h, new _.L(0, q), P7);
            r.style.position = "relative";
            var v = new _.pS(n, h, b, c);
            _.G.addListener(v, "active_changed", function() {
                var a = v.get("active") ? Vea[p] : q;
                _.pC(r, P7, new _.L(0, a))
            });
            v.bindTo("value", e, "drawingMode")
        }
        var d = _.Vk("drawing"),
            e = this;
        c(null, "\u505c\u6b62\u7ed8\u56fe", !0, !b.length);
        _.E(b,
            function(a, d) {
                var e = Wea[a];
                e && c(a, e, !1, d == b.length - 1)
            })
    };
    var Q7 = function() {};
    var R7 = function(a, b, c) {
        this.S = a;
        this.T = b;
        this.U = c;
        _.G.bind(this, "click", this, this.Zl);
        _.G.bind(this, "mousemove", this, this.Xd);
        _.G.bind(this, "movestart", this, this.Xl);
        _.G.bind(this, "move", this, this.Yl);
        _.G.bind(this, "moveend", this, this.Wl)
    };
    var S7 = function(a) {
        if (!a.j) {
            var b = {};
            _.Fa(b, a.get("options"));
            null == b.zIndex && (b.zIndex = a.U());
            delete b.map;
            a.j = a.S.O(b)
        }
    };
    var T7 = function(a, b) {
        a.Xd(b);
        var c = a.j;
        c.unbind("map");
        a.j = null;
        a.P = true;
        var parentTimeID=Date.parse(new Date())/1000+''+parseInt(Math.random()*1000);
        //这里是圆和矩形的
        if (a.S.S()=='circle') {
            google.maps.event.addListener(c, "rightclick", function(e){
                $.post('delete.php',{type:'circle',id:parentTimeID},function  (data) {

                });
                c.setMap(null);
            });

            /*$.post('add.php',{type:'circle',parent:parentTimeID,lng:c.getCenter().lng(),lat:reLat(c.getCenter().lat()),radius:c.getRadius(),fillColor:c.fillColor,strokeColor:c.strokeColor,strokeWeight:c.strokeWeight,fillOpacity:c.fillOpacity,strokeOpacity:c.strokeOpacity},function  (data) {

            });*/
        };
        if(a.S.S()=='rectangle'){
            google.maps.event.addListener(c, "rightclick", function  (data) {
                $.post('delete.php',{type:'tangle',id:parentTimeID},function  (data) {

                });
                c.setMap(null);
            });
            var rectangle_data=[];
            /*rectangle_data.push([c.getBounds().j.j,reLat(c.getBounds().O.O),c.fillColor,c.strokeColor,c.strokeWeight,c.fillOpacity,c.strokeOpacity]);
            rectangle_data.push([c.getBounds().j.O,reLat(c.getBounds().O.j),c.fillColor,c.strokeColor,c.strokeWeight,c.fillOpacity,c.strokeOpacity]);*/
            /*$.post('add.php',{type:'tangle',parent:parentTimeID,data:rectangle_data},function  (data) {
                //console.log(data);
            });*/
            rectangle_data=null;
        }

        _.G.trigger(a, "overlaycomplete", {
            type: a.S.S(),
            overlay: c
        });
        _.G.trigger(a, a.S.P(), c);
        a.O = null;
        a.P = 1;
    };
    var U7 = function() {};
    var V7 = function(a) {
        this.O = a;
        this.j = null;
        _.G.bind(this, "click", this, this.P);
    };
    var W7 = function(a) {
        if (!a.j) {
            var b = {};
            _.Fa(b, a.get("options"));
            delete b.map;
            a.j = new _.Kd(b)
        }
    };
    var X7 = function(a, b, c, d) {
        this.P = a;
        this.O = b;
        this.S = c;
        this.T = d + 1E-6;
        this.j = null;
        this.na = new _.L(0, 0);
        this.U = new _.L(0, 0);
        this.$ = new _.L(0, 0);
        _.G.bind(this, "click", this, this.Gl);
        _.G.bind(this, "dblclick", this, this.Tn);
        _.G.bind(this, "mousemove", this, this.Hl);
        _.G.bind(this, "movestart", this, this.Jl);
        _.G.bind(this, "move", this, this.Kl);
        _.G.bind(this, "moveend", this, this.Il)
    };
    var Y7 = function(a, b) {
        a.j.Rc.getPath().push(b);
        a.j.zc.set("anchors", [b])
    };
    var Z7 = function(a, b) {
        var c = $7(a, b);
        c ? (a.P || 2 != c.type || Y7(a, c.Ra), a8(a)) : Y7(a, b)
    };
    var $7 = function(a, b) {
        var c = a.j.Rc.getPath(),
            d = c.getLength();
        if (d) {
            var e = a.get("map"),
                f = e.get("projection"),
                e = e.__gm.get("zoom"),
                e = a.T / (1 << e),
                g = f.fromLatLngToPoint(b, a.na),
                h = b.lng(),
                d = c.getAt(d - 1),
                k = new _.J(d.lat(), _.Ja(d.lng(), h - 180, h + 180), !0),
                k = f.fromLatLngToPoint(k, a.U);
            if (Math.abs(g.x - k.x) <= e && Math.abs(g.y - k.y) <= e) return {
                type: 1,
                Ra: d
            };
            c = c.getAt(0);
            h = new _.J(c.lat(), _.Ja(c.lng(), h - 180, h + 180), !0);
            f = f.fromLatLngToPoint(h, a.$);
            if (Math.abs(g.x - f.x) <= e && Math.abs(g.y - f.y) <= e) return {
                type: 2,
                Ra: c
            }
        }
        return null
    };
    var b8 = function(a) {
        var b = a.get("options"),
            c = new _.I;
        c.setValues(b);
        var d = new _.eN(c, a.P),
            c = {};
        _.Fa(c, b);
        c.strokeColor = d.get("strokeColor");
        c.strokeOpacity = d.get("strokeOpacity");
        c.strokeWeight = d.get("strokeWeight");
        null == c.zIndex && (c.zIndex = a.S());
        delete c.path;
        delete c.map;
        var e = new _.Vd(c);
        e.bindTo("map", a);
        c.strokeOpacity = d.get("ghostStrokeOpacity");
        d = new _.dN;
        d.setValues(c);
        d.set("anchors", []);
        d.bindTo("map", a);
        var f = null;
        a.P && (f = {}, _.Fa(f, b), f.zIndex = c.zIndex, f.paths = new _.wc([e.getPath()]),
            delete f.map, f = new _.Ud(f));
        a.j = {
            Rc: e,
            Kj: f,
            zc: d
        };
        c8(a)
    };
    var a8 = function(a) {
        var b = a.j.Rc;
        b.unbind("map");
        var c = a.j.Kj;
        //这里是线,和多边形
        var tangle_data=[];
        /*for (var i = 0; i < b.getPath().j.length; i++) {
            tangle_data.push([b.getPath().j[i].lng(),reLat(b.getPath().j[i].lat()),b.fillColor,b.strokeColor,b.strokeWeight,b.fillOpacity,b.strokeOpacity]);
        };*/
        if (a.P) {
            //poly
            var parentTimeID=Date.parse(new Date())/1000+''+parseInt(Math.random()*1000);
            google.maps.event.addListener(c, "rightclick", function  (data) {
                $.post('delete.php',{type:'poly',id:parentTimeID},function  (data) {

                });
                c.setMap(null);
            });
            /*$.post('add.php',{type:'poly',parent:parentTimeID,data:tangle_data},function  (data) {

            });*/
        } else{
            //line
            var parentTimeID=Date.parse(new Date())/1000+''+parseInt(Math.random()*1000);
            google.maps.event.addListener(b, "rightclick", function  (data) {
                $.post('delete.php',{type:'line',id:parentTimeID},function  (data) {

                });
                b.setMap(null);
            });
            /*$.post('add.php',{type:'line',parent:parentTimeID,data:tangle_data},function  (data) {

            });*/
        };
        tangle_data=null;
        a.j.zc.unbind("map");
        a.j.zc.set("map", null);
        a.j = null;
        a.set("draggableCursor", a.O);
        if (b.getPath().getLength()) {
            if (a.P) {
                b.set("map", null);
                c.set("map", a.get("map"));
                var d = {
                    type: "polygon",
                    overlay: c
                };
                // console.log(b.getPath().j);
                _.G.trigger(a, "overlaycomplete", d);
                _.G.trigger(a, "polygoncomplete", c);
            } else d = {
                type: "polyline",
                overlay: b
            }, _.G.trigger(a, "overlaycomplete", d), _.G.trigger(a, "polylinecomplete", b);
            c8(a);
        } else b.set("map", null);
    };
    var c8 = function(a) {
        a.set("enablePanning", !!a.j && a.get("drawPolysWithDrag") && !a.get("panWhileDrawing"))
    };
    var d8 = function() {};
    var Xea = function(a, b) {
        var c, d;
        a.lat() < b.lat() ? (c = a.lat(), d = b.lat()) : (c = b.lat(), d = a.lat());
        var e, f;
        180 >= _.jd(a.lng(), b.lng()) ? (f = a.lng(), e = b.lng()) : (f = b.lng(), e = a.lng());
        return _.nd(c, f, d, e)
    };
    var Yea = function() {
        var a = 0;
        return function() {
            return a++
        }
    };
    var e8 = function() {
        var a = "click dblclick movestart move moveend panbynow mousewheel".split(" ");
        _.ok() || a.push("mousemove");
        a = this.O = Zea(this, a);
        this.va = $ea(this);
        var b;
        b = "url(" + _.Wk + "crosshair.cur)";
        _.W.O && (b += " 7 7");
        b = b + ", crosshair";
        var c = Yea();
        this.T = 6 + (_.ok() ? 9 : 0);
        this.P = {
            circle: new R7(new U7, b, c),
            marker: new V7(b),
            polygon: new X7(!0, b, c, this.T),
            polyline: new X7(!1, b, c, this.T),
            rectangle: new R7(new d8, b, c)
        };
        b = afa(this);
        for (var d in this.P) c = this.P[d], c.bindTo("map", this), c.bindTo("panWhileDrawing",
            this), c.bindTo("draggingCursor", a), c.bindTo("draggableCursor", b), c.bindTo("enablePanning", a, "panAtEdge"), c.bindTo("options", this, d + "Options"), _.G.forward(c, "overlaycomplete", this), _.G.forward(c, d + "complete", this);
        this.P.polygon.bindTo("drawPolysWithDrag", this);
        this.P.polyline.bindTo("drawPolysWithDrag", this);
        this.j = null;
        this.ta = [];
        this.S = this.U = null;
        this.oa = 0;
        this.na = this.$ = null
    };
    var Zea = function(a, b) {
        var c = new _.$M(b),
            d = !1;
        _.E(b, function(b) {
            _.G.addListener(c, b, function(c) {
                "click" != b && "dblclick" != b && "mousemove" != b || _.fb(c);
                if ("mousewheel" != b && (!d || "mousemove" != b)) {
                    if ("mousemove" == b || "move" == b) a.$ = b, a.na = c;
                    if (d || !a.get("panWhileDrawing")) "movestart" == b && (d = !0), "moveend" == b && (d = !1), "panbynow" == b ? a.$ && a.na && f8(a, a.$, a.na) : f8(a, b, c)
                }
            })
        });
        return c
    };
    var $ea = function(a) {
        var b = new _.yv(["map", "drawingMode", "pegmanDragging"], "active", function(a, b, e) {
            return !!a && !!b && !e
        });
        b.bindTo("map", a);
        b.bindTo("drawingMode", a);
        a.O.bindTo("active", b);
        return b
    };
    var afa = function(a) {
        var b = new _.yv(["draggableCursor", "panWhileDrawing"], "cursor", function(a, b) {
            return b ? null : a
        });
        b.bindTo("panWhileDrawing", a);
        a.O.bindTo("draggableCursor", b, "cursor");
        return b
    };
    var f8 = function(a, b, c) {
        var d = a.get("map");
        if (a.j) {
            var e = d.__gm.get("projectionController"),
                d = d.__gm.get("panes");
            if (e && d) {
                c.Ja ? (d = c.Ja, e = e.fromContainerPixelToLatLng(d)) : (d = _.zl(c, d.floatPane), e = e.fromDivPixelToLatLng(d));
                var f = a.get("snappingCallback");
                (f = f && f(a.j.dh(e))) && (e = f);
                if ("click" == b) {
                    f = _.xj();
                    if (300 >= f - a.oa && a.S && _.Ka(a.S.x, d.x, a.T) && _.Ka(a.S.y, d.y, a.T)) return;
                    a.S = d;
                    a.oa = f
                }
                _.G.trigger(a.j, b, e, c)
            }
        }
    };
    var g8 = function(a) {
        _.R.call(this);
        var b = new e8;
        b.bindTo("map", a);
        b.bindTo("drawingMode", a);
        b.bindTo("panWhileDrawing", a);
        b.bindTo("markerOptions", a);
        b.bindTo("polygonOptions", a);
        b.bindTo("polylineOptions", a);
        b.bindTo("rectangleOptions", a);
        b.bindTo("circleOptions", a);
        b.bindTo("drawPolysWithDrag", a);
        _.G.forward(b, "overlaycomplete", a);
        _.G.forward(b, "circlecomplete", a);
        _.G.forward(b, "markercomplete", a);
        _.G.forward(b, "polygoncomplete", a);
        _.G.forward(b, "polylinecomplete", a);
        _.G.forward(b, "rectanglecomplete",
            a);
        this.bindTo("map", a);
        this.bindTo("drawingControl", a);
        this.bindTo("drawingControlOptions", a);
        this.bindTo("drawingMode", a);
        this.set("snappingCallback", a.get("snappingCallback"));
        a.bindTo("snappingCallback", this);
        b.bindTo("snappingCallback", this)
    };
    var h8 = function(a) {
        switch (a) {
            case null:
                return null;
            case "Point":
                return "marker";
            case "LineString":
                return "polyline";
            case "Polygon":
                return "polygon";
            default:
                return null
        }
    };
    _.w(O7, _.I);
    var Wea = {
            marker: "\u6dfb\u52a0\u70b9",
            polygon: "\u7ed8\u5236\u591a\u8fb9\u5f62",
            polyline: "\u7ed8\u5236\u7ebf\u6761",
            rectangle: "\u7ed8\u5236\u77e9\u5f62",
            circle: "\u7ed8\u5236\u5706\u5f62"
        },
        P7 = new _.M(32, 32),
        Vea = {
            hand: 288,
            marker: 224,
            polygon: 192,
            polyline: 256,
            rectangle: 96,
            circle: 0
        },
        Uea = {
            hand: 160,
            marker: 352,
            polygon: 128,
            polyline: 64,
            rectangle: 32,
            circle: 320
        };
    _.w(Q7, _.I);
    _.w(R7, Q7);
    _.m = R7.prototype;
    _.m.dh = function(a) {
        S7(this);
        this.Xd(a);
        return {
            latLng: a,
            overlay: this.j
        }
    };
    _.m.active_changed = function() {
        if (this.get("active")) this.set("draggableCursor", this.T), this.set("draggingCursor", "");
        else {
            var a = this.j;
            a && (a.unbind("map"), a.set("map", null), this.j = null);
            this.O = null;
            this.P = !1
        }
    };
    _.m.Xd = function(a) {
        this.j && (this.O ? (this.j.get("map") || this.j.bindTo("map", this), this.S.j(this.j, this.O, a)) : this.S.j(this.j, a))
    };
    _.m.Zl = function(a) {
        this.O ? T7(this, a) : (S7(this), this.O = a, this.Xd(a), this.P = !0)
    };
    _.m.Xl = function(a, b) {
        this.P || (this.set("draggingCursor", this.T), this.set("enablePanning", !0), S7(this), this.O = a, this.Xd(a), _.GC(b))
    };
    _.m.Yl = function(a, b) {
        this.P || (this.Xd(a), _.GC(b))
    };
    _.m.Wl = function(a, b) {
        this.P || (this.set("draggingCursor", ""), this.set("enablePanning", !1), T7(this, a), _.GC(b))
    };
    U7.prototype.O = function(a) {
        return new _.cg(a)
    };
    U7.prototype.j = function(a, b, c) {
        // 这里是圆的数据
        a.set("center", b);
        var d = 0,
            e = a.get("map");
        e && c && (d = e.__gm.get("mapType"), d = _.SA(b, c, d && d.radius));

        a.set("radius", d)
    };
    U7.prototype.S = _.na("circle");
    U7.prototype.P = _.na("circlecomplete");
    _.w(V7, Q7);
    V7.prototype.dh = function(a) {
        W7(this);
        this.j.setPosition(a);
        return {
            latLng: a,
            overlay: this.j
        }
    };
    V7.prototype.active_changed = function() {
        this.get("active") && this.set("draggableCursor", this.O)
    };
    V7.prototype.P = function(a) {
        W7(this);
        // this.j.setPosition(a);
        // this.j.setMap(this.get("map"));
        // var thisLittleMarker=this.j;
        //这是里是标注的
        //  var parentTimeID=Date.parse(new Date())/1000+''+parseInt(Math.random()*1000);
        //  google.maps.event.addListener(thisLittleMarker, "rightclick", function  (data) {
        //     $.post('delete.php',{type:'little_marker',id:parentTimeID},function  (data) {

        //     });
        //     thisLittleMarker.setMap(null);
        // });
        //  thisLittleMarker.setDraggable(true);
        //  google.maps.event.addListener(thisLittleMarker, "dragend", function  (event) {
        //      $.post('save_show.php',{id:parentTimeID,marker_type:'little',lat:event.latLng.lat(),lng:event.latLng.lng()},function  (data) {

        //      });
        //  });

        // $.post('add.php',{type:'little_marker',parent:parentTimeID,lng:a.lng(),lat:reLat(a.lat())},function  (data) {

        // });
        //点击添加后先保存到数据库,成功后再显示图标
       /* $.post('add.php',{lat:reLat(a.lat()),lng:a.lng(),type:'marker'},function  (data) {
            addMarker(a.lat(),a.lng(),1,' ',data);
        });*/

        _.G.trigger(this, "overlaycomplete", {
            type: "marker",
            overlay: this.j
        });
        _.G.trigger(this, "markercomplete", this.j);
        this.j = null
    };
    _.w(X7, Q7);
    _.m = X7.prototype;
    _.m.dh = function(a) {
        this.j && this.j.Rc || b8(this);
        return {
            latLng: a,
            overlay: this.j.Kj || this.j.Rc
        }
    };
    _.m.active_changed = function() {
        this.get("active") ? this.set("draggableCursor", this.O) : this.j && this.j.Rc && a8(this)
    };
    _.m.Gl = function(a) {
        this.j ? Z7(this, a) : (b8(this), Y7(this, a))
    };
    _.m.Tn = function() {
        this.j && 1 < this.j.Rc.getPath().getLength() && a8(this)
    };
    _.m.Hl = function(a) {
        var b = a;
        this.j && (a = $7(this, a), this.set("draggableCursor", a ? "pointer" : this.O), a && (b = a.Ra), this.j.zc.set("freeVertexPosition", b))
    };
    _.m.Jl = function(a, b) {
        this.get("drawPolysWithDrag") && (this.j || b8(this), this.j.Rc.getPath().getLength() || Y7(this, a), this.set("draggingCursor", this.O), _.GC(b))
    };
    _.m.Kl = function(a, b) {
        this.j && this.get("drawPolysWithDrag") && (this.j.zc.set("freeVertexPosition", a), _.GC(b))
    };
    _.m.Il = function(a, b) {
        this.get("drawPolysWithDrag") && (this.j && (Z7(this, a), this.set("draggingCursor", "")), this.j && this.j.zc.set("freeVertexPosition", null), _.GC(b))
    };
    _.m.drawPolysWithDrag_changed = X7.prototype.panWhileDrawing_changed = function() {
        c8(this)
    };
    d8.prototype.O = function(a) {
        return new _.dg(a)
    };
    d8.prototype.j = function(a, b, c) {
        a.set("bounds", Xea(b, c || b))
    };
    d8.prototype.S = _.na("rectangle");
    d8.prototype.P = _.na("rectanglecomplete");
    _.w(e8, _.I);
    e8.prototype.map_changed = function() {
        var a = this.get("map"),
            b = this.va,
            c = this.O;
        if (a) {
            var d = a.__gm;
            this.bindTo("mouseEventTarget", d);
            b.bindTo("pegmanDragging", d);
            c.bindTo("draggable", a);
            c.bindTo("scrollwheel", a);
            this.U = _.G.forward(c, "panbynow", d)
        } else this.unbind("mouseEventTarget"), this.set("mouseEventTarget", null), b.unbind("pegmanDragging"), c.unbind("draggable"), c.unbind("scrollwheel"), this.U && (_.G.removeListener(this.U), this.U = null)
    };
    e8.prototype.mouseEventTarget_changed = function() {
        var a = ["offset", "panes", "projectionTopLeft", "size"];
        Tea(this.O, a);
        var b = this.ta;
        _.E(b, _.G.removeListener);
        b.length = 0;
        var c = this.get("mouseEventTarget");
        if (c) {
            var d = this.O,
                e = this.get("map");
            _.eD(d, a, e.__gm);
            _.E(["movestart", "move", "moveend"], function(a) {
                var e = _.G.addListener(d, a, function(b) {
                    _.Ql(b) || _.G.trigger(c, a, b)
                });
                b.push(e)
            });
            _.G.forward(d, "mousewheel", c)
        }
    };
    e8.prototype.drawingMode_changed = function() {
        this.j && this.j.set("active", !1);
        this.O.set("panAtEdge", !1);
        var a = this.get("drawingMode");
        (this.j = this.P[a]) && this.j.set("active", !0)
    };
    _.w(g8, _.R);
    g8.prototype.map_changed = function() {
        var a = this.get("map");
        a ? (a = a.__gm, this.bindTo("layoutManager", a), a.set("snappingCallback", this.get("snappingCallback")), this.bindTo("snappingCallback", a)) : (this.unbind("layoutManager"), this.set("layoutManager", null), this.unbind("snappingCallback"))
    };
    g8.prototype.layoutManager_changed = g8.prototype.drawingControl_changed = g8.prototype.drawingControlOptions_changed = function() {
        this.Ba()
    };
    g8.prototype.Ia = function() {
        this.j && (this.P.O(this.j), _.Vf(this.j), this.j = null, this.O.unbindAll(), this.O = null);
        if ((this.P = this.get("layoutManager")) && 0 != this.get("drawingControl")) {
            var a = this.get("drawingControlOptions") || {},
                b = a.drawingModes || bfa,
                c = window.document.createElement("div");
            _.NC(c);
            c.style.margin = _.T(5);
            _.Jk(c, 10);
            this.j = c;
            this.O = new O7(this.j, b);
            this.O.bindTo("drawingMode", this);
            this.P.j(this.j, a.position || 1, !1, .25)
        }
    };
    var bfa = ["marker", "polyline", "rectangle", "circle", "polygon"];
    _.nc("drawing_impl", {
        Mk: g8,
        bo: function(a) {
            var b = new _.I,
                c = new _.yv(["dataDrawingMode"], "drawingManagerMode", h8);
            c.bindTo("dataDrawingMode", a, "drawingMode");
            var d = new _.yv(["styleOrStylingFunction"], "style", function(a) {
                return "function" === typeof a ? a(new _.pc) : a
            });
            d.bindTo("styleOrStylingFunction", a, "style");
            var e = new _.yv(["controls", "controlPosition"], "drawingControlOptions", function(a, b) {
                return {
                    drawingModes: _.Na(a, h8),
                    position: b
                }
            });
            e.bindTo("controls", a);
            e.bindTo("controlPosition", a);
            var f = new _.yv(["controls"],
                "drawingControl",
                function(a) {
                    return !!a
                });
            f.bindTo("controls", a);
            b.bindTo("map", a);
            b.bindTo("drawingMode", c, "drawingManagerMode");
            b.bindTo("markerOptions", d, "style");
            b.bindTo("polylineOptions", d, "style");
            b.bindTo("polygonOptions", d, "style");
            b.bindTo("drawingControlOptions", e);
            b.bindTo("drawingControl", f);
            _.G.addListener(b, "overlaycomplete", function(b) {
                b = b.overlay;
                var c = _.aD([b]),
                    d = a.get("featureFactory"),
                    c = d ? d(c) : new _.pc({
                        geometry: c
                    });
                a.add(c);
                b.set("map", null);
            });
            new g8(b);
            _.jD(a, function() {
                var b =
                    a.get("map");
                b && _.Y(b, "Le")
            })
        }
    });
});
