import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LivestreamComponent } from './components/livestream/livestream.component';
import { RtmChatComponent } from './components/rtm-chat/rtm-chat.component';
import { AppendVideoComponent } from './components/append-video/append-video.component';

@NgModule({
  declarations: [
    AppComponent,
    LivestreamComponent,
    RtmChatComponent,
    AppendVideoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
