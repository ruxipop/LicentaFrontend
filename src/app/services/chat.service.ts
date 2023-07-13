import {Injectable, OnDestroy, OnInit} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MessageRequest} from "../models/message";
import {AppComponent} from "../app.component";
import {isAuthenticated} from "../utils";
import {SealService} from "./seal.service";
import {TransferDataService} from "./transfer-data.service";
import {NotificationType} from "../models/notificationType";
import {Notification} from "../models/notification";
import {AlertService} from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {

  private connection: signalR.HubConnection;


  constructor(private sealService: SealService,private dataTransfer:TransferDataService,private alertService:AlertService) {

  }

  startConnection(username: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/chatsocket?username=${username}`)
      .withAutomaticReconnect()

      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.start()
      .then(() => {
        console.log('Conexiunea cu SignalR a fost stabilită.');
        this.receiveChat((message) => {
          this.dataTransfer.sendResponseMessage(message);
        });
        this.receiveNotification((notification:Notification) => {
          this.alertService.addNotification({ id:1,label:"New...",message:"You have a new notification", type: "info" })
        });
      })
      .catch((err: Error) => console.error('Eroare la stabilirea conexiunii cu SignalR: ' + err));
  }

  sendChat(sendId: string, receiverId: string, message: string): void {

    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      const encryptedMessage = this.sealService.encryptMessage(message);
      this.connection.invoke('SendChat', receiverId, sendId, encryptedMessage)
        .catch((err: Error) => console.error('Eroare la trimiterea mesajului: ' + err));
    } else {
      console.error('Conexiunea nu este stabilită.');
    }
  }

  sendNotification( receiverId: string,type:NotificationType,imageId:string): void {

    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      this.connection.invoke('SendNotification', receiverId, localStorage.getItem("id"),imageId,type)
        .catch((err: Error) => console.error('Eroare la trimiterea notificării: ' + err));
    } else {
      console.error('Conexiunea nu este stabilită.');
    }
  }




  receiveChat(callback: (message: any) => void): void {
    this.connection.on('ReceiveChat', callback);
  }

  receiveNotification(callback: (message: Notification) => void): void {
    this.connection.on('ReceiveNotification', callback);
  }
  ngOnDestroy() {

    this.connection.stop()
      .then(() => console.log('SignalR connection stopped'))
      .catch(error => console.error('Error stopping SignalR connection: ', error));
  }

}
