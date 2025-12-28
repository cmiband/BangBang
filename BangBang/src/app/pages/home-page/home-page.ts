import { Component } from '@angular/core';
import { User } from '../../auth/auth';
import { Auth } from '../../auth/auth';
import { SERVER_ENDPOINT } from '../../constants/constants';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  authService : Auth;
  availableUsers: Array<User> = [];

  constructor(authService: Auth) {
    this.authService = authService;
    const userId = this.authService.getUserId();

    fetch(SERVER_ENDPOINT+'/users/available?currentid='+userId)
    .then((res) => res.json())
    .then((data) => {
      this.availableUsers = data.users as Array<User>;
      console.log(this.availableUsers);
    }).catch((err) => {
      console.error(err);
    });
  }
}
