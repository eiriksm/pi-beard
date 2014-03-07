var app = require('../src/app');
var http = require('http');
var should = require('should');
var WebSocketServer = require('ws').Server;

var response, server;
var config = {
  host: 'localhost',
  port: 54321
};

describe('Client part', function() {
  it('Should connect to the specified server', function(done) {
    var wss = new WebSocketServer({port: config.port});
    wss.on('connection', function(ws) {
      ws.on('message', function(message) {
        if (message === 'hello') {
          wss.close(1234);
          done();
        }
      });
    });
    app.start(config);
  });
  var s;
  it('Should call callback when sent data', function(done) {
    var wss2 = new WebSocketServer({port: config.port});
    wss2.on('connection', function(ws) {
      s = wss2;
      ws.on('message', function(message) {
        if (message === 'hello') {
          ws.send('world2');
        }
      });
    });
    config.callback = function(err, data) {
      should(err).equal(null);
      data.should.eql('world2');
      done(err);
    };
    app.start(config);
  });

  it('Should call callback with error', function(done) {
    s.close();
    var wss3 = new WebSocketServer({port: config.port});
    wss3.on('connection', function(ws) {
    });
    config.callback = function(err, data) {
      should(err).not.equal(null);
      done();
    };
    config.ws = function(webss) {
      webss.emit('error');
    };
    app.start(config);
  });

  it('Should have an app.log function exposed', function() {
    // Just see if it is there.
    app.log.should.be.type('function');
    // Just call it, for coverage.
    app.log('Testing log function.');
  });
});
