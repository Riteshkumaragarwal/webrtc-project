import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'src/app/modal';
import { AgoraConstants } from 'src/app/agora.constants';
import { AgoraRtmService } from 'src/app/services/agora-rtm.service';

@Component({
  selector: 'app-rtm-chat',
  templateUrl: './rtm-chat.component.html',
  styleUrls: ['./rtm-chat.component.css']
})
export class RtmChatComponent implements OnInit {
  @ViewChild('messageInput') fullNameInput: any; 
  @Input() showMePartially: boolean | undefined;
  messages: Modal[] = [];
  @Input() usernames: string | undefined;
  client: any;
  message: any;

  constructor(private agoraRTM: AgoraRtmService) { }

  ngOnInit(): void {
    this.agoraRTM.initiatingRTM(this.messages);
  }

  async sendMessage(data: any) {
    console.log('--------------data', data)
    this.message = this.usernames + ', ' + data.value.text;
    if (this.message === "") return;
    this.agoraRTM.sendingMessage(this.message)
    this.messages.push({
      id: AgoraConstants.rtmUid,
      type: 'sender',
      name: this.usernames,
      message: data.value.text
    })
    console.log('pp----------------', this.messages)
  }

  clearText(){
    this.fullNameInput.nativeElement.value = '';
  }
}


