import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {
  TuiAlertModule,
  TuiAlertService, TuiButtonModule, TuiCalendarModule, TuiDataListModule, TuiDialogModule,
  TuiDropdownModule, TuiErrorModule,
  TuiGroupModule, TuiHintModule, TuiHostedDropdownModule, TuiLinkModule, TuiLoaderModule, TuiNotificationModule,
  TuiRootModule,
  TuiSvgModule,
  TuiTextfieldControllerModule, TuiTooltipModule
} from "@taiga-ui/core";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {TuiTabBarModule} from '@taiga-ui/addon-mobile';
import {
  TuiActionModule, TuiArrowModule,
  TuiBreadcrumbsModule, TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputSliderModule, TuiIslandModule, TuiRadioBlockModule, TuiRatingModule, TuiTextAreaModule,
  TuiToggleModule
} from "@taiga-ui/kit";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import {UploadImageComponent} from './upload-image/upload-image.component';
import {ImageCropperModule} from "ngx-image-cropper";
import {NgxFileDropModule} from "ngx-file-drop";
import {EditBarComponent} from './edit-bar/edit-bar.component';
import {EditPageComponent} from './edit-page/edit-page.component';
import {FiltersComponent} from './filters/filters.component';
import {DrawingMenuComponent} from './drawing-menu/drawing-menu.component';
import {TuiInputColorModule} from "@taiga-ui/addon-editor";
import {ColorPickerModule} from "ngx-color-picker";
import {TextMenuComponent} from './text-menu/text-menu.component';
import {MatSliderModule} from "@angular/material/slider";
import {TabsComponent} from './tabs/tabs.component';
import {TabComponent} from './tab/tab.component';
import {DiscoverPageComponent} from './discover-page/discover-page.component';
import {DropdownComponent} from './dropdown/dropdown.component';
import {APP_BASE_HREF, NgOptimizedImage} from "@angular/common";
import {NgxMasonryModule} from "ngx-masonry";
import {InfiniteScrollModule, NgxInfiniteScrollService} from "ngx-infinite-scroll";
import {TestComponent} from './test/test.component';
import {Test2Component} from './test2/test2.component';
import {environment} from "../environments/environment";

import {initializeFirestore, provideFirestore} from '@angular/fire/firestore';
import {initializeAppCheck, provideAppCheck, ReCaptchaV3Provider} from '@angular/fire/app-check';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {ImagePageComponent} from './image-page/image-page.component';
import {MatDialogModule} from "@angular/material/dialog";
import {LikesModalComponent} from './likes-modal/likes-modal.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {TuiValueChangesModule} from "@taiga-ui/cdk";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    UploadImageComponent,
    EditBarComponent,
    EditPageComponent,
    FiltersComponent,
    DrawingMenuComponent,
    TextMenuComponent,
    TabsComponent,
    TabComponent,
    DiscoverPageComponent,
    DropdownComponent,
    TestComponent,
    Test2Component,
    ImagePageComponent,
    LikesModalComponent,
    UserProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,

  ],
  imports: [
    BrowserModule,
    TuiRootModule,
    AppRoutingModule,
    TuiDropdownModule,
    TuiTabBarModule,
    TuiInputModule,
    FormsModule,
    TuiTextfieldControllerModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    TuiGroupModule,
    TuiSvgModule,
    TuiHintModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatIconModule,
    HttpClientModule,
    MatSelectModule,
    MatButtonModule,
    ImageCropperModule,
    NgxFileDropModule,
    TuiInputColorModule,
    TuiInputModule,
    ColorPickerModule,
    TuiInputSliderModule,
    MatSliderModule,
    TuiToggleModule,
    NgOptimizedImage,
    NgxMasonryModule,
    InfiniteScrollModule,
    MatDialogModule,
    TuiDialogModule,
    TuiAlertModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    TuiRootModule,
    TuiAlertModule,
    TuiNotificationModule,
    TuiActionModule,
    ReactiveFormsModule,
    MatSelectModule,
    RouterModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    FlexLayoutModule,
    TuiHintModule,
    TuiTooltipModule,
    TuiSvgModule,
    TuiIslandModule,
    TuiTextAreaModule,
    TuiRatingModule,
    TuiDialogModule,
    TuiInputModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiRadioBlockModule,
    TuiValueChangesModule,
    TuiLoaderModule,
    MatDialogModule,
    TuiArrowModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    TuiCalendarModule,
    TuiButtonModule


  ],
  providers: [
    // { provide: APP_BASE_HREF, useValue: '/' },

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
