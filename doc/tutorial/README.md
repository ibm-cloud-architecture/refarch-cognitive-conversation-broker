# IT Support Chat bot Tutorial

Implement a simple **IT support** help-me conversation chatbot. The chatbot helps to streamline IT support queries by automating the dialog flow.
Updates: 10/03/2017

## Business use case
The support director wants to modernize the way to support internal staff and offload his team from basic work. Currently 20000 tickets are issued in a year. 50% of the calls are answered in 7 minutes whereas there are many situations that reach up to 70 minutes for resolution. 92% of the calls are resolved by level 1 support. Employees of the Case Inc engage with customer support mostly through phones. Today, call center agents struggle to find some of the answers in a timely fashion as the systems are not integrated. This results in loss of productivity and frustration on the part of the bank employees. Level 1 support team get frustrated at times because of unavailability of the right information and proper guidance. The Level 1 support has to consult the Level 2 support team members to get some answers.   

As presented in the [Watson Conversation reference architecture diagram](https://www.ibm.com/devops/method/content/architecture/cognitiveArchitecture) this tutorial addresses the Ground Truth development with the conversation flow design (E) and the run time processing (4,7), integrated with chatbot interface (1), and controlled by the application logic - or **broker** micro service.
![Reference Architecture Diagram](wcs-ra.png)  


This tutorial was ported to the IBM Cloud Garage method tutorial web site at https://www.ibm.com/devops/method/tutorials/watson_conversation_support.
In this tutorial, you complete the following tasks:

* [What is Watson Conversation (Quick Summary)](#watson-conversation-quick-summary)
* [Create Watson conversation service](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=1) and [workspace](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=2)
* [Defining intents to help natural language processing](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=3)
* [Unit test intents](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=4)
* [Add entities to improve language understanding](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=5)
* [Building simple dialog flow](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=6)
* [Using the context object for more advanced dialog](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=7)
* [Using the api](https://www.ibm.com/devops/method/tutorials/watson_conversation_support?task=8)


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
As mentioned above the training was ported to the Garage Method [Tutorial section](https://www.ibm.com/devops/method/tutorials/watson_conversation_support) so you should follow the step by step instruction from this web site.


## Final solution
If you need to see the current solution, load the exported conversation workspace as json file into your Conversation tools. The file is under **./wcs-workspace/ITsupport-workspace.json**.

## Learn More
* A super simple chat bot designed for customer service [here](https://www.ibm.com/blogs/watson/2016/12/build-chat-bot)
* Watson Conversation simple [Product tutorial](https://www.ibm.com/watson/developercloud/doc/conversation/tutorial.html)
