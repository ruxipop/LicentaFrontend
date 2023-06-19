import {User} from "./user";
import {Location} from "./location";
import {Comment} from "./comment";
import {Like} from "./like";
import {CategoryImage} from "./categoryImage";

export class Picture{
  id: number;
  autor:User;
  description:string;
  title:string;
  uploaded:Date;
  taked:Date;
  location:Location;
  imageUrl:string;
  isHovered:boolean
  comments:Comment[]
  likes:Like[]
  width:number;
  height:number;
  autorId:number
  category:CategoryImage;
  constructor(
    width: number,
    category: CategoryImage,
    height: number,
    id: number,
    description: string,
    title: string,
    uploaded: Date,
    taked: Date,
    location: Location,
    imageUrl: string,
    autorId:number,


  ) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.description = description;
    this.title = title;
    this.uploaded = uploaded;
    this.taked = taked;
    this.location = location;
    this.imageUrl = imageUrl;
    this.isHovered = false;
    this.category = category;
    this.autorId=autorId
  }



}
