import { Component, inject } from '@angular/core';
import { CustomButton } from '../../shared/custom-button/custom-button';
import { CustomTextInput } from '../../shared/custom-text-input/custom-text-input';
import { RouterLink, Router } from '@angular/router';
import { User } from '../../auth/auth';
import { Auth } from '../../auth/auth';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; 

@Component({
  selector: 'app-sign-up-page',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.css'
})
export class SignUpPage {
  name = ''
  surname = ''
  country = ''
  dob = ''
  username = ''
  password = ''
  email = ''
  error = ''
  success = ''

  today: string = new Date().toISOString().split('T')[0];

  constructor(private authService: Auth, private router: Router) {}

  resetForm(){
    this.username = ''
    this.password = ''
    this.email = ''
    this.name = ''
    this.surname = ''
    this.country = ''
    this.dob = ''
  }

  validation() {

    if(this.username == '' || 
      this.email == '' || 
      this.password == '' ||
      this.country == '' ||
      this.name == '' ||
      this.surname == '' ||
      this.dob == '') {
      this.error = 'Error! Fields cannot be empty.'
      return false
    }

    if(this.username.trim().length < 1) {
      this.error = 'Error! Username must contain at least 1 character.'
      return false
    }

    const users = this.authService.returnUsers()

    for(let user of users) {
      if (user.email == this.email) {
        this.error = 'Error! There is an account with this email.'
        return false
      }
      if (user.username == this.username) {
        this.error = 'Error! There is an account with this username.'
        return false
      }
    }
    return true
  }

  onSubmit() {
    const validationResult = this.validation()

    if(validationResult) {
      const newUser: User = {
        username: this.username,
        password: this.password,
        email: this.email,
        name: this.name,
        surname: this.surname,
        country: this.country,
        dob: this.dob
      };
      const status = this.authService.addUser(newUser)
      if(status) {
        this.error = ''
        this.success = 'true'
        this.resetForm()
      } else {
        this.error = 'Unexpected error'
        this.success = ''
      }
    } else {
      this.success = ''
    }
  }

}
