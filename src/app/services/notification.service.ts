import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Notification} from "../models/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http:HttpClient) { }

  getNotifications(userId:number,pageNb: number, pageSize: number) {
    let params = new HttpParams()
      .set('userId',userId)
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())


    return this.http.get<Notification[]>(`${environment.apiUrl}/api/Notification`, {params});
  }

  deleteAllNotification(userId:number){
    return this.http.delete(`${environment.apiUrl}/api/Notification/`+ userId)
  }

  deleteNotification(notificationId:number){
    return this.http.delete(`${environment.apiUrl}/api/Notification/delete/`+ notificationId)

  }
}
