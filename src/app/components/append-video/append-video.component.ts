import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { AgoraConstants } from 'src/app/agora.constants';
import AgoraRTC from "agora-rtc-sdk-ng"


@Component({
  selector: 'app-append-video',
  templateUrl: './append-video.component.html',
  styleUrls: ['./append-video.component.css']
})
export class AppendVideoComponent implements OnInit {
// @Input('name') userName: string | undefined;
// videoPlayer: any
// username: any
// videoStream: any
// uid = AgoraConstants.uid
screenClient: any | undefined
  constructor(private renderer:Renderer2) { }

  ngOnInit(): void {
  //  this.screenClient = AgoraRTC.createClient({mode: 'rtc',codec: 'vp8'});
  }

  // onLocalVideo(){
  //   this.videoPlayer = this.renderer.createElement('div');
  //   this.username = this.renderer.createElement('div')
  //   this.renderer.setAttribute(this.username, 'class', 'user-uid');
  //   this.username.innerText = this.userName;
  //   this.videoStream = this.renderer.createElement('div');
  //   this.renderer.setAttribute(this.videoStream, 'class', 'video-player');
  //   this.renderer.setAttribute(this.videoStream, 'id', `stream-${AgoraConstants.uid}`);

  //   this.videoPlayer.appendChild(this.username)
  //   this.videoPlayer.appendChild(this.videoStream)

  //   this.renderer.setAttribute(this.videoPlayer, 'class', 'video-containers');
  //   this.renderer.setAttribute(this.videoPlayer, 'id', `video-wrapper-${AgoraConstants.uid}`);
  //   this.renderer.appendChild(document.getElementById('user-streams'), this.videoPlayer);
  // }

  // onRemoteVideo(){}

}
