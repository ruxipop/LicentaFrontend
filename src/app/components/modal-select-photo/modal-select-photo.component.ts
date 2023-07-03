import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {ImageService} from "../../services/image.service";
import {BehaviorSubject, forkJoin, Observable, of, take} from "rxjs";
import {FileUpload} from "../../models/file-upload.model";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-modal-select-photo',
  templateUrl: './modal-select-photo.component.html',
  styleUrls: ['./modal-select-photo.component.scss']
})
export class ModalSelectPhotoComponent implements OnInit,OnChanges {
  @Input() openModal = false;
  @Input() userId=0;
  pageSize = 15;
  openUploadNewPhoto = false;
  currentPage = 1;
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  images$: Observable<any> = this.obsArray.asObservable();
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;

  @Output() selectedPhoto = new EventEmitter<string>();
  @Output() closeEvent = new EventEmitter<boolean>();
  loading = false;

  constructor(private imageService: ImageService) {
  }

  ngOnChanges() {
  }

  ngOnInit() {
    console.log("sal")
    this.fetchImages();
  }

  fetchImages() {
    this.obsArray.next([]);
    this.imageService.getImagesByAuthorID(this.currentPage, this.pageSize, this.userId).subscribe(data => {
      console.log(this.userId)
      console.log("ii"+data.length)
      this.obsArray.next(data);
    });
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
    this.closeModal();
  }

  openFileInput() {
    const fileInput = this.fileInput.nativeElement;
    fileInput.click();
  }

  handleFileInput(event: any) {
    this.loading = true;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileUpload = new FileUpload(file);
        this.imageService.pushFileToStorage(fileUpload).pipe(
          switchMap((uploadedFile) => {
            return of(uploadedFile);
          })
        ).subscribe((res) => {
            this.loading = false;
            this.selectImage(res.url)
          }
        );
      };
      reader.readAsDataURL(file);
    }
  }

  closeModal() {
    this.openModal = false;
    this.closeEvent.emit(false)

  }
}
