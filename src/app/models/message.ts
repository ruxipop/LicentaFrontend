import {MessageStatus} from "./messageStatus";

export class MessageRequest {
  public senderId: string;
  public receiverId: string;
  public text: string;

  constructor(senderId: string, receiverId: string, text: string) {
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.text = text;
  }
}

export class MessageResponse{
  public senderId:number;
  public receiverId:number;
  public message:string;
  public timestamp:Date;
  public status:MessageStatus
  public sent:boolean;

  constructor(senderId: number, receiverId: number, message: string, timestamp: Date) {
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.message = message;
    this.timestamp = timestamp;
  }

}
