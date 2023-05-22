import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from "@angular/router";
import {TuiAlertService} from "@taiga-ui/core";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class NavbarComponent {

  isMenuOpen = false;
  optionCityDropdownVisible=true;

  constructor(
    private router:Router,
    private alertService: TuiAlertService,

  ) { }



  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeDialog() {
    this.isMenuOpen = false;
  }

  readonly items = [
    {
      text: 'Home',
      icon: 'tuiIconHomeLarge',
    },
    {
      text: 'Discover',
      icon: 'tuiIconImageLarge',
    },
    {
      text: 'Profile',
      icon: 'tuiIconUserLarge',
    },
  ];
  search = '';
  value: any;
  customSeparator: any;
  login() {
    this.router.navigate(['auth/login']).then();
  }


  toggleOptionLocationDropdown() {

  }

  isLoggin(){
    return false;
  }
}
