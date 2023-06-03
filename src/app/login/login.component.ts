import {Component, OnDestroy} from '@angular/core';
import {AuthenticationService} from "../service/authentication.service";
import {finalize, first, Subject} from "rxjs";
import {User} from "../models/user";
import {Credentials} from "../models/credentials";
import {HttpErrorResponse} from "@angular/common/http";
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnDestroy{
  email: any;
  password: any;
  form: FormGroup;
  hidePassword: boolean = true;
  isLoading = false;
  private ngUnsubscribe = new Subject<void>();



  constructor(private authService: AuthenticationService,
              private formBuilder: FormBuilder,
              private alertService: TuiAlertService,
              private router: Router) {
    this.form = formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  login() {
    if (this.form.valid) {
      this.isLoading = true;

      this.authService.login(new Credentials(this.form.controls['email'].value, this.form.controls['password'].value))
        .pipe(
          first(),
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (result: User) => {

            this.isLoading = false;
            localStorage.setItem('id', result.id.toString());
            localStorage.setItem('email', result.email);
            localStorage.setItem('role', result.role);
            this.router.navigate(['discover'])
              .then(() => {
                window.location.reload();
              });
          },
          error: (error: HttpErrorResponse) => {
            console.log("aici ajuns" + error.error.error)
            this.alertService.open("error.error.error", {
              label: 'Oops...',
              status: TuiNotification.Error,
              autoClose: true,
            }).subscribe();
          }
        })

    }
  }

  getEmailErrorMessage() {
    const field = this.form.get('email') as FormControl;
    return field.hasError('required') ?
      'You must enter a value' :
      field.hasError('email') ?
        'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.form.get('password')!.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
