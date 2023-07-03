import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {SecuritySettingsService} from "./security-settings.service";
import {environment} from "../../environments/environment";
import {Follow} from "../models/follow";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private http:HttpClient,
              private settings:SecuritySettingsService) { }


  getAllFollowersForUser(userID:number){
    return this.http.get<number>(`${environment.apiUrl}/api/Follow/getFollowersNb/${userID}`);
  }

  getAllFollowingNb(userID:number){
    return this.http.get<number>(`${environment.apiUrl}/api/Follow/getFollowingNb/${userID}`);
  }

  getAllFollowingByPage(userId:number,pageNb:number,pageSize:number,searchTerm:string){
    let params = new HttpParams()
      .set("id",userId)
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())

      if(searchTerm!=' '){
        params=params.set("searchTerm",searchTerm)
      }
    return this.http.get<User[]>(`${environment.apiUrl}/api/Follow/getAllFollowing/`,{params});

  }

  addFollow(followingId:number){
    let params=new HttpParams();
    params=params.set("followingId",followingId);
    return this.http.post(`${environment.apiUrl}/api/Follow`, {},
      {
        headers: this.settings.getHeaders(),
        params:params
      });
  }

  removeFollow(followingId:number){
    let params = new HttpParams();

    params=params.set("followingId",followingId);

    return this.http.delete(`${environment.apiUrl}/api/Follow`,
      {
        headers: this.settings.getHeaders(),
        params: params
      });
  }

  isUserFollowing(followingId:number){
    let params = new HttpParams();

    params=params.set("followingId",followingId);

    return this.http.get<boolean>(`${environment.apiUrl}/api/Follow`,
      {
        headers: this.settings.getHeaders(),
        params: params
      });
  }

  sendNotificationToAll(senderId:number,imageId:number){
    return this.http.post(`${environment.apiUrl}/api/Follow/sendNotificationToAll`,{
      'ImageId':imageId.toString(),
      'UserId':senderId.toString()
    })
  }

}
