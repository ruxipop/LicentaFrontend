import {Location} from "./location";
export class UpdateUserDto {
  id:number;
  username:string;
  name:string;
  location:Location;
  description:string;
  backgroundPhoto?:string;
  profilePhoto?:string

  constructor(id: number, username: string, name: string, location: Location, description: string, backgroundPhoto: string, profilePhoto: string) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.location = location;
    this.description = description;
    this.backgroundPhoto = backgroundPhoto;
    this.profilePhoto = profilePhoto;
  }




}
