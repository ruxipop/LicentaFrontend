import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, take} from "rxjs";
import {ImageService} from "../service/image.service";
import {Follow} from "../models/follow";
import {User} from "../models/user";
import {LikesModal} from "../models/likesModal";
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {HttpErrorResponse} from "@angular/common/http";
import {FollowService} from "../service/follow.service";
import {isUserAuthenticated} from "../utils";
import {Image} from "../models/image";

@Component({
  selector: 'app-likes-modal',
  templateUrl: './likes-modal.component.html',
  styleUrls: ['./likes-modal.component.scss']
})
export class LikesModalComponent implements OnChanges {
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @Input() isModalOpen = false;
  @Input() imageDetails: [number, number];
  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() followEvent = new EventEmitter<boolean>();
  obsArray: BehaviorSubject<LikesModal[]> = new BehaviorSubject<LikesModal[]>([]);
  likesModal$: Observable<any> = this.obsArray.asObservable();
  currentPage = 1;
  pageSize = 6;
  currentUserId: number;

  constructor(private imageService: ImageService, private alertService: TuiAlertService, private followService: FollowService) {
  }

  ngOnChanges() {
    const userId = localStorage.getItem("id");
    if (userId) {
      this.currentUserId = parseInt(userId);
    }
    this.getLikes()
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
    forkJoin([this.likesModal$.pipe(take(1)), this.imageService.getImageLikes(this.imageDetails[0], this.currentPage, this.pageSize, this.currentUserId)])
      .subscribe((data: Array<Array<LikesModal>>) => {
        const newArr = [...data[0], ...data[1]];
        this.obsArray.next(newArr);
      });
  }

  getLikes() {
    this.obsArray.next([]);
    this.imageService.getImageLikes(this.imageDetails[0], this.currentPage, this.pageSize, this.currentUserId).subscribe(data => {
      this.obsArray.next(data);
    });
  }

  private removeFollow(followingId: number) {
    this.followService.removeFollow(followingId)
      .subscribe({
        next: () => {

          this.alertService.open('Follow removed!', {
            label: 'Done!',
            status: TuiNotification.Success,
            autoClose: true,
          }).subscribe();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.open(error.error, {
            label: 'Oops...',
            status: TuiNotification.Error,
            autoClose: true,
          }).subscribe();
        }
      })
  }


  private addFollow(followingId: number) {
    this.followService.addFollow(followingId)
      .subscribe({
        next: () => {
          this.alertService.open('Follow removed!', {
            label: 'Done!',
            status: TuiNotification.Success,
            autoClose: true,
          }).subscribe();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.open(error.error, {
            label: 'Oops...',
            status: TuiNotification.Error,
            autoClose: true,
          }).subscribe();
        }
      })
  }

  isUserAuthenticated() {
    return isUserAuthenticated()
  }

  onFollowChange(likedModalList:LikesModal[], followingId: number) {
    const likedModal = likedModalList.find(item => item.likedImage.userId ===followingId);

    if (this.isUserAuthenticated() && likedModal) {
      if (likedModal.following) {
        this.removeFollow(followingId)
        likedModal.following=false
      } else {
        this.addFollow(followingId)
        likedModal.following=true
      }
      if(followingId===this.imageDetails[1]) {
        this.followEvent.emit(likedModal.following)
      }
    } else {
      console.log("Trebe sa te loghezi")
      //ToDo
      // this.router.navigate(['/auth/login'])
    }
  }
}
