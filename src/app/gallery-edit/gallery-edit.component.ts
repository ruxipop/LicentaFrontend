import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GalleryService} from "../service/gallery.service";
import {Observable} from "rxjs";
import {Gallery} from "../models/gallery";

@Component({
  selector: 'app-gallery-edit',
  templateUrl: './gallery-edit.component.html',
  styleUrls: ['./gallery-edit.component.scss']
})
export class GalleryEditComponent implements OnInit {
galleryId = 1;


  constructor(private route: ActivatedRoute, private galleryService: GalleryService, private router: Router) {
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.galleryId = Number(routeParams.get('id'));
    if (this.galleryId != undefined) {
      this.fetchGallery();
    }
  }

  galleryName = '';
  galleryDescription = ' ';
  isPrivate = false;

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

  updateGallery(){
    let userId=parseInt(localStorage.getItem("id")!);

    let gallery=new Gallery(this.galleryId,userId,this.galleryName,this.galleryDescription,this.isPrivate);
    this.galleryId!=0?
    this.galleryService.updateGallery(gallery).subscribe(() => {
      this.router.navigate(["/gallery/" + this.galleryId])
    }) :  this.galleryService.createGallery(gallery).subscribe((data) => {
        this.router.navigate(["/gallery/" + data.id])
    });
  }

  goToPreviousPage() {
    if (this.galleryId === 0) {
     let userId=parseInt(localStorage.getItem("id")!);

      this.router.navigate(["/user/"+userId])
    }
    this.router.navigate(["/gallery/" + this.galleryId])
  }
}
