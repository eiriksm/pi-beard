var app = require('../src/app');
var http = require('http');
var should = require('should');

var response, server;
var config = {
  host: 'localhost',
  port: 54321
};

describe('Client part', function() {
  it('Should connect to the specified server', function(done) {
    response = function(req, res) {
      done();
      server.close();
    };
    server = http.createServer(response).listen(54321);
    app.start(config);
  });
  it('Should call callback when sent data', function(done) {
    response = function(req, res) {
      res.write('test');
      server.close();
    };
    server = http.createServer(response).listen(54321);
    config.callback = function(err, data) {
      should(err).equal(null);
      data.should.eql('test');
      done(err);
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
