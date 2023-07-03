import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {MessageRequest, MessageResponse} from "../models/message";
import {environment} from "../../environments/environment";
import {User} from "../models/user";
import {UserChat} from "../models/user-chat";

@Injectable({
  providedIn: 'root'
})
export class ChatSenderService {

  constructor(private  http:HttpClient) {

  }

  addSenderMessage(message:MessageRequest){
    this.http.post<any>(`${environment.apiUrl}/api/Chat/addSenderMessage`, message).subscribe();
  }

  getSenderMessage(senderId:number,receiverId:number){
    let params=new HttpParams().set("senderId",senderId).set("receiverId",receiverId);

    return this.http.get<MessageResponse[]>(`${environment.apiUrl}/api/Chat/senderMessage`,{params})
  }

  getReceiverMessage(senderId:number,receiverId:number){
    let params=new HttpParams().set("senderId",senderId).set("receiverId",receiverId);

    return this.http.get<MessageResponse[]>(`${environment.apiUrl}/api/Chat/receiverMessage`,{params})
  }

  getUsers(id:number){
    return this.http.get<UserChat[]>(`${environment.apiUrl}/api/Chat/getChat/${id}`)

  }
}
