import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../user-interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  createUser(userData: User) {
    this.http
      .post('https://webrtc-project-6f472-default-rtdb.firebaseio.com/users.json',
        userData).subscribe(responseData => {
          console.log(responseData);
        })
  }
}
