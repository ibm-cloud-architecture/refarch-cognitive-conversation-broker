import {Component} from '@angular/core';
import { IoTService }  from './iot.service';
import { ConversationService }  from '../conv/conversation.service';
import { IoTSentence } from "./IoTSentence";

@Component({
    //moduleId: module.id,
    selector: 'conversation',
    styleUrls:['../conv/conversation.css'],
    templateUrl:'iot.conversation.html'
  })

export class IoTConversation {
  currentDialog : IoTSentence[]=[];
  context={'type':'iot'};
  type:string = "iot";
  message:string;
  /**
  When creating a conversation component call Watson to get a greetings message as defined in the Dialog. This is more user friendly.
  */
  constructor(private convService : ConversationService){
    // Uncomment this line if you do not have a conversation_start trigger in a node of your dialog
    this.callConversationBFF("Hello");
  }

  // variable used for the input field in html page to get user query
  queryString=""

  isArray(what) {
      return Object.prototype.toString.call(what) === '[object Array]';
  }

  callConversationBFF(msg:string) {
    this.convService.submitMessage(msg,this.context).subscribe(
      data => {
        this.context=data.context;
        this.context['type']=this.type; // inject the type of caller so the BFF can call different conversation workspace
        let s:IoTSentence = new IoTSentence();
        s.direction="from-watson";
        if (!this.isArray(data.discdata)) {
            s.text=data.text;
        } else {
          s.text="<table id=\"dataTable\" class=\"table table-striped table-condensed\"><tbody>";
          for (var i = 0; i < data.discdata.length; i++) {
            s.text+="<tr><td style=\"color:blue\">"+JSON.stringify(data.discdata[i].Symptom)+"</td>"
            +"<td>"+JSON.stringify(data.discdata[i].Solution)+"</td></tr>";
          }
          s.text+="</tbody></table>"
        }

        this.currentDialog.push(s)
      },
      error => {
        let s:IoTSentence = new IoTSentence();
        s.direction="from-watson";
        s.text=error.text;
        console.log("Error occurs in conversation processing:" + error.text);
        }
    )
  }

  submit(){
    let obj:IoTSentence = new IoTSentence();
    obj.direction="to-watson";
    obj.text=this.queryString;
    this.currentDialog.push(obj);

    this.callConversationBFF(this.queryString);
    this.queryString="";
  }

  keyMessage(event){
     if(event.keyCode == 13) {
        this.submit();
      }
  }
}
