import { ball } from './ui/ball.js'
import { grid } from './ui/grid.js'
import * as text from "./ui/text.js"
import * as ease from './base/ease.js'
import * as control from './base/control.js'
import * as detail from "./ui/detail.js"
import { sw } from "./ui/filters.js"
import reqwest from 'reqwest'

window.flags = {
    FBO_DEBUG: 0,
    FAKE_BEACON: 1
};

var renderMatrix = [];

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window['global_width'] = window.innerWidth;
window['global_height'] = window.innerHeight;
let ratio = 1,
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

function setup() {
    if (ctx) {
        // console.log("setup");
        control.register(canvas);
        init();
        requestAnimationFrame(update);
        window.addEventListener('resize', rescale);
        rescale();
    }
}

function rescale() {
    global_width = window.innerWidth;
    global_height = window.innerHeight;
    ratio = window.devicePixelRatio || 1;
    canvas.setAttribute('width', global_width * ratio);
    canvas.setAttribute('height', global_height * ratio);
    main_grid.resize();
    draw();
}

/* INIT */
function init() {
    draw();
}

window.main_grid = new grid(canvas, ctx);

function draw() {
    ctx.save();
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, global_width, global_height);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, global_width, global_height);
    main_grid.draw();
    detail.draw(ctx);
    ctx.restore();
    // ctx.scale(1 / ratio, 1 / ratio);
}

/* UPDATE */
var lastCalledTime;
var fps;
var fps_meter = document.getElementById('fps');
function update() {
    if (!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 0;
    } else {
        var delta = (Date.now() - lastCalledTime) / 1000;
        lastCalledTime = Date.now();
        fps = parseInt(1 / delta);
        fps_meter.innerText = fps;
    }
    main_grid.update();
    ease.update();
    draw();
    control.update();
    text.update();
    return requestAnimationFrame(update);
}

window.onload = setup;

// 数据 mock
let authors,works
let p1 = reqwest({
    url: 'http://192.168.0.109:3000/api/all/authors', 
    type: 'json'
})
let p2 = reqwest({
    url: 'http://192.168.0.109:3000/api/all/works', 
    type: 'json'
})
Promise.all([p1, p2]).then(values => { 
    console.log(values)
    authors = values[0].authors
    works = values[1].works
    for(var i in works) {
        if (works.hasOwnProperty(i)) { 
            works[i].author = authors[works[i].AuthorId-1]
        } 
    }
    for (var i = works.length - 1; i >= 0; i--) {
        renderMatrix[i] = new ball({
            uuid: works[i].uuid,
            src: works[i].img,
            title: works[i].name,
            mat: works[i].material,
            author: works[i].author.name,
            avator: works[i].author.avator,
            size: works[i].size,
            year: works[i].year,
            nickname: works[i].author.nickname,
            introduce: works[i].author.introduce,
            color: works[i].color
        });
    }
    main_grid.setMatrix(renderMatrix);
    // 双向绑定
    observe(main_grid);

    setTimeout(()=>{
        if(window.flags.FAKE_BEACON) {
            // 蓝牙数据
            let { balls } = main_grid.uuid()
            for(var i in balls){
                if(balls.hasOwnProperty(i)){
                    var t = Math.random()
                    balls[i].distance = t>0.5? t:-1
                }
            }
            setInterval(()=>{
                for(var i in balls){
                    if(balls.hasOwnProperty(i)){
                        var t = Math.random()
                        balls[i].distance = t>0.5? t:-1
                    }
                }
            },2000)
        }
    }, 500)



});

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    defineReactive(data, 'autoFollowDist', data.autoFollowDist);
};

function defineReactive(data, key, val) {
    var timer;
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function() {
            return val;
        },
        set: function(newVal) {
            console.log('autoFollowDist变化 ', val, ' --> ', newVal);
            clearTimeout(timer)
            timer = setTimeout(()=>{
                if(sw.userChecked && sw.getValue()) {
                    sw.setChecked(true)
                    main_grid.setBeaconFollow(true)
                }
            }, 2000)
            // sw.setChecked(newVal)
            val = newVal;
        }
    });
}


window.getIn = function(){
    if(sw.userChecked){
        _debug_mode(2)
        main_grid.setBeaconFollow(false)
        sw.setChecked(false)
    } else{
        _debug_mode(2)
    }
}

window.getOut = function(){
    if(isInFilter) {
        _debug_mode(1)
    } else {
        if(sw.userChecked){
            _debug_mode(1)
            main_grid.setBeaconFollow(true)
            sw.setChecked(true)
        } else {
            _debug_mode(1)
        }
    }
}