import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule, Routes} from "@angular/router";
import {NavbarComponent} from "./navbar/navbar.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {UploadImageComponent} from "./upload-image/upload-image.component";
import {EditBarComponent} from "./edit-bar/edit-bar.component";
import {EditPageComponent} from "./edit-page/edit-page.component";
import {FiltersComponent} from "./filters/filters.component";
import {DrawingMenuComponent} from "./drawing-menu/drawing-menu.component";
import {TextMenuComponent} from "./text-menu/text-menu.component";
import {TabsComponent} from "./tabs/tabs.component";
import {DiscoverPageComponent} from "./discover-page/discover-page.component";
import {TestComponent} from "./test/test.component";
import {Test2Component} from "./test2/test2.component";
import {ImagePageComponent} from "./image-page/image-page.component";
import {LikesModalComponent} from "./likes-modal/likes-modal.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {ResetPassword} from "./models/password";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {ChatComponent} from "./chat/chat.component";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";
import {GalleryEditComponent} from "./gallery-edit/gallery-edit.component";
import {GalleryPageComponent} from "./gallery-page/gallery-page.component";
import {NotificationPageComponent} from "./notification-page/notification-page.component";
import {UploadModalComponent} from "./upload-modal/upload-modal.component";
import {ModalSelectPhotoComponent} from "./modal-select-photo/modal-select-photo.component";
import {GalleryModalComponent} from "./gallery-modal/gallery-modal.component";



const routes: Routes = [
  {path: 'image/:id', component:  ImagePageComponent},
  {path: 'auth/login', component:  LoginComponent},
  // {path: 'discover', component: TabsComponent},
  {path: 'auth/register', component:RegisterComponent},
  {path: 'auth/forgot-password', component:ForgotPasswordComponent},
  {path: 'auth/reset-password', component: ResetPasswordComponent},
  {path:'edit-bar',component:EditBarComponent},
  {path:'edit-page',component:EditPageComponent},
  {path: 'user/:id', component:  UserProfileComponent},
  {path: 'user2/:id', component:  UserProfileComponent},
  {path:'chat',component:ChatComponent},
  {path:"edit/:id",component:EditProfileComponent},
  {path:"gallery/:id",component:GalleryPageComponent},
  {path:"create-gallery",component:GalleryEditComponent},
  {path:"gallery-edit/:id",component:GalleryEditComponent},
  {path:"notification/:id",component:NotificationPageComponent},
  {path:"upload",component:UploadImageComponent},
  {path:"upload2",component:UploadModalComponent},
  {path:"ce",component:Test2Component},
  {
    path:'discover',
    component:DiscoverPageComponent,
    children:[
      {path:'popular',component:LoginComponent},
      {path:'basic',component:DiscoverPageComponent},
      {path:'editors',component:DiscoverPageComponent},
      {path:'fresh',component:DiscoverPageComponent}



    ]
  }
  ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
