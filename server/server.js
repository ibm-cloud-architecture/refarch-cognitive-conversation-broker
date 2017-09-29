/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Get dependencies
const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');

const app = express();

// Parsers for POST JSON PAYLOAD
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist')));

// Set specific api routes
var config = require('./config/config.json');
require('./routes/api')(app,config);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});


// start server on the specified port and binding host
const port = process.env.PORT || config.port;
app.listen(port, '0.0.0.0', function() {
  console.log("Conversation Broker Service "+ config.version+" starting on " + port);
  console.log("  Use your web browser: http://localhost:"+port);
});
