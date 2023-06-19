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
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ImageService} from "../service/image.service";
import {BehaviorSubject, forkJoin, fromEvent, map, Observable, Subscription, take, tap} from "rxjs";
import {Router} from "@angular/router";
import {TransferDataService} from "../service/transfer-data.service";
import {isUserAuthenticated} from "../utils";
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {LikeService} from "../service/like.service";
import {Like} from "../models/like";
import {User} from "../models/user";
import {Picture} from "../models/picture";
import {AlertService} from "../service/alert.service";


@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnChanges{
  @Input('tabTitle') tabTitle: string='Photos';

  @Input() subTitle: string;
  @Input() title: string;
  @Input() active = false
  @Input('routeLink') routerLink: string
  currentUserId: number;
  @Output() removeEvent = new EventEmitter<number>();
  @Input() images: any[] = []
  isGalleryModalOpen=false;
  selectedImage:Picture;
  constructor(private imageService: ImageService,
              private router: Router,
              private alertService: AlertService,
              private likeService: LikeService) {
    const userId = localStorage.getItem("id");
    if (userId) {
      this.currentUserId = parseInt(userId);
    }

  }
@Input()
  selectedTab:string;

  isUserAuthenticated() {
    return isUserAuthenticated();
  }

ngOnChanges() {
    console.log("Sa sc" +this.selectedTab)
}

  onLikeChange(image: Picture) {
    console.log(this.tabTitle)
    if (this.isUserAuthenticated() ) {
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

  private removeLike(image: Picture) {
    this.likeService.removeLike(image.id)
      .pipe(
        tap(()=> {
            if (this.tabTitle === 'Liked') {
              const index = this.images.findIndex(item => item.id === image.id);

              if (index !== -1) {
                this.images.splice(index, 1);
              }
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


        },
        error: (error: HttpErrorResponse) => {
          const notification = { id:1,label:"Oops...",message:error.error, type: "error" };
          this.alertService.addNotification(notification)
        }
      })
  }


  addLike(image: Picture) {
    this.likeService.addLikeToImage(image.id)
      .subscribe({
        next: () => {
          // if (this.tabTitle === 'Liked') {

            image.likes.push(new Like(image.id, this.currentUserId));
          // }


        },
        error: (error: HttpErrorResponse) => {
          const notification = { id:1,label:"Oops...",message:error.error, type: "error" };
          this.alertService.addNotification(notification)
        }
      })
  }

  isInLikesList(image: Picture) {

    return image.likes.some(item => item.userId === this.currentUserId);
  }

  onImageClick(image: Picture) {
    console.log(image.likes)
    this.router.navigate([`/image/${image.id}`]).then();
  }

  handleCloseModal() {
    document.body.style.overflow = 'initial';
    this.isGalleryModalOpen= false;
  }

  openGalleryModal(image:Picture) {
    document.body.style.overflow = 'hidden';
    this.selectedImage=image;
    this.isGalleryModalOpen=true;
  }


  goToPage(type: string|null,galleryId:number|null) {

    type=='create'?this.router.navigate(["create-gallery"]):this.router.navigate(["gallery/"+galleryId])

  }
}
