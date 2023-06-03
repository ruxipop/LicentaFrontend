import {User} from "./user";

export class Comment{
  id: number;
 user:User;
 commentText:string;
 createdAt:Date;



  constructor(id: number,user:User,commentText:string,createdAt:Date) {
    this.id = id;
    this.user=user;
    this.commentText=commentText;
    this.createdAt=createdAt;
  }
}
