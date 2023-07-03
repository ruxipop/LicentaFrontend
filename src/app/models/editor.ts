import {User} from "./user";
import {Picture} from "./picture";

export class Editor{
  id:number;
  editorId:number;
  editor?:User;
  imageId:number;
  images?:Picture;
  date:Date;

  constructor(id: number, editorId: number, imageId: number,date:Date) {
    this.id = id;
    this.editorId = editorId;
    this.imageId = imageId;
    this.date=date;
  }

}
