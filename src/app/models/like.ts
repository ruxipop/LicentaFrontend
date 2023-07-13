import {User} from "./user";

export class Like{
  id: number;
  user:User;
  userId?:number

  constructor(id: number,userId:number) {
    this.id = id;
    this.userId=userId

  }
}
