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
const watson = require('watson-developer-cloud');
const bpmoc  = require('./supplier-bpm-client');
const persist= require('./persist');

module.exports = {
  /**
  Specific logic for the conversation related to IT support. From the response the
  code could dispatch to BPM.
  It persists the conversation to remote cloudant DB
  */
   itSupportConversation : function(config,req,res) {
        // this logic applies when the response is expected to be a value to be added to a context variable
        // the context variable name was set by the conversation dialog
        if (req.body.context.action === "getVar") {
            req.body.context[req.body.context.varname] = req.body.text;
        }
        sendMessage(config,req,config.conversation.workspace1,res,processITSupportResponse);
  }, // itSupportConversation

   sobdConversation : function(config,req,res) {
    sendMessage(config,req,config.conversation.workspace2,res,function(config,res,response) {
        if (config.debug) {console.log(" SOBD <<< "+JSON.stringify(response,null,2));}
        if (response.Error !== undefined) {
          res.status(500).send({'text':response.Error});
        } else {
          res.status(200).send(response);
        }
    });
  },
  advisor : function(config,req,res) {
   if ( req.body.context !== undefined) {
     req.body.context.action="";
     req.body.context.predefinedResponses="";
   }
   sendMessage(config,req,config.conversation.workspace3,res,function(config,res,response) {
       if (config.debug) {console.log(" Advisor <<< "+JSON.stringify(response,null,2));}
       if (response.Error !== undefined) {
         res.status(500).send({'text':response.Error});
       } else {
           response.text="<p>"+response.output.text[0]+"</p>";
           /*
           if (response.context.action !== undefined && response.context.action == "predefinedResponses") {
             for (var sr in response.context.predefinedResponses) {
               response.text=response.text+
               "<br/><a class=\"btn btn-primary\" (click)=\"advisorResponse(\""
               +response.context.predefinedResponses[sr]
               +"\")>"
               +response.context.predefinedResponses[sr]+"</a>"
               console.log(response.text)
             }
           }
           */
           if (response.context.action === "click") {
               response.text= response.text+ "<br/><a class=\"btn btn-primary\" href=\""+response.context.url+"\">"+response.context.buttonText+"</a>"
           }
         res.status(200).send(response);
       }
   });
 }
} // exports

// ------------------------------------------------------------
// Private
// ------------------------------------------------------------
var sendMessage = function(config,req,wkid,res,next){
  var message =req.body;
  if (config.debug) {
      console.log("--- Connect to Watson Conversation named: " + config.conversation.conversationId);
      console.log(">>> "+JSON.stringify(message,null,2));
  }
  if (message.context.conversation_id === undefined) {
      message.context["conversation_id"]=config.conversation.conversationId;
  }
  conversation = watson.conversation({
          username: config.conversation.username,
          password: config.conversation.password,
          version: config.conversation.version,
          version_date: config.conversation.versionDate});

  conversation.message(
      {
      workspace_id: wkid,
      input: {'text': message.text},
      context: message.context
      },
      function(err, response) {
        if (err) {
          console.log('error:', err);
          next(config,res,{'Error': "Communication error with Watson Service. Please contact your administrator"});
        } else {
          if (config.conversation.usePersistence) {
              response.context.persistId=req.body.context.persistId;
              response.context.revId=req.body.context.revId;
              persist.saveConversation(config,response,function(persistRep){
                    response.context.persistId=persistRep.id;
                    response.context.revId=persistRep.rev;
                    console.log("Conversation persisted, response is now: "+JSON.stringify(response,null,2));
                    next(config,res,response);
              });
          } else {
              next(config,res,response);
          }
        }
      }
    );

} // sendMessage

var processITSupportResponse = function(config,res,response){
    if (config.debug) {console.log(" BASE <<< "+JSON.stringify(response,null,2));}
    if (response.Error !== undefined) {
        res.status(500).send(response);
    } else {
        // Here apply orchestration logic
        if (response.context.url != undefined) {
            if (response.context.action === "click") {
                response.text=response.output.text[0] + "<a class=\"btn btn-primary\" href=\""+response.context.url+"\">Here</a>"
            }
        } else if (response.context.action === "trigger"
             && response.context.actionName === "supplierOnBoardingProcess") {
               bpmoc.callBPMSupplierProcess(config,response.context.customerName,response.context.productName);
        } else if (response.context.action == "predefinedResponses") {

        }
        res.status(200).send(response);
    }
} // processITSupportResponse
