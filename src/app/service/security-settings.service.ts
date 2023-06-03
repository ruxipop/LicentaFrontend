import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SecuritySettingsService {

  private httpHeaders:HttpHeaders;

  constructor() {
   // this.updateHeaders()
  }

  getHeaders(){
    console.log(localStorage.getItem('accessToken'))
    this.updateHeaders();
    return this.httpHeaders;
  }

  updateHeaders(){
    this.httpHeaders = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('accessToken'));

  }
}
