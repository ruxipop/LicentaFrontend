import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Countries, countries} from "../../models/country-data-store"
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {UpdateUserDto} from "../../models/updateUserDto";
import {Location} from "../../models/location"
import {currentCharacterCount, getUserAuthenticatedId} from "../../utils";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

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
  loading: boolean = false;
  city: string = ''
  country: string = ''
  protected readonly currentCharacterCount = currentCharacterCount;
  protected readonly getUserAuthenticatedId = getUserAuthenticatedId;

  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.userId = Number(routeParams.get('id'));

    this.fetchUser();


  }

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
    this.loading = true


    let location = (this.country === '' && this.city === '') ? null : new Location(0, this.country, this.city)

    let user = new UpdateUserDto(this.userId, this.username, this.name, location, this.description==''? null:this.description, this.backgroundImage==''?null: this.backgroundImage, this.profileImage==''?null:this.profileImage);
    this.userService.updateUser(user).subscribe(() =>
      setTimeout(() => {
        this.loading = false;
        this.goToUserProfile()
      }, 2000)
    )
  }

  isButtonDisabled() {
    return this.username == '' || this.name == ''
  }

  goToUserProfile() {
    window.location.href = 'user-profile/' + this.userId
  }

  cancelUpdate() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {label: 'Leave', message: "Are you sure you want to leave the page?", button: "Leave"}
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'Leave') {
        this.goToUserProfile()
      }
    });
  }

  handleSelectedPhoto($event: string) {
    if (this.isBackgroundPhoto) {
      console.log("ce")
      this.backgroundImage = $event;
    } else {
      this.profileImage = $event;
    }
  }

  handleCloseModal() {
    // document.body.style.overflow = 'initial';
    console.log("aici?")
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
