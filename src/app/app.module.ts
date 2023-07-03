import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';

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
  TuiFieldErrorPipeModule, TuiFilterByInputPipeModule, TuiInputDateRangeModule,
  TuiInputModule,
  TuiInputSliderModule,
  TuiIslandModule, TuiMarkerIconModule,
  TuiRadioBlockModule,
  TuiRatingModule, TuiSelectModule,
  TuiStringifyContentPipeModule,
  TuiTextAreaModule,
  TuiToggleModule
} from "@taiga-ui/kit";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import {UploadImageComponent} from './components/upload-image/upload-image.component';
import {ImageCropperModule} from "ngx-image-cropper";
import {NgxFileDropModule} from "ngx-file-drop";
import {EditBarComponent} from './components/edit-bar/edit-bar.component';
import {EditPageComponent} from './components/edit-page/edit-page.component';
import {FiltersComponent} from './components/filters/filters.component';
import {DrawingMenuComponent} from './components/drawing-menu/drawing-menu.component';
import {TuiInputColorModule} from "@taiga-ui/addon-editor";
import {ColorPickerModule} from "ngx-color-picker";
import {TextMenuComponent} from './components/text-menu/text-menu.component';
import {MatSliderModule} from "@angular/material/slider";
import {TabsComponent} from './components/tabs/tabs.component';
import {TabComponent} from './components/tab/tab.component';
import {DiscoverPageComponent} from './components/discover-page/discover-page.component';
import {DropdownComponent} from './components/dropdown/dropdown.component';
import {APP_BASE_HREF, NgOptimizedImage} from "@angular/common";
// import {NgxMasonryModule} from "ngx-masonry";
import {InfiniteScrollModule, NgxInfiniteScrollService} from "ngx-infinite-scroll";
import {Test2Component} from './test2/test2.component';
import {environment} from "../environments/environment";

import {initializeFirestore, provideFirestore} from '@angular/fire/firestore';
import {initializeAppCheck, provideAppCheck, ReCaptchaV3Provider} from '@angular/fire/app-check';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {ImagePageComponent} from './components/image-page/image-page.component';
import {LikesModalComponent} from './components/likes-modal/likes-modal.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import { ChatComponent } from './components/chat/chat.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { TrimPipe } from './models/trim.pipe';
import { GroupByPipe } from './models/group-by.pipe';
import { GalleryModalComponent } from './components/gallery-modal/gallery-modal.component';
import { GalleryEditComponent } from './components/gallery-edit/gallery-edit.component';
import { GalleryPageComponent } from './components/gallery-page/gallery-page.component';
import { NotificationPageComponent } from './components/notification-page/notification-page.component';
import { UploadModalComponent } from './components/upload-modal/upload-modal.component';
import { ModalSelectPhotoComponent } from './components/modal-select-photo/modal-select-photo.component';
import {MatDialogModule} from "@angular/material/dialog";
import { CustomDialogComponent } from './components/custom-dialog/custom-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { VotedImagesComponent } from './components/voted-images/voted-images.component';
import { StatisticsPageComponent } from './components/statistics-page/statistics-page.component';
import {
  TuiAxesModule, TuiBarChartModule,
  TuiLineChartModule,
  TuiLineDaysChartModule,
  TuiPieChartModule,
  TuiRingChartModule
} from "@taiga-ui/addon-charts";
import {NgApexchartsModule} from "ng-apexcharts";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { CropMenuComponent } from './components/crop-menu/crop-menu.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';


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
    VotedImagesComponent,
    StatisticsPageComponent,
    CropMenuComponent,
    HomePageComponent,
    FooterComponent,


  ],
  imports: [
    BrowserModule,
    TuiDropdownModule,
    TuiTabBarModule,
    TuiInputModule,
    FormsModule,
    TuiTextfieldControllerModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
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
    TuiLineDaysChartModule,
    TuiAxesModule,
    TuiInputDateRangeModule,
    NgApexchartsModule,

    FormsModule,
    ReactiveFormsModule,
    TuiInputDateRangeModule,
    MatDatepickerModule,
    TuiLineChartModule,
    TuiRingChartModule,
    TuiPieChartModule,
    TuiBarChartModule,
    TuiSelectModule,
    TuiToggleModule,

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
