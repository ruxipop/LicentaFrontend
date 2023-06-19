import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';

import {
  TuiAlertModule,
  TuiButtonModule, TuiCalendarModule, TuiDataListModule, TuiDialogModule,
  TuiDropdownModule, TuiErrorModule,
  TuiGroupModule, TuiHintModule, TuiHostedDropdownModule, TuiLinkModule, TuiLoaderModule, TuiNotificationModule,
  TuiRootModule,
  TuiSvgModule,
  TuiTextfieldControllerModule, TuiTooltipModule
} from "@taiga-ui/core";
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {TuiTabBarModule} from '@taiga-ui/addon-mobile';
import {
  TuiActionModule,
  TuiArrowModule,
  TuiBreadcrumbsModule, TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule, TuiFilterByInputPipeModule,
  TuiInputModule,
  TuiInputSliderModule,
  TuiIslandModule, TuiMarkerIconModule,
  TuiRadioBlockModule,
  TuiRatingModule,
  TuiStringifyContentPipeModule,
  TuiTextAreaModule,
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
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
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
// import {NgxMasonryModule} from "ngx-masonry";
import {InfiniteScrollModule, NgxInfiniteScrollService} from "ngx-infinite-scroll";
import {TestComponent} from './test/test.component';
import {Test2Component} from './test2/test2.component';
import {environment} from "../environments/environment";

import {initializeFirestore, provideFirestore} from '@angular/fire/firestore';
import {initializeAppCheck, provideAppCheck, ReCaptchaV3Provider} from '@angular/fire/app-check';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {ImagePageComponent} from './image-page/image-page.component';
import {LikesModalComponent} from './likes-modal/likes-modal.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import { ChatComponent } from './chat/chat.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { TrimPipe } from './models/trim.pipe';
import { GroupByPipe } from './models/group-by.pipe';
import { GalleryModalComponent } from './gallery-modal/gallery-modal.component';
import { GalleryEditComponent } from './gallery-edit/gallery-edit.component';
import { GalleryPageComponent } from './gallery-page/gallery-page.component';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { ModalSelectPhotoComponent } from './modal-select-photo/modal-select-photo.component';
import {MatDialogModule} from "@angular/material/dialog";
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


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
    ChatComponent,
    EditProfileComponent,
    TrimPipe,
    GroupByPipe,
    GalleryModalComponent,
    GalleryEditComponent,
    GalleryPageComponent,
    NotificationPageComponent,
    UploadModalComponent,
    ModalSelectPhotoComponent,
    CustomDialogComponent,
    ConfirmDialogComponent,


  ],
  imports: [
    BrowserModule,
    TuiDropdownModule,
    TuiTabBarModule,
    TuiInputModule,
    FormsModule,
    TuiTextfieldControllerModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiAlertModule,
    TuiDialogModule,
    AppRoutingModule,
    FlexLayoutModule,
    TuiGroupModule,
    TuiSvgModule,
    TuiValueChangesModule,
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
    ColorPickerModule,
    MatSliderModule,
    NgOptimizedImage,
    InfiniteScrollModule,

    TuiNotificationModule,
    TuiActionModule,
    TuiRatingModule,
    TuiLoaderModule,
    TuiArrowModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    TuiCalendarModule,
    TuiButtonModule,
    RouterModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    TuiTooltipModule,
    TuiMarkerIconModule,
    TuiIslandModule,
    TuiTextAreaModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiRadioBlockModule,
    TuiValueChangesModule,
    TuiDataListWrapperModule,
    TuiStringifyContentPipeModule,
    TuiFilterByInputPipeModule,
    TuiComboBoxModule,
    MatDialogModule,
    MatSelectCountryModule.forRoot('en'),

  ],

  providers: [

    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
