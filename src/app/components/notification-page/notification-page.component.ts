import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FollowService} from "../../services/follow.service";
import {HttpErrorResponse} from "@angular/common/http";
import {calculateTime, isAuthenticated} from "../../utils";
import {BehaviorSubject, forkJoin, Observable, take} from "rxjs";
import {NotificationService} from "../../services/notification.service";
import {Notification} from "../../models/notification";
import {NotificationType} from "../../models/notificationType";
import {AlertService} from "../../services/alert.service";
import {ChatService} from "../../services/chat.service";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class NotificationPageComponent implements OnInit {
  currentPage = 1;
  pageSize = 10
  obsArray: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  notifications$: Observable<any> = this.obsArray.asObservable();
  userId: number;
  protected readonly calculateTime = calculateTime;
  protected readonly NotificationType = NotificationType;


  constructor(private followService: FollowService,private dialog: MatDialog,  private chatService: ChatService, private notificationService: NotificationService, private alertService: AlertService) {
  }


  deleteNotification(notifications: any[], notificationId: number) {
    this.notificationService.deleteNotification(notificationId).subscribe();


    const index = notifications.findIndex((obj) => obj.notification.id === notificationId)
    if (index !== -1) {
      notifications.splice(index, 1);
    }

  }

  deleteAllNotification() {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {label: 'Delete', message: "Are you sure you want to delete all notifications?", button: "Delete"}
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'Delete') {
        this.notificationService.deleteAllNotification(this.userId).subscribe();
        this.obsArray.next([])
      }
    });


  }

  ngOnInit() {
    this.userId = parseInt(localStorage.getItem("id")!)
    this.fetchNotifications();
  }

  onScroll() {
    this.currentPage += 1;
    forkJoin([this.notifications$.pipe(take(1)), this.notificationService.getNotifications(this.userId, this.currentPage, this.pageSize)])
      .subscribe((data: Array<Array<any>>) => {

        const newArr = [...data[0], ...data[1]];
        this.obsArray.next(newArr);
      });
  }

  fetchNotifications() {
    this.obsArray.next([]);
    this.notificationService.getNotifications(this.userId, this.currentPage, this.pageSize).subscribe(data => {
      console.log(data)
      this.obsArray.next(data);

    })
  }

  private removeFollow(followingId: number) {
    this.followService.removeFollow(followingId)
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          const notification = {id: 1, label: "Oops...", message: error.error, type: "error"};
          this.alertService.addNotification(notification)
        }
      })
  }


  private addFollow(followingId: number) {
    this.followService.addFollow(followingId)
      .subscribe({
        next: () => {

        },
        error: (error: HttpErrorResponse) => {
          const notification = {id: 1, label: "Oops...", message: error.error, type: "error"};
          this.alertService.addNotification(notification)
        }
      })
  }




  typeOfNotification(type: NotificationType) {
    switch (type) {
      case NotificationType.Follow:
        return ' followed you!'
      case NotificationType.Like:
        return ' liked your photo!'
      case NotificationType.Comment:
        return ' left a comment on your picture'

    }
  }

  onFollowChange(notifications: any[], followingId: number,event: MouseEvent) {
    event.stopPropagation()
    const currentNot = notifications.find((obj) => obj.notification.senderId === followingId)
    if (isAuthenticated() && currentNot) {
      if (currentNot.isFollowing) {
        this.removeFollow(followingId)
       notifications.forEach(obj=>{
         if(obj.notification.senderId===followingId)
           obj.isFollowing=false;

         }
       )


      } else {
        this.addFollow(followingId)
        notifications.forEach(obj=>{


          if(obj.notification.senderId===followingId)
            obj.isFollowing=true;

          }
        )
        currentNot.isFollowing = true
        this.chatService.sendNotification(followingId.toString(), NotificationType.Follow,null)


      }
    } else {
      const notification = {id: 1, label: "Oops...", message: "You need to login first!", type: "error"};
      this.alertService.addNotification(notification)
    }
  }


  goToPage(notification: Notification) {
    window.location.href= (notification.type===NotificationType.Follow)? 'user-profile/'+notification.senderId : 'image/'+notification.imageId
  }
}
