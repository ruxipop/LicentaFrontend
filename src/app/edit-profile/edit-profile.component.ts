import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Countries, countries} from "../models/country-data-store"
import {FormControl} from "@angular/forms";
import {TuiStringHandler} from "@taiga-ui/cdk";
interface Country {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  numericCode: string;
  callingCode: string;
}
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  user = {
    username: "ruxi",
    name: "pop",
    city: "bb",
    country: "bucuresti",
    description: ""
  }
  public countries:Countries[] | null= countries

  constructor(private http: HttpClient) {
  }
  readonly control = new FormControl();




  ngOnInit(): void {

  }

  submitForm() {

  }


}
