var express = require('express');
var util = require('./util');
var app = express();

app.use(express.static('../test'));

util.refreshTokenAndTicket();

app.get('/api', function (req, res) {
	res.json(util.getJsApiData());
});
app.get('/', function (req, res) {
	res.send('welcome');
});




// groudp 1847115

// var request = require('request');
// var fs = require('fs');
// var file = JSON.parse(fs.readFileSync('./file.json').toString());
// var token = file.accessToken;
// var url = 'https://api.weixin.qq.com/shakearound/device/group/add?access_token=' + token;
// var url2= 'https://api.weixin.qq.com/shakearound/device/group/adddevice?access_token=' + token;
// request.post({
//   url: url2, 
//   body: JSON.stringify({
//    "group_id": 1847115,
//    "device_identifiers":[
//             {
//             "device_id":7487858
//             }
//    ]
// })
// }, function (e, r, body) {
//   var info = JSON.parse(body);
//   console.log(info);
// })




































var http = require('http');

var port = normalizePort(process.env.PORT || '80');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}

