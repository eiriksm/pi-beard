var http = require('http');

http.createServer(function(req, res) {
  setInterval(function() {
    res.write(Date.now() + '');
  }, 1000);
}).listen(8900);

var connect = function(host, port) {
  // Try to connect to supplied host.
  http.get('http://' + host + ':' + port, function(res) {
    console.log('Got response %d from %s', res.statusCode, host);
    res.setEncoding('utf8');
    res.on('data', function(d) {
      console.log(d);
    });
  });
}

connect('localhost', 8900);
