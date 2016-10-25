
var fastlist = require('./fast-list.js');

var easelist = [];
var RESOLUTION = 0.001;
// var prevT = Date.now();

export function update() {
    var len = easelist.length;
    // var t = (Date.now() - prevT) / 10;
    // prevT = Date.now();
    for (var i = 0; i < len; i++) {
        var cur = easelist[i];
        if (!cur.__ease_enabled__) continue;
        cur.__ease_enabled__ = false;
        for (var key in cur.__ease__) {
            if (!cur.__ease__.hasOwnProperty(key)) continue;
            let curve = cur.__ease__[key];
            let delta = curve[0] - cur[key];
            if (delta > RESOLUTION || delta < -RESOLUTION) {
                cur[key] += delta * curve[1];
                cur.__ease_enabled__ = true;
            } else {
                cur[key] = curve[0];
                // delete cur.__ease__[key];
            }
        }
    }
}

Object.prototype.easeTo = Object.prototype.ease = function (p, v, perc) {
    if (!this.hasOwnProperty('__ease_enabled__')) {
        easelist.push(this);
    }
    this.__ease_enabled__ = true;
    perc = perc || 0.09;
    if (this.__ease__ == undefined) {
        this.__ease__ = {};
    }
    if (!this.__ease__[p]) {
        this.__ease__[p] = [v, perc];
    } else {
        this.__ease__[p][0] = v;
        this.__ease__[p][1] = perc;
    }
    if (this[p] == undefined) {
        this[p] = 0;
    }
};

Object.prototype.abs = Object.prototype.raw = function (p) {
    return (!this.__ease__ || this.__ease__[p] == undefined) ? this[p] : this.__ease__[p][0];
}
