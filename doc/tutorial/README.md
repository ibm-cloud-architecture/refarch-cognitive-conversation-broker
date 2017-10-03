# IT Support Chat bot Tutorial

Implement a simple **IT support** help-me conversation chatbot. The chatbot helps to streamline IT support queries by automating the dialog flow.
Updates: 10/03/2017

## Business use case
The support director wants to modernize the way to support internal staff and offload his team from basic work. Currently 20000 tickets are issued in a year. 50% of the calls are answered in 7 minutes whereas there are many situations that reach up to 70 minutes for resolution. 92% of the calls are resolved by level 1 support. Employees of the Case Inc engage with customer support mostly through phones. Today, call center agents struggle to find some of the answers in a timely fashion as the systems are not integrated. This results in loss of productivity and frustration on the part of the bank employees. Level 1 support team get frustrated at times because of unavailability of the right information and proper guidance. The Level 1 support has to consult the Level 2 support team members to get some answers.   

As presented in the [Watson Conversation reference architecture diagram](https://www.ibm.com/devops/method/content/architecture/cognitiveArchitecture) this tutorial addresses the Ground Truth development with the conversation flow design (E) and the run time processing (4,7), integrated with chatbot interface (1), and controlled by the application logic - or **broker** micro service.
![Reference Architecture Diagram](wcs-ra.png)  

## Table of Contents
This tutorial was ported to the IBM Cloud Garage method tutorial web site at https://www.ibm.com/devops/method/tutorials/watson_conversation_support.
In this tutorial, you complete the following tasks:

* [What is Watson Conversation (Quick Summary)](#watson-conversation-quick-summary)
* [Create Watson conversation service](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=1) and [workspace](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=2)
* [Defining intents to help natural language processing](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=3)
* [Unit test intents](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=4)
* [Add entities to improve language understanding](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=5)
* [Building simple dialog flow](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=6)
* [Using the context object for more advanced dialog](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=7)
* [Using the api](#task-8---using-api)


# Watson Conversation Quick Summary
To have a quick understanding of Watson Conversation, you may want to read the [product overview](https://www.ibm.com/watson/developercloud/doc/conversation/index.html) section.
![Conversation Components](wcs-view.png)

As a summary, you use the Watson Conversation service to create  **chatbot**. This is the generic term for a piece of software that provides automated responses to user input. The bot is hosted in the cloud and is highly available. All the information that defines your bot's behavior is contained in a **workspace**.  

You create an **application** that enables your users to interact with the bot. The application passes user's input to the bot, possibly with some additional context information, and presents responses from the bot to the user.  

The bot is **stateless**, that is, it does not retain information from one interchange to the next. The application is responsible for maintaining any continuing information. However, the application can pass information to the bot, and the bot can update the **context** information and pass it back to the application.  

The bot uses natural language understanding and machine learning to extract meaning from the user's input. This process identifies the user's **intent**, which is the goal or purpose of the asked question. It can also identify an **entity**, which is a term, a noun that is mentioned in the input and narrow the purpose of the request. You train your bot to recognize intents and entities in the input submitted by users. To train your bot on intents, you supply lots of examples of user's input and indicate which intents they map to.

To train your bot on entities, you list the values for each entity and synonyms that users might enter.
Note: the names of intents and entities, and the text of examples, values, and synonyms, can be exposed in URLs when an application interacts with your bot. Do not store sensitive or personal information in these artifacts.
As you add information, the bot trains itself; you do not have to take any action to initiate the training.

Finally, after you train your system to recognize intents and entities, you teach it how to respond when it recognizes those intents and entities. You use the **dialog** builder to create conversations with users, providing responses based on the intents and entities that the bot recognizes in their inputs.  A dialog is composed of multiple flows and subFlows to design the multiple interactions of the conversation. Intent is supported by a dialog flow.

You should also read [Cognitive Conversation introduction](https://www.ibm.com/devops/method/content/architecture/cognitiveConversationDomain)

# Hands on lab - Step by step
As mentioned above the training was ported to the Garage Method [Tutorial section](https://www.ibm.com/devops/method/tutorials/watson_conversation_support) so you should follow the step by step instruction from this web site, but as new product capabilities were introduced since the last publish, we are specifying below some change to the tutorial that will stay here until they are ported to the method web site.

## Task 1 - Create Conversation Service
New screen shots:
![](bmx-watson-serv.png)

![](bmx-conv-tool.png)

## Task 2 - Creating a workspace
New screen
![](wcs-conv-wksp.png)

## Task 3 - Creating intents

New screens

![Intents](wcs-build-intents.png)  

![Questions](wcs-intent-question.png)  

![goodbyes](goodbyes-intent.png)

![greetings](greetings.png)

## Task 4 - Intent Unit testing

New screens
![Ask Watson](Ask-Watson.png)

![try it](tryitout.png)  


## Task 5 - Adding entities  
New screens
![](wcs-entities-panel.png)

![entities](wcs-entities.png)

![Test entity](ut-app-abc.png)

## Task 6 - Building the dialog
New screens
![Dialog](wcs-dialog.png)  

![](wcs-two-nodes.png)  

### Defining Greetings node

The first node, named Welcome, is executed when conversation starts. As we have defined the **#greeting** intent, you want to add a new node to do something when Watson Conversation classifies the user input to be a greeting. So select the `welcome` node and click to the `Add node below` menu choice:
![](Add-greetings.png)


![Greeting Node](wcs-diag-greeting.png)  


![Dialog-ut](wcs-diag-ut.png)

At each node level, you can expand the conversation by adding node at the same level, and the flows will be parallel or by adding a child node to create a dependent track of conversation, so the conversation branches out into a tree structure.

### Managing Anything else use case

![](wcs-otherwise.png)

![](wcs-otherwisejson.png)

### Defining the 'access application' dialog flow
Click the "Handle Greetings" node and then click  **Add node below** menu item. Name the new node Handle application access...

![Add node](add-app-acc-node.png)


![](Add-condition.png)

![Abc Access](app-access-conditions.png)  


![Unit testing AbC access](wcs-diag-abc-ut.png)  


The evaluation round works in two stages. In the first stage, the dialog tries to find an answer in the child nodes of the contextual node. That is, the dialog tries to match all the conditions of the child nodes of the contextual node. If the final condition has a condition of "true," meaning that it is to be used if none of its siblings are matched, that node's response is processed.


## Task 7 - Advanced Dialog Work
In this task the following is updated:

### Adding variables to context
Suppose you want to return an actionable URL, meaning that the response includes a URL variable that the user can click to go to a new page. To try this scenario, you will present the URL of a business process that is deployed on IBM BPM on Cloud.

If you did not import the intents definition from the lab csv file, you need to add a new intent to support the user's query about accessing the "Supplier on boarding business process".
![Supplier on boarding](supplier-intent.png)  

Add a new node to the dialog flow under the **Application access** node. Named it **Handling supplier on boarding**, specify the intent, **#SupplierOnBoarding** and then in the response  access the Advanced editor so we can edit the *json* response object:  

![Supplier node](supplier-node.png)

The response object includes an *output* object with the text to present and a *context* object. The *context* object has new variable named *url* to give IBM BPM on Cloud access and an *action* variable to control the behavior of the broker code. When the user enters a question like "I want to access the supplier on boarding business process,” the returned object looks like this example:
```json
{"intents": [
     {
       "intent": "supplieronboarding",
       "confidence": 0.940047025680542
     }
   ],
 "entities": [
   {
     "entity": "supplier",
     "value": "supplier"
    }
   ],
   "input": {
      "text": " I want to access the supplier on boarding business process"
   },
   "output": {
     "log_messages": [],
     "text": [
     "To access the Supplier On Boarding business process use the url: "
     ],
     "nodes_visited": [
       "Supplier On Boarding",
       "Provide URL for Supplier on boarding"
     ]
    },
    "context": {
       "conversation_id": "Conversation-ut",
       "system": {
         "dialog_stack": [
         {
           "dialog_node": "root"
         }
         ],
         "dialog_turn_counter": 1,
         "dialog_request_counter": 1
         },
         "url": "https://vhost001.bpm.ibmcloud.com/bpm/dev/ProcessPortal/dashboards/SYSRP/RESPONSIVE_WORK",
         "action":"click"
      }
}
```
The code that calls the Watson Conversation API can take the URL value and create a hyperlink in HTML so that the display has an actionable link
```javascript
if (rep.context.url != undefined) {
 if (rep.context.action === "click") {
   rep.text=rep.output.text[0] + "<a class=\"btn btn-primary\" href=\""+rep.context.url+"\">Here</a>"
 }
}
```
The actionable link is shown in the last interaction, with the clickable button added to the message:
![](click-url.png)  
Much can be done on the context object. For example, the application code can add elements in the context object before it calls the Conversation service. Then, at the condition level in a node, tests can be done on those elements.

To use a context variable in your condition, use one of these formats:
```
$variable_name:value
$variable_name == 'value'
```
The value of the condition might have been set by the application or in the response portion of a previous dialog node. In the next test, the canAccessSOD context variable is a Boolean that is set by accessing an internal authorization service that, for example, returns true if a user ID can access an application.

### Using slots
This section replaces 'add a hierarchical flow'.

In this section we will add a dialog flow to address when a user wants to bring his own device. We will support only certain brand and device. So we need to get those information. What we want to achieve could be illustrated by the following dialog:
![](byod-ut.png)
From the first query: "I want to bring my phone", Watson Conversation was able to get the **#BYOD** intent and the entity **@deviceType:phone**, so the dialog flow ask the brand of the device. If the device type was not extracted it will have ask a question about the type of device the user wants to bring.

A older way to support this different combination is to add a hierarchy of nodes and code the conditions on entity. Since the August release, there is the **slot** concept makes it more simple to implement. Use slots to get the information you need before you can respond accurately to the user.

1. If you did not import the intent and entities before, create a new entity for bring your own device question, like illustrated below:
![byod](byod.png)  
1. Create the entities @deviceBrand and @deviceType:
  ![device-brand](device-brand.png)

  ![device-type](device-type.png)  
1. Add a new flow, by adding a top level node, with the `#BYOD` intent as recognize condition/ Select the Customize menu on the right to enable slots for this node:
![](slot-enabled.png)

Once done the condition part changes to **Then check for:**
![](byod-node1.png)  

You should be able to add 2 slots:
* Check for entity @deviceBrand, save the result in a context variable named **$deviceBrand**, and if not present ask: "What is the brand of your device?"
* Check for the entity @deviceType, saved in **$deviceType** with question: "What is the type of your device (tablet, smartphone, computer)?"

Slots make it possible for the service to answer follow-up questions without having to re-establish the user's goal.

For the response part you can use the advanced dialog to enter a output text to display the content of the device type and brand:
![](byod-resp.png)

Be sure to set to *wait for user input* in the *And then* action part.

### Using interaction to get parameters to call a web service
The last example is more complex, but it represents a common pattern: in the context of a dialog flow, the set of interactions aim to gather input parameters so that after the interaction is done, the broker code can call a web service and pass the parameters as part of the payload.

In this example, the BPM supplier onboarding process can be triggered via a SOAP call. There are two input parameters: the company name and the product name. The client code is in the conversation broker code as a feature in the server/routes/features/supplier-bpm-client.js file.

As the focus is on the dialog, you must modify the previous flow to handle the 'Supplier process' intent. The first node asks whether the user wants the chatbot to trigger the process, as shown in this image:  
![](supplier-node.png)  

When the response is no, you use the previous behavior by providing the URL to BPM Process portal so that the user can start the process manually.
![](supplier-node-no.png)

When the response is yes, the two next interactions are used to get the company name and product name. You can try to reproduce the following structure
![](get-parameters.png)  

Outside of the output.text which provides a question about the company, the context uses two variables to help driving the broker code: the action is set to getVar and the varname to the name of the variable to add to the context via code. The following figure illustrates that on a **yes** response the bot will ask about the supplier node.
![](supplier-node-yes.png)  

The broker code dynamically adds the specified variable in the context to keep the data for the next interaction. The following code is in the function to manage the user's response before it calls the Conversation service:

```javascript  
if (req.body.context.action === "getVar") {
      req.body.context[req.body.context.varname] = req.body.text;
  }
```

The same approach is done in for the product name:

![](get-product-name.png)

If the user does not give the product or company name a specific node identify the missing parameter and goes back to the node to ask the question again.

![](no-product-name.png)

 Finally when all the parameters are set the interaction set the action to **trigger**, so the broke call can perform the soap call to the service.

![](trigger-process.png)

## Task 8 - Using API
To use API you need the service credential and use tool to preform HTTP request. See this separate [instructions](../use-apis.md).

For understanding the **broker** code see [this section of the readme](https://github.com/ibm-cloud-architecture/refarch-cognitive-conversation-broker#code-explanation)

## Learn More
* A super simple chat bot designed for customer service [here](https://www.ibm.com/blogs/watson/2016/12/build-chat-bot)
* Watson Conversation simple [Product tutorial](https://www.ibm.com/watson/developercloud/doc/conversation/tutorial.html)
