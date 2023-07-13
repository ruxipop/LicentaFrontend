import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {UploadImageComponent} from "./components/upload-image/upload-image.component";
import {EditBarComponent} from "./components/edit-bar/edit-bar.component";
import {EditPageComponent} from "./components/edit-page/edit-page.component";
import {DiscoverPageComponent} from "./components/discover-page/discover-page.component";
import {ImagePageComponent} from "./components/image-page/image-page.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {ChatComponent} from "./components/chat/chat.component";
import {EditProfileComponent} from "./components/edit-profile/edit-profile.component";
import {GalleryEditComponent} from "./components/gallery-edit/gallery-edit.component";
import {GalleryPageComponent} from "./components/gallery-page/gallery-page.component";
import {NotificationPageComponent} from "./components/notification-page/notification-page.component";
import {VotedImagesComponent} from "./components/voted-images/voted-images.component";
import {StatisticsPageComponent} from "./components/statistics-page/statistics-page.component";
import {environment} from "../environments/environment";
import {BrowserModule} from "@angular/platform-browser";
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {HomePageComponent} from "./components/home-page/home-page.component";
import {AuthGuard} from "./auth/auth.guard";
import {ReportsPageComponent} from "./components/reports-page/reports-page.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'discover', component: DiscoverPageComponent},
  {path: "home", component: HomePageComponent},
  {path: 'image/:id', component: ImagePageComponent},
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/register', component: RegisterComponent},
  {path: 'auth/forgot-password', component: ForgotPasswordComponent},
  {path: 'auth/reset-password', component: ResetPasswordComponent},
  {path: 'editor', component: EditPageComponent},
  {path: "gallery-page/:id", component: GalleryPageComponent},
  {path: 'user-profile/:id', component: UserProfileComponent},
  {path: 'chat-page', component: ChatComponent, canActivate: [AuthGuard], data: {roles: ['EDITOR','USER']}},
  {path: "edit-profile/:id", component: EditProfileComponent,canActivate: [AuthGuard], data: {roles: ['EDITOR','USER']}},
  {path: "create-gallery", component: GalleryEditComponent,canActivate: [AuthGuard], data: {roles: ['EDITOR','USER']}},
  {path: "edit-gallery/:id", component: GalleryEditComponent,canActivate: [AuthGuard], data: {roles: ['EDITOR','USER']}},
  {path: "notifications-page/:id", component: NotificationPageComponent,canActivate: [AuthGuard], data: {roles: ['EDITOR','USER']}},
  {path: "statistics-page", component: StatisticsPageComponent,canActivate: [AuthGuard], data: {roles: ['EDITOR']}},
  {path: "votes-page/:id", component: VotedImagesComponent,canActivate: [AuthGuard], data: {roles: ['EDITOR']}},
  {path:"reports-page",component:ReportsPageComponent,canActivate: [AuthGuard], data: {roles: ['EDITOR']}}
]

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule],
  providers: [],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
