import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {Gallery} from "../../models/gallery";
import {GalleryService} from "../../services/gallery.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../../services/alert.service";
import {Picture} from "../../models/picture";
import {HttpErrorResponse} from "@angular/common/http";
import {Like} from "../../models/like";
import {LikeService} from "../../services/like.service";
import {isUserAuthenticated} from "../../utils";

@Component({
  selector: 'app-gallery-page',
  templateUrl: './gallery-page.component.html',
  styleUrls: ['./gallery-page.component.scss']
})
export class GalleryPageComponent implements OnInit {
  galleryId: number = 1;


  constructor(private galleryService: GalleryService,private likeService:LikeService,private alertService: AlertService, private dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
  }


  gallery$: Observable<Gallery>;

  openDeleteDialog(galleryId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {label: 'Delete',message:"Are you sure you want to delete this Gallery!",button:"Delete"}
    });

    dialogRef.afterClosed().subscribe((result: string) => {

      if (result === 'Delete') {
        this.deleteGallery(galleryId);
      }
    });
  }
  isInLikesList(image: Picture) {

    return image.likes.some(item => item.userId === parseInt(localStorage.getItem("id")!));
  }

  deleteGallery(galleryId: number) {

    this.galleryService.deleteGallery(galleryId).subscribe((response: any) => {
        setTimeout(() => {
          this.router.navigate(["user-profile/" + localStorage.getItem("id")]).then()
          const notification = {id: 1, label: "Oops...", message: response.message, type: "success"};

          this.alertService.addNotification(notification)
        }, 1000)
      }
    );
  }


  goToEditPage() {
    this.router.navigate(["/edit-gallery/" + this.galleryId])
  }

  fetchGallery() {
    this.gallery$ = this.galleryService.getGalleryById(this.galleryId).pipe()
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.galleryId = Number(routeParams.get('id'));
    this.fetchGallery();
  }

  removeImageFromGallery(gallery: Gallery, image: Picture) {

    this.galleryService.removePhotoFromGallery(image, gallery).subscribe((response) => {
      setTimeout(() => {
        this.fetchGallery();
        this.alertService.addNotification({id: 1, label: "info", message: response.message, type: "success"});

      }, 1000)

    })


  }

  onLikeChange(image: Picture) {
    if (isUserAuthenticated() ) {
      if (image.likes.some(item => item.userId === parseInt(localStorage.getItem("id")!))) {
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



          }
        )
      )
      .subscribe({
        next: () => {
          const index = image.likes.findIndex(item => item.userId ===parseInt(localStorage.getItem("id")!));

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

          image.likes.push(new Like(image.id, parseInt(localStorage.getItem("id")!)));
          // }


        },
        error: (error: HttpErrorResponse) => {
          const notification = { id:1,label:"Oops...",message:error.error, type: "error" };
          this.alertService.addNotification(notification)
        }
      })
  }
  openRemovePhoto(gallery: Gallery, image: Picture) {
    console.log("aici")
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {label: 'Delete',message:"Are you sure you want to delete this Image?",button:"Delete"}
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'Delete') {
        this.removeImageFromGallery(gallery, image)
      }
    });
  }


  goToImagePage(imageId: number) {
    window.location.href='image/'+imageId
  }
}
