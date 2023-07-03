import {
  Injectable,
} from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private notificationSubject: Subject<{ id: string, label: string, message: string, type: string }>
    = new Subject<{
    id: string,
    label: string,
    message: string,
    type: string
  }>();

  public getNotifications(): Subject<any> {
    return this.notificationSubject;
  }

  public addNotification(notification: any): void {
    const id = Date.now().toString();
    notification.id = id;
    this.notificationSubject.next(notification);
  }

}
