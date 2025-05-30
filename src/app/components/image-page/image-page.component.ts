import {AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject, tap} from "rxjs";
import {ImageService} from "../../services/image.service";
import {CommentService} from "../../services/comment.service";
import {Comment} from "../../models/comment";
import {CategoryImage} from "../../models/categoryImage";
import {
  calculateTime,
  getUserAuthenticatedId,
  isAdminAuthenticated,
  isAuthenticated,
  isUserAuthenticated
} from "../../utils";
import {LikeService} from "../../services/like.service";
import {HttpErrorResponse} from "@angular/common/http";
import {FollowService} from "../../services/follow.service";
import {Follow} from "../../models/follow";
import {User} from "../../models/user"
import {Like} from "../../models/like";
import {Picture} from "../../models/picture";
import {AlertService} from "../../services/alert.service";
import {NotificationType} from "../../models/notificationType";
import {ChatService} from "../../services/chat.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ReportDialogComponent} from "../report-dialog/report-dialog.component";
import {ReportService} from "../../services/report.service";
import {EmailMessage} from "../../models/email-message";
import {SuccessMessage} from "../../models/success-message";
import { Report } from 'src/app/models/report';

@Component({
  selector: 'app-image-page',
  templateUrl: './image-page.component.html',
  styleUrls: ['./image-page.component.scss']
})
export class ImagePageComponent implements OnInit, AfterViewInit {
  @ViewChild('imagesContainer') imagesContainer!: ElementRef;
  id: number;
  image$: Observable<Picture>
  value: string = '';
  isInputFocused: boolean = false;
  isFullscreen = false;
  imageType$: Observable<any>
  authorImages$: Picture[];
  comments$: Observable<Comment[]>
  currentUser$: Observable<User>;
  isLiked: boolean = false;
  isFollowing: boolean = false;
  currentUserId = 0;
  openLikesModal = false;

  element: ElementRef
  @ViewChild('carouselContainer') carouselContainer: ElementRef;
  @ViewChild('carouselWrapper') carouselWrapper: ElementRef;
  public isGalleryModalOpen: boolean = false;
  screenWidth: number = window.innerWidth;
  protected readonly CategoryImage = CategoryImage;
  protected readonly isAuthenticated = isAuthenticated;
  protected readonly Follow = Follow;
  protected readonly calculateTime = calculateTime;
  private isFollowingSubject: Subject<Follow[]> = new Subject<Follow[]>();
  existReport:Observable<boolean>

  constructor(private elementRef: ElementRef,
              private authService: AuthenticationService,
              private router: Router,
              private dialog: MatDialog,
              private renderer: Renderer2,
              private route: ActivatedRoute,
              private imageService: ImageService,
              private followService: FollowService,
              private alertService: AlertService,
              private likeService: LikeService,
              private reportService:ReportService,
              private chatService: ChatService,
              private commentService: CommentService) {


  }
  fetchReport(){
    this.existReport=this.reportService.existReport(this.id).pipe()

  }

