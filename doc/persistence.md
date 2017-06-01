# Persisting the conversation
An important feature for a conversation broker micro service is to be able to persist the conversation into a document oriented database. In this example we are using Bluemix CloudandDB.

## Bluemix Cloudand Integration
The script on the server side is server/routes/features/persist.js.


## On-premise database
The alternative is to use an on-premise data base to keep conversation trace behind the firewall. The hybrid integration is generally demonstrated and validated by the following architecture [content](https://github.com/ibm-cloud-architecture/refarch-integration). For this broker the schema may look like the diagram below:
