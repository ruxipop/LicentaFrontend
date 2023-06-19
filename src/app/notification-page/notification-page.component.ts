import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FollowService} from "../service/follow.service";
import {tuiHintOptionsProvider, TuiNotification} from "@taiga-ui/core";
import {HttpErrorResponse} from "@angular/common/http";
import {Modal} from "../models/modal";
import {isUserAuthenticated} from "../utils";
import {BehaviorSubject, forkJoin, Observable, take} from "rxjs";
import {NotificationService} from "../service/notification.service";
import {Notification} from "../models/notification";
import {NotificationType} from "../models/notificationType";
import {AlertService} from "../service/alert.service";
import {ChatService} from "../service/chat.service";

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


  constructor(private followService: FollowService,private chatService:ChatService, private notificationService: NotificationService,private alertService:AlertService) {
  }


  deleteNotification(notifications:any[],notificationId: number) {
    this.notificationService.deleteNotification(notificationId).subscribe();


    const index = notifications.findIndex((obj) => obj.notification.id === notificationId)
    if (index !== -1) {
      notifications.splice(index, 1);
    }

  }

  deleteAllNotification() {
    this.notificationService.deleteAllNotification(this.userId).subscribe();
    this.obsArray.next([])
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
          const notification = { id:1,label:"Oops...",message: error.error, type: "error" };
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
          const notification = { id:1,label:"Oops...",message: error.error, type: "error" };
          this.alertService.addNotification(notification)
        }
      })
  }

   calculateTime(correctDate: Date): string {
    const date = new Date(correctDate);
    const now = new Date();
    const diffInMilliseconds = Math.abs(now.getTime() - date.getTime());

    const minutes = Math.floor(diffInMilliseconds / (1000 * 60));

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      } else {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      }
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return "right now";
    }
  }


  typeOfNotification(type: NotificationType) {
    switch (type) {
      case NotificationType.Follow:
        return ' followed you!'
      case NotificationType.Like:
        return ' liked your photo!'
      case NotificationType.Message:
        return ' sent you a message!'
    }
  }

  onFollowChange(notifications: any[], followingId: number) {
    console.log(notifications)
    const currentNot = notifications.find((obj) => obj.notification.senderId === followingId)
    console.log(currentNot)
    //
    if (isUserAuthenticated() && currentNot) {
      if (currentNot.isFollowing) {
        console.log("remove")
        this.removeFollow(followingId)

        currentNot.isFollowing = false
      } else {
        this.addFollow(followingId)
        currentNot.isFollowing = true
        this.chatService.sendNotification(followingId.toString(),"follow",NotificationType.Follow)

      }
      //
    } else {
      const notification = { id:1,label:"Oops...",message:"You need to login first!", type: "error" };
      this.alertService.addNotification(notification)
    }
  }
}
