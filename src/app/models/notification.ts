import {NotificationType} from "./notificationType";
import {User} from "./user";

export class Notification{
  public isFollowing?:boolean;
  public senderId: string;
  public receiverId: string;
  public imageId:string;
  public type:NotificationType;
  public timestamp:Date
  public id:number;
}
