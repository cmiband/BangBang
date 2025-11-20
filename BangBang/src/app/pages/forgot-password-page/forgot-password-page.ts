import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-forgot-password-page',
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.css'
})
export class ForgotPasswordPage {
  email = '';
  error = '';
  success = '';
  username = '';
  password = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    this.username=''
    const users = this.authService.returnUsers()
    for(let user of users) {
      if (user.email == this.email) {
        this.username = user.username
        this.password = user.password
      }
    } 
    if (this.username === '') {
      this.error = 'error'
      this.success = ''
    }
    else {
      this.error = ''
      this.success = 'true'
    }
  }
}
