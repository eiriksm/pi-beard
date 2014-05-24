var util = require('util');
var Primus = require('primus');
var Emitter = require('primus-emitter');

var connect = function(config) {
  var host = config.host;
  var port = config.port;
  var callback = config.callback;
  var Socket = Primus.createSocket({
    transformer: 'engine.io',
    plugin: {
      'Emitter': require('primus-emitter')
    }
  });

  var client = new Socket(util.format('ws://%s:%d/', host, port));
  client.on('open', function() {
    console.log('Connected to %s, sending greeting', host);
    client.send('auth', config.auth);
    if (config.ws) {
      config.ws(client);
    }
  });
  client.on('data', function(data, flags) {
    callback(null, data, flags);
  });
  client.on('error', function(err) {
    callback(err);
  });
  client.on('authed', function(msg) {
    // Client is OK, as far as the server cares.
    if (config.interval && config.repeat) {
      config.i = setInterval(config.repeat, config.interval);
    }

  });
  return client;
};

exports.log = function(msg) {
  console.log(msg);
};

exports.start = function(config) {
  if (!config.callback) {
    config.callback = this.log;
  }
  return connect(config);
};
