import {User} from "./user";
import {Picture} from "./picture";

export class Gallery{
  id:number;
  name:string;
  description:string;
  images:Picture[];
  user:User;
  isPrivate:boolean;
  userId?:number;

  constructor(id: number, userId:number,name: string, description: string, isPrivate: boolean) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isPrivate = isPrivate;
    this.userId=userId;
  }
}

