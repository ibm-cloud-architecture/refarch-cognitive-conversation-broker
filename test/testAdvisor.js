
var http = require('http');
var assert=require('assert');


var options = {
  host: 'localhost',
  headers: {
     "accept": "application/json",
     "content-type": "application/json"
  },
  method: 'POST',
  port: process.env.PORT || 3001,
  path: '/api/advisor'
};

var callback = function(response){
  var responseString = '';
  response.on('data', function (chunk) {
    responseString += chunk;
  });

  response.on('end', function () {
    console.log(JSON.parse(responseString ));
  });
};

var sendMessage = function(aText,ctxt,done) {
  console.log(">>> "+ aText );
  var req=http.request(options, done);
  req.write(JSON.stringify({text: aText,context: ctxt}));
  req.end();
}

var processResponse = function(response,next) {
  var responseString = '';
  response.on('data', function (chunk) {
    responseString += chunk;
  });
  response.on('end', function () {
    repp=JSON.parse(responseString);
    console.log("<<<< ", repp );
    next(repp);
  });
}

var handleITteam = function(response) {
      processResponse(response, function(repp) {
        assert.equal(repp.intents[0].intent,"wasapp");
        sendMessage("Your IT team",repp.context,callback);
      })
} // own IT


var handleWASapp = function(response) {
      processResponse(response, function(repp) {
        assert.equal(repp.intents[0].intent,"wasapp");
        sendMessage("Your IT team",repp.context,handleITteam);
      })
} // WAS app

var handleSingleApp = function(response) {
      processResponse(response, function(repp) {
        assert.equal(repp.intents[0].intent,"singleApp")
        sendMessage("websphere",repp.context,handleWASapp);
      })
} //single app


var handleMigrateToCloud = function(response){
  processResponse(response, function(repp) {
    assert.equal(repp.intents[0].intent,"migrateToCloud")
    sendMessage("single application",repp.context,handleSingleApp);
  })
}; // migrate to the cloud


var handleGreeting = function(response) {
  processResponse(response, function(repp) {
    assert.equal(repp.intents[0].intent,"Greetings")
    sendMessage("migrate to the cloud",repp.context,handleMigrateToCloud);
  })
}

// process WAS app migration flow starting by hello
sendMessage("hello", {conversation_id:"CyanConversations"},handleGreeting);
