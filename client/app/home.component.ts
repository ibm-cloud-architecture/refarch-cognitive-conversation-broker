import {Component} from '@angular/core';
import { Router }   from '@angular/router';
/*
Main page component to display access to the different demo features.
*/

@Component({
    selector: 'home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
  })

  export class HomeComponent {
    constructor(private router: Router) {
    }


    conversation(){
      this.router.navigate(['conversation/base']);
    }
    // ADD Here methods to be called from HTLM button to route to other component
    conversationSodb(){
      this.router.navigate(['conversation/sodb']);
    }

    advisor(){
      this.router.navigate(['advisor']);
    }
}
