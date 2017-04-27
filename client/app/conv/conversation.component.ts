import {Component} from '@angular/core';
import { ConversationService }  from './conversation.service';
import { Sentence } from "./Sentence";

@Component({
    moduleId: module.id,
    selector: 'conversation',
    styleUrls:['conversation.css'],
    templateUrl:'conversation.html'
  })

export class ConversationComponent {
  currentDialog : Sentence[]=[];
  context:any; // used to keep the Conversation context
  message:string;
  /**
  When creating a conversation component call Watson to get a greetings message as defined in the Dialog. This is more user friendly.
  */
  constructor(private convService : ConversationService){
    // Uncomment this line if you do not have a conversation_start trigger in a node of your dialog
    // this.callConversationBFF("Hello");
  }

  // variable used for the input field in html page to get user query
  queryString=""

  callConversationBFF(msg:string) {
    this.convService.submitMessage(msg,this.context).subscribe(
      data => {
        this.context=data.context;
        let s:Sentence = new Sentence();
        s.direction="from-watson";
        s.text=data.text;
        this.currentDialog.push(s)
      },
      error => {
        return "Error occurs in conversation processing"
        }
    )
  }

  submit(){
    let obj:Sentence = new Sentence();
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
