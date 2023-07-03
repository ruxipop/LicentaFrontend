import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {SecuritySettingsService} from "./security-settings.service";
import {environment} from "../../environments/environment";
import {StatisticsType} from "../models/statisticsType";
import {Picture} from "../models/picture";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http:HttpClient) { }

  getStatistics(startDate:Date,endDate:Date){
    let params = new HttpParams()
    params=params.set("startDate",startDate.toISOString()).set("endDate",endDate.toISOString());
    return this.http.get<number[]>(`${environment.apiUrl}/api/Statistics`,
      {
        params:params
      });
  }

  getStatistics2(startDate:Date,endDate:Date){
    let params = new HttpParams()
    params=params.set("startDate",startDate.toISOString()).set("endDate",endDate.toISOString());
    return this.http.get<number[]>(`${environment.apiUrl}/api/Statistics/images`,
      {
        params:params
      });
  }
  getAllUsersNb(){

    return this.http.get<number>(`${environment.apiUrl}/api/Statistics/allRegisteredUsersNb`);
  }
  getNewsUsersNb(){

    return this.http.get<number>(`${environment.apiUrl}/api/Statistics/newlyRegisteredUsersNb`);
  }

  getAllUser(pageNb: number, pageSize: number){
    let params = new HttpParams()
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())

    return this.http.get<any>(`${environment.apiUrl}/api/Statistics/allRegisteredUsers/`, {params});
  }
  getNewlyUser(pageNb: number, pageSize: number){
    let params = new HttpParams()
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())

    return this.http.get<any>(`${environment.apiUrl}/api/Statistics/newlyRegisteredUsers/`, {params});
  }


  // getAllImagesNb(){
  //
  //   return this.http.get<number>(`${environment.apiUrl}/api/Statistics/allRegisteredUsersNb`);
  // }
  // getNewsUsersNb(){
  //
  //   return this.http.get<number>(`${environment.apiUrl}/api/Statistics/newlyRegisteredUsersNb`);
  // }

  getAllImages(pageNb: number, pageSize: number){
    let params = new HttpParams()
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())

    return this.http.get<any>(`${environment.apiUrl}/api/Statistics/allUploadedImages/`, {params});
  }
  getNewlyUploadedImages(pageNb: number, pageSize: number){
    let params = new HttpParams()
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())

    return this.http.get<any>(`${environment.apiUrl}/api/Statistics/newlyUploadedImages/`, {params});
  }

  getStatisticsByType(){


    return this.http.get<StatisticsType[]>(`${environment.apiUrl}/api/Statistics/getStatisticsByType`);
  }
  getStatisticsByCategory(){


    return this.http.get<StatisticsType[]>(`${environment.apiUrl}/api/Statistics/getStatisticsByCategory`);
  }



  getMostAppreciatedImages(){


    return this.http.get<Picture[]>(`${environment.apiUrl}/api/Statistics/getFirstImages`);
  }

}
