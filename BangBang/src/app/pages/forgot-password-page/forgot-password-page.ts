import { Component } from '@angular/core';
import { CustomButton } from '../../shared/custom-button/custom-button';
import { CustomTextInput } from '../../shared/custom-text-input/custom-text-input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  imports: [CustomButton, CustomTextInput,RouterLink],
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.css'
})
export class ForgotPasswordPage {

}
