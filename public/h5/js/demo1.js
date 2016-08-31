var K = 0.85;
var old, now;
var initial = false;
var first,second;
var h = $('body').height();

wx.config(config);
wx.ready(function(){
    wx.startSearchBeacons({
        complete:function(argv){
            alert(JSON.stringify(argv))
        }
    });
    wx.onSearchBeacons({
        complete:function(argv){
            $('#rssi').html(argv.beacons[0].rssi);
            $('#origin').html(argv.beacons[0].accuracy + 'm');

            var start = parseFloat(argv.beacons[0].accuracy);
            // if (!initial) {
            //     if(start > 0){
            //         if (first === undefined) return first = start;
            //         if (second === undefined) second = start;
            //         initial = true;
            //     } 
            //     return;
            // }
            if (!initial) {
                if(start > 0){
                    old = start;
                    return initial = true;
                } 
            }
            if(start < 0) {
                start = old;
            }
            now = old*(1-K) + start*K;
            old = now;
            $('#handled').html(now + 'm');
            $('.p').stop().animate({'top': (h*(6-now))/12 + 'px'}, 800);
            //var fixed = parseFloat(start.toFixed(2));
        }
    });
});