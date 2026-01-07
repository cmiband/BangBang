import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth,AccontInfo } from '../../auth/auth';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage {
  user: any;
  passwordMasked: string = "********";
  age: string = ''

  constructor(private authService: Auth) {
    this.user = this.authService.getUser();
    this.age = this.calculateAge(this.user.dob)
  }
  
  calculateAge(dob: string): string {
    const [day, month, year] = dob.split('.').map(Number);

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }

    return age.toString();
  }

}
