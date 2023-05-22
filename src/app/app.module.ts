import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import {
  TuiDropdownModule,
  TuiGroupModule, TuiHintModule,
  TuiRootModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {TuiTabBarModule} from '@taiga-ui/addon-mobile';
import {TuiInputModule} from "@taiga-ui/kit";
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent
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
    TuiGroupModule,
    TuiSvgModule,
    TuiHintModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
