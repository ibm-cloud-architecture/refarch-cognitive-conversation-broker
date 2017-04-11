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
var conversation = require('./features/conversation');
var slacklisterner = require('./features/slack-listener');
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('API supported: GET /api; POST /api/conversation; ');
});

router.post('/conversation',function(req,res){
    if(!req.body){
      res.status(400).send({error:'no post body'});
    } else {
      if (res.context !== undefined && res.context.url !== undefined) {
        // url is an attribute of the context that can be set in the conversation to let the user
        // navigates to a business application. So this test is part of the business logic.
        res.context.url= undefined;
      }
      conversation.submit(req.body,function(response) {
        console.log(JSON.stringify(response,null,2));
        var rep="";
        // TODO add logic to manage Conversation response
        if (response.context.url != undefined) {
          rep={"text":response.output.text[0] + "<a class=\"btn btn-primary\" href=\""+response.context.url+"\">Here</a>","context":response.context}
        } else {
          rep={"text":response.output.text[0],"context":response.context}
        }
        res.status(200).send(rep);
        });
    }
});


module.exports = router;
