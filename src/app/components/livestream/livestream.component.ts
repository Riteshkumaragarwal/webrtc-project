import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AgoraConstants } from 'src/app/agora.constants';
import { AgoraRtcService } from 'src/app/services/agora-rtc.service';
import { NgForm } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.css']
})
export class LivestreamComponent implements OnInit {
[x: string]: any;
  remoteCalls: any = [];
  localCall = 'agora_local'
  screenCall = 'screen_share'
  remoteUid: string | undefined;
  activeCall: boolean = false;
  uid: string | undefined;
  profileImage: string | undefined
  userName: string | undefined;
  inputShow: boolean = false
  showVar: boolean = false;
  images: boolean = true;
  client: any;
  videoPlayer: any | undefined;
  localTrackState: any = {
    audioTrackMuted: false,
    videoTrackMuted: false
  }
  remoteTracks: any = {}
  videoImage: any
  url: any = ''
  sharingScreen: boolean = false;
  list: any
  userUid: string | undefined;
  remoteImageURL: string | undefined;
  remoteUSerName: string | undefined;
  videoDestroyed: boolean = false
  screen: boolean = false

  constructor(private renderer: Renderer2, private el: ElementRef,
    private agoraRTC: AgoraRtcService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.client = this.agoraRTC.client;
  }

  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }

  async joinBtn(event: NgForm) {
    console.log('event target-------------', event);
    console.log('event target value-------------', event.value);
    this.activeCall = true
    this.uid = AgoraConstants.uid;
    this.userName = event.value.userName;
    this.profileImage = event.value.image;
    if (event.value.userName) {
      // this.httpService.createUser(event.value)
      let updateUid = this.userName + ', ' + AgoraConstants.uid + ', ' + AgoraConstants.channelId
      await this.client.on('user-published', this.handleUserJoined.bind(this))
      await this.agoraRTC.joinVideo(updateUid)
      await this.agoraRTC.publishStream(this.localCall)
      let cameraButton = document.getElementById('agora_local')
      cameraButton?.classList.add('host-img')
      this.renderer.setStyle(document.getElementById('join'), 'display', 'none');
      this.showVar = !this.showVar
      this.inputShow = !this.inputShow;
    }
  }

  async switchToCamera() {
    await this.agoraRTC.onMute();
    await this.agoraRTC.onCamera();
    this.renderer.removeClass(document.getElementById('mic-btn'), 'active')
    this.renderer.removeClass(document.getElementById('screen-btn'), 'active')
    await this.agoraRTC.publishStream(this.localCall)
  }

  async onScreenShare(event: any) {
    let screenButton = event.currentTarget
    let cameraButton = document.getElementById('camera-btn')
    if (!this.sharingScreen) {
      this.sharingScreen = true;
      // this.screen = false
      screenButton.classList.add('active')
      cameraButton?.classList.add('active')
      this.renderer.setStyle(cameraButton, 'display', 'none');
      // await this.agoraRTC.joinScreen(AgoraConstants.channelId)
      this.agoraRTC.PublishScreen(this.screenCall)

    } else {
      this.sharingScreen = false;
      this.renderer.setStyle(cameraButton, 'display', 'block');
      screenButton.classList.remove('active')
      this.list = document.getElementById(this.localCall)
      this.list?.removeChild(this.list.lastElementChild)
      this.agoraRTC.unPublishScreen()
      this.switchToCamera()
    }
  }


  async handleUserJoined(user: any, mediaType: any) {
    console.log(user)
    let uid = user.uid;
    let remoteUSerName = uid.substring(0, uid.indexOf(', '));
    let uidWithImage = uid.substring(uid.indexOf(', ') + 1)
    let userUid = uidWithImage.substring(0, uidWithImage.indexOf(', '))
    this.remoteUid = uidWithImage.substring(0, uidWithImage.indexOf(', '))
    let remoteImageURL = uidWithImage.substring(uidWithImage.indexOf(', ') + 1);
    console.log('---------------user joined stream---', userUid)

    this.client.on('user-left', () => {
      if (!user.hasVideo) {
        this.videoPlayer = document.getElementById(`agora_remote${userUid}`);
        this.videoPlayer && this.videoPlayer.remove();
      }
    })

      // if (user.videoTrack && user.videoTrack._isDestroyed) {
      //   // if (!this.remoteCalls.includes(`agora_remote${userUid}`))
      //   // this.remoteCalls.push({
      //   //   uid: `agora_remote${userUid}`, username: remoteUSerName,
      //   //   imageURL: remoteImageURL
      //   // });
      //   // console.log('remotedata123---------', this.remoteCalls)
      //   await this.agoraRTC.publishVideoTrack();
      //   // setTimeout(() => user.videoTrack.play(`agora_remote${userUid}`), 1000);
      //   // this.agoraRTC.publishStream(`agora_remote${userUid}`)
      // }
    this.videoDestroyed = user.videoTrack?._isDestroyed
    this.remoteTracks[userUid] = user;
    console.log('remote ---------------track', this.remoteTracks)
    await this.client.subscribe(user, mediaType);
    console.log("subscribe success");

    if (mediaType === 'video') {
      this.videoPlayer = document.getElementById(`agora_remote${userUid}`);
      if (this.videoPlayer != null) {
        this.videoPlayer && this.videoPlayer.remove();
      }
      if (!this.remoteCalls.includes(`agora_remote${userUid}`))
        this.remoteCalls.push({
          uid: `agora_remote${userUid}`, username: remoteUSerName,
          imageURL: `agora_remote${remoteImageURL}`
        });
      console.log('remotedata158---------', this.remoteCalls)
      setTimeout(() => user.videoTrack.play(`agora_remote${userUid}`), 1000);

      // if (user.videoTrack && user.videoTrack._isDestroyed) {
      //   if (!this.remoteCalls.includes(`agora_remote${userUid}`))
      //   // this.remoteCalls.push({
      //   //   uid: `agora_remote${userUid}`, username: remoteUSerName,
      //   //   imageURL: `agora_remote${remoteImageURL}`
      //   // });
      //   this.remoteCalls.push({
      //     uid: `agora_remote${userUid}`, username: remoteUSerName,
      //     imageURL: `agora_remote${remoteImageURL}`
      //   });
      //   // await this.agoraRTC.publishVideoTrack();
      //   // console.log('remotedata123---------', this.remoteCalls)
      //   setTimeout(() => user.videoTrack.play(`agora_remote${userUid}`), 1000);
      //   // setTimeout(() => user.videoTrack.play(`agora_remote${userUid}`), 2000);

      // }
   
    }

    // if (mediaType === 'screen') {
    //   const screenElement = document.createElement('video');
    // screenElement.id = userUid + '-screen';
    // screenElement.autoplay = true;
    // screenElement.controls = false;
    // document.body.appendChild(screenElement);
    // user.screenTrack.play(screenElement);
    // }

    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  }

  async onLeave() {
    this.activeCall = false
    this.agoraRTC.leaveStream();
    this.showVar = !this.showVar
    this.inputShow = !this.inputShow;
    this.renderer.setStyle(document.getElementById('join'), 'display', 'block');
    // this.renderer.setProperty(document.getElementById('user-streams'), 'innerHTML', '');
    window.location.reload()
  }

  async onMuted(event: any) {
    let button = event.currentTarget
    if (!this.localTrackState.audioTrackMuted) {
      console.log('Muted ========================')
      await this.agoraRTC.onMute();
      this.localTrackState.audioTrackMuted = true;
      button.classList.remove('active')
    } else {
      await this.agoraRTC.onUnmute()
      this.localTrackState.audioTrackMuted = false;
      button.classList.add('active')
    }
  }

  async onCamera(event: any) {
    let button = event.currentTarget
    if (!this.localTrackState.videoTrackMuted) {
      await this.agoraRTC.onCamera();
      this.localTrackState.videoTrackMuted = true;
      button.classList.remove('active')
      this.images = false
    } else {
      await this.agoraRTC.offCamera()
      this.localTrackState.videoTrackMuted = false;
      this.images = true
      button.classList.add('active')
    }
  }
}

