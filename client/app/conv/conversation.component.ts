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
  When creating a conversation component call Watson to get a greetings as defined in the Dialog
  */
  constructor(private convService : ConversationService){
    this.callConversationBFF("Hello");
  }
  // variable used in the input field in html page
  queryString=""

  callConversationBFF(msg:string) {
    this.convService.submitMessage(msg,this.context).subscribe(
      data => {console.log(data)
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
