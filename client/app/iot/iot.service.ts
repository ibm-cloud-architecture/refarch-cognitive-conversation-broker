import { Injectable }    from '@angular/core';
import { Headers, Http,Response,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppMeasure } from "./AppMeasure";

@Injectable()
export class IoTService {
  private invUrl ='/api/a';
  private convUrl ='/api/ac/conversation/';

  constructor(private http: Http) {}

  getMeasures(): Observable<any>{
      return this.http.get(this.invUrl+'/measures')
           .map((res:Response) =>
            res.json())
  }

  submitMessage(msg:string,ctx:any): Observable<any>{
    let bodyString = JSON.stringify(  { text:msg,context:ctx });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers })
    return this.http.post(this.convUrl,bodyString,options)
         .map((res:Response) => res.json())
  }
}
