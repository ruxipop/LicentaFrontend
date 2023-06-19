import {ChangeDetectionStrategy, Component, ElementRef, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {TuiAlertService} from "@taiga-ui/core";
import {isAuthenticated, isUserAuthenticated} from "../utils";
import {ChatService} from "../service/chat.service";
import {NotificationType} from "../models/notificationType";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class NavbarComponent {
  isUploadModalOpen=false;

  isMenuOpen = false;
  handleCloseModal() {
    document.body.style.overflow = 'initial';

    this.isUploadModalOpen = false;

  }
  openModal() {
    document.body.style.overflow = 'hidden';

    this.isUploadModalOpen = true;

  }
  value: any;
  constructor(private elementRef:ElementRef,
    private chatService:ChatService,
    private router:Router,

  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownElement = this.elementRef.nativeElement;
    const dropdownMenu = dropdownElement.querySelector('.dropdown-menu');

    if (!dropdownElement.contains(target) && !dropdownMenu?.contains(target)) {
      this.isDropdownOpen = false;
      this.isUserMenuOpen=false;
    }
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }


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

  login() {
    this.router.navigate(['auth/login']).then();
  }


 isLoggedIn(){
    return isAuthenticated();
 }
  isDropdownOpen = false;

  toggleDropdown() {
    this.isUserMenuOpen=false;

    this.isDropdownOpen = !this.isDropdownOpen;
  }
  register() {
    this.router.navigate(['auth/register'])
  }

  logOut() {

    localStorage.clear();
    this.router.navigate(["auth/login"])
  }

  isUserMenuOpen=false;
  openUserMenu() {
    this.isDropdownOpen =false;
      this.isUserMenuOpen=!this.isUserMenuOpen;
  }

  goToUserProfile() {
    let  userId=localStorage.getItem("id");
    if(userId){
    this.router.navigate(['user/'+parseInt(userId)])}
  }

  goToPage(chat: string) {
    this.router.navigate(["/"+chat])
  }

  goToNotificationPage() {
    this.router.navigate(["notification/"+localStorage.getItem("id")])
  }
}
