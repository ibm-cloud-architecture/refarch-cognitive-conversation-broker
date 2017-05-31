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
//var slacklisterner = require('./features/slack-listener');
var bpmoc = require('./features/supplier-bpm-client');
const persist = require('./features/persist.js');
const router = express.Router();
const debug=true;

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('API supported: GET /api; POST /api/conversation; ');
});

router.post('/conversation',function(req,res){
    if(!req.body){
      res.status(400).send({error:'no post body'});
    } else {
      if (req.body.context !== undefined) {
          if (req.body.context.action === "getVar") {
            req.body.context[req.body.context.varname] = req.body.text;
        }
      }
      if (debug) {console.log(">>> "+JSON.stringify(req.body,null,2));}
      conversation.submit(req.body,function(response) {
          if (debug) {console.log(" <<< "+JSON.stringify(response,null,2));}
          //  var rep={"text":response.output.text[0],"context":response.context};
          var rep=response;
          rep.text=response.output.text[0];
          rep.context.persistId=req.body.context.persistId;
          rep.context.revId=req.body.context.revId;
          // Here apply orchestration logic
          if (rep.context.url != undefined) {
            if (rep.context.action === "click") {
                rep.text=rep.output.text[0] + "<a class=\"btn btn-primary\" href=\""+rep.context.url+"\">Here</a>"
            }
          } else if (rep.context.action === "trigger"
               && rep.context.actionName === "supplierOnBoardingProcess") {
              bpmoc.callBPMSupplierProcess(rep.context.customerName,rep.context.productName);
          }
          console.log("Before save: "+JSON.stringify(rep,null,2))
          persist.saveConversation(rep,function(persistRep){
                rep.context.persistId=persistRep.id;
                rep.context.revId=persistRep.rev;
                console.log("Send back: "+JSON.stringify(rep,null,2));
                res.status(200).send(rep); // be sure to send a response with persistence id
          });
        });
    }
});


module.exports = router;
