import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {fabric} from "fabric";
import {FormControl, Validators} from "@angular/forms";
import {Countries, countries} from "../models/country-data-store"
import {finalize, first, Observable} from "rxjs";
import {ImageService} from "../service/image.service";
import {Picture} from "../models/picture";
import {CategoryImage} from "../models/categoryImage";
import {Location} from "../models/location";

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadModalComponent implements OnInit, AfterViewInit {
  @ViewChild('dummyButton') dummyButton: ElementRef;

  ngAfterViewInit() {
    if(this.dummyButton){
    this.dummyButton.nativeElement.click();}
  }

  selectedDate: string = '';
  @Input() isModalOpen = false;
  @Output() closeEvent = new EventEmitter<boolean>();
  @ViewChild('imageContainer') imageContainer: ElementRef;

  @ViewChild('fileInput') fileInput: ElementRef;

  selectedImage: string | undefined = '';

  title: string = '';
  country: string = '';
  city: string = ''
  description: string = '';
  category: number | string = '';

  width: number;
  height: number;

  categories$: Observable<string[]>

  public countries: Countries[] | null = countries

  constructor(private imageService: ImageService) {

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
    return this.selectedDate == '' || this.title == '' || this.description == '' || this.category == '' || this.country == '' || this.city == ''

  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  ngOnInit() {
    console.log("bua")
    this.categories$ = this.imageService.getCategory();

  }

  openFileInput() {
    console.log("open file")
    const fileInput = this.fileInput.nativeElement;
    fileInput.click();
  }

  maxCharacters = 100;

  updateCharacterCount(input: any) {
    // this.textControl.setValue(input.substr(0, this.maxCharacters));
  }

  currentCharacterCount(input: any): number {
    return input ? input.length : 0;
  }


  uploadPhoto() {
    console.log(this.category)
    const image = new Image();
    image.src = this.selectedImage as string
    image.onload = () => {

      let picture = new Picture(image.width, this.category as CategoryImage, image.height, 0, this.description, this.title, new Date(), new Date(), new Location(1, this.country, this.city), this.selectedImage as string, 2,);
      this.imageService.createImage(picture).pipe(
        first(),
        finalize(()=>null)
      ).subscribe({
        next: () => {
          setTimeout(() => {
            this.closeModal();
          }, 2000);

        }

      });
      console.log('Dimensiunea imaginii:', image.width, 'x', image.height);
    };


  }

  deletePhoto() {
    this.selectedImage = undefined;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.value = '';
    this.resetValues()
  }

  selected = false

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log("Sal")
        this.selectedImage = e.target.result;
        this.dummyButton.nativeElement.click();
      };
      reader.readAsDataURL(file);
    }
  }
}