  ngOnInit() {


    this.currentUserId = getUserAuthenticatedId();
    if (this.currentUserId) {
      this.currentUser$ = this.authService.loadLoggedUser().pipe()
    }
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('id'));
    this.fetchImage();
    this.fetchReport();
    this.fetchComments();

  }

  ngAfterViewInit() {
    this.element = this.elementRef.nativeElement;
  }

  fetchImage() {
    this.image$ = this.imageService.getImage(this.id).pipe(
      tap(image => {
        this.isLiked = image.likes.some(item => item.user.id === this.currentUserId);
        if (isUserAuthenticated()) {
          this.followService.isUserFollowing(image.autor.id).subscribe((data) => {
            this.isFollowing = data
          })
        }
        this.imageService.getImagesByColor(image).subscribe(authorImages => {
          this.authorImages$ = authorImages;
        });


      })
    );
    this.imageType$ = this.imageService.getImageType(this.id);
  }

  fetchComments() {
    this.comments$ =
      this.commentService.getCommentsForImage(this.id);
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

  scrollToNext() {
    const wrapper = this.carouselWrapper.nativeElement;
    wrapper.scrollLeft += 400;
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

  postComment(image: Picture) {
    let userID = localStorage.getItem("id")
    if (userID) {
      this.commentService.addCommentForImage(image.id, parseInt(userID), this.value).subscribe({
        next: () => {
          this.value = ' ';
          this.isInputFocused = false;

          this.fetchComments();
          this.chatService.sendNotification(image.autorId.toString(), NotificationType.Comment, image.id.toString())
        },

      })
    }
  }

  openModal() {
    if (isAuthenticated()) {
      document.body.style.overflow = 'hidden';
      this.openLikesModal = true;
    } else {
      this.openLoginMessage();
    }


  }

  openLoginMessage() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        label: 'Log in to your account',
        message: "Empower your account by logging in and embrace the possibilities",
        button: "Log in"
      }
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'Log in') {
        window.location.href = '/auth/login'
      }
    })
  }

  handleCloseModal() {
    document.body.style.overflow = 'initial';
    this.isGalleryModalOpen = false;
    this.openLikesModal = false;

  }


  onLikeChange(image: Picture) {
    if (isUserAuthenticated()) {
      if (this.isLiked) {
        const index = image.likes.findIndex(item => item.userId === this.currentUserId);

        if (index !== -1) {
          image.likes.splice(index, 1);
        }
        this.removeLike()

      } else {

        this.addLike()
        this.sendNotification(NotificationType.Like, image.autorId.toString(), image.id.toString())

        image.likes.push(new Like(image.id, this.currentUserId))
      }
    } else {
      this.openLoginMessage()
    }
  }

  addLike() {
    this.likeService.addLikeToImage(this.id)
      .subscribe({
        next: () => {
          this.isLiked = true;
        },
        error: (error: HttpErrorResponse) => {
          const notification = {id: 1, label: "Oops...", message: error.error, type: "error"};
          this.alertService.addNotification(notification)
        }
      })
  }

  onFollowChange(following: User) {
    if (isUserAuthenticated()) {

      if (this.isFollowing) {
        this.removeFollow(following.id)
      } else {
        this.addFollow(following.id)
        this.sendNotification(NotificationType.Follow, following.id.toString(), null)

      }
    } else {
      this.openLoginMessage()
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.screenWidth = window.innerWidth;
  }

  changeFollowStatus($event: boolean) {
    this.isFollowing = $event;
  }

  sendNotification(type: NotificationType, receiverId: string, imageId: string | null) {
    this.chatService.sendNotification(receiverId, type, imageId);
  }

  openGalleryModal() {
    if (isAuthenticated()) {
      document.body.style.overflow = 'hidden';
      this.isGalleryModalOpen = true;
    } else {
      this.openLoginMessage();
    }
  }

  goToUserPage(autorId: number) {
    this.router.navigate(["user-profile/" + autorId])
  }

  goToImagePage(id: number) {

    this.router.navigateByUrl("/image/" + id).then(() => {

      setTimeout(() => {
        window.scrollTo(0, 0);
        window.location.reload();

      }, 10);
    });


  }

  private removeLike() {
    this.likeService.removeLike(this.id)
      .pipe(
        tap()
      )
      .subscribe({
        next: () => {
          this.isLiked = false;

        },
        error: (error: HttpErrorResponse) => {
          const notification = {id: 1, label: "Oops...", message: error.error, type: "error"};
          this.alertService.addNotification(notification)
        }
      })
  }

  private removeFollow(followingId: number) {
    this.followService.removeFollow(followingId)
      .subscribe({
        next: () => {
          this.isFollowing = false;
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
          this.isFollowing = true;
        },
        error: (error: HttpErrorResponse) => {
          const notification = {id: 1, label: "Oops...", message: error.error, type: "error"};
          this.alertService.addNotification(notification)
        }
      })
  }

  openDialogReport() {

      const dialogRef = this.dialog.open(ReportDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined){
          let report = new Report(" "," ",result,this.id,this.currentUserId)
          this.reportService.createReport(report).subscribe({
            next: (response:SuccessMessage) => {
              const notification = {
                id: 1,
                label: "Hooray...",
                message: response.message,
                type: "success"
              };
              this.alertService.addNotification(notification)
            },
            error: (error: any) => {
              const notification = {
                id: 1,
                label: "Hooray...",
                message: error.error,
                type: "error"
              };
              this.alertService.addNotification(notification)
            }
          })
        }
      });

  }

  protected readonly isAdminAuthenticated = isAdminAuthenticated;
  deleteImageViaReport(image: Picture) {
    this.reportService.deleteReportImage(this.id).subscribe({
      next: () => {
        this.imageService.deleteImage(image.id).subscribe({
          next: (response: SuccessMessage) => {
            const notification = {
              id: 1,
              label: "Hooray...",
              message: response.message,
              type: "success"
            };
            this.alertService.addNotification(notification);

          },
          error: (error: any) => {
            const notification = {
              id: 1,
              label: "Hooray...",
              message: error.error,
              type: "error"
            };
            this.alertService.addNotification(notification);
          }
        });
      },
      error: (error: any) => {
        const notification = {
          id: 1,
          label: "Hooray...",
          message: error.error,
          type: "error"
        };
        this.alertService.addNotification(notification);
      }
    });
  }


  protected readonly isUserAuthenticated = isUserAuthenticated;
  protected readonly localStorage = localStorage;
}


