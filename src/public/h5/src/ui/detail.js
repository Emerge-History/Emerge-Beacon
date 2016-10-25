import { instance } from "./grid.js";
// vendor
import '../vendor/zepto/zepto.js'
import '../vendor/zepto/form.js'
import '../vendor/zepto/event.js'
import '../vendor/zepto/fx.js'
import '../vendor/zepto/fx_methods.js'
import '../vendor/zepto/touch.js'
import '../vendor/preventoverscroll.min.js'
import '../vendor/scrollTo.zepto.js'

window["showDetail"] = window["showDetail"] || function (detail, detail_obj) {
    console.log("Please Override showDetail Function");
    console.log(detail);
};

var contentzone = document.querySelector('.content-zone');
var detail_prev = undefined;
export function draw(ctx) {
    ctx.save();
    if (instance.mag > 0.3 && instance.selected()) {
        if (detail_prev !== instance.selected()) {
            detail_prev = instance.selected();
            //trigger event - load div!
            window["showDetail"](instance.selected().data, instance.selected());
        }
        var cur = instance.selected();
        var magSq = (instance.mag - 0.3) / 0.7;
        magSq = magSq;
        var s2 = Math.max(0, Math.min(1, (cur.s - 0.3) * 2)) * 1.1;
        ctx.beginPath();
        ctx.globalCompositeOperation = "destination-out";
        ctx.arc(cur.x, cur.y - cur.yoff, s2 * instance.itemSize * (magSq * 10), 0, Math.PI * 2, false);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fill();
        ctx.closePath();
    }
    if (instance.mag < 0.3) {
        contentzone.scrollTop = 0;
    }
    ctx.restore();
}


function template(templateId, contentId, data) {
    var re = /{([^}]+)}/g;
    var text = document.getElementById(templateId).innerHTML;
    var html = text.replace(re, function (all, t) {
        return data[t];
    });
    document.getElementById(contentId).innerHTML = html
}

$('#content').swipeRight(function(){
    getOut()
})
new PreventOverScroll({
    list: ['content']
});

window.showDetail = function (detail, detail_obj) {
    // BUG 进入详情页 应该也触发了drag autoFollowDist应该为false
    // main_grid.setBeaconFollow(false)
    var data = {
        name: detail.title,
        material: detail.mat,
        size: detail.size,
        year: detail.year,
        author: detail.author,
        nickname: detail.nickname,
        introduce: detail.introduce
    }
    template('template', 'content', data)
    $('#content').css({'-webkit-transform':'translate3d(0, 0, 0)'})
    $('#content').scrollTo({toT:0,durTime:0});
    $('#back').click(function(){
        getOut()
    })
    // $('.tool-bar').appendTo('.content-zone')
    $('#wrap').css({
        background: 'url('+detail.src +')',
        backgroundSize: 'cover'
    });
    $('#avator').css({
        background: 'url('+detail.avator +')',
        backgroundSize: 'cover'
    });
};


