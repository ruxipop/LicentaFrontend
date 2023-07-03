import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, take} from "rxjs";
import {ImageService} from "../../services/image.service";
import {EditorService} from "../../services/editor.service";

@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  styleUrls: ['./discover-page.component.scss']
})
export class DiscoverPageComponent implements OnInit {
  currentPage = 1;
  pageSize = 20
  type: string = 'Popular'
  category: string | null = null
  allCategory: string[] = [];
  deselectCategory: string | null = null;
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  images$: Observable<any> = this.obsArray.asObservable();

  constructor(private imageService: ImageService) {
  }

  ngOnInit(): void {
    this.getImages();
  }

  onScroll() {
    this.currentPage += 1;
    forkJoin([this.images$.pipe(take(1)), this.imageService.getImages(this.currentPage, this.pageSize, this.type, this.allCategory)])
      .subscribe((images1: Array<Array<any>>) => {
        const newArr = [...images1[0], ...images1[1]];
        this.obsArray.next(newArr);
      });
  }

  getImages() {
    this.obsArray.next([]);
    this.imageService.getImages(this.currentPage, this.pageSize, this.type, this.allCategory).subscribe(images => {
      this.obsArray.next(images);
    });
  }

  handleType($event: string) {
    this.type = $event;
    this.currentPage = 1;
    this.obsArray.next([]);
    this.getImages();
  }

  handleCategory($event: string | null) {
    this.allCategory = []
    if ($event != null) {
      this.allCategory.push($event)
    }
    this.currentPage = 1;
    this.obsArray.next([]);
    this.getImages();
  }

  handleDeselectCategory($event: string | null) {
    this.currentPage = 1;
    if ($event) {
      const index = this.allCategory.findIndex(item => item === $event);
      if (index !== -1) {
        this.allCategory.splice(index, 1);
      }
    }
    this.obsArray.next([]);
    this.deselectCategory = $event;
    this.getImages()
  }

}
