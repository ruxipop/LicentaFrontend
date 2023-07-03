import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private auth: AuthenticationService, private http: HttpClient) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getAccessToken()}`
      }
    });

    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        if (!this.refreshTokenSubject.value) {
          this.refreshTokenSubject.next(null);
          return this.handleUnauthorizedRequest(request, next);
        } else {
          return this.refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(jwt => {
              return next.handle(request.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.auth.getAccessToken()}`
                }
              }));
            })
          );
        }
      }
      return throwError(() => err);
    }));
  }

  private handleUnauthorizedRequest(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.auth.getRefreshToken().pipe(
      switchMap(() => {
        return next.handle(request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.auth.getAccessToken()}`
          }
        }));
      })
    );
  }
}
