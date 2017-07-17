/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
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
const express = require('express');
const router = express.Router();

const watson = require('watson-developer-cloud');
const conversationId="Industrial";
const workspaceId="3c833599-30f3-4c8e-87d8-b9c1021bae1c";
const conversation = watson.conversation({
  "username":"e5e1709b-6754-4c79-bf09-3c98046fe667",
  "password":"Evxmkk1IYSv4",
  version: 'v1',
  version_date: "2017-02-03"
});
console.log("--- Connect to Watson Conversation named: " + conversationId);

const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
const discovery = new DiscoveryV1({
  username: "e99796c1-3ece-469b-b92a-cb0bace684f9",
  password: "ke4LPVTar5ZR",
  "version_date": "2017-06-25",
  path: {
    "environment_id": "b11cca07-ea37-4567-8845-3736ca4b435a",
    "collection_id": "680f3983-0bc0-496e-8e6e-4f40d040729a"
  }
});

/**
Submit the user's response or first query to Watson Conversation.
*/
var sendMessage = function(message,next){
  console.log(">>> "+JSON.stringify(message,null,2));
  if (message.context === undefined){
    message.context={}
  }
  if (message.context.conversation_id === undefined) {
      message.context["conversation_id"]=conversationId;
  }
  conversation.message({
      workspace_id: workspaceId,
      input: {'text': message.text},
      context: message.context
    },  function(err, response) {
        if (err)
          console.log('error:', err);
        else {
          next(response);
        }

    });
}

var callDiscovery=function(query,next){

  console.log("Call discovery with "+query);
  const params = {
      count: 3,
      passages: true,
      natural_language_query:query
    };
  discovery.query(params, function(err, response) {
    if (err) {
      console.error("Error "+err);
    } else {
      console.log(JSON.stringify(response.results,null,2));
      next(response.results);
    }
  });

}
/**
Control flow logic for the appliance bot, when conversation return action field
*/
var applianceConversation = function(req,res){
  sendMessage(req.body,function(response) {
    var rep=response;
    console.log("<<<< "+JSON.stringify(rep,null,2));

    if (rep.output.action === "Call discovery") {

      callDiscovery(rep.output.query,function(data){
          rep.text="I got this symptoms from Discovery";
          rep.discdata=data;
          res.status(200).send(rep);
      });

    } else {
      rep.text=response.output.text[0];
      rep.discdata={};
      res.status(200).send(rep);
    }

  });
}


/**
 REST API end Point for the appliance conversation
 */
router.post('/conversation',function(req,res){
    if(!req.body){
      res.status(400).send({error:'no post body'});
    } else {
        applianceConversation(req,res);
    }
});


module.exports = router;
