export class ForgotPassword {
  email:string
  constructor(email:string) {
    this.email=email;
  }
}

export class ResetPassword{
  newPassword:string;
  token:string | null

  constructor(newPassword: string, token: string | null) {
    this.newPassword=newPassword;
    this.token=token;
  }
}
