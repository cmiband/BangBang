import { Component } from '@angular/core';
import { CustomButton } from '../../shared/custom-button/custom-button';
import { CustomTextInput } from '../../shared/custom-text-input/custom-text-input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up-page',
  imports: [CustomButton, CustomTextInput,RouterLink],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.css'
})
export class SignUpPage {

}
