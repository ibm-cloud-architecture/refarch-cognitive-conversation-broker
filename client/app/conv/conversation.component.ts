import {Component, AfterViewChecked, ElementRef, ViewChild, OnInit} from '@angular/core';
import { ConversationService }  from './conversation.service';
import { Sentence } from "./Sentence";
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'conversation',
    styleUrls:['conversation.css'],
    templateUrl:'conversation.html'
  })

export class ConversationComponent implements OnInit, AfterViewChecked {
  currentDialog : Sentence[]=[];
  context={'type':'base'}; // used to keep the Conversation context
  message:string;
  type:string = "base";
  /**
  When creating a conversation component call Watson to get a greetings message as defined in the Dialog. This is more user friendly.
  */
  constructor(private convService : ConversationService, private route: ActivatedRoute){
    // depending of the url parameters the layout can be simple or more demo oriented with instruction in html
    this.type=this.route.snapshot.params['type'];
    // Uncomment this line if you do not have a conversation_start trigger in a node of your dialog
    this.callConversationBFF("Hello");
  }

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  ngOnInit() {
      this.scrollToBottom();
  }

  ngAfterViewChecked() {
      this.scrollToBottom();
  }

  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
  }


  // variable used for the input field in html page to get user query
  queryString=""

  callConversationBFF(msg:string) {
    this.context['type']=this.type; // inject the type of caller so the BFF can call different conversation workspace
    this.convService.submitMessage(msg,this.context).subscribe(
      data => {
        this.context=data.context;
        let s:Sentence = new Sentence();
        s.direction="from-watson";
        s.text=data.output.text[0];
        this.currentDialog.push(s)
      },
      error => {
        return "Error occurs in conversation processing"
        }
    )
  }

  // method called from html button
  submit(){
    let obj:Sentence = new Sentence();
    obj.direction="to-watson";
    obj.text=this.queryString;
    this.currentDialog.push(obj);
    this.callConversationBFF(this.queryString);
    this.queryString="";
  }

  // instead to click on button if user hits enter/return key
  keyMessage(event){
     if(event.keyCode == 13) {
        this.submit();
      }
  }
}
