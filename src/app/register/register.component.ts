import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../models/user";
import {finalize, first} from "rxjs";
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {AuthenticationService} from "../service/authentication.service";
import {ConfirmedValidator} from "../validators/confirmPasswordValidator";
import {FileService} from "../service/file.service";
import {SealService} from "../service/seal.service";
import {AlertService} from "../service/alert.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  isLoading: boolean = false;
  email: any;
  password: any;

  constructor(
    private sealService:SealService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private authService: AuthenticationService
  ) {
    this.form = formBuilder.group(
      {
        username: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]+')]),

        name: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]+')]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.pattern('(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z\\d$@$!%*?&].{7,}')]),
        confirmPassword: new FormControl(null, [Validators.required, Validators.pattern('(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z\\d$@$!%*?&].{7,}')])
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword'),
      }
    );
  }


  register() {
    if (this.form.valid) {
      this.isLoading = true;
      const user = new User(
        0,
        this.form.controls['email'].value,
        this.form.controls['password'].value,
        this.form.controls['name'].value,
        'user',
        this.form.controls['username'].value
      );
      this.authService.register(user)
        .pipe(
          first(),
          finalize(() => (this.isLoading = false))
        )
        .subscribe({
          next: () => {
            this.sealService.generatePublicKey(user.username);
            this.sealService.generateSecretKry(user.password,user.username)
            const notification = { id:1,label:"Hooray...", message: 'Account created successfully! You can log in with your new credentials.', type: "success" };
            this.alertService.addNotification(notification)

          },
          error: (error: any) => {
            for (let key in error.error) {
              const notification = { id:1,label:"Hooray...", message:error.error[key], type: "error" };
              this.alertService.addNotification(notification)
            }
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

  getNameErrorMessage() {
    const field = this.form.get('name') as FormControl;
    return field.hasError('required') ?
      'You must enter a value' :
      field.hasError('pattern') ?
        'Only letters and blank spaces allowed' : '';
  }
}
