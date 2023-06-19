import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, take, tap} from "rxjs";
import {ImageService} from "../service/image.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../models/user";
import {UserService} from "../service/user.service";
import {FollowService} from "../service/follow.service";
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {HttpErrorResponse} from "@angular/common/http";
import {isUserAuthenticated} from "../utils";
import {ChatService} from "../service/chat.service";
import {SealService} from "../service/seal.service";
import {AlertService} from "../service/alert.service";
import {GalleryService} from "../service/gallery.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
  @Input() userID:number=1
  currentPage = 1;
  type=''
  openFollowersModal = false;
  openFollowingModal = false;
  pageSize = 5
  user$:Observable<User>
  nbImagesPosted$:Observable<number>
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  images$: Observable<any> = this.obsArray.asObservable();
  loggedUser:number;
FollowersNb:number;
FollowingNb:number;
  isUserFollowing:boolean=false;
  constructor(private route: ActivatedRoute,   private sealService:SealService,private router:Router,
              private galleryService:GalleryService,
              private userService:UserService,private followService:FollowService,private alertService:AlertService) {

  }

  ngOnInit(): void {

    // this.chatService.receiveNotification((message: string) => {
    //   console.log('Notificare primită:', message);
    //   // Realizați acțiuni suplimentare în funcție de notificare
    // });
     const loggedUser=localStorage.getItem("id");

    if(loggedUser){
      this.loggedUser=parseInt(loggedUser);
    }
    const routeParams = this.route.snapshot.paramMap;
    this.userID= Number(routeParams.get('id'));
    // this.getImages();
    this.fetchUser();
    this.fetchFollowNb();
    if(this.userID!=this.loggedUser){
      this.followService.isUserFollowing(this.userID).subscribe((data) => {
        this.isUserFollowing = data
        console.log(data)
      })
    }


  }

  fetchFollowNb(){

    this.followService.getAllFollowingNb(this.userID).subscribe(data=>{
      console.log(data)
      this.FollowingNb=data}
    );


    this.followService.getAllFollowersForUser(this.userID).subscribe(data=>{
      console.log(data)
      this.FollowersNb=data}
    );
  }
  handleCloseModal() {
    document.body.style.overflow = 'initial';

    this.openFollowingModal=false;
    this.openFollowersModal=false;

  }
  openFollowing() {

    const userId = localStorage.getItem('id'); // Verificați dacă obțineți corect ID-ul utilizatorului din localStorage

    console.log("ce"+userId)
    // @ts-ignore
    document.body.style.overflow = 'hidden';

    this.openFollowingModal=true;
  }

  openFollowers() {
    document.body.style.overflow = 'hidden';

    this.openFollowersModal=true;
  }
  fetchUser() {
    this.user$ = this.userService.getUser(this.userID).pipe()
    this.nbImagesPosted$=this.userService.getNbOfPostedImage(this.userID).pipe()
  }

  onScroll() {
    console.log("------------------------------------------------------")
    console.log("scroll")
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
    else if(this.type==='Galleries') {
      forkJoin([this.images$.pipe(take(1)), this.galleryService.getAllGalleries(this.userID,this.currentPage,this.pageSize,' ') ])
        .subscribe((data: Array<Array<any>>) => {
          const newArr = [...data[0], ...data[1]];
          this.obsArray.next(newArr);
        });
    }

  }

  getImages() {
    console.log("sal" +this.currentPage)
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
    }else if(this.type==='Galleries'){
      this.galleryService.getAllGalleries(this.userID,this.currentPage,this.pageSize,' ').subscribe(data=>{
        this.obsArray.next(data)
      })
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

  changeProfileFol() {
    setTimeout(() => {
      this.fetchFollowNb();
    }, 100)

  }

  private removeFollow() {
    this.followService.removeFollow(this.userID)
      .subscribe({
        next: () => {
          this.isUserFollowing = false;

        },
        error: (error: HttpErrorResponse) => {
          const notification = { id:1,label:"Oops...",message:error.error, type: "error" };
          this.alertService.addNotification(notification)
        }
      })
  }


  private addFollow() {
    this.followService.addFollow(this.userID)
      .subscribe({
        next: () => {
          this.isUserFollowing=true;

        },
        error: (error: HttpErrorResponse) => {
          const notification = { id:1,label:"Oops...",message:error.error, type: "error" };
          this.alertService.addNotification(notification)
        }
      })
  }
  isUserAuthenticated() {
    return isUserAuthenticated();
  }


  onFollowChange() {
    if (this.isUserAuthenticated()) {

      if (this.isUserFollowing) {
        this.removeFollow()
      } else {
        this.addFollow()
      }
      this.changeProfileFol()
    } else {
      console.log("Trebe sa te loghezi")
      //ToDo
      // this.router.navigate(['/auth/login'])
    }
  }

  goToEditPage() {
    this.router.navigate(["edit/"+this.userID])
  }
}
