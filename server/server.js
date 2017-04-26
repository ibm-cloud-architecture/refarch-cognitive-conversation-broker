// Get dependencies
const express = require('express');
const path = require('path');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
const cfenv = require('cfenv');
const bodyParser = require('body-parser');

const Debug=true;

const app = express();

// Get our API routes
const api = require('./routes/api');

// Parsers for POST JSON PAYLOAD
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
/**
 * Get port from environment and store in Express.
 */
const port =appEnv.port || '3000';

// start server on the specified port and binding host
app.listen(port, '0.0.0.0', function() {
  // print a message when the server starts listening
  if (Debug) {
      var config = require('./routes/env.json');
      var extend = require('extend');
      var vcapServices = require('vcap_services');
      var wcconfig = extend(config.conversation, vcapServices.getCredentials('conversation'));
      console.log("--- Connect to Watson Conversation named: " + wcconfig.conversationId);
  }
  console.log("Server v0.0.1 starting on " + appEnv.url);
});
