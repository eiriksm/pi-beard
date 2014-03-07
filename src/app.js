var http = require('http');

var connect = function(host, port, callback) {
  // Try to connect to supplied host.
  http.get('http://' + host + ':' + port, function(res) {
    console.log('Got response %d from %s', res.statusCode, host);
    res.setEncoding('utf8');
    res.on('data', function(d) {
      callback(null, d);
    });
    res.on('error', function(e) {
      callback(e);
    });
  });
};

exports.log = function(msg) {
  console.log(msg);
};

exports.start = function(config) {
  var cb = this.log;
  if (config.callback) {
    cb = config.callback;
  }
  connect(config.host, config.port, cb);
};
