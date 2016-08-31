
wx.config(config);
wx.ready(function(){
    wx.startSearchBeacons({
        complete:function(argv){
            // alert(JSON.stringify(argv))
        }
    });
    wx.onSearchBeacons({
        complete:function(argv){
            // alert(JSON.stringify(argv))
            socket.emit('beacons', argv['beacons']);
        }
    });
});