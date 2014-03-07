var app = require('./src/app');
var yaml = require('js-yaml');
var fs = require('fs');

// Read app config.
try {
  app.config = yaml.safeLoad(fs.readFileSync('../config.yml', 'utf8'));
}
catch(err) {
  app.log('No config.yml file found. Using default.config.yml for now. This is most likely not what you want to do.', 'w');
  app.config = yaml.safeLoad(fs.readFileSync('./default.config.yml', 'utf8'));
}

app.start(app.config);
