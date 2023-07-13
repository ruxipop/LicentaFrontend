export class EmailMessage{
  name:string;
  email:string;
  message:string;


  constructor(email: string, content: string, name: string) {
    this.email = email;
    this.message = content;
    this.name = name;
  }



}

