# Integrate with BPM
A business process can expose a web service end point to be callable from a remote soap client. As illustrated in the [demonstration flow](demoflow.md) the conversation is getting company name and product name and then trigger the process. The creation of the process is in fact a call to the exposed SOAP service.

The client code is in the server/routes/features supplier-bpm-client.js. The exported function has two parameters: the company name and product name. The method prepare the SOAP envelope and a SOAP body which is based on the WSDL of the web service.

```javascript
exports.callBPMSupplierProcess = function(company,product) {
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
```

The URL for the BPM on cloud server is define in the env.json configuration file.
*This code will be protected by circuit breaker in the future.*

The orchestration logic is integrate in the response management from Watson Conversation call. This code is in api.js and is looking at the conversation **context** json object to access some variable defined by the conversation developer:

```javascript
...
if (rep.context.action === "trigger"
     && rep.context.actionName === "supplierOnBoardingProcess") {
    bpmoc.callBPMSupplierProcess(rep.context.customerName,rep.context.productName);
}
```
the action name is the business process name and the action *trigger*, so delegate the processing to the BPM client.
