import { Component } from '@angular/core';
import { CustomButton } from '../../shared/custom-button/custom-button';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../auth/auth';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; 

@Component({
  selector: 'app-login-page',
  imports: [CustomButton, RouterLink, FormsModule, NgIf],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  username = '';
  password = '';
  error = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    const ok = this.authService.login(this.username, this.password);
    if (ok) {
      this.router.navigate(['/profile']);
    } else {
      this.error = 'Niepoprawne dane logowania';
      this.password=''
    }
  }
}
