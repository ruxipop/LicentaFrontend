import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {SecuritySettingsService} from "./security-settings.service";
import {Editor} from "../models/editor";

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  constructor(private http: HttpClient, private settings: SecuritySettingsService) {

  }

  getVotedImages(userId: number, pageNb: number, pageSize: number) {
    let params = new HttpParams()
      .set('userId', userId)
      .set('pageNb', pageNb.toString())
      .set('pageSize', pageSize.toString())

    return this.http.get<any>(`${environment.apiUrl}/api/Editor/`, {params});
  }

  addVote(editorChoice: Editor) {
    return this.http.post<any>(`${environment.apiUrl}/api/Editor/`, editorChoice);

  }

  deleteVote(editorId: number) {
    return this.http.delete<any>(`${environment.apiUrl}/api/Editor/` + editorId);

  }

  getEditor(userId:number,imageId:number){
    let params = new HttpParams()
      .set('userId', userId)
      .set('imageId', imageId)
    return this.http.get<any>(`${environment.apiUrl}/api/Editor/editorId/` , {params});

  }

  isImageVoted(imageId:number){
    return this.http.get<boolean>(`${environment.apiUrl}/api/Editor/voted/` + imageId);

  }

  getNbOfVotes(userId:number){

    return this.http.get<number>(`${environment.apiUrl}/api/Editor/nbOfVotes/` +userId);

  }
}
