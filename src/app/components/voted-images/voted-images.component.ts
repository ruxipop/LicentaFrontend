import {Component} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, take} from "rxjs";
import {EditorService} from "../../services/editor.service";

@Component({
  selector: 'app-voted-images',
  templateUrl: './voted-images.component.html',
  styleUrls: ['./voted-images.component.scss']
})
export class VotedImagesComponent {
  currentPage = 1;
  pageSize = 20
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  editors$: Observable<any> = this.obsArray.asObservable();
  nbVotes: number = 0;

  constructor(private editorService: EditorService) {
  }

  ngOnInit(): void {
    this.getEditors();
    this.getVotes()
  }

  getVotes() {
    this.editorService.getNbOfVotes(parseInt(localStorage.getItem("id")!)).subscribe(data => {
      this.nbVotes = data

    })

  }

  onScroll() {
    this.currentPage += 1;
    forkJoin([this.editors$.pipe(take(1)), this.editorService.getVotedImages(parseInt(localStorage.getItem("id")!), this.currentPage, this.pageSize)])
      .subscribe((data: Array<Array<any>>) => {


        const images1 = data.map((image: any) => {

          return {...image, voted: true};
        });
        const newArr = [...images1[0], ...images1[1]];
        this.obsArray.next(newArr);
      });
  }

  getEditors() {
    this.obsArray.next([]);
    this.editorService.getVotedImages(parseInt(localStorage.getItem("id")!), this.currentPage, this.pageSize).subscribe(data => {
      const images1 = data.map((image: any) => {
        return {...image, voted: true};
      });
      this.obsArray.next(images1);
    });
  }


  removeElement($event: number) {
    this.nbVotes = 0;
    this.getVotes()

  }
}
