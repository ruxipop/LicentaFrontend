import {Component, OnInit} from '@angular/core';
import {isAuthenticated} from "./utils";
import {ChatService} from "./service/chat.service";
import {SealService} from "./service/seal.service";
import {FileService} from "./service/file.service";
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
