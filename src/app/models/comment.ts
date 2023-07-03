import {User} from "./user";

export class Comment{
  id: number;
 user?:User;
 commentText:string;
 createdAt:Date;
 userId:number;
 imageId:number;



  constructor(id: number,userId:number,imageId:number,commentText:string,createdAt:Date) {
    this.id = id;
    this.userId=userId;
    this.commentText=commentText;
    this.createdAt=createdAt;
    this.imageId=imageId;
  }
}
