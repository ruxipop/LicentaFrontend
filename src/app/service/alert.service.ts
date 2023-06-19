import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef
} from '@angular/core';
import {CustomDialogComponent} from '../custom-dialog/custom-dialog.component';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private notificationSubject: Subject<{ id: string, label:string,message: string, type: string }> = new Subject<{
    id: string,
    label:string,
    message: string,
    type: string
  }>();

  constructor() {
  }

  public getNotifications(): Subject<any> {
    return this.notificationSubject;
  }

  public addNotification(notification: any): void {
    const id = Date.now().toString();
    notification.id = id;
    this.notificationSubject.next(notification);

  }


}
