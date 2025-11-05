import { Component } from '@angular/core';
import { CustomTextInput } from '../../shared/custom-text-input/custom-text-input';
import { CustomButton } from '../../shared/custom-button/custom-button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [CustomButton, CustomTextInput, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

}
