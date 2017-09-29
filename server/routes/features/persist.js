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
/**
This module perists the conversation content to a cloudant DB. It implements the data access object patterb
Author: IBM - Jerome Boyer
*/



module.exports=  {
  saveConversation : function(config,conv,next){
    var cloudant = require('cloudant')(config.dbCredentials.url);
    var db = cloudant.use('wcsdb');
    if (conv.context !== undefined) {
      if (conv.context.revId !== undefined) {
        conv._id=conv.context.persistId;
        conv._rev=conv.context.revId;
      }
    }
    db.insert(conv, function(err, data) {
      if (err) {
        next({error: err.message});
      } else {
        next(data);
      }
    });
  }, // saveConversation
  getAllConversations: function(cid,next){
    var cloudantquery = {
      "selector": {
        "conv_id": cid
      }
    };
    db.find(cloudantquery, function(err, data) {
      if (err) {
        next({error: err.message})
      } else {
        next(data.docs);
      }
    });
  },
  getConversationById: function(id,next){
    var cloudantquery = {
      "selector": {
        "_id": id
      }
    };
    db.find(cloudantquery, function(err, data) {
      if (err) {
        next({error: err.message})
      } else {
        if(data.docs.length > 0){
          next(data.docs[0]);
        } else {
          next({error: 'no conversation found with _id: ' + id});
        }
      }
    });
  }
}
