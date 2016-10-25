import ease from '../base/ease.js'
import { Renderable } from '../base/renderable.js'
import {instance} from "./grid.js";

var shadow_canvas, lens_canvas;

var _prerender = {
    shadow: function () {
        if (!shadow_canvas) {
            shadow_canvas = document.createElement("canvas");
        }

        var canvas = shadow_canvas;
        canvas._ctx = canvas._ctx || canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;
        var ctx = canvas._ctx;
        var grd = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width / 3.5, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        grd.addColorStop(0, "rgba(0, 0, 0, 0.5)");
        grd.addColorStop(1, "rgba(255,255,255,0)");

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.width);
    },
    lens: function () {
        if (!lens_canvas) {
            lens_canvas = document.createElement("canvas");
        }
        var canvas = lens_canvas;
        canvas._ctx = canvas._ctx || canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;
        var ctx = canvas._ctx;
        var grd = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width / 5, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        grd.addColorStop(0, "rgba(255,255,255,1)");
        grd.addColorStop(1, "rgba(222,222,222, 0)");
        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.width);
    }
};

export function assets_pass(opts) {
    for (var t in _prerender) {
        if (_prerender.hasOwnProperty(t)) {
            _prerender[t](opts);
        }
    }
}

var MMAP_LEVEL = 3;
var MMAP_RES_MAX = 256;

function getFBO(fboArr, size) {
    var cur = fboArr[0];
    for (var i = 0; i < fboArr.length; i++) {
        if (fboArr[i].width < size) {
            return cur;
        }
        cur = fboArr[i];
    }
    return cur;
}

function generateFBO(FBO, img) {
    if (!img) {
        for (var j = 1; j <= MMAP_LEVEL; j++) {
            FBO[j - 1] = document.createElement("canvas")
            FBO[j - 1].width = MMAP_RES_MAX / j;
            FBO[j - 1].height = MMAP_RES_MAX / j;
        }
        return;
    }
    for (var j = 0; j < MMAP_LEVEL; j++) {
        var cv = FBO[j];
        var ctx = cv.getContext('2d');
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        ctx.globalCompositeOperation = "destination-in";
        ctx.beginPath();
        ctx.arc(cv.width / 2, cv.width / 2, cv.width / 2, 0, Math.PI * 2, false);
        // ctx.clip();
        if (flags.FBO_DEBUG) {
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "rgba(" + ((j % 3 + j % 2) * 80) + ", " + ((j % 5 + j % 7) * 80) + ", 0, 1)";
            ctx.fillRect(0, 0, cv.width, cv.height);
        }
        ctx.closePath();
        ctx.fill();
    }
}



function draw(cur, itemSize, ctx) {

    var magSq = Math.pow(instance.mag, 2);
    var r = ~~((magSq) * 0) + 255;
    var g = ~~((magSq) * 212) + 43;
    var b = ~~((magSq * magSq) * 142) + 113;
    var _s = Math.pow(cur.s, 0.5 + ctl.stationaryM) * itemSize;

    var yoff = instance.mag * (global_height / 2 - ((global_width - _s) / 2 + _s / 2));
    cur.yoff = yoff;

    if (cur.s > 0.5 && cur.select_time > 0) {
        var s2 = Math.min(1, (cur.s - 0.5) * 2) * 1.1;
        ctx.beginPath();
        ctx.arc(cur.x, cur.y - yoff, s2 * itemSize * (1 + magSq * 20), 0, Math.PI * 2, false);
        ctx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + (1 - instance.mag) * (cur.select_time * (cur.s - 0.5) * 2) + ")";
        ctx.fill();
        ctx.closePath();
    }

    if (cur.s > 0.3) {
        var s2 = Math.min(1, (cur.s - 0.3) * 3) * 1.05 * (1 - ctl.stationaryM);
        ctx.beginPath();
        ctx.arc(cur.x, cur.y - yoff, s2 * itemSize * s2, 0, Math.PI * 2, false);
        ctx.fillStyle = "rgba(255, 43, 113, " + ((cur.s - 0.3) * 2) + ")";
        ctx.fill();
        ctx.closePath();
    }

    // ctx.globalAlpha = Math.pow(cur.s, 0.8);
    // var lensSize = (1 - cur.s) * 1.2 * 128; //<--lens effect
    // ctx.drawImage(lens_canvas, -lensSize  + cur.x, -lensSize + cur.y, lensSize * 2, lensSize * 2);
    ctx.globalAlpha = cur.s * cur.s * 0.9;
    var shadowSize = (cur.s) * itemSize * 1.2; //<--lens effect
    var shadowOffset = (cur.s) * (cur.s) * itemSize * 0.2; //<--lens effect
    ctx.drawImage(shadow_canvas, - shadowSize + cur.x, shadowOffset - shadowSize + cur.y - yoff, shadowSize * 2, shadowSize * 2);
    // ctx.globalAlpha = cur.s;
    ctx.globalAlpha = Math.pow(cur.s, ctl.stationaryM * 2);
    ctx.drawImage(getFBO(cur.FBO, _s * 2), -_s + cur.x, -_s + cur.y - yoff, _s * 2, _s * 2);
    ctx.globalAlpha = 1;

}

export class ball {
    constructor(data) {
        // super();
        this.absX = 0;
        this.absY = 0;
        this.x = 0;
        this.y = 0;
        this.s = 0;
        this.selected = false;
        this.data = data;
        this.distance = -1;
        var arr = [];
        this.FBO = arr;
        generateFBO(arr); //prepare
        this.img = new Image();
        this.img.onload = () => {
            generateFBO(arr, this.img); //go
        };
        this.img.src = data.src;
    }

    draw(ctx, itemSize) {
        // super.draw(ctx);
        draw(this, itemSize, ctx);
    }

    isClicked(rX, rY, itemSize) {
        if (Math.sqrt((rX - this.x) * (rX - this.x) + (rY - this.y) * (rY - this.y)) < itemSize * this.s) {
            return true;
        } else {
            return false;
        }
    }
}
