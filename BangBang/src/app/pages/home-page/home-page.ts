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
  currentUser: User | undefined;
  currentImage: string = "";
  availableUsersExist = false;

  constructor(authService: Auth) {
    this.authService = authService;
    const userId = this.authService.getUserId();

    fetch(SERVER_ENDPOINT+'/match/available?currentid='+userId)
    .then((res) => res.json())
    .then((data) => {
      this.availableUsers = data.users as Array<User>;
      console.log(this.availableUsers);

      this.availableUsersExist = !!this.availableUsers.length;
      if(this.availableUsersExist) {
        this.adaptFirstLoad(this.availableUsers);
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  adaptFirstLoad(users: Array<User>) {
    this.currentUser = users[0];
    this.currentImage = this.getImageName(this.currentUser);      
  }

  getImageName(user: User) {
    return user.gender == "male" ? "images/man.jpg" : "images/woman.png";
  }
}
