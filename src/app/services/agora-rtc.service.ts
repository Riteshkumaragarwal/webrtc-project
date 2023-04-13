import { Injectable } from '@angular/core';
import AgoraRTC from "agora-rtc-sdk-ng";
// import AgoraScreenRTC from 'agora-screen-share-sdk'
import { AgoraConstants } from '../agora.constants';

@Injectable({
  providedIn: 'root'
})
export class AgoraRtcService {
  client: any;
  screenClient: any
  trackName: any | undefined;
  track: any | undefined;
  player: any;
  localTracks: any = {
    audioTrack: null,
    videoTrack: null,
    screenTrack: null
  };
  remoteTracks: any = {}

  constructor() {
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' });
    this.screenClient = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'});
  }

  async joinVideo(updateUid: any) {
    return this.client.join(AgoraConstants.appId, AgoraConstants.room,
      AgoraConstants.token || null, updateUid || null)
  }

  async joinScreen(updateUid: any) {
    return this.screenClient.join(AgoraConstants.appId, AgoraConstants.room,
      AgoraConstants.token || null, updateUid || null)
  }

  async publishStream(localCall: any) {
    this.localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    this.localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
    this.localTracks.videoTrack.play(localCall)
    return this.client.publish([this.localTracks.audioTrack, this.localTracks.videoTrack])
  }

  async unPublishStream(){
    return this.client.unpublish([this.localTracks.audioTrack, this.localTracks.videoTrack])
  }

  async publishVideoTrack(){
    this.localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
    // this.localTracks.screenTrack = await AgoraRTC.createScreenVideoTrack({});
  }

  async PublishScreen(screenID:any){
    // this.client.join(AgoraConstants.appId, AgoraConstants.room,
    //   AgoraConstants.token || null, AgoraConstants.channelId || null)
    this.localTracks.screenTrack = await AgoraRTC.createScreenVideoTrack({});
    this.localTracks.screenTrack.play(screenID)
    await this.client.unpublish([this.localTracks.videoTrack])
    await this.client.publish([this.localTracks.screenTrack])
  }

  async unPublishScreen(){
    await this.client.unpublish([this.localTracks.screenTrack])
  }

  async leaveStream() {
    for (this.trackName in this.localTracks) {
      this.track = this.localTracks[this.trackName];
      if (this.track) {
        // stop camera and mic
        this.track.stop();
        // Disconnect from your camera and mic
        this.track.close();
        this.localTracks[this.trackName] = null;
      }
    }
    await this.client.leave();
  }

  async onMute() {
    this.localTracks.audioTrack.setMuted(true);
  }

  async onUnmute() {
    this.localTracks.audioTrack.setMuted(false);
  }

  async onCamera() {
    this.localTracks.videoTrack.setMuted(true);
  }

  async offCamera() {
    this.localTracks.videoTrack.setMuted(false)
  }
}
