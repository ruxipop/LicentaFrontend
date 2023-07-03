import {Component, EventEmitter, Input, OnChanges, Output,} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {ImageService} from "../../services/image.service";
import {tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {getUserAuthenticatedId, isAdminAuthenticated, isAuthenticated} from "../../utils";
import {LikeService} from "../../services/like.service";
import {Like} from "../../models/like";
import {Picture} from "../../models/picture";
import {AlertService} from "../../services/alert.service";
import {Editor} from "../../models/editor";
import {EditorService} from "../../services/editor.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {UserService} from "../../services/user.service";
import {NotificationType} from "../../models/notificationType";
import {ChatService} from "../../services/chat.service";


@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnChanges {
  @Input('tabTitle') tabTitle: string = 'Photos';
  @Input() subTitle: string;
  @Input() title: string;
  @Input() active = false
  @Input('routeLink') routerLink: string
  @Input() selectedTab: string;
  @Output() removeEvent = new EventEmitter<number>();
  @Input() images: any[] = []
  isGalleryModalOpen = false;
  selectedImage: Picture;
  loggedUser: number;
  currentUser: number;
  currentUserName: string;
  protected readonly isAdminAuthenticated = isAdminAuthenticated;

  isUploadModalOpen = false;

  constructor(private imageService: ImageService,
              private dialog: MatDialog,
              private chatService:ChatService,
              private userService: UserService,
              private router: Router,
              private editorService: EditorService,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private likeService: LikeService) {

  }

  ngOnChanges() {
    const routeParams = this.route.snapshot.paramMap;
    this.currentUser = Number(routeParams.get('id'));
    this.loggedUser = getUserAuthenticatedId();
    if (this.currentUser) {
      this.getUserById();
    }
  }

  onLikeChange(image: Picture) {
    if (isAuthenticated()) {
      if (image.likes.some(item => item.userId === this.loggedUser)) {
        this.removeLike(image)
      } else {
        this.addLike(image)
        this.chatService.sendNotification(image.autorId.toString(), NotificationType.Like,image.id.toString());

      }
    } else {
      this.openLoginMessage();
    }
  }

  getUserById() {
    this.userService.getUser(this.currentUser).subscribe((user) =>
      this.currentUserName = user.name)
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

  private removeLike(image: Picture) {
    this.likeService.removeLike(image.id)
      .pipe(
        tap(() => {
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
          const index = image.likes.findIndex(item => item.userId === this.loggedUser);
          if (index !== -1) {
            image.likes.splice(index, 1);
          }
        },
        error: (error: HttpErrorResponse) => {
          const notification = {id: 1, label: "Oops...", message: error.error, type: "error"};
          this.alertService.addNotification(notification)
        }
      })
  }


  addLike(image: Picture) {
    this.likeService.addLikeToImage(image.id)
      .subscribe({
        next: () => {
          image.likes.push(new Like(image.id, this.loggedUser));
        },
        error: (error: HttpErrorResponse) => {
          const notification = {id: 1, label: "Oops...", message: error.error, type: "error"};
          this.alertService.addNotification(notification)
        }
      })
  }

  isInLikesList(image: Picture) {
    return image.likes.some(item => item.userId === this.loggedUser);
  }

  onImageClick(image: Picture) {
    this.router.navigate([`/image/${image.id}`]).then();
  }

  handleCloseModal() {
    document.body.style.overflow = 'initial';
    this.isGalleryModalOpen = false;
  }

  handleCloseUploadModal() {
    document.body.style.overflow = 'initial';
    this.isUploadModalOpen = false;
    window.location.reload()
  }

  openGalleryModal(image: Picture) {
    if (isAuthenticated()) {
      document.body.style.overflow = 'hidden';
      this.selectedImage = image;
      this.isGalleryModalOpen = true;
    } else {
      this.openLoginMessage();
    }
  }

  goToPage(type: string | null, galleryId: number | null) {
    type == 'create' ? this.router.navigate(["create-gallery"]) : this.router.navigate(["gallery-page/" + galleryId])
  }

  addVote(imageId: number) {
    let editor = new Editor(0, this.loggedUser, imageId, new Date());
    this.editorService.addVote(editor).subscribe
    ({
      next: () => {
        this.removeEvent.next(0)
      },
      error: (error: HttpErrorResponse) => {
        const notification = {id: 1, label: "Oops...", message: error.error, type: "error"};
        this.alertService.addNotification(notification)
      }
    })

  }

  deleteVote(id: number) {
    this.editorService.getEditor(this.loggedUser, id).subscribe((data) => this.editorService.deleteVote(data.id).subscribe(() => this.removeEvent.next(0)))
  }

  changeVote(image: any) {
    if (image.voted == true) {
      this.deleteVote(image.image.id)
      image.voted = false;
    } else {
      this.addVote(image.image.id)
      image.voted = true;
    }
  }

  goToAuthorPage(authorId: number) {
    window.location.href = 'user-profile/' + authorId
  }

  deleteImage(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {label: 'Delete', message: "Are you sure you want to delete this Image?", button: "Delete"}
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'Delete') {
        this.imageService.deleteImage(id).subscribe((response) => {
          const index = this.images.findIndex(item => item.image.id === id);
          if (index !== -1) {
            this.images.splice(index, 1);
          }
          const notification = {id: 1, label: "Hooray!", message: response.message, type: "success"};
          this.alertService.addNotification(notification)
        })
      }
    });
  }


  gotToDiscoverPage() {
    window.location.href = '/discover'
  }

  openUploadModal() {
    document.body.style.overflow = 'hidden';

    this.isUploadModalOpen = true;
  }
}
