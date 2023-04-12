import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AgoraConstants {
    public static appId = '021143a1f6f2475cb71641769ecffadb';
    public static room = 'livestream';
    public static token = null;
    public static uid = String(Math.floor(Math.random() * 2032));
    public static rtmUid = String(Math.floor(Math.random() * 2032));
    public static channelId = String(Math.floor(Math.random() * 2032));
}