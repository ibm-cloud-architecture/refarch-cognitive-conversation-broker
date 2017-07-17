import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }         from './app.component';
import { ConversationComponent} from './conv/conversation.component';
import { ConversationService }  from './conv/conversation.service';
import { HomeComponent }        from './home.component';
// added for appliance IoT extends use case
import { IoTComponent }        from './iot/iot.component';
import { IoTService }          from './iot/iot.service';
import { IoTConversation }     from './iot/iotconv.component';
import { IoTMeasureComponent } from './iot/iotmeasure.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'conversation/:type', component: ConversationComponent },
  { path: 'appliance', component: IoTComponent },
  { path: 'applianceMeasure', component: IoTMeasureComponent},
  { path: 'applianceChat',component: IoTConversation},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConversationComponent,
    IoTComponent,
    IoTConversation,
    IoTMeasureComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ConversationService,IoTService],
  bootstrap: [AppComponent]
})
export class AppModule { }
