import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, take} from "rxjs";
import {ImageService} from "../../services/image.service";
import {Modal} from "../../models/modal";
import {HttpErrorResponse} from "@angular/common/http";
import {FollowService} from "../../services/follow.service";
import {getUserAuthenticatedId, isAuthenticated, isUserAuthenticated} from "../../utils";
import {Router} from "@angular/router";
import {AlertService} from "../../services/alert.service";
import {NotificationType} from "../../models/notificationType";
import {ChatService} from "../../services/chat.service";

@Component({
  selector: 'app-likes-modal',
  templateUrl: './likes-modal.component.html',
  styleUrls: ['./likes-modal.component.scss']
})
export class LikesModalComponent implements OnChanges {
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @Input() isModalOpen = false;
  @Input() title:string
  @Input() pageDetails: [number, number];
  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() followEvent = new EventEmitter<boolean>();
  @Output() followingChangeEvent=new EventEmitter<any>();
  @Output() followersChangeEvent=new EventEmitter<boolean>()
  obsArray: BehaviorSubject<Modal[]> = new BehaviorSubject<Modal[]>([]);
  likesModal$: Observable<any> = this.obsArray.asObservable();
  currentPage = 1;
  pageSize = 6;
  currentUserId: number;

  constructor(private imageService: ImageService, private chatService:ChatService,private route:Router,private alertService:AlertService, private followService: FollowService) {
  }

  ngOnChanges() {
    this.currentUserId = getUserAuthenticatedId();
    if (this.currentUserId) {
      this.getLikes()
    }

  }

  closeModal() {
    this.isModalOpen = false;
    this.closeEvent.emit(false);
    this.obsArray.next([]);
    this.currentPage = 1;
    this.getLikes()
  }



  onScroll() {
    this.currentPage += 1;
    forkJoin([this.likesModal$.pipe(take(1)), this.imageService.getImageLikes(this.pageDetails[0], this.currentPage, this.pageSize, this.currentUserId,this.title)])
      .subscribe((data: Array<Array<Modal>>) => {
        const newArr = [...data[0], ...data[1]];
        this.obsArray.next(newArr);
      });
  }

  getLikes() {
    console.log("ll"+this.currentUserId)
    this.obsArray.next([]);
    this.imageService.getImageLikes(this.pageDetails[0], this.currentPage, this.pageSize, this.currentUserId,this.title).subscribe(data => {
      this.obsArray.next(data);
    });
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


  onFollowChange(likedModalList:Modal[], followingId: number) {
    const likedModal = likedModalList.find(item => item.following.id===followingId);

    if (isAuthenticated() && likedModal) {
      if (likedModal.isFollowing) {
        this.removeFollow(followingId)
        likedModal.isFollowing=false
      } else {
        this.addFollow(followingId)
        likedModal.isFollowing=true
        this.chatService.sendNotification(followingId.toString(),NotificationType.Follow,null)
      }
      this.followingChangeEvent.emit();
      if(followingId===this.pageDetails[1]) {
        this.followEvent.emit(likedModal.isFollowing)
      }
    }
  }

  onUserClick(id:number) {
    this.closeModal();
    window.location.href='user-profile/'+id

  }
}
