import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chat } from 'src/app/messageModal';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase, ref, set, onValue } from "firebase/database";
import { NgForm } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment';
import { faComments, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-rtm-chat',
  templateUrl: './rtm-chat.component.html',
  styleUrls: ['./rtm-chat.component.css']
})
export class RtmChatComponent implements OnInit {
  todayString: string = new Date().toDateString();
  faComments = faComments;
  faPaperPlane = faPaperPlane
  app: FirebaseApp;
  db: Database;
  chats: Chat[] = [];
  chat_btn: any
  chat_box: any
  @ViewChild('messageInput') fullNameInput: any;
  @Input() showMePartially: boolean | undefined;
  @Input() usernames: string | undefined;

  constructor() {
    this.app = initializeApp(environment.firebase);
    this.db = getDatabase(this.app);
  }

  ngOnInit(): void {
    const chatsRef = ref(this.db, 'chats');
    onValue(chatsRef, (snapshot: any) => {
      const data = snapshot.val();
      console.log('data----', data)
      for (let id in data) {
        if (!this.chats.map(chat => chat.id).includes(id)) {
          this.chats.push(data[id])
        }
      }
    });
  }

  async onChatSubmit(form: NgForm) {
    const chat = form.value;
    console.log('chat========', chat)
    console.log('this.chats', this.chats)
    chat.timestamp = new Date().toString();
    chat.id = uuidv4();
    chat.name = this.usernames
    chat.message = form.value.message
    set(ref(this.db, `chats/${chat.id}`), chat);
  }

  clearText() {
    this.fullNameInput.nativeElement.value = '';
  }

  onClickIcon() {
    this.chat_btn = document.getElementById("crossIcon")
    this.chat_box = document.getElementById("fullBox")
    this.chat_btn.classList.toggle("expanded");
    setTimeout(() => {
      this.chat_box.classList.toggle("expanded");
    }, 100)
  }
}


