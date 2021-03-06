var app = require('../src/app');
var http = require('http');
var should = require('should');
var Primus = require('primus');
var http = require('http');

var config = {
  host: 'localhost',
  port: 54321,
  auth: 'thisisauth'
};

describe('Client part', function() {
  it('Should connect to the specified server', function(done) {
    this.timeout(10000);
    var server = http.createServer();
    var wss = new Primus(server,
      { transformer: 'engine.io' }
    );
    server.listen(config.port, function() {
      app.start(config);
    });
    wss.on('connection', function(ws) {
      ws.on('auth', function(message) {
        if (message === config.auth) {
          ws.send('authed', 'whatevs');
          wss.end();
          done();
          server.close();
        }
      });
    });
  });
  var s;
  it('Should call callback when sent data', function(done) {
    var server = http.createServer();
    var wss2 = new Primus(server,
      { transformer: 'engine.io' }
    );
    config.port = config.port + 1;
    server.listen(config.port, function() {
      app.start(config);
    });
    config.interval = 10000;
    config.repeat = function() {
      if (config.i) {
        clearInterval(config.i);
      }
    };
    wss2.on('connection', function(ws) {
      s = wss2;
      ws.on('auth', function(message) {
        if (message === config.auth) {
          ws.write('world2');
          ws.send('authed', 'whatevs');
        }
      });
    });
    var recv = false;
    config.callback = function(err, data) {
      if (recv) {
        return;
      }
      recv = true;
      should(err).equal(null);
      data.should.equal('world2');
      done(err);
    };
  });

  it('Should call callback with error', function(done) {
    s.end();
    var server = http.createServer();
    var wss3 = new Primus(server,
      { transformer: 'engine.io' }
    );
    config.port = config.port + 1;
    wss3.on('connection', function(ws) {
    });
    config.callback = function(err, data) {
      should(err).not.equal(null);
      done();
    };
    config.ws = function(webss) {
      webss.emit('error');
    };
    server.listen(config.port, function() {
      app.start(config);
    });
  });

  it('Should have an app.log function exposed', function() {
    // Just see if it is there.
    app.log.should.be.type('function');
    // Just call it, for coverage.
    app.log('Testing log function.');
  });
});
