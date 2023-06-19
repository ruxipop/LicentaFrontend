import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Countries, countries} from "../models/country-data-store"
import {FormControl} from "@angular/forms";
import {TuiStringHandler} from "@taiga-ui/cdk";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../service/user.service";
import {User} from "../models/user";
import {Observable} from "rxjs";
import {log} from "fabric/fabric-impl";
import {Gallery} from "../models/gallery";
import {UpdateUserDto} from "../models/updateUserDto";
import {Location} from "../models/location"

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  user: User;
  isBackgroundPhoto = true;

  public countries: Countries[] | null = countries
  name: string
  userId: number;
  username: string;
  description: string;
  openChoosePhoto = false;
  backgroundImage: string = '';
  profileImage: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private userService: UserService) {
  }


  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.userId = Number(routeParams.get('id'));

    this.fetchUser();


  }

  city: string = ''
  country: string = ''

  fetchUser() {
    this.userService.getUser(this.userId).subscribe(data => {
      this.name = data.name,

        this.username = data.username
      this.description = data.description
      if (data.location != null) {
        this.city = data.location.city;
        this.country = data.location.country
      }

      if (data.backgroundPhoto != null) {
        this.backgroundImage = data.backgroundPhoto;
      }
      if (data.profilePhoto != null) {
        this.profileImage = data.profilePhoto;
      }
    })
  }


  updateUser() {
    let user = new UpdateUserDto(this.userId, this.username, this.name, new Location(0, this.country, this.city), this.description, this.backgroundImage, this.profileImage);
    this.userService.updateUser(user).subscribe()
  }

  isButtonDisabled() {
    return this.username == '' || this.name == '' || this.country == '' || this.city == '' || this.description == ''
  }


  goToUserProfile() {
    this.router.navigate(["/user/" + this.userId])
  }

  handleSelectedPhoto($event: string) {
    if (this.isBackgroundPhoto) {
      this.backgroundImage = $event;
    } else {
      this.profileImage = $event;
    }
  }

  handleCloseModal() {
    // document.body.style.overflow = 'initial';
    this.openChoosePhoto = false;


  }

  openModalPhoto(type: string) {
    if (type === 'profile') {
      this.isBackgroundPhoto = false;
    } else {
      this.isBackgroundPhoto = true;
    }
    this.openChoosePhoto = true;
  }


}
