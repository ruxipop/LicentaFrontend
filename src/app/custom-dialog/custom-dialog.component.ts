import {Component, Inject, Input, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {AlertService} from "../service/alert.service";

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss']
})
export class CustomDialogComponent implements OnInit {
  notifications: { id: string, label:string,message: string, type: string }[] = [];
 notificationToRemoveId: any;

  constructor(private notificationService: AlertService) {
  }

  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe(notification => {
      this.notifications.push(notification);
    });
  }

  removeNotification(id: string) {
    this.notificationToRemoveId = id;
    setTimeout(() => {
      this.notifications = this.notifications.filter(n=>n.id !== id);
      this.notificationToRemoveId = null;
    }, 300); // 300ms este durata animației
  }

  getIconSrc(type: string) {
    console.log(type)
    switch (type) {
      case 'success':
        return 'tuiIconCheckCircle';
      case 'info':
        return 'tuiIconAlertCircle';
      case 'error':
        return 'tuiIconXCircle';
      default:
        return '';
    }
  }
}
