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
const config = require('../env.json');
const watson = require('watson-developer-cloud');


const conversation = watson.conversation({
  username: config.conversation.username,
  password: config.conversation.password,
  version: 'v1',
  version_date: config.conversation.version
});
if (config.debug) {
    console.log("--- Connect to Watson Conversation named: " + config.conversation.conversationId);
}

var sendMessage = function(message,wkid,next){
  if (config.debug) {console.log(">>> "+JSON.stringify(message,null,2));}
  if (message.context.conversation_id === undefined) {
      message.context["conversation_id"]=config.conversation.conversationId;
  }
  conversation.message({
      workspace_id: wkid,
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

/**
Submit the user's response or first query to Watson Conversation.
*/
exports.submitITSupport = function(message,next) {
      sendMessage(message,config.conversation.workspace1,next);
}

exports.submitSODBHelp = function(message,next) {
      sendMessage(message,config.conversation.workspace2,next);
}
