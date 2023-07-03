import {Component, OnInit} from '@angular/core';
import {isAuthenticated} from "./utils";
import {ChatService} from "./services/chat.service";
import {SealService} from "./services/seal.service";
import {FileService} from "./services/file.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private chatService: ChatService) {


  }


  ngOnInit() {
    if (isAuthenticated()) {

      this.chatService.startConnection(localStorage.getItem("id")!)
    }
  }
}
