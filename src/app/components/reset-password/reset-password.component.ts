import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {ConfirmedValidator} from "../../validators/confirmPasswordValidator";
import {finalize, first} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ResetPassword} from "../../models/password";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  isLoading: boolean = false;
  token: string | null = ''
  disabledInput: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = formBuilder.group(
      {
        password: new FormControl(null, [Validators.required, Validators.pattern('(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z\\d$@$!%*?&].{7,}')]),
        confirmPassword: new FormControl(null, [Validators.required, Validators.pattern('(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z\\d$@$!%*?&].{7,}')])
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (this.token) {
      this.authService.isTokenValid(this.token).subscribe(
        {
          next: () => {
          },
          error: () => {
            this.disabledInput = true
            const notification = {
              id: 1,
              label: "Oops...",
              message: "The link has expired or is invalid.",
              type: "error"
            };
            this.alertService.addNotification(notification)
          }
        }
      )
    }
  }

  changePassword() {
    if (this.form.invalid) {
      return
    }
    this.isLoading = true;
    this.authService.resetPassword(new ResetPassword(this.form.controls['confirmPassword'].value, this.token))


      .pipe(
        first(),
        finalize(() => (this.isLoading = false))
      ).subscribe({
        next: () => {
          const notification = {
            id: 1,
            label: "Hooray!",
            message: 'Password changed successfully! You can log in with your new credentials.',
            type: "success"
          };
          this.alertService.addNotification(notification)
          setTimeout(() => this.router.navigate(['auth/login']), 1000)

        },
        error: (error) => {

          const notification = {id: 1, label: "Oops!", message: error.error, type: "error"};
          this.alertService.addNotification(notification)


        }
      }
    )
  }

  getPasswordErrorMessage() {
    const field = this.form.get('password') as FormControl;
    return field.hasError('required') ?
      'You must enter a value' :
      field.hasError('pattern') ?
        'Min. 8 chars, letters and digits' : '';
  }

  getConfirmPasswordErrorMessage() {
    const field = this.form.get('confirmPassword') as FormControl;
    return field.hasError('required') ?
      'You must enter a value' :
      field.hasError('pattern') ?
        'Min. 8 chars, letters and digits' :
        field.hasError('confirmedValidator') ?
          'Passwords do not match' : '';
  }

}
