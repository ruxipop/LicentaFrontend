import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss']
})
export class GalleryModalComponent {
  isModalOpen=true;
  value: any;

  createNewGallery=false;
  newGalleryName: any= ' ';


  openNewGalleyDialog(){
    console.log("ok")
    this.createNewGallery=true;
  }
  closeModal() {

  }

  searchMethod() {

  }



  postComment() {

  }

  cancelCreate() {
    this.createNewGallery=false;
  }
}
