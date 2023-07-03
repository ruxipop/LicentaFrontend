import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {User} from "../models/user";
import {UpdateUserDto} from "../models/updateUserDto";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,) {

  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/User/${id}`);
  }

  updateUser(user:UpdateUserDto){
    return this.http.put<any>(`${environment.apiUrl}/api/User/update`, user);

  }

  getImageByUserId(userId:number,pageNb: number, pageSize: number) {
    let params = new HttpParams()
      .set("id",userId)
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())

   return  this.http.get<any>(`${environment.apiUrl}/api/Image/getImagesUser/`, {params});
  }

  getImagesLikedByUserId(userId:number,pageNb: number, pageSize: number) {
    let params = new HttpParams()
      .set("id",userId)
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())

   return  this.http.get<any>(`${environment.apiUrl}/api/Image/getImagesLiked/`, {params});
  }



  getNbOfPostedImage(userId:number){
    return this.http.get<number>(`${environment.apiUrl}/api/User/getNbImages/${userId}`)
  }
}
