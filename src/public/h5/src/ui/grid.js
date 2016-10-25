import { Renderable } from '../base/renderable.js'
import * as ball from './ball.js'

function distfast(ax, ay, bx, by) {
    return (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
}

function dist(ax, ay, bx, by) {
    return Math.sqrt(distfast(ax, ay, bx, by));
}

// setInterval(function(){
//     canvas_drag.goto(Math.random() * 300, Math.random() * 300);
// }, 1000);

function sort_render(a, b) {
    return a.hide - b.hide;
}

export var instance;

export class grid extends Renderable {

    constructor(canvas, ctx) {
        super();
        instance = this;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.maincanvas = canvas;
        this.mainctx = ctx;
        this.autoFollowDist = true;
        this.renderMatrix = [];
        this.attractiveRange = 1; //<--change this
        this.updateMatrix = undefined;
        this.x = 0;
        this.y = 0;
        this.dragScaler = -3;
        this.dragging = false;
        this.resize();
        this.visibleLength = 0;
        this._sqrt_visibleLength = 0;
        this.filter = () => true;
        this.ratio = 1;
    }

    goto(x, y) {
        this.x = x;
        this.y = y;
        // this.easeTo("x", x);
        // this.easeTo("y", y);
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        // this.easeTo("x", this.abs('x') + dx);
        // this.easeTo("y", this.abs('y') + dy);
    }

    _suppress_ble() {
        this._autoFollowDist = this.autoFollowDist;
        if (this.autoFollowDist) {
            this._autoFollowedTarget = this.selected();
        }
        this.autoFollowDist = false;
    }

    _restore_ble() {
        if (this._autoFollowDist !== this.autoFollowDist) {
            if (this.selected() != this._autoFollowedTarget) {
                this.autoFollowDist = false;
            } else {
                this.autoFollowDist = true;
            }
        }
    }

    _update_drag() {
        if (ctl.pressed && !this.dragging) {
            this.dragging = true;
            this._suppress_ble();
        }
        else if (ctl.pressed && this.dragging) {
            this.move(ctl.dx * this.dragScaler, ctl.dy * this.dragScaler);
        } else if (this.dragging) {
            //end
            // var sel = this.selected();
            // if (sel) {
            //     this.goto(sel.absX, sel.absY);
            // }
            this._reselect = true;
            this.select(this.selected());
            this.dragging = false;
            this._restore_ble();
        }
    }

    resize() {
        this.ratio = window.devicePixelRatio || 1;
        this.canvas.setAttribute('width', global_width * this.ratio);
        this.canvas.setAttribute('height', global_height * this.ratio);
        this.updateGridsize();
    }

    updateGridsize() {
        this.easeTo('gridSize', global_width / 3);
        this.easeTo('gridHalf', this.abs('gridSize') / 2);
        this.easeTo('itemSize', this.abs('gridSize') * 0.5);
    }

    runFilter(fn) {
        if (fn) {
            this.filter = fn;
        } else {
            fn = this.filter;
        }
        var arr = this.renderMatrix;
        var hide = undefined;
        var len = 0;
        for (var i = 0; i < arr.length; i++) {
            hide = !fn(arr[i], i);
            if (arr[i].hide != hide) {
                arr[i].hide = hide;
                arr[i].hide_changed = true;
            }
            if (!hide) {
                arr[i].index = len;
                len++;
            } else {
                arr[i].index = -1;
            }
        }
        this.renderMatrix.sort(sort_render);
        this._retainSelection = 1;
        this.visibleLength = len;
        this._sqrt_visibleLength = ~~(Math.sqrt(this.visibleLength));
    }

    update() {

        // isclick
        // if (ctl.clicked) {
        //     ctl.easeTo("magnification", 1, 0.01);
        //     document.getElementById('search').style.display = "none";
        // }
        //form a nice shape plz

        this.updateGridsize();

        if (this.updateMatrix) {
            this.renderMatrix = this.updateMatrix;
            this.updateMatrix = undefined;
            this.runFilter();
        }
        var arr = this.renderMatrix;
        // var motion = dist(0, 0, canvas_drag.rel_eased_vv[0], canvas_drag.rel_eased_vv[1]) / 100;

        var viewX = this.x;
        var viewY = this.y;

        var realX = this.abs('x');
        var realY = this.abs('y');

        var minD = 9999999999;
        var minIndex = -1;
        //calculate nice w/h 
        var s = this._sqrt_visibleLength;
        var off = s / 2 * this.gridSize;

        var ctlRX = (ctl.x - global_width / 2);
        var ctlRY = (ctl.y - global_height / 2);
        this.easeTo('mag', ctl.stationaryM * ctl.magnification * (this.selected() ? Math.max(0, 500 - distfast(this.selected().x, this.selected().y, 0, 0)) / 500 : 0));
        for (var i = 0; i < arr.length; i++) {
            //magic..
            // arr[i].x = curX * (arr[i].s * (2 * motion));
            // arr[i].y = curY * (arr[i].s * (2 * motion));
            // //morphy
            if (!arr[i].hide) {
                var index = arr[i].index;
                var absX = ((~~(index / s) % 2) ? 0 : this.gridHalf) + (index % s) * this.gridSize - off;
                var absY = ~~(index / s) * this.gridSize - off;
                var curX = absX - viewX;
                var curY = absY - viewY;

                // arr[i].x = curX * (arr[i].s * (2 * motion));
                // arr[i].y = curY * (arr[i].s * (2 * motion));
                var d = dist(curX, curY, 0, 0);
                var selection = distfast(absX - realX, absY - realY, 0, 0);
                arr[i].absX = absX;
                arr[i].absY = absY;
                arr[i].selected = false;
                //normalize
                arr[i].easeTo("select_time", 0);
                var _s = 1 - ((d / global_height)) / 1.;
                _s = _s < 0 ? 0 : Math.pow(_s, (2.5 - ctl.stationaryM));

                var dv = dist(arr[i].x, arr[i].y, 0, 0);
                var _ds = 1 - ((dv / global_height)) / 1.;
                _ds = _ds < 0 ? 0 : Math.pow(_ds, (2.5 - ctl.stationaryM)) * (1 + this.mag * 0.8);
                arr[i].easeTo('s', _ds, 1);

                arr[i].easeTo('x', curX * (1.5 + this.mag + _s) * (0.5 + this.mag), this.dragging ? 0.1 : 0.06);
                arr[i].easeTo('y', curY * (1.5 + this.mag + _s) * (0.5 + this.mag), this.dragging ? 0.1 : 0.06);

                if (ctl.clicked) {
                    // console.log(arr[i].x, arr[i].y, ctlRX, ctlRY);
                    if (arr[i].isClicked(ctlRX, ctlRY, this.itemSize)) {
                        // console.log(arr[i]);
                        minIndex = i;
                    }
                } else if (this.autoFollowDist) {
                    if (arr[i].distance >= 0 && minD >= arr[i].distance && arr[i].distance <= this.attractiveRange) {
                        minIndex = i;
                        minD = arr[i].distance;
                    }
                } else {
                    //snap
                    if (minD >= selection) {
                        minD = selection;
                        minIndex = i;
                    }
                }
            } else if (arr[i].abs('s') > 0) {
                arr[i].easeTo('s', 0, 0.2);
            }
            arr[i].hide_changed = false;
            // canvas_drag.measureBorder(absX - off, absY - off);
            //locking would be better solution
        }

        if (minIndex >= 0) {
            if (!this._retainSelection) {
                this.select(arr[minIndex]);
            } else if (this.selected() && !this.selected().hide) {
                //might move?
                if (this.selected().abs('x') * this.selected().abs('x') +
                    this.selected().abs('y') * this.selected().abs('y') > 0) {
                    this._reselect = true;
                    this.select(this.selected());
                }
            }
        } else if (!this.isFollowingBeacon()) {
            ctl.easeTo("selected", 0);
            arr.selected = this._selected = undefined;
        } else {
            //no nothing
            this.select(this.selected());
        }
        this._retainSelection = 0;

        this._update_drag();
    }

    select(obj) {
        if (obj && !obj.hide) {
            obj.selected = true;
            obj.easeTo("select_time", 1);
            this.renderMatrix.selected = this._selected = obj;
            ctl.easeTo("selected", 1);
        }

        if (this.selected() && (!ctl.pressed || this._reselect)) {
            this._reselect = false;
            this.goto(this.selected().absX, this.selected().absY);
        }
    }

    draw() {
        ball.assets_pass({});
        var ctx = this.ctx;
        var halfGW = global_width / 2;
        var halfGH = global_height / 2;
        var borderL = -halfGW - this.gridHalf;
        var borderT = -halfGH - this.gridHalf;
        var cur;
        ctx.save();
        ctx.scale(this.ratio, this.ratio);
        ctx.clearRect(0, 0, global_width, global_height);
        ctx.translate(halfGW, halfGH);

        for (var i = 0; i < this.renderMatrix.length; i++) {
            cur = this.renderMatrix[i];
            if (cur.s > 0.1 &&
                cur.x > borderL && cur.x < -borderL &&
                cur.y > borderT && cur.y < -borderT
            ) {
                if (cur == this.selected()) continue;
                cur.draw(this.ctx, this.itemSize);
            }
        }
        ctx.restore();
        this.mainctx.drawImage(this.canvas, 0, 0, global_width, global_height);
        this.mainctx.translate(halfGW, halfGH);
        if (this.selected()) {
            this.selected().draw(this.mainctx, this.itemSize); //z-sort
        }

        // ctx.translate(-halfGW, -halfGH);
    }

    selected() {
        return this._selected;
    }

    setMatrix(arr) {
        this.updateMatrix = arr;
    }

    setBeaconFollow(val) {
        if (val == undefined) {
            val = true;
        }
        this.autoFollowDist = val;
        return this.autoFollowDist;
    }

    isFollowingBeacon() {
        return this.autoFollowDist;
    }
    // BUG
    uuid() {
        let balls = {}
        var arr = this.renderMatrix;
        for (var i = 0; i < arr.length; i++) {
            balls[arr[i].data.uuid] = arr[i]
        }
        return { balls }
    }
}
