import { Component } from '@angular/core';
import {AuthenticationService} from "../service/authentication.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {NavigationExtras, Router} from "@angular/router";
import {ForgotPassword} from "../models/password";
import {finalize, first} from "rxjs";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: any;
  isLoading=false;
  form: FormGroup;
  constructor(private authService: AuthenticationService,
              private formBuilder: FormBuilder,
              private alertService: TuiAlertService,
              private router: Router) {
    this.form = formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }


  sendEmailResetPass() {

    if (this.form.valid) {
      console.log("aloo")
      this.isLoading = true;
      this.authService.sendEmailResetPass(new ForgotPassword(this.form.controls['email'].value)).pipe(
        first(),
        finalize(() => (this.isLoading = false))
      ).subscribe({
          next: () => {
            this.alertService.open('Email sent successfully! Check your email!', {
              label: 'Hooray!',
              status: TuiNotification.Success,
              autoClose: true,
            }).subscribe();
            this.form.controls['email'].reset();
          },
          error: (error) => {
            for (let key in error.error) {
              this.alertService.open(error.error[key], {
                status: TuiNotification.Error,
                autoClose: true,
              }).subscribe();
            }
          }
        }
      )
    }
  }

  getEmailErrorMessage() {
    const field = this.form.get('email') as FormControl;
    return field.hasError('required') ?
      'You must enter a value' :
      field.hasError('email') ?
        'Not a valid email' : '';
  }
}
