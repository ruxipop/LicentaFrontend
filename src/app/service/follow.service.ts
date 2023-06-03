import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {SecuritySettingsService} from "./security-settings.service";
import {environment} from "../../environments/environment";
import {Follow} from "../models/follow";

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private http:HttpClient,
              private settings:SecuritySettingsService) { }


  getAllFollowersForUser(userID:number){
    return this.http.get(`${environment.apiUrl}/api/Follow/getFollower/${userID}`);
  }

  getAllFollowing(userID:number){
    return this.http.get<Follow[]>(`${environment.apiUrl}/api/Follow/getFollowing/${userID}`);
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

}
