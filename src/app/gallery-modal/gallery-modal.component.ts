import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GalleryService} from "../service/gallery.service";
import {BehaviorSubject, forkJoin, Observable, take} from "rxjs";
import {Modal} from "../models/modal";
import {Gallery} from "../models/gallery";
import {Picture} from "../models/picture";
import {AlertService} from "../service/alert.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss']
})
export class GalleryModalComponent implements OnInit {
  @Input()
  isModalOpen = false;
  @Output() closeEvent = new EventEmitter<boolean>();
  @Input()
  currentImage: Picture
  currentPage = 1;
  pageSize = 5;
  searchValue: string = '';
  @ViewChild('scrollContainer') scrollContainer: ElementRef;


  createNewGallery = false;
  obsArray: BehaviorSubject<Gallery[]> = new BehaviorSubject<Gallery[]>([]);
  galleries$: Observable<Gallery[]> = this.obsArray.asObservable();
  form: FormGroup;

  userId: number;
  // isChecked: boolean=false;
  // newGalleryName: any = ' ';


  constructor(private galleryService: GalleryService, private alertService: AlertService) {
    this.form = new FormGroup({
      nameGallery: new FormControl('', Validators.required),
      isChecked: new FormControl(false, Validators.required)
    });


  }

  ngOnInit() {
    this.userId = parseInt(localStorage.getItem("id")!);
    this.fetchGalleries();
  }

  onScroll() {
    console.log("ca")
    this.currentPage += 1;
    forkJoin([this.galleries$.pipe(take(1)), this.galleryService.getAllGalleries(this.userId, this.currentPage, this.pageSize,this.searchValue)])
      .subscribe((data: Array<Array<Gallery>>) => {
        const newArr = [...data[0], ...data[1]];
        this.obsArray.next(newArr);
      });
  }

  fetchGalleries() {
    this.obsArray.next([]);
    this.galleryService.getAllGalleries(this.userId, this.currentPage, this.pageSize,this.searchValue).subscribe(data => {
      this.obsArray.next(data);
    });
  }

  openNewGalleyDialog() {
    this.createNewGallery = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.createNewGallery=false;
    this.form.reset();
    this.closeEvent.emit(false);
    this.obsArray.next([]);
    this.currentPage = 1;
    this.searchValue='';
    this.fetchGalleries()
  }

  checkImage(images: Picture[]) {
    return images.some(image => image.id == this.currentImage.id);
  }

  cancelCreate() {
    this.createNewGallery = false;
  }


  searchMethod() {
    this.obsArray.next([]);
    this.currentPage = 1;
    this.fetchGalleries();
  }


  createGallery() {
    if (this.form.invalid)
      return;
    let gallery = new Gallery(0, this.userId, this.form.get('nameGallery')!.value, '', this.form.get('isChecked')!.value)
    this.galleryService.createGallery(gallery).subscribe((response)=>{
      this.addPhotoToGallery(response)
   })

  }


  changeGallery(gallery: Gallery) {
    if (this.checkImage(gallery.images)) {
      this.removePhotoFromGallery(gallery)

    } else {
      this.addPhotoToGallery(gallery)
    }


  }

  addPhotoToGallery(gallery: Gallery) {
    this.galleryService.addPhotoToGallery(this.currentImage, gallery)
      .subscribe((response) => {
        setTimeout(() => {
          this.closeModal()
          this.alertService.addNotification({id: 1, label: "info", message: response.message, type: "success"});

        }, 1000)
      })

  }

  removePhotoFromGallery(gallery: Gallery) {
    this.galleryService.removePhotoFromGallery(this.currentImage, gallery).subscribe((response) => {
      setTimeout(() => {
        this.closeModal()
        this.alertService.addNotification({id: 1, label: "info", message: response.message, type: "success"});
      }, 1000)

    })

  }
}

