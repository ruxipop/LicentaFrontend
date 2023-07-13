import {Component} from '@angular/core';
import {currentCharacterCount} from "../../utils";
import {AuthenticationService} from "../../services/authentication.service";
import {EmailMessage} from "../../models/email-message";
import {ReportService} from "../../services/report.service";
import {AlertService} from "../../services/alert.service";
import {SuccessMessage} from "../../models/success-message";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  message: any = '';
  name: string = '';
  email: string = '';
  protected readonly currentCharacterCount = currentCharacterCount;

  constructor(private reportService:ReportService,private alertService:AlertService) {
  }

  goToRegisterPage() {
    window.location.href = 'auth/register'
  }

  isButtonDisable() {

    return this.message == '' || this.name == '' || this.email == ''
  }


  sendEmail() {
    let emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    if (!emailRegex.test(this.email)) {
      const notification = {
        id: 1,
        label: "Error",
        message: "Invalid email format",
        type: "error"
      };
      this.alertService.addNotification(notification);
      return;
    }

    let email = new EmailMessage(this.email, this.message, this.name)
    this.reportService.sentEmailToEditor(email).subscribe({
      next: (response:SuccessMessage) => {
        const notification = {
          id: 1,
          label: "Hooray...",
          message: response.message,
          type: "success"
        };
        this.alertService.addNotification(notification)
      },
      error: (error: any) => {
        const notification = {
          id: 1,
          label: "Hooray...",
          message: error.error,
          type: "error"
        };
        this.alertService.addNotification(notification)
      }
    })
  }

}
