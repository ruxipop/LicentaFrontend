import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ImageService} from "../service/image.service";
import {BehaviorSubject, forkJoin, Observable, take} from "rxjs";
import {Picture} from "../models/picture";

@Component({
  selector: 'app-modal-select-photo',
  templateUrl: './modal-select-photo.component.html',
  styleUrls: ['./modal-select-photo.component.scss']
})
export class ModalSelectPhotoComponent implements OnInit {
  @Input() openModal = false;
  @Input() userId = 2;
  pageSize = 15;
  openUploadNewPhoto = false;
  currentPage = 1;
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  images$: Observable<any> = this.obsArray.asObservable();
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;

  @Output() selectedPhoto = new EventEmitter<string>();
  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(private imageService: ImageService) {
  }

  ngOnInit() {
    this.fetchImages();
  }

  fetchImages() {
    this.obsArray.next([]);
    this.imageService.getImagesByAuthorID(this.currentPage, this.pageSize, this.userId).subscribe(data => {
      console.log(data)
      this.obsArray.next(data);
    });
  }

  openUploadPhotoModal() {
    this.openUploadNewPhoto = true;
  }

  handleCloseModal() {

    this.openUploadNewPhoto = false;
    this.openModal = false;

  }

  onScroll() {
    this.currentPage += 1;
    forkJoin([this.images$.pipe(take(1)), this.imageService.getImagesByAuthorID(this.currentPage, this.pageSize, this.userId)])
      .subscribe((data: Array<Array<any>>) => {

        const newArr = [...data[0], ...data[1]];
        this.obsArray.next(newArr);
      });
  }


  selectImage(url: string) {
    this.selectedPhoto.emit(url)
    this.openModal = false;
    this.closeEvent.emit(false)

  }

  openFileInput() {
    const fileInput = this.fileInput.nativeElement;
    fileInput.click();
  }
  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectImage( e.target.result)


      };
      reader.readAsDataURL(file);
    }
  }
}
