# Persisting the conversation
An important feature for a conversation broker micro service is to be able to persist the conversation interactions into a document oriented database so that developers and business analysts can identify when the conversation dialog flow was not able to address the user's query. In this article we are presenting how to persist the Watson Conversation Response to a Bluemix CloudandDB database and also how to use an internal / on-premise data source to persist the conversation

# Bluemix Cloudant Integration
The approach is to add a feature into the server layer to implement the [Data Access Object](https://en.wikipedia.org/wiki/Data_access_object) pattern that can be enabled easily in the router layer of the broker. The DAO is using the Cloudant API to access an Cloudant instance running in Bluemix.
![](wcs-save-cloudant.png)

## Pre-requisites
To be able to persist on Bluemix Cloudant service you need to add such a service. The steps are:
* In Bluemix Catalog use the 'Data & Analytics' choices under the Services. Select Cloudant NoSQL DB, specify a name and create the service.
* Launch the Database tools from the newly created service and add a new database called: 'wcsdb'
* Get the service credential for username and password and URL as illustrated in figure below, you will need them for the data access layer component added to the Conversation broker   
![credentials](cloudant-cred.png)

## Bluemix Cloudant Integration


The script on the server side is server/routes/features/persist.js. It uses the  javascript cloudant client library, define the database
```javascript
var config = require('../env.json');
const cloudant = require('cloudant')(config.dbCredentials.url);
var db = cloudant.use('wcsdb');
```

and then expose a set of CRUD functions:
```javascript
saveConversation : function(conv,next){
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
},
```
The code above is using the _id and _rev attributes of the persisted conversation so call to db.insert will update existing record/document when the document is already there. When there is no _id a new documented is added. This update mechanism is important to keep a unique conversation document for each interaction with Watson Conversation. The content of the conversation includes the path and nodes visited during the interactions.  
```
"_node_output_map": {
     "Start the conversation": [
       0
     ],
     "Otherwise": [
       0
     ],
     "node_4_1489854990975": [
       0
     ],
     "Watson trigger the process": [
       0
     ],
     "node_1_1492819089967": [
       0
     ],
     "node_1_1496247132094": [
       0
     ]
   },
   "branch_exited": true,
   "branch_exited_reason": "completed"

```
The dialog flow developer can use this information to tune the flow, address new case / intent or scope out requests.

The database configuration is done inside a env.json file
```
"dbCredentials" : {
  "url": "https://username:pwd@xxxxx-bluemix.cloudant.com"
},
"usePersistence": true
```

# Persist Conversation on an On-premise database
The alternative is to use an on-premise data base to keep conversation trace behind the firewall. The hybrid integration is generally demonstrated and validated by the following architecture [content](https://github.com/ibm-cloud-architecture/refarch-integration), using API Connect, Secure Gateway and Exposed data access layer API. For this DAO the schema may look like the diagram below:
![](wcs-save-on-prem.png)
The DAO is using Request javascript module to do HTTP calls to a secure gateway configured in Bluemix, which get connection from a Secure Gateway Client running on one of the internal, behind the firewall, server. You can read details on configuration from Hybrid integration github repository [here](https://github.com/ibm-cloud-architecture/refarch-integration-utilities/blob/master/docs/ConfigureSecureGateway.md)  

The secure gateway destination can be the API Connect gateway server with API URLs specified as part of an API product. The API may be a pass through or performing an interface mapping between REST and other protocol. Using more recent technology the back-end can expose REST api directly on top of a document oriented DB. If the choice is to design a relational database, then you need to take care of the structure as the content from conversation can change overtime with new product version, and the context object, being an open JSON object, any structure can be defined during the Watson Conversation design time.
