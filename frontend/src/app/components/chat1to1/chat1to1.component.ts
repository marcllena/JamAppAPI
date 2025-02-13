import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.services'
import { WebsocketsService } from 'src/app/services/websockets.service';

@Component({
  selector: 'app-chat1to1',
  templateUrl: './chat1to1.component.html',
  styleUrls: ['./chat1to1.component.scss'],
})
export class Chat1to1Component implements OnInit {
  destination
  sendingMessage

  constructor(private singleton: DataService, private websockets: WebsocketsService) {
    this.singleton.newChatDestination.subscribe(destination => this.destination = destination)
  }

  ngOnInit() {
    this.websockets.chatInit(this.destination);
    console.log("iniciant chat")
  }
  sendMessage(destination, message){
      
      this.websockets.pushMessage(message);
      this.websockets.sendMessage(this.destination, this.sendingMessage)
      this.sendingMessage = ""
  }
}
