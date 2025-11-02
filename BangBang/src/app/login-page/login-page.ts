import { Component } from '@angular/core';
import { CustomTextInput } from '../custom-text-input/custom-text-input';
import { CustomButton } from '../custom-button/custom-button';

@Component({
  selector: 'app-login-page',
  imports: [CustomButton, CustomTextInput],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

}
