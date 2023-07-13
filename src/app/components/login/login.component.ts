import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {finalize, first, Subject} from "rxjs";
import {User} from "../../models/user";
import {Credentials} from "../../models/credentials";
import {TuiAlertService} from "@taiga-ui/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ChatService} from "../../services/chat.service";
import {SealService} from "../../services/seal.service";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnDestroy, OnInit {
  email: any;
  password: any;
  form: FormGroup;
  hidePassword: boolean = true;
  isLoading = false;
  private ngUnsubscribe = new Subject<void>();

  constructor(private authService: AuthenticationService,
              private formBuilder: FormBuilder,
              private sealService: SealService,
              private chatService: ChatService,
              private router: Router,
              private alertService: TuiAlertService,
              private alertService1: AlertService) {
    this.form = formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {

  }

  login() {
    if (this.form.valid) {
      this.isLoading = true;

      this.authService.login(new Credentials(this.form.controls['email'].value, this.form.controls['password'].value))
        .pipe(
          first(),
          finalize(() => this.isLoading = false
          )
        )
        .subscribe({
          next: (result: User) => {
            this.isLoading = false;
            localStorage.setItem('id', result.id.toString());
            localStorage.setItem('email', result.email);
            localStorage.setItem('role', result.role);
            localStorage.setItem('password', result.password)
            this.chatService.startConnection(localStorage.getItem("id")!)
            this.sealService.setSecretKey(result.username, this.form.controls['password'].value)
            setTimeout(() => {
              window.location.href = '/discover'
            }, 1000);


          },
          error: () => {
            const notification = {
              id: 1,
              label: "Oops...",
              message: 'Failed to connect to the account. Please try again!',
              type: "error"
            };
            this.alertService1.addNotification(notification)
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
