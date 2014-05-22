var http = require('http');

var connect = function(config) {
  var host = config.host;
  var port = config.port;
  var path = config.path;
  var callback = config.callback;
  var WebSocket = require('ws');
  var ws = new WebSocket('ws://' + host + ':' + port + '/' + path);
  ws.on('open', function() {
    console.log('Connected to %s, sending greeting', host);
    ws.send('hello');
    if (config.ws) {
      config.ws(ws);
    }
  });
  ws.on('message', function(data, flags) {
    callback(null, data, flags);
  });
  ws.on('error', function(err) {
    callback(err);
  });
};

exports.log = function(msg) {
  console.log(msg);
};

exports.start = function(config) {
  if (!config.callback) {
    config.callback = this.log;
  }
  connect(config);
};
