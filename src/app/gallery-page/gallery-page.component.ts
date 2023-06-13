import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Gallery} from "../models/gallery";
import {GalleryService} from "../service/gallery.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-gallery-page',
  templateUrl: './gallery-page.component.html',
  styleUrls: ['./gallery-page.component.scss']
})
export class GalleryPageComponent implements OnInit{
galleryId:number=1;
  constructor(private galleryService: GalleryService,private route:ActivatedRoute,private router:Router) {
  }


  gallery$:Observable<Gallery>;



  goToEditPage(){
    this.router.navigate(["/gallery-edit/"+this.galleryId])
  }
  fetchGallery(){
    this.gallery$=this.galleryService.getGalleryById(this.galleryId).pipe()
}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.galleryId= Number(routeParams.get('id'));
    this.fetchGallery();
  }
}
