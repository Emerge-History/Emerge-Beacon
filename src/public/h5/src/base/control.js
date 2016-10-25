window["ctl"] = {
    x: 0,
    y: 0,
    pressed: 0,
    released: 0,
    clicked: false,
    initX: 0,
    initY: 0,
    px: 0,
    py: 0,
    dx: 0,
    dy: 0,
    distance: 0,
    _update_flag: false,
    global_timer: 0,
    global_sin: 0,
    global_cos: 0,
    magnification: 0,
    stationary: 0,
    stationaryM: 0,
    canvas: undefined,
    clickRange: 90 * 90
};


function _move(x, y) {
    ctl._update_flag = true;
    ctl.easeTo("stationary", 0, 0.5);
    ctl.easeTo("stationaryM", 0, 0.05);
    if (ctl.px !== undefined) {
        ctl.dx = ctl.x - ctl.px;
        ctl.dy = ctl.y - ctl.py;
        ctl.px = ctl.x;
        ctl.py = ctl.y;
    } else {
        ctl.px = x;
        ctl.py = y;
    }
    ctl.x = x;
    ctl.y = y;
}

function _triggerClick() {
    var dx = ctl.x - ctl.initX;
    var dy = ctl.y - ctl.initY;
    // console.log(dx, dy);
    if (dx * dx + dy * dy < ctl.clickRange) {
        ctl.clicked = true;
    }
}

function _clear() {
    ctl.dx = 0;
    ctl.dy = 0;
    ctl.px = undefined;
    ctl.py = undefined;
    ctl.easeTo("stationaryM", 1, 0.05);
    ctl.easeTo("stationary", 1, 0.08);

    ctl.initX = 0;
    ctl.initY = 0;
}

export function register(canvas) {
    ctl.canvas = canvas;
    _clear();
    canvas.addEventListener('mousedown', function (e) {
        ctl.released = false;
        ctl.pressed = true;
        _clear();
    }, { passive: false });
    canvas.addEventListener('mouseup', function (e) {
        ctl.released = true;
        ctl.pressed = false;
        _clear();
    }, { passive: false });
    canvas.addEventListener('mousemove', function (e) {
        ctl.mouseX = e.clientX;
        ctl.mouseY = e.clientY;
        _clear();
    }, { passive: false });
    canvas.addEventListener('touchstart', function (e) {
        ctl.released = false;
        ctl.pressed = true;
        _clear();
        e.preventDefault(true);

        ctl.x = e.touches[0].clientX;
        ctl.y = e.touches[0].clientY;
        ctl.initX = e.touches[0].clientX;
        ctl.initY = e.touches[0].clientY;

    }, { passive: false });
    canvas.addEventListener('touchcancel', function (e) {
        ctl.released = true;
        ctl.pressed = false;
        _clear();
        e.preventDefault(true);
    }, { passive: false });
    canvas.addEventListener('touchend', function (e) {
        ctl.released = true;
        ctl.pressed = false;
        _triggerClick();
        _clear();
        e.preventDefault(true);
    }, { passive: false });
    canvas.addEventListener('touchmove', function (e) {
        _move(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault(true);
    }, { passive: false });
    console.log("Control Registered");
}

export function update() {
    if(ctl.magnification > 0.95) {
        canvas.style.display = "none";
    } else {
        canvas.style.display = "block";
    }
    if(ctl.magnification > 0) {
        canvas.style.pointerEvents = "none";
    } else {
        canvas.style.pointerEvents = "";
    }
    ctl.global_timer += 0.01;
    ctl.global_sin = Math.sin(ctl.global_timer);
    ctl.global_cos = Math.cos(ctl.global_timer);
    ctl.global_smc = ctl.global_sin * ctl.global_cos;
    if (!ctl._update_flag) {
        ctl.dx = 0;
        ctl.dy = 0;
    } else {
        ctl._update_flag = false;
    }
    ctl.clicked = false;
}

window._debug_mode = function(m) {
    if(m > 1) {
        ctl.easeTo("magnification", 1, 0.06);
        document.getElementById('search').style.display = "none";
    } else {
        ctl.easeTo("magnification", 0, 0.6);
        document.getElementById('search').style.display = "block";
    }
}