google.maps.__gjsload__('poly', function(_) {
    'use strict';
    var v1 = function(a) {
        for (a = a.toString(16); 2 > a.length;) a = "0" + a;
        return a
    };
    var lca = function(a) {
        var b = new _.$M(["mousemove", "mouseup", "mousewheel"]);
        _.eD(b, ["offset", "panes", "projectionTopLeft", "size"], a);
        return b
    };
    var w1 = function(a, b, c) {
        var d = a.path;
        a = a.j;
        for (var e = [], f = a ? [] : null, g = d[0] == d[d.length - 2] && d[1] == d[d.length - 1], h = 0, k = d.length - 2; h < k; h += 2) {
            var n = d[h],
                p = d[h + 1],
                q = d[h + 2],
                r = d[h + 3],
                v, x;
            a && (v = a[h / 2], x = a[h / 2 + 1]);
            var y, A;
            switch (b) {
                case 0:
                    y = n >= c;
                    A = q >= c;
                    break;
                case 1:
                    y = n <= c;
                    A = q <= c;
                    break;
                case 2:
                    y = p >= c;
                    A = r >= c;
                    break;
                case 3:
                    y = p <= c, A = r <= c
            }!h && y && (e.push(n, p), a && f.push(v));
            if (y != A) {
                var D;
                switch (b) {
                    case 0:
                    case 1:
                        D = (c - n) / (q - n);
                        e.push(c, p + D * (r - p));
                        break;
                    case 2:
                    case 3:
                        D = (c - p) / (r - p), e.push(n + D * (q - n), c)
                }
                a && f.push(v + D * (x -
                    v))
            }
            A && (e.push(q, r), a && f.push(x))
        }
        g && e.length && (e[0] != e[e.length - 2] || e[1] != e[e.length - 1]) && (e.push(e[0], e[1]), a && f.push(a[a.length - 1]));
        return {
            path: e,
            j: f
        }
    };
    var x1 = function(a) {
        var b = lca(a);
        _.G.addListener(b, "mousemove", _.db);
        _.G.addListener(b, "mouseup", _.db);
        _.G.addListener(b, "mousewheel", function(b) {
            var d = a.get("mouseEventTarget");
            d && _.G.trigger.apply(null, [d, "mousewheel"].concat(_.yj(arguments)))
        });
        return b
    };
    var mca = function(a, b, c, d) {
        for (var e = null, f = c * c, g = 0, h = d.length; g < h; ++g) {
            var k = _.JI(a, b, c, d[g]);
            k && k[2] <= f && (f = k[2], e = k)
        }
        return e
    };
    var nca = function(a, b, c) {
        for (var d = 0, e = 0, f = c.length; e < f; ++e) d += _.II(a, b, c[e]);
        return !!(d & 1)
    };
    var y1 = function(a, b) {
        for (var c = new _.J(0, 0), d = new _.L(0, 0), e = 0, f = a.length; e < f; e += 2) _.J.call(c, a[e], a[e + 1], !0), d = b.fromLatLngToPoint(c, d), a[e] = d.x, a[e + 1] = d.y
    };
    var z1 = function() {
        var a = new _.cg({
            clickable: !1,
            fillOpacity: 0
        });
        a.bindTo("map", this);
        a.bindTo("strokeColor", this);
        a.bindTo("strokeOpacity", this);
        a.bindTo("strokeWeight", this);
        var b = ["center", "freeVertexPosition", "freeVertexIsCenter"],
            c = new _.yv(b, "return", oca);
        _.eD(c, b, this);
        a.bindTo("center", c, "return");
        b = ["center", "radius", "planetRadius", "freeVertexPosition", "freeVertexIsCenter"];
        c = new _.yv(b, "return", (0, _.t)(this.O, this));
        _.eD(c, b, this);
        a.bindTo("radius", c, "return");
        this.j = _.cN();
        this.j.bindTo("zIndex",
            this);
        a.bindTo("zIndex", this.j, "ghostZIndex")
    };
    var oca = function(a, b, c) {
        return c && b || a
    };
    var A1 = function(a, b, c, d, e, f, g, h) {
        var k = this,
            n = _.X("div", a);
        a = 9 + 2 * (1 + c);
        _.vf(n, new _.M(a, a));
        _.Lk.O(n);
        g.P(n, c, 9, 1, h ? .5 : 1);
        var p = new _.DI(f);
        p.bindTo("position", k);
        f = new _.xI(n);
        f.bindTo("position", p, "rawPosition");
        f.bindTo("containerPixelBounds", k, "mapPixelBounds");
        f.bindTo("panningEnabled", k);
        f.set("draggableCursor", d);
        this.j = n;
        this.U = b;
        this.$ = c;
        this.oa = p;
        this.na = e;
        this.P = f;
        this.S = !1;
        this.O = {};
        this.T = g;
        var q;
        this.ya = [_.G.addListener(f, "dragstart", function() {
            p.set("referencePosition", k.get("position"));
            p.set("snappingCallback", k.na);
            k.O.mouseout = !0;
            k.O.mouseover = !0;
            q = [_.G.forward(b, "mousemove", n), _.G.forward(b, "mouseup", n)];
            b.set("draggableCursor", d);
            b.set("active", !0)
        }), _.G.addListener(f, "dragend", function() {
            p.set("referencePosition", null);
            p.set("snappingCallback", null);
            p.set("rawPosition", p.get("position"));
            b.set("active", !1);
            q && (_.E(q, _.G.removeListener), q = null)
        }), _.G.forward(f, "panbynow", k), _.G.forward(f, "dragstart", k), _.G.forward(f, "dragend", k), _.G.addListener(f, "mouseover", function() {
            k.S = !0;
            B1(k)
        }), _.G.addListener(f, "mouseout", function() {
            k.S = !1;
            B1(k)
        })];
        _.E(C1, function(a) {
            k.ya.push(pca(k, a))
        })
    };
    var pca = function(a, b) {
        function c(a) {
            d.O[b] ? d.O[b] = !1 : (_.cb(a), _.G.trigger(d, b, a))
        }
        var d = a;
        return "rightclick" == b ? _.G.addDomListener(d.j, "contextmenu", c) : _.G.addListener(d.P, b, c)
    };
    var B1 = function(a) {
        var b;
        if (a.S) {
            var c = _.zN(a.get("color"));
            c && (c.P = Math.floor((c.P + 255) / 2), c.O = Math.floor((c.O + 255) / 2), c.j = Math.floor((c.j + 255) / 2), b = ["#", v1(c.P), v1(c.O), v1(c.j)].join(""))
        }
        a.T.O(a.j, b || "white")
    };
    var D1 = function(a, b, c, d, e, f) {
        function g() {
            h.S || _.G.trigger(h, "toolbar", {
                Pb: !1
            })
        }
        this.ta = a;
        this.$ = b;
        this.U = c;
        this.O = _.X("div", e, _.Eg);
        this.S = d;
        this.va = f;
        this.j = [];
        a.forEach((0, _.t)(this.T, this));
        var h = this;
        this.na = [_.G.addListener(a, "insert_at", function(b) {
            h.T(a.getAt(b), b);
            E1(h, b + 1);
            g()
        }), _.G.addListener(a, "remove_at", function(a) {
            var b = h.j[a];
            h.j.splice(a, 1);
            h.oa(b);
            E1(h, a);
            g()
        }), _.G.addListener(a, "set_at", function(b) {
            h.j[b].Nd.set("latLngPosition", a.getAt(b));
            g()
        })]
    };
    var E1 = function(a, b) {
        for (var c = a.j.length; b < c; ++b) a.j[b].index = b
    };
    var F1 = function(a, b) {
        this.P = a;
        this.S = b;
        this.O = null;
        this.De = !1;
        this.j = new _.wc;
        _.G.bind(this.j, "set_at", this, this.Tq)
    };
    var qca = function(a) {
        var b = a.get("panes");
        if (!b) return null;
        b = new D1(a.j, rca, sca, !1, b.overlayMouseTarget, a.S);
        b.bindTo("projection", a);
        b.bindTo("zoom", a);
        b.bindTo("projectionCenterQ", a);
        b.bindTo("panningEnabled", a);
        b.bindTo("mapPixelBounds", a);
        b.bindTo("color", a);
        b.bindTo("zIndex", a);
        b.bindTo("offset", a);
        var c = a.P;
        c.bindTo("freeVertexPosition", b);
        var d, e;
        _.G.addListener(b, "dragstart", function(b) {
            d = a.get("center");
            e = a.get("radius");
            c.set("freeVertexIsCenter", 0 == b);
            c.set("map", a.get("map"))
        });
        _.G.addListener(b,
            "dragend",
            function(b, g) {
                c.set("map", null);
                _.G.trigger(a, "toolbar", {
                    Pb: !0,
                    position: g,
                    action: function() {
                        a.set("center", d);
                        a.set("radius", e)
                    }
                })
            });
        _.G.forward(b, "dragstart", a);
        _.G.forward(b, "dragend", a);
        _.G.forward(b, "panbynow", a);
        return b
    };
    var G1 = function(a) {
        var b = a.O;
        b && (b.unbindAll(), b.release(), _.G.clearInstanceListeners(b), a.O = null)
    };
    var H1 = function() {};
    var I1 = function() {};
    var tca = function(a, b, c) {
        function d() {
            a.get("editable") ? uca(a, b, c) : (J1(a), _.G.trigger(a, "toolbar", {
                Pb: !1
            }))
        }
        a.editable_changed = d;
        d()
    };
    var uca = function(a, b, c) {
        if (!a.P) {
            var d = new _.eN(a, !0);
            a.S = d;
            var e = new z1;
            e.bindTo("strokeColor", d);
            e.bindTo("strokeOpacity", d, "ghostStrokeOpacity");
            e.bindTo("strokeWeight", d);
            e.bindTo("center", a);
            e.bindTo("radius", a);
            e.bindTo("planetRadius", c);
            e.bindTo("zIndex", a);
            a.T = e;
            var f = b.__gm;
            a.j = x1(f);
            var g = _.GI(f, a),
                h = _.ok() ? 9 : 0,
                k = _.Lk.T ? new H1 : new I1,
                e = new F1(e, function(b, c, d, e) {
                    return new A1(b, a.j || null, h, c, g, d, k, e)
                });
            e.set("map", b);
            e.bindTo("center", a);
            e.bindTo("radius", a);
            e.bindTo("planetRadius", c);
            e.bindTo("panes",
                f);
            e.bindTo("projection", b);
            e.bindTo("zoom", f);
            e.bindTo("projectionCenterQ", f);
            e.bindTo("panningEnabled", b, "draggable");
            e.bindTo("mapPixelBounds", f, "pixelBounds");
            e.bindTo("offset", f);
            e.bindTo("color", d, "strokeColor");
            e.bindTo("zIndex", a);
            a.P = e;
            _.G.addListener(e, "dragstart", function() {
                a.set("capturing", !0)
            });
            _.G.addListener(e, "dragend", function() {
                a.set("capturing", !1)
            });
            _.G.forward(e, "panbynow", f);
            _.G.forward(e, "toolbar", a)
        }
    };
    var J1 = function(a) {
        var b = a.P;
        b && (b.unbindAll(), b.set("map", null), _.G.clearInstanceListeners(b), delete a.P, a.j.release(), delete a.j, a.set("capturing", !1), a.T.unbindAll(), delete a.T, a.S.release(), delete a.S)
    };
    var K1 = function(a, b, c, d, e, f) {
        this.O = a;
        this.Ta = c;
        a = a.get("center");
        b = c.fromDivPixelToLatLng(b);
        this.S = d(a, b);
        this.j = _.SA(b, a);
        this.P = f
    };
    var L1 = function() {
        var a = this;
        _.R.call(a);
        var b = this.j = new _.Ud;
        b.P = !0;
        b.bindTo("capturing", a);
        b.bindTo("cursor", a);
        b.bindTo("map", a);
        b.bindTo("strokeColor", a);
        b.bindTo("strokeOpacity", a);
        b.bindTo("strokeWeight", a);
        b.bindTo("strokePosition", a);
        b.bindTo("fillColor", a);
        b.bindTo("fillOpacity", a);
        b.bindTo("clickable", a);
        b.bindTo("zIndex", a);
        b.bindTo("suppressUndo", a);
        var c = this.O = [];
        _.E(C1, function(d) {
            c.push(_.G.forward(b, d, a))
        });
        c.push(_.G.forward(a, "toolbar", b))
    };
    var vca = function(a, b) {
        var c = Array(250),
            d = [c],
            e = _.La(a.lat()),
            f = _.La(a.lng()),
            g = Math.cos(b),
            h = Math.sin(b),
            k = Math.cos(e),
            n = Math.sin(e);
        if (1E-6 < k)
            for (var p = 0; 250 > p; ++p) {
                var q = p / 250 * Math.PI * 4,
                    q = q + Math.sin(q + Math.PI),
                    r = q / 2,
                    v = n * g + k * h * Math.cos(r),
                    q = Math.asin(v),
                    r = f + Math.atan2(Math.sin(r) * h * k, g - n * v),
                    r = _.Ja(r, -Math.PI, Math.PI);
                c[p] = new _.J(_.Ma(q), _.Ma(r))
            } else
                for (p = _.Ma(b), f = 0 < a.lat() ? a.lat() - p : a.lat() + p, p = 0; 250 > p; ++p) c[p] = new _.J(f, 360 * p / 250);
        e - b < -Math.PI / 2 && (c = [new _.J(-90, -200, !0), new _.J(90, -200, !0),
            new _.J(90, -100, !0), new _.J(90, 0, !0), new _.J(90, 100, !0), new _.J(90, 200, !0), new _.J(-90, 200, !0), new _.J(-90, 100, !0), new _.J(-90, 0, !0), new _.J(-90, -100, !0), new _.J(-90, -200, !0)
        ], d.push(c));
        return d
    };
    var M1 = function(a) {
        this.y = this.x = 0;
        this.j = a
    };
    var N1 = function(a) {
        var b = Math.sqrt(O1(a, a));
        1E-12 > b || (a.x /= b, a.y /= b, a.j /= b)
    };
    var O1 = function(a, b) {
        return a.x * b.x + a.y * b.y + a.j * b.j
    };
    var P1 = function(a, b, c) {
        c.x = a.y * b.j - a.j * b.y;
        c.y = a.j * b.x - a.x * b.j;
        c.j = a.x * b.y - a.y * b.x
    };
    var Q1 = function(a, b) {
        var c = _.La(a[0]),
            d = _.La(a[1]),
            e = Math.cos(c);
        b.x = Math.cos(d) * e;
        b.y = Math.sin(d) * e;
        b.j = Math.sin(c)
    };
    var R1 = function(a, b) {
        var c = Math.atan2(a.y, a.x);
        b[0] = _.Ma(Math.atan2(a.j, Math.sqrt(a.x * a.x + a.y * a.y)));
        b[1] = _.Ma(c)
    };
    var wca = function(a, b, c) {
        c.x = a.x + b.x;
        c.y = a.y + b.y;
        c.j = a.j + b.j;
        N1(c)
    };
    var S1 = function(a, b, c, d, e, f) {
        this.j = a;
        this.Ta = c;
        this.U = e;
        this.T = f;
        var g = xca(this);
        b = c.fromDivPixelToLatLng(b);
        this.$ = _.SA(g, b);
        this.na = d(g, b);
        var h = this.S = [];
        a.get("latLngs").forEach(function(a) {
            var b = [];
            a.forEach(function(a) {
                b.push({
                    heading: d(g, a),
                    Yc: _.SA(a, g)
                })
            });
            h.push(b)
        });
        this.O = g;
        this.P = b.lng() - g.lng()
    };
    var xca = function(a) {
        a = a.j.get("latLngs");
        var b = new M1(0),
            c = new M1(0);
        a.forEach(function(a) {
            a.forEach(function(a) {
                Q1([a.lat(), a.lng()], c);
                b.x += c.x;
                b.y += c.y;
                b.j += c.j
            })
        });
        N1(b);
        a = [0, 0];
        R1(b, a);
        a[0] = _.Ia(a[0], -89, 89);
        return new _.J(a[0], a[1])
    };
    var T1 = function(a, b, c, d, e) {
        _.Xj.call(this, a, b);
        _.z(c) && (this.path = c);
        _.z(d) && (this.vertex = d);
        _.z(e) && (this.edge = e)
    };
    var U1 = function(a, b, c) {
        this.O = a;
        this.Ta = c;
        this.j = c.fromDivPixelToLatLng(b);
        var d = this.P = [];
        a.get("latLngs").forEach(function(a) {
            d.push(_.yj(a.getArray()))
        })
    };
    var V1 = function(a, b) {
        this.$ = a;
        this.O = _.X("div", null, null, W1);
        this.O.style.backgroundColor = "red";
        _.Mk(this.O, .01);
        var c = this.P = new _.xI(this.O);
        c.bindTo("position", this);
        c.bindTo("containerPixelBounds", this);
        c.bindTo("panningEnabled", this);
        c.set("draggableCursor", "pointer");
        c.set("draggingCursor", "pointer");
        c.set("size", W1);
        c.set("anchorPoint", X1);
        this.U = [_.G.bind(c, "dragstart", this, this.hi), _.G.bind(c, "dragend", this, this.ng), _.G.bind(c, "click", this, this.Ll), _.G.bind(c, "mousedown", this, this.Pl), _.G.bind(c,
            "mousemove", this, this.Ql), _.G.bind(c, "mouseup", this, this.Rl), _.G.forward(c, "panbynow", this)];
        _.ok() && (c = b.__gm, _.G.bind(c, "movestart", this, this.Nl), _.G.bind(c, "move", this, this.Ol), _.G.bind(c, "moveend", this, this.Ml));
        c = new _.yv(["mousedown", "dragging"], "active", function(a, b) {
            return a || b
        });
        c.bindTo("dragging", this, null, !0);
        c.bindTo("mousedown", this, null, !0);
        this.bindTo("active", c, null, !0)
    };
    var Y1 = function(a, b) {
        var c;
        c = b ? 1E9 : (a.j.get("zIndex") || 0) - 2;
        _.Jk(a.O, c)
    };
    var Z1 = function(a, b, c) {
        var d = a.get("position"),
            d = a.Ta.fromDivPixelToLatLng(d);
        _.G.trigger(a.j, b, new _.Xj(d, c))
    };
    var $1 = function(a, b) {
        var c = a.__gm;
        b.bindTo("panningEnabled", a, "draggable");
        b.bindTo("panes", c);
        b.bindTo("projectionController", c);
        b.bindTo("containerPixelBounds", c, "pixelBounds");
        c.Wa = _.G.forward(b, "panbynow", c)
    };
    var a2 = function(a, b) {
        function c() {
            var b = a.getMap();
            a.getDraggable() && (_.Y(b, "Od"), _.Bl("Od", "-p", a, !(!b || !b.Ga)))
        }
        a.draggable_changed = c;
        c();
        a.oa = [_.G.addListener(a, "mouseover", function(c) {
            null == c.vertex && null == c.edge && b.set("poly", a)
        }), _.G.addListener(a, "click", function(b) {
            null == b.vertex && null == b.edge && a.getDraggable() && (b = a.getMap(), _.Bl("Od", "-i", a, !(!b || !b.Ga)))
        }), _.G.addListener(a, "mouseout", function(a) {
            null != a.vertex || null != a.edge || _.si(a.Jb) || b.set("poly", null)
        })]
    };
    var yca = function(a) {
        var b = a.__gm.P;
        b.j || (_.K("geometry", function(c) {
            var d = new V1(function(a, b, d) {
                return new K1(a, b, d, c.computeHeading, 0, c.computeOffsetOrigin)
            }, a);
            $1(a, d);
            b.j = function(b) {
                a2(b, d);
                var c = b.Fr = new _.yv(["mapType"], "planetRadius", _.Md);
                c.bindTo("mapType", a.__gm);
                var g = b.Ei = new L1;
                g.set("map", a);
                g.bindTo("radius", b);
                g.bindTo("center", b);
                g.bindTo("capturing", b);
                g.bindTo("clickable", b);
                g.bindTo("cursor", b);
                g.bindTo("fillColor", b);
                g.bindTo("fillOpacity", b);
                g.bindTo("strokeColor", b);
                g.bindTo("strokeOpacity",
                    b);
                g.bindTo("strokeWeight", b);
                g.bindTo("strokePosition", b);
                g.bindTo("zIndex", b);
                g.bindTo("suppressUndo", b);
                g.bindTo("planetRadius", c);
                b.Pa = [];
                _.E(C1, function(a) {
                    b.Pa.push(_.G.forward(g, a, b))
                });
                b.Pa.push(_.G.forward(b, "toolbar", g));
                tca(b, a, c);
                _.Y(a, "Oc");
                _.Bl("Oc", "-p", b, !(!a || !a.Ga));
                _.G.addListener(b, "click", function() {
                    _.Bl("Oc", "-i", b, !(!a || !a.Ga))
                })
            }
        }), b.onRemove = function(a) {
            var b = a.Ei;
            b.unbindAll();
            b.set("map", null);
            b.release();
            delete a.Ei;
            _.E(a.Pa, _.G.removeListener);
            delete a.Pa;
            delete a.editable_changed;
            J1(a);
            _.Cl("Oc", "-p", a)
        })
    };
    var zca = function(a, b, c, d) {
        a.capturing_changed = function() {
            if (a.get("capturing"))
                if (0 == a.get("clickable")) {
                    var e = a.O = new _.hN;
                    e.bindTo("draggableCursor", a, "cursor");
                    e.set("active", !0);
                    b.bindTo("cursor", e);
                    d.oc(e)
                } else d.Je(c, a);
            else a.O ? (d.$d(a.O), a.O.unbindAll(), b.unbind("cursor"), b.set("cursor", ""), delete a.O) : d.Ie(c, a)
        }
    };
    var b2 = function(a, b, c) {
        var d = this;
        this.$ = a;
        this.S = b;
        this.T = c;
        this.O = {};
        this.j = {};
        this.P = 0;
        this.U = function(a) {
            c2(d, this, a)
        };
        a.j = function(a) {
            var b = d.get("projection"),
                b = a.Jf = {
                    style: d2(d.T, a),
                    dd: e2(a, b)
                };
            f2(d, a);
            a.changed = d.U;
            _.zc(d.S, b)
        };
        a.onRemove = function(a) {
            var b = a.Jf;
            delete a.Jf;
            d.S.remove(b);
            delete a.changed;
            g2(a);
            a = _.pb(a);
            delete d.O[a];
            delete d.j[a]
        }
    };
    var c2 = function(a, b, c) {
        var d = _.pb(b);
        c in Aca && (a.j[d] = b, g2(b));
        c in Bca && (a.O[d] = b);
        h2(a)
    };
    var h2 = function(a) {
        a.P || (a.P = _.Ya(function() {
            a.P = 0;
            var b = a.O;
            a.O = {};
            var c = a.j;
            a.j = {};
            for (var d in b) {
                var e = b[d],
                    f = e.Jf;
                f.style = d2(a.T, e);
                f.lh && !c[d] && f.lh()
            }
            var b = a.S,
                g = a.get("projection");
            for (d in c) e = c[d], f = e.Jf, b.remove(f), f.dd = e2(e, g), _.zc(b, f), f2(a, e)
        }))
    };
    var f2 = function(a, b) {
        function c() {
            c2(e, b, "latLngs")
        }
        var d = b.get("latLngs");
        if (d) {
            for (var e = a, f = _.pb(b), g = d.getArray(), h = 0, k = g.length; h < k; ++h) {
                var n = g[h];
                i2(n);
                n.O.Ab[f] = n.S.Ab[f] = n.P.Ab[f] = c
            }
            i2(d);
            d.S.Ab[f] = d.P.Ab[f] = function(a, b) {
                j2(b, f);
                c()
            };
            d.O.Ab[f] = c
        }
    };
    var g2 = function(a) {
        var b = a.get("latLngs");
        if (b) {
            a = _.pb(a);
            j2(b, a);
            for (var b = b.getArray(), c = 0, d = b.length; c < d; ++c) j2(b[c], a)
        }
    };
    var i2 = function(a) {
        a.O || (a.O = function(b) {
            _.Ga(a.O.Ab, function(a, d) {
                d(b)
            })
        }, a.O.Ab = {});
        a.S || (a.S = function(b, c) {
            _.Ga(a.S.Ab, function(a, e) {
                e(b, c)
            })
        }, a.S.Ab = {});
        a.P || (a.P = function(b, c) {
            _.Ga(a.P.Ab, function(a, e) {
                e(b, c)
            })
        }, a.P.Ab = {})
    };
    var j2 = function(a, b) {
        a.O && delete a.O.Ab[b];
        a.S && delete a.S.Ab[b];
        a.P && delete a.P.Ab[b]
    };
    var k2 = function() {
        var a = this.O = _.X("div");
        _.Jk(a, -202);
        _.Ik(a, "pointer");
        _.Lk.O(a);
        _.QC(a);
        this.j = _.qC(Cca, a, l2, m2);
        _.G.bind(this, "toolbar", this, this.Sl);
        _.G.Ha(a, "click", this, this.Gp);
        _.G.addDomListener(a, "mouseover", (0, _.t)(this.Lf, this, Dca));
        _.G.addDomListener(a, "mouseout", (0, _.t)(this.Lf, this, l2));
        _.G.Ha(a, "mousedown", this, function(a) {
            _.fb(a);
            this.Lf(Eca)
        });
        _.G.addDomListener(a, "mousemove", _.fb);
        _.G.addDomListener(a, "mouseup", _.fb)
    };
    var n2 = function(a) {
        a.P && _.G.clearListeners(a.P, "suppressundo_changed")
    };
    var Fca = function(a, b, c, d) {
        a.Lf(l2);
        _.Ak(a.O, new _.L(b.x + o2.x, b.y + o2.y));
        a.S = c;
        n2(a);
        a.P = d;
        _.Fk(a.O);
        _.G.addListener(d, "suppressundo_changed", function() {
            d.get("suppressUndo") && a.sd()
        })
    };
    var p2 = function(a) {
        var b = this;
        this.j = a;
        _.G.addListener(a, "set_at", function(c) {
            _.G.trigger(b, "set_at", c);
            var d = a.getLength();
            0 == c && 1 < d && _.G.trigger(b, "set_at", d)
        });
        _.G.addListener(a, "insert_at", function(c) {
            _.G.trigger(b, "insert_at", c);
            var d = a.getLength();
            2 == d ? _.G.trigger(b, "insert_at", 2) : 0 == c && 1 < d && _.G.trigger(b, "set_at", d)
        });
        _.G.addListener(a, "remove_at", function(c) {
            _.G.trigger(b, "remove_at", c);
            var d = a.getLength();
            1 == d ? _.G.trigger(b, "remove_at", 1) : 0 == c && 1 < d && _.G.trigger(b, "set_at", d)
        })
    };
    var q2 = function(a, b, c) {
        this.O = a;
        this.P = b;
        this.j = c;
        this.ya = [_.G.bind(a, "set_at", this, this.Sk), _.G.bind(a, "insert_at", this, this.Vh), _.G.bind(a, "remove_at", this, this.Rk)];
        b = 0;
        for (a = a.getLength(); b < a; ++b) this.Vh(b)
    };
    var r2 = function(a, b, c) {
        var d = a.get("projection");
        if (d) {
            var e = a.O,
                f = e.getAt(c),
                g = a.P,
                h = a.get("geodesic");
            0 < c && g.setAt(c - 1, s2(e.getAt(c - 1), f, h, d, a.j));
            c < e.getLength() - 1 && (a = s2(f, e.getAt(c + 1), h, d, a.j), b ? g.insertAt(c, a) : g.setAt(c, a))
        }
    };
    var s2 = function(a, b, c, d, e) {
        c ? d = e(a, b, .5) : (180 < Math.abs(a.lng() - b.lng()) && (a = new _.J(a.lat(), _.Ja(a.lng(), b.lng() - 180, b.lng() + 180), !0)), a = d.fromLatLngToPoint(a), b = d.fromLatLngToPoint(b), d = d.fromPointToLatLng(new _.L((a.x + b.x) / 2, (a.y + b.y) / 2)));
        return d
    };
    var t2 = function(a, b, c, d) {
        this.T = a;
        this.S = b;
        this.na = c;
        this.$ = d;
        this.O = [];
        this.j = [];
        this.U = []
    };
    var u2 = function(a, b, c) {
        var d = v2(a, b, c, !1),
            e = a.T,
            f;
        _.G.addListener(d, "dragstart", function(c) {
            f = b.getAt(c);
            var h = b.getArray(),
                k = a.S,
                n = h.length;
            if (2 > n) e.set("anchors", []);
            else {
                var p = h[k && 0 == c ? n - 1 : c - 1];
                c = h[k && c == n - 1 ? 0 : c + 1];
                h = [];
                p && h.push(p);
                c && h.push(c);
                e.set("anchors", h)
            }
            e.bindTo("freeVertexPosition", d);
            e.set("map", a.get("map"))
        });
        _.G.addListener(d, "dragend", function(c, d) {
            e.set("map", null);
            _.G.trigger(a, "toolbar", {
                Pb: !0,
                position: d,
                action: function() {
                    b.setAt(c, f)
                }
            })
        });
        return d
    };
    var w2 = function(a, b, c) {
        var d = new _.wc,
            e = a.S ? new p2(b) : b,
            f = new q2(e, d, a.$);
        f.bindTo("geodesic", a);
        f.bindTo("projection", a);
        var g = v2(a, d, c, !0);
        g.P = f;
        var h = a.T;
        _.G.addListener(g, "dragstart", function(b) {
            b = [e.getAt(b), e.getAt(b + 1)];
            h.set("anchors", b);
            h.bindTo("freeVertexPosition", g);
            h.set("map", a.get("map"))
        });
        _.G.addListener(g, "dragend", function(c, e) {
            b.insertAt(c + 1, d.getAt(c));
            h.set("map", null);
            _.G.trigger(a, "toolbar", {
                Pb: !0,
                position: e,
                action: function() {
                    b.removeAt(c + 1)
                }
            })
        });
        return g
    };
    var v2 = function(a, b, c, d) {
        var e = new D1(b, ["pointer"], [0], d, c, a.na);
        e.bindTo("projection", a);
        e.bindTo("zoom", a);
        e.bindTo("projectionCenterQ", a);
        e.bindTo("panningEnabled", a);
        e.bindTo("mapPixelBounds", a);
        e.bindTo("color", a);
        e.bindTo("zIndex", a);
        e.bindTo("offset", a);
        _.G.forward(e, "dragstart", a);
        _.G.forward(e, "dragend", a);
        _.G.forward(e, "panbynow", a);
        _.G.forward(e, "toolbar", a);
        _.E(C1, function(c) {
            _.G.addListener(e, c, function(g) {
                var h = b.getAt(g),
                    k;
                if (a.S)
                    for (var n = d ? a.j : a.O, p = 0; p < n.length; ++p)
                        if (n[p] == e) {
                            k =
                                p;
                            break
                        }
                _.G.trigger(a, c, new T1(h, void 0, k, d ? void 0 : g, d ? g : void 0))
            })
        });
        return e
    };
    var x2 = function(a) {
        var b = (0, _.t)(a.P, a);
        _.E(a.O, b);
        _.E(a.j, b);
        a.O.length = 0;
        a.j.length = 0;
        _.E(a.U, _.G.removeListener);
        a.U.length = 0
    };
    var y2 = function(a, b, c) {
        function d() {
            g[x++] = k.Ra[0];
            g[x++] = k.Ra[1];
            f && (h[q++] = k.Yc);
            n = k
        }
        var e = a.path,
            f = a.j;
        if (!e.length) return a;
        var g = Array(e.length),
            h = f ? Array(f.length) : null;
        a = [];
        var k, n = z2();
        g[0] = n.Ra[0] = e[0];
        g[1] = n.Ra[1] = e[1];
        f && (h[0] = n.Yc = f[0]);
        n.depth = 0;
        Q1(n.Ra, n.Od);
        for (var p = 1, q = 1, r = [], v = 2, x = 2; v < e.length || r.length;)
            if (r.length ? k = r.pop() : (k = z2(), k.depth = 0, k.Ra[0] = e[v++], k.Ra[1] = e[v++], f && (k.Yc = f[p++]), Q1(k.Ra, k.Od)), 12 <= Math.max(n.depth, k.depth)) d();
            else {
                var y = new _.rf;
                y.ra = Math.min(n.Ra[0],
                    k.Ra[0]);
                y.ua = Math.max(n.Ra[0], k.Ra[0]);
                y.qa = Math.min(n.Ra[1], k.Ra[1]);
                y.wa = Math.max(n.Ra[1], k.Ra[1]);
                if (_.Pj(b, y)) {
                    var A = z2();
                    wca(n.Od, k.Od, A.Od);
                    R1(A.Od, A.Ra);
                    A.depth = Math.max(n.depth, k.depth) + 1;
                    f && (A.Yc = (n.Yc + k.Yc) / 2);
                    var D = y.qa - 1E-6,
                        C = y.wa + 1E-6,
                        y = A.Ra;
                    y[1] = Gca(D, C, y[1]);
                    Hca(n.Ra, k.Ra, a);
                    Math.max(Math.abs(A.Ra[0] - a[0]), Math.abs(A.Ra[1] - a[1])) <= c ? d() : (r.push(k), r.push(A))
                } else d()
            }
        return {
            path: g,
            j: h
        }
    };
    var Hca = function(a, b, c) {
        c[0] = (a[0] + b[0]) / 2;
        c[1] = (a[1] + b[1]) / 2
    };
    var Gca = function(a, b, c) {
        for (; c < a;) c += 360;
        for (; c > b;) c -= 360;
        return c
    };
    var z2 = function() {
        return {
            Ra: [0, 0],
            Od: new M1(0)
        }
    };
    var Ica = function(a) {
        return function(b, c) {
            var d;
            d = "px" == b.vc ? b.value / a : (d = _.u(c)) ? b.value / 100 * c[d - 1] : 0;
            return d
        }
    };
    var Jca = function(a, b, c, d) {
        --b;
        if (!(0 > b)) {
            var e = a.length,
                f = 0;
            for (d(0); f < b;) {
                var g = 1 << e,
                    h = e ? a[e - 1][f / g] : 0,
                    k = f + g;
                k >= b && (k = b);
                e && c(f, k, h) ? --e : (d(k), f = k, f & g || ++e)
            }
        }
    };
    var Kca = function(a, b) {
        return function(c, d) {
            if (0 == c) return !0;
            for (var e = a[c], f = a[d], g = 0, h; h = b[g]; ++g) {
                var k = h.offset;
                if (h = h.repeat) {
                    if (Math.floor((e - k) / h) != Math.floor((f - k) / h)) return !0
                } else if (e < k && k <= f) return !0
            }
            return !1
        }
    };
    var Lca = function(a, b, c, d) {
        var e = a.ra,
            f = a.qa,
            g = a.ua,
            h = a.wa;
        return function(a, n, p) {
            var q = d[2 * a],
                r = d[2 * a + 1];
            a = d[2 * n];
            n = d[2 * n + 1];
            var v = Math.min(r, n) - p,
                x = Math.max(q, a) + p,
                y = Math.max(r, n) + p;
            Math.min(q, a) - p <= g && e <= x && v <= h && f <= y ? p > b ? p = !0 : (v = c.fromLatLngToPoint(new _.J(q, r, !0)), x = c.fromLatLngToPoint(new _.J(a, n, !0)), v = c.fromPointToLatLng(new _.L((v.x + x.x) / 2, (v.y + x.y) / 2), !0), r = (r + n) / 2, q = (q + a) / 2 - v.lat(), a = r - v.lng(), p = Math.sqrt(q * q + a * a) + p > b) : p = !1;
            return p
        }
    };
    var Mca = function(a, b, c) {
        return function(d, e, f) {
            var g = d.path,
                h = d.j,
                k = Lca(a, b, c, g);
            d = k;
            if (h) {
                var n = Kca(h, f);
                d = function(a, b, c) {
                    return k(a, b, c) || n(a, b)
                }
            }
            var p = [],
                q = h ? [] : null;
            Jca(e, g.length / 2, d, function(a) {
                p.push(g[2 * a], g[2 * a + 1]);
                h && q.push(h[a])
            });
            return {
                path: p,
                j: q
            }
        }
    };
    var A2 = function(a, b) {
        var c = 0;
        _.Ka(a, -16, .001) && (c |= 1);
        _.Ka(a, 272, .001) && (c |= 2);
        _.Ka(b, -16, .001) && (c |= 4);
        _.Ka(b, 272, .001) && (c |= 8);
        return c
    };
    var B2 = function(a, b, c) {
        var d = a.fromPointToLatLng(c);
        a = a.fromPointToLatLng(new _.L(c.x + b, c.y + b));
        return Math.min(Math.abs(d.lat() - a.lat()), Math.abs(d.lng() - a.lng()))
    };
    var C2 = function(a, b, c) {
        b = this.U = 1 << b;
        this.T = c;
        var d = _.sf((256 * a.x - 16) / b, (256 * a.y - 16) / b, (256 * (a.x + 1) + 16) / b, (256 * (a.y + 1) + 16) / b);
        a = new _.L(d.ra, d.qa);
        var d = new _.L(d.ua, d.wa),
            e = c.fromPointToLatLng(a, !0),
            f = c.fromPointToLatLng(d, !0),
            g = Math.min(e.lat(), f.lat()),
            h = Math.max(e.lat(), f.lat()),
            k = Math.min(e.lng(), f.lng()),
            e = Math.max(e.lng(), f.lng()),
            f = (k + e) / 2,
            n = _.Ja(f, -180, 180),
            k = k + (n - f),
            e = e + (n - f),
            f = _.sf(g, k, h, e),
            g = new _.J(g, k, !0);
        c.fromLatLngToPoint(g, a);
        h = new _.J(h, e, !0);
        c.fromLatLngToPoint(h, d);
        d = new _.rf([a,
            d
        ]);
        this.O = f;
        this.j = d;
        a = .5 / b;
        d = this.j;
        this.S = Math.min(B2(c, a, new _.L(d.ra, d.qa)), B2(c, a, new _.L(d.ua, d.wa)));
        this.$ = Mca(this.O, this.S, c);
        this.P = Ica(b)
    };
    var D2 = function(a, b, c) {
        this.P = a;
        this.O = b;
        this.S = c
    };
    var Nca = function(a) {
        return _.Na(a, function(a) {
            return _.Na(a, function(a) {
                return Math.round(a)
            })
        })
    };
    var Oca = function(a, b, c, d) {
        function e() {
            a.get("editable") ? (Pca(a, b, d), _.Y(b, "Oe"), _.Bl("Oe", "-p", a, !(!b || !b.Ga))) : (_.G.trigger(c, "toolbar", {
                Pb: !1,
                Dc: a
            }), E2(a))
        }
        a.editable_changed = e;
        e();
        a.U = _.G.addListener(a, "toolbar", function(b) {
            b.Dc = a;
            _.G.trigger(c, "toolbar", b)
        })
    };
    var Pca = function(a, b, c) {
        if (!a.T) {
            var d = new _.eN(a, a.wb);
            a.$ = d;
            var e = new _.dN;
            e.bindTo("strokeColor", d);
            e.bindTo("strokeOpacity", d, "ghostStrokeOpacity");
            e.bindTo("strokeWeight", d);
            e.bindTo("geodesic", a);
            e.bindTo("zIndex", a);
            a.zc = e;
            var f = b.__gm;
            a.j = x1(f);
            var g = _.GI(f, a),
                h = _.ok() ? 9 : 0,
                k = _.Lk.T ? new H1 : new I1,
                n = new t2(e, a.wb, function(b, c, d, e) {
                    return new A1(b, a.j || null, h, c, g, d, k, e)
                }, c);
            n.set("map", b);
            n.bindTo("paths", a, "latLngs");
            n.bindTo("panes", f);
            n.bindTo("projection", b);
            n.bindTo("zoom", f);
            n.bindTo("projectionCenterQ",
                f);
            n.bindTo("panningEnabled", b, "draggable");
            n.bindTo("mapPixelBounds", f, "pixelBounds");
            n.bindTo("offset", f);
            n.bindTo("color", d, "strokeColor");
            n.bindTo("zIndex", a);
            n.bindTo("geodesic", a);
            n.bindTo("suppressGhostControlPoints", a);
            a.T = n;
            a.na = [_.G.addListener(a, "mousedown", function() {
                a.set("capturing", !0)
            }), _.G.addListener(a, "mouseup", function() {
                a.set("capturing", !1)
            })];
            _.G.addListener(a, "click", function() {
                a.get("editable") && _.Bl("Oe", "-i", a, !(!b || !b.Ga))
            });
            _.G.forward(n, "panbynow", f);
            _.G.forward(n, "toolbar",
                a);
            _.E(C1, function(b) {
                _.G.forward(n, b, a)
            })
        }
    };
    var E2 = function(a) {
        var b = a.T;
        b && (b.unbindAll(), b.set("map", null), _.G.clearInstanceListeners(b), delete a.T, a.j.unbindAll(), a.j.release(), delete a.j, a.set("capturing", !1), _.E(a.na, _.G.removeListener), delete a.na, a.zc.unbindAll(), delete a.zc, a.$.release(), delete a.$)
    };
    var F2 = function(a, b) {
        this.j = a;
        this.O = _.dk(b, Math.min(2, _.yf()));
        this.tileSize = new _.M(256, 256)
    };
    var G2 = function(a, b, c, d) {
        this.$ = c;
        this.T = a;
        a = _.zk(a);
        this.j = H2(a, b, d);
        _.Ak(this.j, _.Eg);
        this.U = I2(this.j, d);
        this.oa = H2(a, b, d);
        this.va = I2(this.oa, d);
        this.Aa = new _.LI(this.U);
        this.Ea = new _.LI(this.va);
        this.O = {};
        this.P = 0
    };
    var H2 = function(a, b, c) {
        a = a.createElement("canvas");
        a.width = b.width * c;
        a.height = b.height * c;
        a.style.width = _.T(b.width);
        a.style.height = _.T(b.height);
        _.Kk(a);
        return a
    };
    var I2 = function(a, b) {
        var c = a.context = a.getContext("2d");
        c.scale(b, b);
        c.lineCap = c.lineJoin = "round";
        return c
    };
    var J2 = function(a) {
        a.P || (a.P = _.Ya(function() {
            a.P = 0;
            var b = Qca(a);
            if (b.length) {
                a.j.parentNode || a.T.appendChild(a.j);
                var c = a.U,
                    d = a.va;
                c.clearRect(0, 0, 256, 256);
                for (var e = 0, f; f = b[e]; ++e) {
                    var g = f.O,
                        h = g.U;
                    _.Ka(1, h) ? (a.$(c, f.Za, g.strokeColor, g.j, g.P, g.T, g.fillColor, g.O), K2(f.j, g.S, c, a.Aa, 1)) : (d.clearRect(0, 0, 256, 256), a.$(d, f.Za, g.strokeColor, g.j / h, g.P, g.T), K2(f.j, g.S, d, a.Ea, h), c.globalAlpha = h, c.drawImage(a.oa, 0, 0, 256, 256))
                }
            } else a.j.parentNode && a.T.removeChild(a.j)
        }))
    };
    var K2 = function(a, b, c, d, e) {
        for (var f = 0, g = a.length; f < g; ++f) {
            var h = b[f],
                k = c,
                n = d,
                p = a[f],
                q = h.S,
                r = h.scale,
                v = h.rotation,
                x = h.T,
                y = h.strokeColor,
                A = h.j / e,
                D = h.P,
                C = h.fillColor,
                h = h.O / e;
            k.beginPath();
            for (var F = 0, H = p.length; F < H; F += 3) n.jc(q, p[F], p[F + 1], v + (x ? p[F + 2] : 0), r);
            h && (k.fillStyle = C, k.globalAlpha = h, k.fill());
            D && (k.lineWidth = D, k.strokeStyle = y, k.globalAlpha = A, k.stroke())
        }
    };
    var Qca = function(a) {
        var b = [];
        a = a.O;
        for (var c in a) b.push(a[c]);
        b.sort(function(a, b) {
            return a.zIndex - b.zIndex
        });
        return b
    };
    var Rca = function(a, b) {
        function c(a, b) {
            a.beginPath();
            for (var c = 0, d; d = b[c]; ++c)
                if (d.length) {
                    a.moveTo(Math.round(d[0]), Math.round(d[1]));
                    for (var e = 2, f = d.length; e < f;) a.lineTo(Math.round(d[e++]), Math.round(d[e++]))
                }
        }

        var d = a.createElement("canvas");
        d.width = d.height = 256 * b;
        var e = d.getContext("2d");
        e.lineCap = e.lineJoin = "round";
        e.scale(b, b);
        var f = [function(a, b, c, d, e) {
            a.lineWidth = e;
            a.strokeStyle = c;
            a.globalAlpha = d;
            a.stroke()
        }, function(a, b, c, d, e) {
            a.lineWidth = 2 * e;
            a.strokeStyle = c;
            a.globalAlpha = d;
            a.save();
            a.clip();
            a.stroke();
            a.restore()
        }, function(a, b, f, n, p) {
            e.lineWidth = 2 * p;
            e.strokeStyle = f;
            e.globalCompositeOperation = "source-over";
            e.clearRect(0, 0, 256, 256);
            c(e, b);
            e.stroke();
            e.globalCompositeOperation = "destination-out";
            e.fill();
            a.globalAlpha = n;
            a.drawImage(d, 0, 0, 256, 256)
        }];
        return function(a, b, d, e, p, q, r, v) {
            c(a, b);
            v && (a.fillStyle = r, a.globalAlpha = v, a.fill());
            if (p) f[q](a, b, d, e, p)
        }
    };
    var L2 = function(a, b, c, d, e) {
        this.j = a;
        this.O = d;
        this.P = e;
        a.setAttribute("dir", "ltr");
        a.style.overflow = "hidden";
        c && _.vf(a, new _.M(b.width - 1, b.height - 1))
    };
    var Sca = function(a, b) {
        for (var c = [], d = new _.L(0, 0), e = 0, f = b.length; e < f; e += 3) {
            var g = M2(a, 1E3);
            d.x = b[e];
            d.y = b[e + 1];
            _.Ak(g, d);
            c.push(g)
        }
        return c
    };
    var M2 = function(a, b) {
        var c = _.lI("gm_v:shape", a.j);
        a.O(c);
        _.vf(c, new _.M(1, 1));
        var d = b || 1;
        c.coordsize = d + " " + d;
        c.coordorigin = "0 0";
        return c
    };
    var N2 = function(a, b, c, d) {
        this.U = a;
        this.P = b;
        this.S = c;
        this.O = d;
        this.j = null
    };
    var Tca = function(a, b, c, d, e) {
        var f = this;
        this.O = b;
        this.j = d;
        this.P = e;
        a.j = function(a) {
            O2(f, a)
        };
        a.onRemove = function(a) {
            delete a.lh;
            f.O.remove(a.Va);
            a = a.dd;
            var b = a.Xa,
                c;
            for (c in b) {
                var d = b[c],
                    e = d.Ua;
                e.j.ta(d);
                delete e.Xa[_.pb(d)]
            }
            a.Xa = {};
            c = a.Zb;
            _.Cl(c.wb ? "Op" : "Ol", "-v", c)
        };
        c.j = function(a) {
            P2(f, a)
        };
        c.onRemove = function(a) {
            f.j.remove(a.Va);
            var b = a.Xa,
                c;
            for (c in b) {
                var d = b[c],
                    e = d.S;
                delete e.Xa[_.pb(d)];
                d = e.Zb;
                _.Cl(d.wb ? "Op" : "Ol", "-v", d)
            }
            a.Xa = {}
        };
        a = a.O;
        for (var g in a) O2(f, a[g]);
        c = c.O;
        for (g in c) P2(f, c[g])
    };
    var O2 = function(a, b) {
        b.lh = function() {
            var a = b.dd.Xa,
                c;
            for (c in a) {
                var d = a[c];
                d.O = b.style;
                d.zIndex = b.style.zIndex;
                d.Ua.j.S(d)
            }
        };
        var c = b.dd,
            d = c.Va;
        d.Dc = b;
        b.Va = d;
        _.RI(a.O, d);
        for (var d = a.j.search(d), e = 0, f = d.length; e < f; ++e) Q2(b, d[e].lc || null);
        0 < d.length && (c = c.Zb, _.Bl(c.wb ? "Op" : "Ol", "-v", c, a.P))
    };
    var P2 = function(a, b) {
        var c = b.Va;
        c.lc = b;
        _.RI(a.j, c);
        for (var c = a.O.search(b.Va), d = 0, e = c.length; d < e; ++d) Q2(c[d].Dc || null, b), _.Bl(c[d].Dc.dd.Zb.wb ? "Op" : "Ol", "-v", c[d].Dc.dd.Zb, a.P)
    };
    var Q2 = function(a, b) {
        for (var c = a.dd, d = b.O, e = c.P, f = c.O, g = c.j, h = [], k = [], n = 0, p = g.length; n < p; ++n) k.push([]);
        n = 0;
        for (p = e.length; n < p; ++n) {
            var q = e[n],
                r = q.O,
                v;
            v = d;
            var x = g,
                y = r.j,
                A = [];
            if (y)
                for (var D = 0, C = void 0; C = x[D]; ++D) A.push({
                    offset: v.P(C.offset, y),
                    repeat: v.P(C.repeat, y)
                });
            v = A;
            r = q.j ? d.$(r, q.j, v) : {
                path: _.yj(r.path),
                j: r.j
            };
            if (r.path.length && (f && (r = y2(r, d.O, d.S)), y1(r.path, d.T), q = d.j, r = w1(r, 0, q.ra), r = w1(r, 1, q.ua), r = w1(r, 2, q.qa), r = w1(r, 3, q.wa), x = r.path, x.length)) {
                h.push(x);
                y = d.U;
                A = d.j.ra;
                D = d.j.qa;
                q = 0;
                for (C =
                    x.length; q < C; q += 2) x[q] = (x[q] - A) * y - 16, x[q + 1] = (x[q + 1] - D) * y - 16;
                for (q = 0; y = v[q]; ++q) {
                    x = y.offset;
                    y = y.repeat;
                    if (A = r.j) {
                        for (var D = r.path, C = [], F = 0, H = D.length - 2; F < H;) {
                            var P = D[F],
                                U = D[F + 1],
                                V = A[F / 2],
                                oa = V - x,
                                F = F + 2,
                                Za = D[F],
                                ab = D[F + 1];
                            if (!(A2(P, U) & A2(Za, ab))) {
                                for (; _.Ka(P, Za) && _.Ka(U, ab) && F < H;) F += 2, Za = D[F], ab = D[F + 1];
                                var Ab = A[F / 2] - x,
                                    uc = Math.atan2(Za - P, U - ab);
                                0 == V && (oa -= 1E-9);
                                if (y)
                                    for (V = Math.floor(Ab / y) * y; V > oa;) {
                                        var hf = (V - oa) / (Ab - oa);
                                        C.push(P + (Za - P) * hf, U + (ab - U) * hf, uc);
                                        V -= y
                                    } else 0 > oa && 0 <= Ab && (oa = (0 - oa) / (Ab - oa), C.push(P +
                                        (Za - P) * oa, U + (ab - U) * oa, uc))
                            }
                        }
                        x = C
                    } else x = null;
                    x && (k[q] = k[q].concat(x))
                }
            }
        }
        h.length && (d = {}, d.Za = h, d.j = k, d.O = a.style, d.zIndex = a.style.zIndex, d.Ua = b, d.S = c, h = _.pb(d), c.Xa[h] = d, b.Xa[h] = d, b.j.na(d))
    };
    var Uca = function(a) {
        return _.Na(a, function(a) {
            var c = {},
                d = a.path;
            if (50 <= d.length) {
                for (var e = [], f = d.length - 2, g, h = 2; h < f; h <<= 1) {
                    for (var k = d[0], n = d[1], p = Math.ceil(f / (2 * h)), q = Array(p), r = 0, v = 0, x = d.length - 1 - h; r < x;) {
                        var r = r + h,
                            y = d[r],
                            A = d[r + 1],
                            r = r + h;
                        r > d.length - 2 && (r = d.length - 2);
                        var D = d[r],
                            C = d[r + 1],
                            F = y - k,
                            H = A - n,
                            k = D - k,
                            P = C - n,
                            U = F * k + H * P,
                            n = k * k + P * P;
                        U >= n ? (y = D - y, A = C - A, A = y * y + A * A) : 0 >= U ? A = F * F + H * H : (A = F * P - H * k, A *= A, A /= n + 1E-16);
                        A = Math.sqrt(A);
                        g && (A += Math.max(g[2 * v], g[2 * v + 1] || 0));
                        q[v++] = A;
                        k = D;
                        n = C
                    }
                    v < p && (q[v] = g ? g[2 * v] : 0);
                    g = q;
                    e.push(q)
                }
                c.j =
                    e
            }
            c.O = a;
            a = f = window.Infinity;
            e = g = -window.Infinity;
            h = 0;
            for (p = d.length; h < p;) q = d[h++], a = Math.min(a, q), e = Math.max(e, q), q = d[h++], f = Math.min(f, q), g = Math.max(g, q);
            d = new _.rf;
            d.ra = a;
            d.ua = e;
            d.qa = f;
            d.wa = g;
            c.Va = d;
            return c
        })
    };
    var Vca = function(a, b, c, d) {
        return _.Na(a, function(a) {
            var f = a.path;
            a = a.j;
            var g = null;
            if (b) {
                for (var g = c ? Wca(f) : Xca(f, d), h = {
                        0: 0
                    }, k = 0, n = [0], p = 1, q = a.length; p < q; ++p) {
                    var r = a[p];
                    r in h ? k = h[r] : (k += g(p - 1), h[r] = k);
                    n.push(k)
                }
                g = n
            }
            return {
                path: f,
                j: g
            }
        })
    };
    var Xca = function(a, b) {
        var c = _.yj(a);
        y1(c, b);
        return function(a) {
            a *= 2;
            var b = c[a] - c[a + 2];
            a = c[a + 1] - c[a + 3];
            return Math.sqrt(b * b + a * a)
        }
    };
    var Wca = function(a) {
        return function(b) {
            b *= 2;
            var c = new _.J(a[b], a[b + 1]);
            b = new _.J(a[b + 2], a[b + 3]);
            return _.SA(c, b, 1)
        }
    };
    var Yca = function(a) {
        a.length && (a = R2(a, Zca), a = R2(a, $ca));
        return a
    };
    var R2 = function(a, b) {
        var c = [],
            d = new M1(0),
            e = new M1(0),
            f = new M1(0),
            g = Array(a.length);
        g[0] = a[0];
        g[1] = a[1];
        Q1(a, d);
        for (var h = 2, k = 2; h < a.length;) {
            c[0] = a[h];
            c[1] = a[h + 1];
            Q1(c, f);
            b(d, f, e) && (R1(e, c), g[k++] = c[0], g[k++] = c[1]);
            g[k++] = a[h++];
            g[k++] = a[h++];
            var n = d,
                d = f,
                f = n
        }
        return g
    };
    var Zca = function(a, b, c) {
        if (0 < a.j == 0 < b.j) return !1;
        P1(a, b, S2);
        P1(S2, T2, c);
        c.j = 0;
        if (1E-12 > O1(c, c)) return !1;
        0 > O1(c, a) + O1(c, b) && (c.x = -c.x, c.y = -c.y);
        return !0
    };
    var $ca = function(a, b, c) {
        P1(a, b, S2);
        P1(T2, S2, U2);
        P1(S2, U2, c);
        if (1E-12 > O1(c, c) || 0 < O1(a, U2) == 0 < O1(b, U2)) return !1;
        0 > O1(c, a) + O1(c, b) && (c.x = -c.x, c.y = -c.y, c.j = -c.j);
        return !0
    };
    var ada = function(a, b, c) {
        if (!b) return null;
        var d = [];
        b.forEach(function(a) {
            d.push(bda(a))
        });
        a && _.E(d, _.HI);
        if (c)
            for (a = 0, b = d.length; a < b; ++a) d[a] = Yca(d[a]);
        return d
    };
    var cda = function(a) {
        return _.Na(a, function(a) {
            var c;
            if (a.length) {
                c = a[1];
                for (var d = [0], e = 1, f = 1; e < a.length / 2; ++e, ++f) {
                    var g = a[2 * e + 1];
                    if (180 < Math.abs(c - g)) {
                        var h = g < c ? 1 : -1,
                            k = a[2 * e - 2],
                            n = a[2 * e];
                        a.splice(2 * e, 0, n, g + 360 * h, n, g + 450 * h, 90, g + 450 * h, 90, c - 450 * h, k, c - 450 * h, k, c - 360 * h);
                        d.push(f, f, f, f, f, f - 1);
                        e += 6
                    }
                    d.push(f);
                    c = g
                }
                c = d
            } else c = [];
            return {
                path: a,
                j: c
            }
        })
    };
    var bda = function(a) {
        a = a.j;
        for (var b = a.length, c = Array(2 * b), d = 0, e = 0; d < b; ++d) {
            var f = a[d];
            c[e++] = f.lat();
            c[e++] = f.lng()
        }
        return c
    };
    var e2 = function(a, b) {
        var c = {},
            d = a.get("icons"),
            e = !a.wb && !!_.u(d),
            f = !0;
        c.j = [];
        e && _.E(d, function(a) {
            var b = _.iN(a.offset, ["px", "%"]) || dda;
            a = _.iN(a.repeat, ["px", "%"]) || eda;
            c.j.push({
                offset: b,
                repeat: a
            });
            f = f && (0 == b.value || "%" == b.vc) && (0 == a.value || "%" == a.vc)
        });
        var d = c.O = a.get("geodesic"),
            g = ada(a.wb, a.get("latLngs"), d),
            g = cda(g),
            h = d && f;
        d && e && !h && (g = fda(g));
        g = Vca(g, e, h, b);
        e = c.P = Uca(g);
        if (1 == e.length) d = e[0].Va;
        else
            for (d = new _.rf, g = 0, h = e.length; g < h; ++g) _.IA(d, e[g].Va);
        c.Va = d;
        c.Zb = a;
        c.Xa = {};
        return c
    };
    var fda = function(a) {
        return _.Na(a, function(a) {
            return y2(a, _.Uh, .1)
        })
    };
    var gda = function(a, b) {
        this.P = _.gN;
        this.j = _.fN;
        this.O = a;
        this.S = b
    };
    var d2 = function(a, b) {
        function c(a) {
            return _.Pa(b.get(a), f[a])
        }
        var d = {},
            e = d.wb = b.wb,
            f = e ? a.j : a.P;
        d.strokeColor = c("strokeColor");
        d.j = c("strokeOpacity");
        d.P = c("strokeWeight");
        d.yb = c("clickable");
        e ? (d.T = a.S ? c("strokePosition") : a.j.strokePosition, d.fillColor = c("fillColor"), d.O = c("fillOpacity")) : d.T = a.j.strokePosition;
        var g = b.get("zIndex") || 0;
        d.zIndex = 1E3 * g + _.pb(b) % 1E3;
        d.P = Math.min(d.P, 0 == d.T ? 32 : 16);
        d.$ = b.get("hitStrokeWeight") || hda(d.P, d.T);
        d.S = [];
        d.U = 1;
        if (!e) {
            var e = b.get("icons"),
                h = a.O,
                k = 0;
            _.E(e, function(a) {
                var b =
                    h(a.icon || {}, d.strokeColor, d.j, d.P);
                b.T = !a.fixedRotation;
                d.S.push(b);
                k = Math.max(k, b.j);
                k = Math.max(k, b.O)
            });
            _.Ka(0, k) || (_.Ka(0, d.j) || _.Ka(0, d.P)) && 1 == d.S.length || (d.U = Math.max(k, d.j));
            _.u(e) && (e = b.get("map"), _.Y(e, "Os"), _.Bl("Os", "-p", b, !(!e || !e.Ga)))
        }
        return d
    };
    var hda = function(a, b) {
        switch (b) {
            case 1:
                return 0;
            case 2:
                return 2 * a;
            default:
                return a
        }
    };
    var ida = function(a) {
        var b = a.__gm.$;
        if (!b.j) {
            var c = a.__gm,
                d = _.cJ(),
                e = jda(),
                f = new _.yc;
            (new b2(b, f, new gda(d, 1 == e))).bindTo("projection", a);
            var g = _.sf(-100, -200, 100, 200),
                d = new _.yc;
            new Tca(f, new _.QI(g), d, new _.QI(g), !(!a || !a.Ga));
            f = _.zk(a.getDiv());
            e = new N2(e, new _.M(256, 256), _.Kk, f);
            e = (0, _.t)(e.T, e);
            e = new F2(d, e);
            e.bindTo("projection", a);
            var h = new D2(d, c, function(b) {
                return a.getProjection().fromPointToLatLng(b)
            });
            a.__gm.j.oc(h);
            _.CI(a, e, "overlayLayer", 30);
            var k = new k2;
            k.bindTo("panes", c);
            k.bindTo("projection",
                a);
            k.bindTo("zoom", c);
            k.bindTo("projectionCenterQ", c);
            k.bindTo("offset", c);
            _.G.bind(a, "click", k, k.sd);
            _.K("geometry", function(d) {
                var e = new V1(function(a, b, c) {
                    return a.get("geodesic") ? new S1(a, b, c, d.computeHeading, d.computeOffset, d.computeOffsetOrigin) : new U1(a, b, c)
                }, a);
                $1(a, e);
                _.G.addListener(b, "insert", function(b) {
                    a2(b, e);
                    Oca(b, a, k, d.interpolate);
                    zca(b, c, h, a.__gm.j);
                    if (!b.P) {
                        var f = b.wb ? "Op" : "Ol";
                        _.Y(a, f);
                        _.Bl(f, "-p", b, !(!a || !a.Ga))
                    }
                    _.G.addListener(b, "click", function() {
                        b.wb ? b.P || _.Bl("Op", "-i", b, !(!a || !a.Ga)) : _.Bl("Ol", "-i", b, !(!a || !a.Ga))
                    })
                })
            });
            _.G.addListener(b, "remove", function(a) {
                _.E(a.oa, _.G.removeListener);
                delete a.draggable_changed;
                delete a.oa;
                _.Cl("Od", "-p", a);
                delete a.editable_changed;
                E2(a);
                _.G.trigger(k, "toolbar", {
                    Pb: !1,
                    Dc: a
                });
                a.U && (_.G.removeListener(a.U), delete a.U);
                _.Cl("Oe", "-p", a);
                a.set("capturing", !1);
                delete a.capturing_changed;
                if (!a.P)
                    if (a.wb) _.Cl("Op", "-p", a);
                    else {
                        _.Cl("Ol", "-p", a);
                        var b = a.get("icons");
                        _.u(b) && _.Cl("Os", "-p", a)
                    }
            })
        }
    };
    var jda = function() {
        var a = 0;
        _.YB() ? a = 1 : _.nI() && (a = 1 == _.W.type && _.hk(_.W.version, 8) ? 3 : 2);
        return a
    };
    var V2 = function(a, b, c) {
        if (!a || !b || !c) return null;
        var d = c.lat(),
            e = c.lng();
        c = b & 1 ? d : a.O.O;
        var f = b & 2 ? e : a.j.j,
            d = b & 4 ? d : a.O.j,
            g = b & 8 ? e : a.j.O;
        if (c > d) {
            var h = c;
            c = d;
            d = h
        }
        b & 10 && !a.j.contains(e) && (h = _.jd(e, a.j.j), a = _.jd(a.j.O, e), b & 2 ? h > a : a > h) && (h = f, f = g, g = h);
        return _.nd(c, f, d, g)
    };
    var W2 = function() {
        var a = new _.dg({
            clickable: !1,
            fillOpacity: 0
        });
        a.bindTo("map", this);
        a.bindTo("strokeColor", this);
        a.bindTo("strokeOpacity", this);
        a.bindTo("strokeWeight", this);
        var b = new _.yv(["bounds", "freeControlPoint", "freeVertexPosition"], "return", V2);
        b.bindTo("bounds", this);
        b.bindTo("freeControlPoint", this);
        b.bindTo("freeVertexPosition", this);
        a.bindTo("bounds", b, "return");
        this.j = _.cN();
        this.j.bindTo("zIndex", this);
        a.bindTo("zIndex", this.j, "ghostZIndex")
    };
    var X2 = function(a, b) {
        this.$ = a;
        this.U = b;
        this.P = this.T = null;
        this.O = new _.wc;
        _.G.bind(this.O, "set_at", this, this.Rq);
        this.S = new _.wc;
        _.G.bind(this.S, "set_at", this, this.Sq);
        this.j = !1
    };
    var Y2 = function(a, b, c) {
        var d;
        d = c ? new D1(a.O, kda, lda, !1, b.overlayMouseTarget, a.U) : new D1(a.S, mda, nda, !0, b.overlayMouseTarget, a.U);
        d.bindTo("projection", a);
        d.bindTo("zoom", a);
        d.bindTo("projectionCenterQ", a);
        d.bindTo("panningEnabled", a);
        d.bindTo("mapPixelBounds", a);
        d.bindTo("color", a);
        d.bindTo("zIndex", a);
        d.bindTo("offset", a);
        var e = a.$,
            f = c ? Z2 : $2,
            g;
        _.G.addListener(d, "dragstart", function(b) {
            g = a.get("bounds");
            e.bindTo("freeVertexPosition", d);
            e.set("freeControlPoint", f[b]);
            e.set("map", a.get("map"))
        });
        _.G.addListener(d,
            "dragend",
            function(b, c) {
                e.set("map", null);
                _.G.trigger(a, "toolbar", {
                    Pb: !0,
                    position: c,
                    action: function() {
                        a.set("bounds", g)
                    }
                })
            });
        _.G.forward(d, "dragstart", a);
        _.G.forward(d, "dragend", a);
        _.G.forward(d, "panbynow", a);
        return d
    };
    var a3 = function(a) {
        a && (a.unbindAll(), a.release(), _.G.clearInstanceListeners(a))
    };
    var b3 = function(a, b, c) {
        a.j || (a.j = !0, b = V2(a.get("bounds"), b, c), a.set("bounds", b), a.j = !1)
    };
    var oda = function(a, b) {
        function c() {
            a.get("editable") ? pda(a, b) : (c3(a), _.G.trigger(a, "toolbar", {
                Pb: !1
            }))
        }
        a.editable_changed = c;
        c()
    };
    var pda = function(a, b) {
        if (!a.P) {
            var c = new _.eN(a, !0);
            a.S = c;
            var d = new W2;
            d.bindTo("strokeColor", c);
            d.bindTo("strokeOpacity", c, "ghostStrokeOpacity");
            d.bindTo("strokeWeight", c);
            d.bindTo("bounds", a);
            d.bindTo("zIndex", a);
            a.T = d;
            var e = b.__gm;
            a.j = x1(e);
            var f = _.GI(e, a),
                g = _.ok() ? 9 : 0,
                h = _.Lk.T ? new H1 : new I1,
                d = new X2(d, function(b, c, d, e) {
                    return new A1(b, a.j || null, g, c, f, d, h, e)
                });
            d.set("map", b);
            d.bindTo("bounds", a);
            d.bindTo("panes", e);
            d.bindTo("projection", b);
            d.bindTo("zoom", e);
            d.bindTo("projectionCenterQ", e);
            d.bindTo("panningEnabled",
                b, "draggable");
            d.bindTo("mapPixelBounds", e, "pixelBounds");
            d.bindTo("offset", e);
            d.bindTo("color", c, "strokeColor");
            d.bindTo("zIndex", a);
            d.bindTo("suppressGhostControlPoints", a);
            a.P = d;
            _.G.addListener(d, "dragstart", function() {
                a.set("capturing", !0)
            });
            _.G.addListener(d, "dragend", function() {
                a.set("capturing", !1)
            });
            _.G.forward(d, "panbynow", e);
            _.G.forward(d, "toolbar", a)
        }
    };
    var c3 = function(a) {
        var b = a.P;
        b && (b.unbindAll(), b.set("map", null), _.G.clearInstanceListeners(b), delete a.P, a.j.release(), delete a.j, a.set("capturing", !1), a.T.unbindAll(), delete a.T, a.S.release(), delete a.S)
    };
    var d3 = function(a, b, c) {
        this.O = a;
        this.Ta = c;
        a = a.get("bounds");
        this.S = a.getSouthWest();
        this.P = a.getNorthEast();
        this.j = c.fromDivPixelToLatLng(b)
    };
    var e3 = function() {
        var a = this,
            b = this.j = new _.Ud;
        b.P = !0;
        b.bindTo("capturing", a);
        b.bindTo("cursor", a);
        b.bindTo("map", a);
        b.bindTo("strokeColor", a);
        b.bindTo("strokeOpacity", a);
        b.bindTo("strokeWeight", a);
        b.bindTo("strokePosition", a);
        b.bindTo("fillColor", a);
        b.bindTo("fillOpacity", a);
        b.bindTo("clickable", a);
        b.bindTo("zIndex", a);
        b.bindTo("suppressUndo", a);
        var c = this.O = [];
        _.E(C1, function(d) {
            c.push(_.G.forward(b, d, a))
        });
        c.push(_.G.forward(a, "toolbar", b))
    };
    var qda = function(a) {
        var b = a.__gm.na;
        if (!b.j) {
            var c = new V1(function(a, b, c) {
                return new d3(a, b, c)
            }, a);
            $1(a, c);
            b.j = function(b) {
                a2(b, c);
                var e = b.Rj = new e3;
                e.set("map", a);
                e.bindTo("bounds", b);
                e.bindTo("capturing", b);
                e.bindTo("cursor", b);
                e.bindTo("clickable", b);
                e.bindTo("fillColor", b);
                e.bindTo("fillOpacity", b);
                e.bindTo("strokeColor", b);
                e.bindTo("strokeOpacity", b);
                e.bindTo("strokeWeight", b);
                e.bindTo("strokePosition", b);
                e.bindTo("suppressUndo", b);
                e.bindTo("zIndex", b);
                var f = b.Pa = [];
                _.E(C1, function(a) {
                    f.push(_.G.forward(e,
                        a, b))
                });
                f.push(_.G.forward(b, "toolbar", e));
                oda(b, a);
                _.Y(a, "Or");
                _.Bl("Or", "-p", b, !(!a || !a.Ga));
                _.G.addListener(b, "click", function() {
                    _.Bl("Or", "-i", b, !(!a || !a.Ga))
                })
            };
            b.onRemove = function(a) {
                var b = a.Rj;
                b.unbindAll();
                b.set("map", null);
                b.release();
                delete a.Rj;
                _.E(a.Pa, _.G.removeListener);
                delete a.Pa;
                delete a.editable_changed;
                c3(a);
                _.Cl("Or", "-p", a)
            }
        }
    };
    var f3 = function() {};
    _.nf.prototype.Ie = _.vi(6, function(a, b) {
        this.j == a && this.O == b && (this.O = this.j = null)
    });
    _.nf.prototype.Je = _.vi(5, function(a, b) {
        this.j = a;
        this.O = b
    });
    var C1 = "click dblclick mousedown mousemove mouseout mouseover mouseup rightclick".split(" ");
    _.w(z1, _.I);
    z1.prototype.O = function(a, b, c, d, e) {
        return !e && d && a ? _.SA(d, a, c) : b
    };
    _.w(A1, _.I);
    A1.prototype.release = function() {
        _.Hj(this.j);
        _.E(this.ya, _.G.removeListener);
        this.ya.length = 0;
        this.P.unbindAll();
        this.P.release();
        this.oa.unbindAll();
        this.U.set("active", !1)
    };
    A1.prototype.position_changed = function() {
        var a = this.get("position");
        if (a) {
            var b = 5 + this.$;
            _.Ak(this.j, new _.L(a.x - b, a.y - b))
        }
    };
    A1.prototype.color_changed = function() {
        var a = this.get("color");
        this.T.j(this.j, a);
        B1(this)
    };
    _.w(D1, _.I);
    D1.prototype.release = function() {
        _.E(this.na, _.G.removeListener);
        this.na.length = 0;
        _.E(this.j, (0, _.t)(this.oa, this));
        this.j.length = 0;
        _.G.clearInstanceListeners(this.O);
        _.Hj(this.O)
    };
    D1.prototype.zIndex_changed = function() {
        var a = this.get("zIndex") || 0;
        this.S && --a;
        _.Jk(this.O, a)
    };
    D1.prototype.T = function(a, b) {
        function c(a) {
            var b = e.index,
                c = f.get("pixelPosition");
            _.G.trigger(d, a, b, c)
        }
        var d = this,
            e = {};
        e.index = b;
        d.j.splice(b, 0, e);
        var f = new _.eI;
        f.bindTo("projection", d);
        f.bindTo("zoom", d);
        f.bindTo("center", d, "projectionCenterQ");
        f.bindTo("offset", d);
        f.set("latLngPosition", a);
        e.Nd = f;
        var g = this.va(d.O, d.$[b % d.$.length], d.U[b % d.U.length], d.S);
        g.bindTo("position", f, "pixelPosition");
        g.bindTo("color", d);
        g.bindTo("panningEnabled", d);
        g.bindTo("mapPixelBounds", d);
        e.j = g;
        var h = [_.G.addListener(g,
            "dragstart",
            function() {
                d.bindTo("freeVertexPosition", f, "latLngPosition");
                c("dragstart")
            }), _.G.addListener(g, "dragend", function() {
            d.ta.setAt(e.index, f.get("latLngPosition"));
            c("dragend")
        }), _.G.forward(g, "panbynow", d)];
        _.E(C1, function(a) {
            h.push(_.G.addListener(g, a, function() {
                c(a)
            }))
        });
        e.Pa = h
    };
    D1.prototype.oa = function(a) {
        a.j.unbindAll();
        a.j.release();
        a.Nd.unbindAll();
        _.E(a.Pa, _.G.removeListener);
        a.Pa.length = 0
    };
    _.w(F1, _.I);
    var rca = ["pointer", "row-resize", "row-resize", "col-resize", "col-resize"],
        sca = [0, 2, 2, 1, 1];
    _.m = F1.prototype;
    _.m.map_changed = function() {
        this.get("map") || (this.P.set("map", null), G1(this), _.G.clearInstanceListeners(this.j))
    };
    _.m.panes_changed = function() {
        G1(this);
        this.O = qca(this)
    };
    _.m.Qp = function() {
        var a = this.j;
        a.clear();
        var b = this.get("center"),
            c = this.get("radius");
        if (b && _.B(c)) {
            var d = this.get("planetRadius"),
                e = _.Ma(c / d),
                f;
            f = _.La(b.lat());
            if (d = c / d) {
                var c = Math.cos(d),
                    d = Math.sin(d),
                    g = Math.sin(f);
                f = Math.atan2(Math.sin(Math.acos((1 - c) / d * Math.tan(f))) * d * Math.cos(f), c - g * g)
            } else f = 0;
            f = _.Ma(f);
            a.push(b);
            c = b.lat() + e;
            90 > c && a.push(new _.J(c, b.lng()));
            e = b.lat() - e; - 90 < e && a.push(new _.J(e, b.lng()));
            180 >= f && (e = b.lng() + f, f = b.lng() - f, a.push(new _.J(b.lat(), e)), a.push(new _.J(b.lat(), f)));
            this.De || _.G.trigger(this, "toolbar", {
                Pb: !1
            })
        }
    };
    _.m.center_changed = F1.prototype.radius_changed = F1.prototype.planetRadius_changed = F1.prototype.Qp;
    _.m.Tq = function(a) {
        var b = this.j.getAt(a);
        if (0 == a) _.XA(this, function() {
            this.De = !0;
            this.set("center", b);
            this.De = !1
        }, 0);
        else {
            var c = _.SA(this.get("center"), b, this.get("planetRadius"));
            _.XA(this, function() {
                this.De = !0;
                this.set("radius", c);
                this.De = !1
            }, 0)
        }
    };
    H1.prototype.P = function(a, b, c, d, e) {
        a = _.X("div", a, new _.L(b, b), new _.M(c, c));
        a.style.borderWidth = _.T(d);
        a.style.borderStyle = "solid";
        a.style.borderRadius = _.T(Math.ceil(c / 2 + d));
        _.Mk(a, e)
    };
    H1.prototype.j = function(a, b) {
        a.firstChild.style.borderColor = b
    };
    H1.prototype.O = function(a, b) {
        a.firstChild.style.backgroundColor = b
    };
    I1.prototype.P = function(a, b, c, d, e) {
        a.innerHTML = "<gm_v:oval></gm_v:oval>";
        a = a.firstChild;
        _.Ak(a, new _.L(b, b));
        _.vf(a, new _.M(c + 1, c + 1));
        _.pI(a).opacity = e;
        b = _.rI(a);
        b.opacity = e;
        b.weight = d
    };
    I1.prototype.j = function(a, b) {
        _.rI(a.firstChild).color = b
    };
    I1.prototype.O = function(a, b) {
        _.pI(a.firstChild).color = b
    };
    var g3 = new _.J(90, 0),
        h3 = new _.J(-90, 0);
    K1.prototype.moveTo = function(a) {
        a = this.Ta.fromDivPixelToLatLng(a);
        var b = this.P(a, this.j, this.S);
        b || (b = Math.abs(_.SA(a, g3) - this.j) < Math.abs(_.SA(a, h3) - this.j) ? g3 : h3);
        this.O.set("center", b)
    };
    _.w(L1, _.R);
    L1.prototype.center_changed = L1.prototype.radius_changed = L1.prototype.planetRadius_changed = function() {
        this.Ba()
    };
    L1.prototype.Ia = function() {
        var a = this.j;
        if (a) {
            var b = this.get("radius"),
                c = this.get("center");
            _.B(b) && c ? (b /= this.get("planetRadius"), a.setPaths(vca(c, b))) : a.setPaths([])
        }
    };
    L1.prototype.release = function() {
        for (var a = this.O, b = 0, c = a.length; b < c; ++b) _.G.removeListener(a[b]);
        this.O = null;
        this.j.unbindAll();
        this.j = null
    };
    S1.prototype.moveTo = function(a) {
        var b = this;
        a = b.Ta.fromDivPixelToLatLng(a);
        var c = this.T(a, this.$, this.na);
        c ? 89 < Math.abs(c.lat()) && (c = new _.J(_.Ia(c.lat(), -89, 89), c.lng())) : c = new _.J(this.O.lat(), a.lng() - this.P);
        b.j.get("latLngs").forEach(function(a, e) {
            for (var f = 0, g = a.getLength(); f < g; ++f) {
                var h = b.U(c, b.S[e][f].Yc, b.S[e][f].heading);
                a.setAt(f, h)
            }
        });
        this.O = c;
        this.P = a.lng() - c.lng()
    };
    _.w(T1, _.Xj);
    U1.prototype.moveTo = function(a) {
        var b = this.O.get("latLngs"),
            c = this.Ta,
            d = c.fromLatLngToDivPixel(this.j),
            e = new _.L(d.x - a.x, d.y - a.y);
        _.E(this.P, function(a, d) {
            var h = b.getAt(d);
            _.E(a, function(a, b) {
                var d = c.fromLatLngToDivPixel(a);
                d.x -= e.x;
                d.y -= e.y;
                h.setAt(b, c.fromDivPixelToLatLng(d))
            })
        })
    };
    _.w(V1, _.I);
    V1.prototype.release = function() {
        this.P && (this.P.unbindAll(), this.P.release(), this.P = null);
        _.E(this.U, _.G.removeListener);
        this.U = null;
        _.E(this.ya, _.G.removeListener);
        this.ya = null;
        this.O && _.Gj(this.O);
        this.O = null
    };
    var W1 = new _.M(30, 30),
        X1 = new _.L(W1.width / 2, W1.height / 2);
    _.m = V1.prototype;
    _.m.active_changed = V1.prototype.panes_changed = V1.prototype.poly_changed = V1.prototype.projectionController_changed = function() {
        if (!this.get("active") && !this.T) {
            var a = this.get("panes"),
                b = this.get("projectionController"),
                c = this.get("poly");
            if (a != this.S || b != this.Ta || c != this.j) this.S = a, this.Ta = b, this.j = c, _.E(this.ya, _.G.removeListener), this.ya = null, this.S && this.Ta && this.j ? (this.ya = _.ok() ? [_.G.bind(this.j, "mousedown", this, this.hp), _.G.bind(this.j, "mouseup", this, this.jp)] : [_.G.bind(this.j, "mousemove", this,
                this.ip)], this.bindTo("draggable", this.j)) : (this.unbind("draggable"), this.set("draggable", !1))
        }
    };
    _.m.draggable_changed = function() {
        this.get("draggable") && !_.ok() ? (this.S.overlayMouseTarget.appendChild(this.O), Y1(this, !!this.get("active"))) : this.O && this.O.parentNode && this.O.parentNode.removeChild(this.O)
    };
    _.m.Ll = function(a) {
        _.fb(a);
        Z1(this, "click", a)
    };
    _.m.Pl = function(a) {
        this.set("mousedown", !0);
        Y1(this, !0);
        Z1(this, "mousedown", a)
    };
    _.m.Rl = function(a) {
        Y1(this, !1);
        this.set("mousedown", !1);
        Z1(this, "mouseup", a)
    };
    _.m.Ql = function(a) {
        this.get("active") ? _.fb(a) : Z1(this, "mousemove", a)
    };
    _.m.ip = function(a) {
        if (a = a.Jb) a = _.zl(a, this.S.overlayMouseTarget), this.set("position", a)
    };
    _.m.hi = function() {
        var a = this.get("position");
        this.set("dragging", !0);
        this.oa = this.$(this.j, a, this.Ta);
        this.j.set("capturing", !0);
        Z1(this, "dragstart");
        this.na = this.j.get("editable");
        this.j.set("editable", !1)
    };
    _.m.ng = function() {
        this.j.set("editable", this.na);
        Z1(this, "dragend");
        this.j.set("capturing", !1);
        this.set("dragging", !1)
    };
    _.m.position_changed = function() {
        var a = this.get("position");
        _.ok() || _.Ak(this.O, new _.L(a.x - X1.x, a.y - X1.y));
        this.get("dragging") && (this.oa.moveTo(a), Z1(this, "drag"))
    };
    _.m.Nl = function(a) {
        a && _.Ql(a) || !this.T || !this.j || this.get("dragging") || (a = this.Ta.fromLatLngToDivPixel(a.latLng), this.set("position", a), this.hi())
    };
    _.m.Ol = function(a) {
        if (this.get("dragging")) {
            if (1 != a.scale) this.ng();
            else if (this.T) {
                var b = this.Ta.fromLatLngToDivPixel(a.latLng);
                this.set("position", b)
            }
            _.GC(a)
        }
    };
    _.m.Ml = function(a) {
        this.get("dragging") && (this.ng(), _.GC(a))
    };
    _.m.hp = function() {
        this.T = !!this.get("draggable")
    };
    _.m.jp = function() {
        this.T = !1
    };
    _.w(b2, _.I);
    b2.prototype.projection_changed = function() {
        var a = this;
        a.$.forEach(function(b) {
            if (b.get("icons")) {
                var c = _.pb(b);
                a.j[c] = b;
                g2(b)
            }
        });
        h2(a)
    };
    var Aca = {
            latLngs: 1,
            geodesic: 1,
            icons: 1
        },
        Bca = {
            strokeColor: 1,
            strokeOpacity: 1,
            strokePosition: 1,
            strokeWeight: 1,
            fillColor: 1,
            fillOpacity: 1,
            hitStrokeWeight: 1,
            zIndex: 1,
            clickable: 1,
            icons: 1
        };
    _.w(k2, _.I);
    _.m = k2.prototype;
    _.m.panes_changed = function() {
        var a = this.O,
            b = this.get("panes");
        b ? b.floatPane.appendChild(a) : a.parentNode && _.Hj(a)
    };
    _.m.sd = function() {
        _.QC(this.O);
        this.S = null;
        n2(this);
        this.P = null
    };
    _.m.changed = k2.prototype.sd;
    _.m.Sl = function(a) {
        a.Pb ? a.Dc.get("suppressUndo") ? this.sd() : Fca(this, a.position, a.action, a.Dc) : a.Dc == this.P && this.sd()
    };
    _.m.Gp = function(a) {
        _.cb(a);
        this.S();
        this.sd()
    };
    _.m.Lf = function(a) {
        _.pC(this.j, m2, a)
    };
    var Cca = _.Vk("undo_poly"),
        m2 = new _.M(30, 27),
        l2 = _.Eg,
        Dca = new _.L(30, 0),
        Eca = new _.L(60, 0),
        o2 = new _.L(10, -11);
    p2.prototype.getLength = function() {
        var a = this.j.getLength();
        1 < a && ++a;
        return a
    };
    p2.prototype.getAt = function(a) {
        this.j.getLength() == a && 1 < a && (a = 0);
        return this.j.getAt(a)
    };
    _.w(q2, _.I);
    _.m = q2.prototype;
    _.m.release = function() {
        _.E(this.ya, _.G.removeListener)
    };
    _.m.Np = function() {
        var a = this.get("projection"),
            b = this.P;
        if (a)
            for (var c = this.O, d = c.getLength(), e = this.get("geodesic"), f = 0; f < d - 1; ++f) b.setAt(f, s2(c.getAt(f), c.getAt(f + 1), e, a, this.j));
        else b.clear()
    };
    _.m.geodesic_changed = q2.prototype.projection_changed = q2.prototype.Np;
    _.m.Sk = function(a) {
        r2(this, !1, a)
    };
    _.m.Vh = function(a) {
        r2(this, !0, a)
    };
    _.m.Rk = function(a) {
        var b = this.get("projection");
        if (b) {
            var c = this.O,
                d = this.P,
                e = this.get("geodesic");
            a < c.getLength() ? (0 < a && d.setAt(a - 1, s2(c.getAt(a - 1), c.getAt(a), e, b, this.j)), d.removeAt(a)) : 0 < a && d.removeAt(a - 1)
        }
    };
    _.w(t2, _.I);
    t2.prototype.map_changed = function() {
        this.get("map") || (this.T.set("map", null), x2(this))
    };
    t2.prototype.panes_changed = t2.prototype.paths_changed = t2.prototype.suppressGhostControlPoints_changed = function() {
        var a = this;
        x2(a);
        var b = a.get("paths"),
            c = a.get("panes");
        if (b && c) {
            var d = c.overlayMouseTarget;
            b.forEach(function(b) {
                a.O.push(u2(a, b, d));
                a.get("suppressGhostControlPoints") || a.j.push(w2(a, b, d))
            });
            var e = function() {
                _.G.trigger(a, "toolbar", {
                    Pb: !1
                })
            };
            e();
            c = a.U;
            c.push(_.G.addListener(b, "insert_at", function(c) {
                var g = a.get("suppressGhostControlPoints"),
                    h = b.getAt(c);
                a.O.splice(c, 0, u2(a, h, d));
                g || a.j.splice(c,
                    0, w2(a, h, d));
                e()
            }));
            c.push(_.G.addListener(b, "remove_at", function(b) {
                var c = a.get("suppressGhostControlPoints");
                a.P(a.O[b]);
                a.O.splice(b, 1);
                c || (a.P(a.j[b]), a.j.splice(b, 1));
                e()
            }));
            c.push(_.G.addListener(b, "set_at", function(c) {
                var g = a.get("suppressGhostControlPoints");
                a.P(a.O[c]);
                var h = b.getAt(c);
                a.O[c] = u2(a, h, d);
                g || (a.P(a.j[c]), a.j[c] = w2(a, h, d));
                e()
            }))
        }
    };
    t2.prototype.P = function(a) {
        a.unbindAll();
        a.release();
        _.G.clearInstanceListeners(a);
        a.P && (a.P.release(), a.P.unbindAll())
    };
    C2.prototype.getBounds = _.l("O");
    D2.prototype.j = function(a, b) {
        var c = a.Ja,
            d = null,
            e = new _.L(0, 0),
            f = new _.L(0, 0),
            g;
        this.P.forEach(function(a) {
            if (!d) {
                g = 1 << a.zoom;
                f.x = 256 * a.La.x;
                f.y = 256 * a.La.y;
                var b = e.x = Math.round(c.x * g - f.x) + .5,
                    h = e.y = Math.round(c.y * g - f.y) + .5;
                0 <= b && 256 > b && 0 <= h && 256 > h && (d = a)
            }
        });
        if (!d) return null;
        var h = [],
            k = d.Xa,
            n;
        for (n in k) h.push(k[n]);
        h.reverse();
        h.sort(function(a, b) {
            return b.zIndex - a.zIndex || 0
        });
        k = null;
        n = b ? 15 : 0;
        for (var p = 0, q = h.length; p < q; ++p) {
            var r = h[p],
                v = r.O;
            if (v.yb) {
                var x = r.S.Zb,
                    y = v.$ / 2 + n,
                    r = Nca(r.Za);
                if (y = mca(e.x,
                        e.y, y, r)) {
                    k = x;
                    h = a.Ja = new _.L((y[0] + f.x) / g, (y[1] + f.y) / g);
                    a.latLng = this.S(h);
                    break
                }
                if (v.wb && !b && nca(e.x, e.y, r)) {
                    k = x;
                    break
                }
            }
        }
        return k
    };
    D2.prototype.handleEvent = function(a, b, c) {
        if ("mouseout" == a) this.O.set("cursor", "");
        else if ("mousemove" == a) {
            var d = c.get && c.get("cursor");
            _.z(d) || (d = "pointer");
            this.O.set("cursor", d)
        }
        _.G.trigger(c, a, new T1(b.latLng, b.Jb))
    };
    D2.prototype.zIndex = 30;
    _.w(F2, _.I);
    F2.prototype.projection = null;
    F2.prototype.maxZoom = 30;
    F2.prototype.getTile = function(a, b, c) {
        c = c.createElement("div");
        _.vf(c, this.tileSize);
        c.style.overflow = "hidden";
        var d = this.get("projection"),
            d = new C2(a, b, d),
            e = d.getBounds(),
            f = this.O(c),
            g = {};
        g.Va = e;
        g.La = a;
        g.Fa = c;
        g.j = f;
        g.Xa = {};
        g.O = d;
        g.zoom = b;
        c.Ua = g;
        _.zc(this.j, g);
        return c
    };
    F2.prototype.releaseTile = function(a) {
        var b = a.Ua;
        a.Ua = null;
        this.j.remove(b);
        _.Ck(a, "")
    };
    G2.prototype.na = function(a) {
        this.O[_.pb(a)] = a;
        J2(this)
    };
    G2.prototype.ta = function(a) {
        delete this.O[_.pb(a)];
        J2(this)
    };
    G2.prototype.S = function() {
        J2(this)
    };
    L2.prototype.na = function(a) {
        var b = a.element = M2(this);
        _.Ak(b, _.Eg);
        for (var c = a.Za, d = [], e = 0, f = c.length; e < f; ++e)
            for (var g = c[e], h = 0, k = g.length; h < k; h += 2) d.push(h ? "l" : "m"), d.push(Math.round(g[h]), Math.round(g[h + 1]));
        d.push("e");
        b.path = d.join(" ");
        a.P = [];
        b = 0;
        for (c = a.j.length; b < c; ++b) a.P.push(Sca(this, a.j[b]));
        this.S(a)
    };
    L2.prototype.ta = function(a) {
        _.Hj(a.element);
        delete a.element;
        _.E(a.P, function(a) {
            _.E(a, _.Hj)
        });
        delete a.P
    };
    L2.prototype.S = function(a) {
        var b = a.O,
            c = a.element;
        _.Jk(c, b.zIndex);
        _.qI(c, b.fillColor, b.O);
        _.sI(c, b.strokeColor, b.j, b.P);
        for (var c = 0, d = b.S.length; c < d; ++c)
            for (var e = a.P[c], f = b.S[c], g = b.zIndex, h = a.j[c], k = this.P.jc(f.S, f.scale), n = 0, p = void 0; p = e[n]; ++n) p.path = k, _.Jk(p, g), _.qI(p, f.fillColor, f.O), _.sI(p, f.strokeColor, f.j, f.P), p.style.rotation = Math.round(_.Ma(f.rotation + (f.T ? h[3 * n + 2] : 0)))
    };
    N2.prototype.T = function(a, b) {
        switch (this.U) {
            case 1:
                return this.j || (this.j = Rca(this.O, a)), new G2(b, this.P, this.j, a);
            case 2:
                return new L2(b, this.P, !1, this.S, new _.NI);
            case 3:
                return new L2(b, this.P, !0, this.S, new _.NI);
            default:
                return null
        }
    };
    var T2 = new M1(1),
        S2 = new M1(0),
        U2 = new M1(0);
    var dda = {
            value: 100,
            vc: "%"
        },
        eda = {
            value: 0,
            vc: "px"
        };
    _.w(W2, _.I);
    _.w(X2, _.I);
    var Z2 = [12, 6, 9, 3],
        $2 = [1, 2, 4, 8],
        kda = ["ne-resize", "nw-resize", "se-resize", "sw-resize"],
        mda = ["row-resize", "col-resize"],
        lda = [0],
        nda = [2, 1];
    _.m = X2.prototype;
    _.m.map_changed = function() {
        this.get("map") || (this.$.set("map", null), a3(this.T), this.get("suppressGhostControlPoints") || a3(this.P), _.G.clearInstanceListeners(this.O))
    };
    _.m.panes_changed = X2.prototype.suppressGhostControlPoints_changed = function() {
        a3(this.T);
        a3(this.P);
        this.P = null;
        var a = this.get("panes");
        a && (this.T = Y2(this, a, !0), this.get("suppressGhostControlPoints") || (this.P = Y2(this, a, !1)))
    };
    _.m.bounds_changed = function() {
        var a = this.O,
            b = this.S,
            c = this.get("bounds");
        if (c) {
            this.j = !0;
            a.setAt(0, c.getNorthEast());
            a.setAt(1, new _.J(c.O.j, c.j.j, !0));
            a.setAt(2, _.PA(c));
            a.setAt(3, c.getSouthWest());
            var a = c.O.Lc(),
                d = c.j.Lc();
            b.setAt(0, new _.J(c.O.O, d));
            b.setAt(1, new _.J(a, c.j.j));
            b.setAt(2, new _.J(c.O.j, d));
            b.setAt(3, new _.J(a, c.j.O));
            this.j = !1;
            _.G.trigger(this, "toolbar", {
                Pb: !1
            })
        } else a.clear(), b.clear()
    };
    _.m.Rq = function(a) {
        b3(this, Z2[a], this.O.getAt(a))
    };
    _.m.Sq = function(a) {
        b3(this, $2[a], this.S.getAt(a))
    };
    d3.prototype.moveTo = function(a) {
        var b = this.Ta,
            c = b.fromLatLngToDivPixel(this.j),
            d = b.fromLatLngToDivPixel(this.S),
            b = b.fromLatLngToDivPixel(this.P),
            b = new _.L(b.x - c.x + a.x, b.y - c.y + a.y);
        a = new _.md(this.Ta.fromDivPixelToLatLng(new _.L(d.x - c.x + a.x, d.y - c.y + a.y)), this.Ta.fromDivPixelToLatLng(b));
        this.O.set("bounds", a)
    };
    _.w(e3, _.I);
    e3.prototype.bounds_changed = function() {
        var a = this.j;
        if (a) {
            var b = this.get("bounds");
            if (b) {
                var c = b.getSouthWest(),
                    d = b.getNorthEast(),
                    b = b.getCenter();
                a.setPaths([new _.J(d.lat(), d.lng()), new _.J(d.lat(), b.lng()), new _.J(d.lat(), c.lng()), new _.J(c.lat(), c.lng()), new _.J(c.lat(), b.lng()), new _.J(c.lat(), d.lng())])
            } else a.setPaths([])
        }
    };
    e3.prototype.release = function() {
        for (var a = this.O, b = 0, c = a.length; b < c; ++b) _.G.removeListener(a[b]);
        delete this.O;
        this.j.unbindAll();
        delete this.j
    };
    f3.prototype.j = function(a) {
        var b = 0 != a.getVisible() ? a.getMap() : null;
        a.O != b && (a.O && a.O.__gm.P.remove(a), b && (yca(b), _.zc(b.__gm.P, a)), a.O = b)
    };
    f3.prototype.O = function(a) {
        var b = 0 != a.getVisible() ? a.getMap() : null;
        a.S != b && (a.S && a.S.__gm.$.remove(a), b && (ida(b), _.zc(b.__gm.$, a)), a.S = b)
    };
    f3.prototype.P = function(a) {
        var b = 0 != a.getVisible() ? a.getMap() : null;
        a.O != b && (a.O && a.O.__gm.na.remove(a), b && (qda(b), _.zc(b.__gm.na, a)), a.O = b)
    };
    _.nc("poly", new f3);
});
