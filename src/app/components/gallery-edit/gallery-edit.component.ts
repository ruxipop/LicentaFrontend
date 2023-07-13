import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GalleryService} from "../../services/gallery.service";
import {Gallery} from "../../models/gallery";
import {currentCharacterCount} from "../../utils";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-gallery-edit',
  templateUrl: './gallery-edit.component.html',
  styleUrls: ['./gallery-edit.component.scss']
})
export class GalleryEditComponent implements OnInit {
  galleryId = 1;
  galleryName = '';
  galleryDescription = ' ';
  isPrivate = false;
  protected readonly currentCharacterCount = currentCharacterCount;

  constructor(private route: ActivatedRoute, private galleryService: GalleryService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.galleryId = Number(routeParams.get('id'));
    if (this.galleryId != undefined && this.galleryId != 0) {
      this.fetchGallery();
    }
  }

  fetchGallery() {
    this.galleryService.getGalleryById(this.galleryId).subscribe(data => {
      this.galleryDescription = data.description;
      this.galleryName = data.name;
      this.isPrivate = data.isPrivate;
    })
  }

  changeVisibility() {
    this.isPrivate = !this.isPrivate;
  }

  updateGallery() {
    let userId = parseInt(localStorage.getItem("id")!);

    let gallery = new Gallery(this.galleryId, userId, this.galleryName, this.galleryDescription, this.isPrivate);
    this.galleryId != 0 ?
      this.galleryService.updateGallery(gallery).subscribe(() => {
        this.router.navigate(["/gallery-page/" + this.galleryId])
      }) : this.galleryService.createGallery(gallery).subscribe((data) => {
        this.router.navigate(["/gallery-page/" + data.id])
      });
  }

  goToPreviousPage() {
    if (this.galleryId === 0) {
      let userId = parseInt(localStorage.getItem("id")!);

      this.router.navigate(["/user-profile/" + userId])
    }
    this.router.navigate(["/gallery-page/" + this.galleryId])
  }

  cancelUpdate() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {label: 'Leave', message: "Are you sure you want to leave the page?", button: "Leave"}
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'Leave') {
        this.goToPreviousPage()
      }
    });
  }
}
