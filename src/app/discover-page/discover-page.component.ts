import {Component, OnDestroy, OnInit} from '@angular/core';
import {TabComponent} from "../tab/tab.component";
import {BehaviorSubject, forkJoin, Observable, Subscription, take} from "rxjs";
import {ImageService} from "../service/image.service";
import {Router} from "@angular/router";
import {TransferDataService} from "../service/transfer-data.service";
import {Image} from "../models/image";

@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  styleUrls: ['./discover-page.component.scss']
})
export class DiscoverPageComponent implements OnInit{
  currentPage = 1;
  pageSize = 20
  type: string = 'Popular'
  category: string | null = null
  allCategory: string[] = [];
  deselectCategory: string | null = null;
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  images$: Observable<any> = this.obsArray.asObservable();

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.getImages();
  }

  onScroll() {
    this.currentPage += 1;
    forkJoin([this.images$.pipe(take(1)), this.imageService.getImages(this.currentPage, this.pageSize, this.type, this.allCategory)])
      .subscribe((data: Array<Array<any>>) => {

        const newArr = [...data[0], ...data[1]];
        this.obsArray.next(newArr);
      });
  }

  getImages() {
    this.obsArray.next([]);
    this.imageService.getImages(this.currentPage, this.pageSize, this.type, this.allCategory).subscribe(data => {
      console.log(data)
      this.obsArray.next(data);
    });
  }

  handleType($event: string) {
    this.type = $event;
    this.currentPage = 1;
    this.obsArray.next([]);
    this.getImages();
  }

  handleCategory($event: string | null) {
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
