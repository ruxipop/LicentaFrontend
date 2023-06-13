import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {FileRequest} from "../models/fileRequest";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  savePublicKey(fileReq: FileRequest) {
    return this.http.post(`${environment.apiUrl}/api/File/addPublicKey`, fileReq);
  }

  saveSecretKey(fileReq: FileRequest) {
    return this.http.post(`${environment.apiUrl}/api/File/addSecretKey`, fileReq);
  }


  readSecretKey(username: any) {
    return this.http.get(`${environment.apiUrl}/api/File/readSecretKey/${username}`, {responseType: 'text'})
  }


  readPublicKey(username: any) {
    return this.http.get(`${environment.apiUrl}/api/File/readPublicKey/${username}`, {responseType: 'text'})
  }

}
