import { Component } from '@angular/core';
import { CustomButton } from '../../shared/custom-button/custom-button';
import { CustomTextInput } from '../../shared/custom-text-input/custom-text-input';
import { RouterLink, Router } from '@angular/router';
import { User } from '../../auth/auth';
import { Auth } from '../../auth/auth';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; 

@Component({
  selector: 'app-sign-up-page',
  imports: [FormsModule, NgIf],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.css'
})
export class SignUpPage {
  username = ''
  password = ''
  email = ''
  error = ''
  private user: User = {username: 'adam', password: 'adam', email: ''};

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    let status = false
    if(this.username != '' && this.email != '' && this.password != '') {
      const newUser: User = {
        username: this.username,
        password: this.password,
        email: this.email
      };
      status = this.authService.addUser(newUser)
    }
    if(status) {
      this.error = 'Dodano uzytkownika!'
      this.router.navigate(['/login']);
    } else {
      this.error = 'Cos poszlo nie tak :('
    }
  }
}
