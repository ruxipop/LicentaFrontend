import {ChangeDetectionStrategy, Component, ElementRef, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {getUserAuthenticatedId, isAdminAuthenticated, isAuthenticated} from "../../utils";
import {ChatService} from "../../services/chat.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class NavbarComponent {
  isUploadModalOpen = false;
  isUserMenuOpen = false;
  isMenuOpen = false;
  loggedId: number;
  protected readonly isAdminAuthenticated = isAdminAuthenticated;

  readonly items = [
    {
      text: 'Home',
      icon: 'tuiIconHomeLarge',
      url: '/home'
    },
    {
      text: 'Discover',
      icon: 'tuiIconImageLarge',
      url: '/discover'
    },
    {
      text: 'Upload',
      icon: 'tuiIconPlusCircleLarge',
      url: ''
    },
    {
      text: 'Chat',
      icon: 'tuiIconSendLarge',
      url: 'chat-page'
    },
    {
      text: 'Profile',
      icon: 'tuiIconUserLarge',
      url: '/user'
    },

  ];

  constructor(private elementRef: ElementRef,
              private chatService: ChatService,
              private router: Router,
  ) {
    this.loggedId = getUserAuthenticatedId();

  }


  handleCloseModal() {
    document.body.style.overflow = 'initial';

    this.isUploadModalOpen = false;

  }

  openModal() {
    document.body.style.overflow = 'hidden';
    this.isUploadModalOpen = true;

  }


  toggleMenu() {
    this.isUserMenuOpen = false;
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeDialog() {
    this.isMenuOpen = false;
  }


  login() {
    this.router.navigate(['auth/login']).then();
  }
  register() {
    this.router.navigate(['auth/register'])
  }


  isLoggedIn() {
    return isAuthenticated();
  }

  logOut() {
    this.isUserMenuOpen=false;
    this.router.navigateByUrl('auth/login').then(()=>  localStorage.clear())
  }

  openUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownElement = this.elementRef.nativeElement;
    const dropdownMenu = dropdownElement.querySelector('.dropdown-menu');

    if (!dropdownElement.contains(target) && !dropdownMenu?.contains(target)) {
      this.isUserMenuOpen = false;
    }
  }


}
