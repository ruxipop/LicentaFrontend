import {Location} from "./location";

export class User {
  id: number;
  email: string;
  password: string;
  role: string;
  name: string;
  backgroundPhoto: string | null;
  profilePhoto: string | null
  location: Location;
  username: string;
  description: string;
  registerDate: Date;

  constructor(id: number, email: string, password: string, name: string, role: string, username: string,registerDate:Date) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
    this.username = username;
    this.registerDate=registerDate;

  }
}
