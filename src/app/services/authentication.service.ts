import { Injectable } from '@angular/core';
import {Observable, switchMap, tap} from "rxjs";
import {User} from "../models/user";
import {Tokens} from "../models/tokens";
import {HttpClient, HttpParams} from "@angular/common/http";
import {SecuritySettingsService} from "./security-settings.service";
import {Credentials} from "../models/credentials";
import {environment} from "../../environments/environment";
import {ForgotPassword, ResetPassword} from "../models/password";
import {AuthInterceptor} from "../interceptors/auth.interceptor";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  tokensStorage:Tokens=new Tokens();


  constructor(private http:HttpClient,
              private settings:SecuritySettingsService) {

  }

  login(credentials: Credentials) {
    return this.http.post(`${environment.apiUrl}/api/User/login`, credentials)
      .pipe(

        tap((tokens: any) => (this.tokensStorage.accessToken= tokens.accessToken)),
        tap((tokens: any) => (this.tokensStorage.refreshToken = tokens.refreshToken)),
        tap(() => this.saveTokens()),
        switchMap(() => this.loadLoggedUser())
      );
  }

  public getAccessToken(){
    return localStorage.getItem("accessToken")
  }

  getRefreshToken(){
    console.log("refresh-----------------------------------------------")
    const tokens = new Tokens();
    // @ts-ignore
    tokens.accessToken = localStorage.getItem('accessToken');
    // @ts-ignore

    tokens.refreshToken =localStorage.getItem('refreshToken');

    return this.http.post(`${environment.apiUrl}/api/User/refresh-token`, tokens)
      .pipe(

        tap((tokens: any) => (this.tokensStorage.accessToken= tokens.accessToken)),
        tap((tokens: any) => (this.tokensStorage.refreshToken = tokens.refreshToken)),
        tap(() => this.saveTokens())
      );
  }

  saveTokens() {
    console.log("tokens")
    localStorage.setItem('accessToken', this.tokensStorage.accessToken);
    localStorage.setItem('refreshToken', this.tokensStorage.refreshToken);
    console.log(this.tokensStorage)
  }

  loadLoggedUser() {
    return this.http.get<User>(`${environment.apiUrl}/api/User/me`);
  }

  getToken(){
    return localStorage.getItem('accessToken')
  }

  register(user: User) : Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/User/register`, user);
  }

  logout() {
    return this.http.get(`${environment.apiUrl}/user/logout`, { headers: this.settings.getHeaders() });
  }

  sendEmailResetPass(forgotPassword:ForgotPassword){
    return this.http.post(`${environment.apiUrl}/api/User/forgot-password`,forgotPassword)
  }


  resetPassword(resetPassword:ResetPassword){
    return this.http.post(`${environment.apiUrl}/api/User/reset-password`, resetPassword);
  }

  isTokenValid(token:string){
    let params = new HttpParams();
    if (location) {
      params = params.set('token', token);
    }
    return this.http.get(`${environment.apiUrl}/api/User/verify-token`, {params:params});
  }
}
