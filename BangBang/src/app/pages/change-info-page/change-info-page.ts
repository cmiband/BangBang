import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Auth } from '../../auth/auth';
import { FormsModule } from '@angular/forms';
import { SERVER_ENDPOINT } from '../../constants/constants';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-change-info-page',
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './change-info-page.html',
  styleUrl: './change-info-page.css'
})
export class ChangeInfoPage {
    name = ''
    surname = ''
    country = ''
    city = ''
    password = ''
    email = ''
    error = ''
    description = ''
    showSuccess = false;
    showError = false;

    user: any;
  
    constructor(private authService: Auth) {
      this.user = this.authService.getUser();

      this.name=this.user.name
      this.surname=this.user.surname
      this.country=this.user.country
      this.city=this.user.city
      this.password=this.user.password
      this.email=this.user.email
      this.description=this.user.description
    }

    async onSubmit() {
      this.closeAlerts();

      let check = this.validate()
      if(!check) {
        this.error = "Invalid data"
        this.showError = true;
        setTimeout(() => (this.showError = false), 2000);
        return
      }
      
      if(this.email != this.user.email) {
        const email = this.email
        const qs = new URLSearchParams({ email }).toString();
        const accountRes = await fetch(`${SERVER_ENDPOINT}/users/emailCheck?${qs}`, {})
        const accountData = await accountRes.json();

        if(accountData) {
          this.error = "Email taken"
          this.showError = true
          setTimeout(() => (this.showError = false), 2000);
          return
        }
      }
      console.log(this.description)
      let result: boolean = false
      await fetch(SERVER_ENDPOINT+'/users/updateUser', {
        method: "PUT",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          oldEmail: this.user.email,
          oldPassword: this.user.password,
          name: this.name,
          surname: this.surname,
          country: this.country,
          city: this.city,
          password: this.password,
          email: this.email,
          description: this.description 
        })
      }).then((res) => res.json()).then((data) => {
      result = data.successful;
      });

      if(result) {
        this.showSuccess = true;
        setTimeout(() => (this.showSuccess = false), 2000);
      } 
      else {
        this.error = "Error"
        this.showError = true
        setTimeout(() => (this.showError = false), 2000);
      }
      if(this.user.password === this.password) {
        this.authService.updateUserInfo()
      }
      else {
        this.authService.updateUserInfo(this.password)
      }
    }
    
    validate(): boolean {
      if(this.name === '' ||
        this.surname === '' ||
        this.country === '' ||
        this.password === '' ||
        this.email === ''
      ) {
        return false
      }
      return true
    }

    closeAlerts() {
      this.showSuccess = false;
      this.showError = false;
    }
}

