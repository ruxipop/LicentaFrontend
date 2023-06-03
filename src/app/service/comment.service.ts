import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Comment} from "../models/comment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }

  addCommentForImage(imageID:number,userID:number,commentText:string){
    return this.http.post(`${environment.apiUrl}/api/Comment/addComment`,{
      UserId:userID,
      CommentText:commentText,
      ImageId:imageID,
      CreatedAt:new Date()
    })
  }

  getCommentsForImage(imageID:number){
    return this.http.get<Comment[]>(`${environment.apiUrl}/api/Comment/${imageID}`)
  }
}
