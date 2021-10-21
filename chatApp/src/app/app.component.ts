import { Component } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  socket: any;
  msgText: string = '';
  targetLang: string = '';
  messages: any[] = [];
  userName: string = '';

  constructor() {
    this.socket = io();
  }

  ngOnInit() {
    this.messages = new Array();

    this.socket.on("message", (data) => {
      console.log(data);
      this.messages.push(data);
    });
  }

  sendMsg() {
    let data = {
      user: this.userName,
      text: this.msgText,
      lang: this.targetLang
    }
    this.socket.emit("newMsg", data);

    this.resetValues();
  }

  resetValues() {
    this.msgText = '';
    this.targetLang = '';
  }
  

}
