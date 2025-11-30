import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SERVER_ENDPOINT } from '../../constants/constants';

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

  constructor() {}

  async onSubmit() {
    this.username='';
    
    const targetedUserPasswordInfo = await this.findUser(this.email);
    if(!targetedUserPasswordInfo.successful) {
      this.error = 'error';
      this.success = '';
      return;
    }

    this.error = '';
    this.success = 'true';
    this.username = targetedUserPasswordInfo.username;
    this.password = targetedUserPasswordInfo.password;
  }

  async findUser(email: string) : Promise<any> {
    let result: any;
    await fetch(SERVER_ENDPOINT+'/users/forgotpassword',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email})
      }
    ).then((res) => res.json()).then((data) => {
      result = data;
    });

    return result;
  }
}
