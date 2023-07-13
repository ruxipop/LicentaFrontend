import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, take} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {FollowService} from "../../services/follow.service";
import {HttpErrorResponse} from "@angular/common/http";
import {isAuthenticated} from "../../utils";
import {SealService} from "../../services/seal.service";
import {AlertService} from "../../services/alert.service";
import {GalleryService} from "../../services/gallery.service";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {NotificationType} from "../../models/notificationType";
import {ChatService} from "../../services/chat.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() userID: number = 1
  currentPage = 1;
  type = ''
  openFollowersModal = false;
  openFollowingModal = false;
  pageSize = 5
  user$: Observable<User>
  nbImagesPosted$: Observable<number>
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  images$: Observable<any> = this.obsArray.asObservable();
  loggedUser: number;
  FollowersNb: number;
  FollowingNb: number;
  isUserFollowing: boolean = false;
  protected readonly isAuthenticated = isAuthenticated;

  constructor(private route: ActivatedRoute,
              private sealService: SealService,
              private router: Router,
              private dialog: MatDialog,
              private chatService: ChatService,
              private galleryService: GalleryService,
              private userService: UserService,
              private followService: FollowService,
              private alertService: AlertService) {

  }

  ngOnInit(): void {
    const loggedUser = localStorage.getItem("id");
    if (loggedUser) {
      this.loggedUser = parseInt(loggedUser);
    }
    this.route.paramMap.subscribe(params => {
      this.userID = Number(params.get('id'))
      this.fetchUser();
      this.fetchFollowNb();
      if (this.userID != this.loggedUser && isAuthenticated()) {
        this.followService.isUserFollowing(this.userID).subscribe((data) => {
          this.isUserFollowing = data
        })
      }
    })
  }

  fetchFollowNb() {
    this.followService.getAllFollowingNb(this.userID).subscribe(data => {
        this.FollowingNb = data
      }
    );


    this.followService.getAllFollowersForUser(this.userID).subscribe(data => {
        this.FollowersNb = data
      }
    );
  }

  handleCloseModal() {
    document.body.style.overflow = 'initial';
    this.openFollowingModal = false;
    this.openFollowersModal = false;

  }

  openFollowing() {
    if (isAuthenticated()) {
      document.body.style.overflow = 'hidden';

      this.openFollowingModal = true;
    } else {
      this.openLoginMessage();
    }
  }

  openFollowers() {
    if (isAuthenticated()) {
      document.body.style.overflow = 'hidden';

      this.openFollowersModal = true;
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

  fetchUser() {
    this.user$ = this.userService.getUser(this.userID).pipe()
    this.nbImagesPosted$ = this.userService.getNbOfPostedImage(this.userID).pipe()
  }

  onScroll() {
    this.currentPage += 1;
    if (this.type === 'Photos') {
      forkJoin([this.images$.pipe(take(1)), this.userService.getImageByUserId(this.userID, this.currentPage, this.pageSize)])
        .subscribe((data: Array<Array<any>>) => {
          const newArr = [...data[0], ...data[1]];
          this.obsArray.next(newArr);
        });
    } else if (this.type === 'Liked') {
      forkJoin([this.images$.pipe(take(1)), this.userService.getImagesLikedByUserId(this.userID, this.currentPage, this.pageSize)])
        .subscribe((data: Array<Array<any>>) => {
          const newArr = [...data[0], ...data[1]];
          this.obsArray.next(newArr);
        });
    } else if (this.type === 'Galleries') {
      forkJoin([this.images$.pipe(take(1)), this.galleryService.getAllGalleries(this.userID, this.currentPage, this.pageSize, ' ')])
        .subscribe((data: Array<Array<any>>) => {

          const newArr = [...data[0], ...data[1]];
          this.obsArray.next(newArr);
        });
    }

  }

  getImages() {
    this.obsArray.next([]);

    if (this.type === 'Photos') {
      this.userService.getImageByUserId(this.userID, this.currentPage, this.pageSize)
        .subscribe(data => {
          this.obsArray.next(data);

        });
    } else if (this.type === 'Liked') {
      this.userService.getImagesLikedByUserId(this.userID, this.currentPage, this.pageSize)
        .subscribe(data => {
          this.obsArray.next(data);
        });
    } else if (this.type === 'Galleries') {
      this.galleryService.getAllGalleries(this.userID, this.currentPage, this.pageSize, ' ').subscribe(data => {
        this.obsArray.next(data)

      })
    }
  }

  removeElement($event: number) {

  }

  handleMessage($event: string) {
    this.type = $event;
    this.currentPage = 1;
    this.obsArray.next([]);
    this.getImages();
  }

  changeProfileFol() {
    setTimeout(() => {
      this.fetchFollowNb();
    }, 100)

  }

  onFollowChange() {
    if (isAuthenticated()) {

      if (this.isUserFollowing) {
        this.removeFollow()
      } else {
        this.addFollow()
      }
      this.changeProfileFol()
    } else {
      this.openLoginMessage();
    }
  }

  goToEditPage() {
    this.router.navigate(["edit-profile/" + this.userID])
  }

  copyLink() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        this.alertService.addNotification({
          id: 1,
          label: "info",
          message: "The link has been copied to the clipboard!",
          type: "success"
        });
      })
      .catch((error) => {
        this.alertService.addNotification({id: 1, label: "info", message: "Error copying the link:", type: "error"});
      });
  }

  private removeFollow() {
    this.followService.removeFollow(this.userID)
      .subscribe({
        next: () => {
          this.isUserFollowing = false;

        },
        error: (error: HttpErrorResponse) => {
          const notification = {id: 1, label: "Oops...", message: error.error, type: "error"};
          this.alertService.addNotification(notification)
        }
      })
  }

  private addFollow() {
    this.followService.addFollow(this.userID)
      .subscribe({
        next: () => {
          this.isUserFollowing = true;
          this.chatService.sendNotification(this.userID.toString(), NotificationType.Follow, null)
        },
        error: (error: HttpErrorResponse) => {
          const notification = {id: 1, label: "Oops...", message: error.error, type: "error"};
          this.alertService.addNotification(notification)
        }
      })
  }
}
