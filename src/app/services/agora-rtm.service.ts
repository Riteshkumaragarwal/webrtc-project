import { Injectable } from '@angular/core';
import AgoraRTM from 'agora-rtm-sdk';
import { AgoraConstants } from 'src/app/agora.constants';
import { Modal } from '../modal';


@Injectable({
  providedIn: 'root'
})
export class AgoraRtmService {
  client: any;
  channel: any;

  constructor() { }

  async initiatingRTM(messages: Modal[]) {
    this.client = AgoraRTM.createInstance(AgoraConstants.appId);
    await this.client.login({ 'uid': AgoraConstants.rtmUid, 'token': AgoraConstants.token })
    this.channel = await this.client.createChannel(AgoraConstants.room);
    await this.channel.join()

    this.channel.on('ChannelMessage', (message: any, peerId: any) => {
      console.log('-----------message------', message, peerId)
      let text = message.text;
      let messageUser = text.substring(0, text.indexOf(', '));
      let messageText = text.substring(text.indexOf(', ') + 1);
      messages?.push({
        id: peerId,
        type: 'receiver',
        name: messageUser,
        message: messageText
      })
      console.log('tt----------------', messages)
    })
  }

  async sendingMessage(message: any) {
    await this.channel.sendMessage({ text: message, type: 'text' })
  }
}
