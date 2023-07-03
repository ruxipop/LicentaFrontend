import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {Countries, countries} from "../../models/country-data-store"
import {catchError, Observable, throwError} from "rxjs";
import {ImageService} from "../../services/image.service";
import {Picture} from "../../models/picture";
import {CategoryImage} from "../../models/categoryImage";
import {Location} from "../../models/location";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FileUpload} from "../../models/file-upload.model";
import {AlertService} from "../../services/alert.service";
import {currentCharacterCount, getUserAuthenticatedId} from "../../utils";
import {FollowService} from "../../services/follow.service";

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadModalComponent implements OnInit, AfterViewInit {
  @ViewChild('dummyButton') dummyButton: ElementRef;
  selected = false
  file: File
  selectedDate: string = '';
  @Input() isModalOpen = false;
  @Output() closeEvent = new EventEmitter<boolean>();
  @ViewChild('imageContainer') imageContainer: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  loading: boolean = false;
  selectedImage: string | undefined = '';
  title: string = '';
  country: string = '';
  city: string = ''
  description: string | null = '';
  category: number | string = '';
  width: number;
  height: number;
  categories$: Observable<string[]>
  public countries: Countries[] | null = countries

  constructor(private imageService: ImageService, private dialog: MatDialog, private alertService: AlertService) {
  }


  ngAfterViewInit() {
    if (this.dummyButton) {
      this.dummyButton.nativeElement.click();
    }
  }

  ngOnInit() {
    this.categories$ = this.imageService.getCategory();

  }

  openConfirmDialog() {
    if (this.selectedImage) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: {label: 'Confirm', message: "Are you sure you want to leave page?", button: "Leave"}
      });

      dialogRef.afterClosed().subscribe((result: string) => {
        if (result === 'Leave') {
          this.closeModal()
        }
      });
    } else this.closeModal();
  }

  closeModal() {
    this.isModalOpen = false;
    this.closeEvent.emit(false);
    this.deletePhoto();
  }

  resetValues() {
    this.selectedDate = ''
    this.title = ''
    this.description = ''
    this.category = ''
    this.country = ''
    this.city = ''
  }

  isButtonDisabled() {
    return this.selectedDate == '' || this.title == '' || this.category == '' || this.country == '' || this.city == ''

  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }


  openFileInput() {
    const fileInput = this.fileInput.nativeElement;
    fileInput.click();
  }



  uploadPhoto() {
    this.loading = true;
    const image = new Image();
    image.src = this.selectedImage as string;
    image.onload = () => {
      const fileUpload = new FileUpload(this.file);

      this.imageService.pushFileToStorage(fileUpload).pipe(
        switchMap(uploadResult => {
          console.log(this.selectedDate)
          const picture = new Picture(
            image.width,
            this.category as CategoryImage,
            image.height,
            0,
            this.description,
            this.title,
            new Date(),
            new Date(this.selectedDate),
            new Location(1, this.country, this.city),
            uploadResult.url,
            getUserAuthenticatedId(),
          );

          return this.imageService.createImage(picture).pipe(
            catchError(error => {
              this.imageService.deleteFile(uploadResult)
              return throwError(error);
            })
          );
        }),
      ).subscribe((result) => {
        setTimeout(() => {
          this.loading = false;
          this.dummyButton.nativeElement.click();

          this.closeModal();
          const notification = {
            id: 1,
            label: "Hooray!",
            message: result.message,
            type: "success"
          };

          this.alertService.addNotification(notification)
        }, 2000);
      }, error => {
        const notification = {
          id: 1,
          label: "Oops...",
          message: error.error.error,
          type: "error"
        };
        this.alertService.addNotification(notification)
        this.dummyButton.nativeElement.click();
        this.loading = false;
      });
    };
  }

  deletePhoto() {
    this.selectedImage = undefined;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.value = '';
    this.resetValues()
  }

  handleFileInput(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log("Sal")
        this.selectedImage = e.target.result;
        this.dummyButton.nativeElement.click();
      };
      reader.readAsDataURL(this.file);
    }
  }

  protected readonly currentCharacterCount = currentCharacterCount;
}
