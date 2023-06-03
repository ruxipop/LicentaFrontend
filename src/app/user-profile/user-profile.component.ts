import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, take, tap} from "rxjs";
import {ImageService} from "../service/image.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../models/user";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
  @Input() userID:number=1
  currentPage = 1;
  type=''
  pageSize = 5
  user$:Observable<User>
  nbImagesPosted$:Observable<number>
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  images$: Observable<any> = this.obsArray.asObservable();

  scrollPosition: number = 0;

  constructor(private route: ActivatedRoute,private userService:UserService) {

  }

  ngOnInit(): void {

    const routeParams = this.route.snapshot.paramMap;
    this.userID= Number(routeParams.get('id'));
    // this.getImages();
    this.fetchUser();

  }


  fetchUser() {
    this.user$ = this.userService.getUser(this.userID).pipe()
    this.nbImagesPosted$=this.userService.getNbOfPostedImage(this.userID).pipe()
  }

  onScroll() {
    this.currentPage += 1;
    if (this.type === 'Photos') {
    forkJoin([this.images$.pipe(take(1)),this.userService.getImageByUserId(this.userID,this.currentPage, this.pageSize) ])
      .subscribe((data: Array<Array<any>>) => {
        const newArr = [...data[0], ...data[1]];
        this.obsArray.next(newArr);
      });}
    else if(this.type==='Liked') {
      forkJoin([this.images$.pipe(take(1)),this.userService.getImagesLikedByUserId(this.userID,this.currentPage, this.pageSize) ])
        .subscribe((data: Array<Array<any>>) => {
          const newArr = [...data[0], ...data[1]];
          this.obsArray.next(newArr);
        });
    }

  }

  getImages() {
    this.obsArray.next([]);

    if (this.type === 'Photos') {
      this.userService.getImageByUserId(this.userID, this.currentPage, this.pageSize)
        .subscribe(data => {
          this.obsArray.next(data);
        });
    } else if(this.type==='Liked'){
      this.userService.getImagesLikedByUserId(this.userID, this.currentPage, this.pageSize)
        .subscribe(data => {
          this.obsArray.next(data);
        });
    }
  }


  removeElement($event:number){

  }
  handleMessage($event: string) {
    this.type = $event;
    this.currentPage = 1;
    this.obsArray.next([]);
    this.getImages();
  }
}
