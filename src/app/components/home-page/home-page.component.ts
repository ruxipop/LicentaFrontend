import {Component} from '@angular/core';
import {currentCharacterCount, isAdminAuthenticated} from "../../utils";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  goToRegisterPage() {
    window.location.href = 'auth/register'
  }

  text = 'ssaa'
  protected readonly currentCharacterCount = currentCharacterCount;
  message: any = '';
  name: string = '';
  email: string = '';

  isButtonDisable(){

      return this.message == '' || this.name == '' || this.email==''
    }
}
