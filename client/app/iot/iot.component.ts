/**
* Main page for the appliance management, exposes to two sub menus
*/
import {Component,ViewChild} from '@angular/core';
import { Router }   from '@angular/router';

@Component({
  //  moduleId: module.id,
    selector: 'iothome',
    templateUrl:'iot.home.component.html',
    styleUrls: ['../home.component.css'],
  })

export class IoTComponent {
  title: string = "Appliance Management"

  constructor(private router: Router,){

  }

  applianceMeasure(){
      this.router.navigate(['applianceMeasure']);
  }

  applianceChat(){
    this.router.navigate(['applianceChat']);
  }
}
