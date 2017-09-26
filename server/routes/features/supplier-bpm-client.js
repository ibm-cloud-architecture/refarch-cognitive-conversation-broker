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
 *
 * This is a BPM on Cloud client code to mae a SOAP request to trigger a process
 Author: IBM - Jerome Boyer
 */
var request = require('request');

/*
Prepare a soap request using the product and company names for BPM on cloud
deployed application.
ATTENTION this code is not generic and the SOAP message depends on the exposed
web service definition of the process application deployed on BPM on Cloud
*/
module.exports ={
  callBPMSupplierProcess : function(config,company,product) {
      var xmlBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://SOBD/SOAPStart.tws">'+
         '<soapenv:Header/>'+
         '<soapenv:Body>'+
            '<soap:StartSOBDUCA>'+
               '<soap:company>'+ company+'</soap:company>'+
               '<soap:product>' + product+ '</soap:product>'+
            '</soap:StartSOBDUCA>'+
         '</soapenv:Body>'+
      '</soapenv:Envelope>';
      console.log(xmlBody);
      request.post(
          {url:'https://'+config.bpmoc.serverName
          + '/bpm/dev/teamworks/webservices/'
          + config.bpmoc.processName,
          body : xmlBody,
          headers: {'Content-Type': 'text/xml',
            'Authorization': 'Basic ' + config.bpmoc.basicAuth
            }
          },
          function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  console.log(response.body)
              }
          }
      );
    }
}
