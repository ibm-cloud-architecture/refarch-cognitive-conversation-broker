import {Component,ViewChild} from '@angular/core';
import { IoTService }  from './iot.service';
import { AppMeasure } from "./AppMeasure";
@Component({
  //  moduleId: module.id,
    selector: 'applianceMeasure',
    templateUrl:'iot.appliance.measures.html'
  })

export class IoTMeasureComponent {
  appMeasures : AppMeasure[]=[];
    message: string ="";

  constructor(private iotService : IoTService){
    this.getMeasures();
  }

  getMeasures() {
      this.iotService.getMeasures().subscribe(
        data => {
          this.appMeasures=data;
        },
        error => {
          this.message="Error to get the data from backend";
          this.appMeasures=error;
          console.log(error);
          }
      )
  }
}
