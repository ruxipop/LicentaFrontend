import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {NgxMasonryOptions} from "ngx-masonry";
import {Image} from "../models/image";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ImageService} from "../service/image.service";
import {BehaviorSubject, forkJoin, fromEvent, map, Observable, Subscription, take, tap} from "rxjs";
import {Router} from "@angular/router";
import {TransferDataService} from "../service/transfer-data.service";
import {isUserAuthenticated} from "../utils";
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {LikeService} from "../service/like.service";
import {Like} from "../models/like";


@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {
  @Input('tabTitle') tabTitle: string;
  @Input() subTitle: string;
  @Input() title: string;
  @Input() active = false
  @Input('routeLink') routerLink: string
  currentUserId: number;
  @Output() removeEvent = new EventEmitter<number>();
  @Input() images: Image[] = []


  constructor(private imageService: ImageService,
              private router: Router,
              private alertService: TuiAlertService,
              private likeService: LikeService) {
    const userId = localStorage.getItem("id");
    if (userId) {
      this.currentUserId = parseInt(userId);
    }

  }

  isUserAuthenticated() {
    return isUserAuthenticated();
  }


  onLikeChange(image: Image) {
    if (this.isUserAuthenticated()) {
      if (image.likes.some(item => item.userId === this.currentUserId)) {
        this.removeLike(image)
      } else {
        this.addLike(image)
      }
    } else {
      console.log("Trebe sa te loghezi")
      //ToDo
      // this.router.navigate(['/auth/login'])
    }
  }

  private removeLike(image: Image) {
    this.likeService.removeLike(image.id)
      .pipe(
        tap(()=> {

          const index = this.images.findIndex(item => item.id === image.id);

          if (index !== -1) {
            this.images.splice(index, 1);
          }
          }

        )
      )
      .subscribe({
        next: () => {
          const index = image.likes.findIndex(item => item.userId === this.currentUserId);

          if (index !== -1) {
            image.likes.splice(index, 1);
          }

          this.alertService.open('Liked Remove!', {
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


  addLike(image: Image) {
    this.likeService.addLikeToImage(image.id)
      .subscribe({
        next: () => {
          image.likes.push(new Like(image.id, this.currentUserId));


          this.alertService.open('Objective added to wishlist!', {
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

  isInLikesList(image: Image) {

    return image.likes.some(item => item.userId === this.currentUserId);
  }

  onImageClick(image: Image) {
    console.log(image.likes)
    this.router.navigate([`/image/${image.id}`]).then();
  }
}
