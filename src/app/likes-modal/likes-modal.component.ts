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
import {Modal} from "../models/modal";
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {HttpErrorResponse} from "@angular/common/http";
import {FollowService} from "../service/follow.service";
import {isUserAuthenticated} from "../utils";
import {Image} from "../models/image";
import {Router} from "@angular/router";

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

  constructor(private imageService: ImageService, private route:Router,private alertService: TuiAlertService, private followService: FollowService) {
  }

  ngOnChanges() {
    const userId = localStorage.getItem("id");
    if (userId) {
      this.currentUserId = parseInt(userId);
    }
    this.getLikes()
    console.log("this"+this.pageDetails[0])

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
        console.log("type"+this.title)
        console.log(this.currentPage)
        const newArr = [...data[0], ...data[1]];
        this.obsArray.next(newArr);
      });
  }

  getLikes() {
    this.obsArray.next([]);
    this.imageService.getImageLikes(this.pageDetails[0], this.currentPage, this.pageSize, this.currentUserId,this.title).subscribe(data => {
    console.log("typelike "+this.title)
      console.log(this.currentPage)

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

  onFollowChange(likedModalList:Modal[], followingId: number) {
    const likedModal = likedModalList.find(item => item.following.id===followingId);

    if (this.isUserAuthenticated() && likedModal) {
      if (likedModal.isFollowing) {
        this.removeFollow(followingId)

        likedModal.isFollowing=false
      } else {
        this.addFollow(followingId)
        likedModal.isFollowing=true
      }
      this.followingChangeEvent.emit();
      if(followingId===this.pageDetails[1]) {
        this.followEvent.emit(likedModal.isFollowing)
      }
    } else {
      console.log("Trebe sa te loghezi")
      //ToDo
      // this.router.navigate(['/auth/login'])
    }
  }

  onUserClick(id:number) {
    console.log("Cfeee")
    this.closeModal();
    this.route.navigate(['user/'+id])

  }
}
