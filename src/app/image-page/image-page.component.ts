import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable, Subject, tap} from "rxjs";
import {Image} from "../models/image";
import {ImageService} from "../service/image.service";
import {CommentService} from "../service/comment.service";
import {Comment} from "../models/comment";
import {CategoryImage} from "../models/categoryImage";
import {isAuthenticated, isUserAuthenticated} from "../utils";
import {LikeService} from "../service/like.service";
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../service/user.service";
import {FollowService} from "../service/follow.service";
import {Follow} from "../models/follow";
import {User} from "../models/user"
import {Like} from "../models/like";

@Component({
  selector: 'app-image-page',
  templateUrl: './image-page.component.html',
  styleUrls: ['./image-page.component.scss']
})
export class ImagePageComponent implements OnInit, AfterViewInit {
  @ViewChild('imagesContainer') imagesContainer!: ElementRef;
  id: number;
  image$: Observable<Image>
  value: string = ' ';
  isInputFocused: boolean = false;
  isFullscreen = false;
  imageType$: Observable<any>
  authorImages$: Image[];
  comments$: Observable<Comment[]>
  currentUserId: number;
  isLiked: boolean = false;
  isFollowing: boolean = false;

  openLikesModal = false;

  element: ElementRef
  @ViewChild('carouselContainer') carouselContainer: ElementRef;

  currentPosition = 0;

  @ViewChild('carouselWrapper') carouselWrapper: ElementRef;
  private bodyElement: HTMLElement;
  private isFollowingSubject: Subject<Follow[]> = new Subject<Follow[]>();
  public followingList$: Observable<Follow[]> = this.isFollowingSubject.asObservable();


  ngOnInit() {
    const userId = localStorage.getItem("id");
    if (userId) {
      this.currentUserId = parseInt(userId);
    }
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('id'));
    this.fetchImage();
    this.fetchComments();
    // this.fetchFollowing();

  }

  ngAfterViewInit() {
    this.element = this.elementRef.nativeElement;
  }


  // fetchFollowing() {
  //   this.followingList$ = this.followService.getAllFollowing(this.currentUserId).;
  // }


  // isFollowing(followingList: Follow[], following: User) {
  //   return followingList.find((item) => item.following.id == following.id);
  // }

  fetchImage() {
    this.image$ = this.imageService.getImage(this.id).pipe(
      tap(image => {
        this.isLiked = image.likes.some(item => item.user.id === this.currentUserId);
        // this.followService.getAllFollowing(this.currentUserId).subscribe(item => {
        //   const filteredItems = item.filter(x => x.following.id === image.autor.id);
        //   this.isFollowing = filteredItems.length === 1;
        //   this.isFollowingSubject.next(item); // Trimiti rezultatul filtrat prin subject
        // });
        this.followService.isUserFollowing(image.autor.id).subscribe((data) => {
          this.isFollowing = data
          console.log(data)
        })

        this.imageService.getImagesByAuthorID(image.autor.id).subscribe(authorImages => {
          this.authorImages$ = authorImages;
        });
      })
    );
    this.imageType$ = this.imageService.getImageType(this.id);
  }

  fetchComments() {
    this.comments$ = this.commentService.getCommentsForImage(this.id);
  }

  formateDate(date1: Date) {
    const date = new Date(date1)
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'long'});
    const year = date.getFullYear();
    const time = date.toLocaleString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true});

    const formattedDate = `${day} ${month} ${year}, ${time}`;

    return formattedDate;
  }


  getImageType(type: string) {
    switch (type) {
      case "Popular":
        return 'tuiIconStarLarge';
      case "Fresh":
        return 'tuiIconSunriseLarge';
      case "Basic":
        return 'tuiIconImageLarge';
      case "EditorChoice":
        return 'tuiIconAwardLarge';
      default:
        return '';
    }
  }

  scrollToPrevious() {
    const wrapper = this.carouselWrapper.nativeElement;
    wrapper.scrollLeft -= 400;
  }

  private readonly parentRoot: HTMLElement;

  scrollToNext() {
    const wrapper = this.carouselWrapper.nativeElement;
    wrapper.scrollLeft += 400;
  }

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              private route: ActivatedRoute,
              private imageService: ImageService,
              private followService: FollowService,
              @Inject(TuiAlertService) private alertService: TuiAlertService,
              private likeService: LikeService,
              private commentService: CommentService) {


  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(event: Event) {
    this.isFullscreen = !!document.fullscreenElement;
  }

  toggleFullscreen() {
    const imageContainer = this.elementRef.nativeElement.querySelector('.image-container') as HTMLElement;

    if (!document.fullscreenElement) {
      if (imageContainer.requestFullscreen) {
        imageContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  onInputFocus(): void {
    this.isInputFocused = true;

  }


  cancelComment() {
    this.value = '';
    this.isInputFocused = false;
  }


  postComment() {
    let userID = localStorage.getItem("id")
    if (userID) {
      this.commentService.addCommentForImage(this.id, parseInt(userID), this.value).subscribe({
        next: () => {
          this.value = ' ';
          this.isInputFocused = false;
          this.fetchComments();
          //ceva mesaj
        },

      })
    }
  }


  openModal() {
    document.body.style.overflow = 'hidden';

    this.openLikesModal = true;
    console.log(this.openLikesModal)
  }

  protected readonly CategoryImage = CategoryImage;

  handleCloseModal() {
    document.body.style.overflow = 'initial';

    this.openLikesModal = false;

  }

  protected readonly isAuthenticated = isAuthenticated;

  isUserAuthenticated() {
    return isUserAuthenticated();
  }


  onLikeChange(image:Image) {
    if (this.isUserAuthenticated()) {
      console.log(this.isLiked)
      if (this.isLiked) {
        const index = image.likes.findIndex(item => item.userId === this.currentUserId);

        if (index !== -1) {
          image.likes.splice(index, 1);
        }
        this.removeLike()

      } else {

        this.addLike()
        image.likes.push(new Like(image.id,this.currentUserId))
      }
    } else {
      console.log("Trebe sa te loghezi")
      //ToDo
      // this.router.navigate(['/auth/login'])
    }
  }


  private removeLike() {
    this.likeService.removeLike(this.id)
      .pipe(
        tap()
      )
      .subscribe({
        next: () => {
          this.isLiked = false;
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


  addLike() {
    this.likeService.addLikeToImage(this.id)
      .subscribe({
        next: () => {
          this.isLiked = true;

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

  private removeFollow(followingId: number) {
    this.followService.removeFollow(followingId)
      .subscribe({
        next: () => {
          this.isFollowing = false;
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
          this.isFollowing = true;
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

  protected readonly Follow = Follow;

  onFollowChange(following: User) {
    console.log("da" + this.isFollowing)
    if (this.isUserAuthenticated()) {

      if (this.isFollowing) {
        console.log("ce")
        this.removeFollow(following.id)
      } else {
        console.log("add")
        this.addFollow(following.id)
      }
    } else {
      console.log("Trebe sa te loghezi")
      //ToDo
      // this.router.navigate(['/auth/login'])
    }
  }

  screenWidth: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.screenWidth = window.innerWidth;
    console.log(this.screenWidth)
  }

  changeFollowStatus($event: boolean) {
    console.log("ceee")
    this.isFollowing=$event;
  }
}
