import {User} from "./user";
import {Picture} from "./picture";

export class Report{
  id:number;
  name:string;
  email:string;
  message:string;
  imageId:number;
  userId:number;
  user:User;
  image:Picture;

  constructor(name: string, email: string, message: string, imageId: number, userId: number) {
    this.name = name;
    this.email = email;
    this.message = message;
    this.imageId = imageId;
    this.userId = userId;
  }





}
