import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse, HttpClient
} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {environment} from "../../environments/environment";
import {AuthenticationService} from "../service/authentication.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

refresh=false;
  constructor(private auth: AuthenticationService, private http: HttpClient) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("accesTok    " + this.auth.getAccessToken())
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getAccessToken()}`
      }
    });
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !this.refresh) {
        this.refreshTokenSubject.next(null);

        console.log("ce masaaa")
        this.refresh=true;
        this.auth.getRefreshToken().pipe(
          switchMap(()=>{
            return next.handle( request.clone({
              setHeaders: {
                Authorization: `Bearer ${this.auth.getAccessToken()}`
              }
            }))
          })
        ).subscribe()

      }
     else{
        return this.refreshTokenSubject.pipe(
          filter(token => token != null),
          take(1),
          switchMap(jwt => {
            return next.handle(request.clone({
              setHeaders: {
                Authorization: `Bearer ${this.auth.getAccessToken()}`
              }
            }));
          }));
      }
      this.refresh=false;
      return throwError(() => err)
    }));
  }
}
