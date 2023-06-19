import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Gallery} from "../models/gallery";
import {GalleryService} from "../service/gallery.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../service/alert.service";
import {Picture} from "../models/picture";

@Component({
  selector: 'app-gallery-page',
  templateUrl: './gallery-page.component.html',
  styleUrls: ['./gallery-page.component.scss']
})
export class GalleryPageComponent implements OnInit {
  galleryId: number = 1;

  constructor(private galleryService: GalleryService, private alertService: AlertService, private dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
  }


  gallery$: Observable<Gallery>;

  openDeleteDialog(galleryId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {message: 'Gallery'}
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        console.log("delete")
        this.deleteGallery(galleryId);
      }
    });
  }


  deleteGallery(galleryId: number) {

    this.galleryService.deleteGallery(galleryId).subscribe((response: any) => {
        setTimeout(() => {
          this.router.navigate(["user/" + localStorage.getItem("id")])
          const notification = {id: 1, label: "Oops...", message: response.message, type: "success"};

          this.alertService.addNotification(notification)
        }, 1000)
      }
    );
  }


  goToEditPage() {
    this.router.navigate(["/gallery-edit/" + this.galleryId])
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


  openRemovePhoto(gallery: Gallery, image: Picture) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {message: 'Image'}
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        this.removeImageFromGallery(gallery, image)
      }
    });
  }
}
