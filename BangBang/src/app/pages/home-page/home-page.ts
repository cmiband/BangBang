import { Component, computed, signal, WritableSignal } from '@angular/core';
import { User } from '../../types/types';
import { Auth } from '../../auth/auth';
import { SERVER_ENDPOINT } from '../../constants/constants';

const DEFAULT_USER: User = {
  id: "",
  gender: "",
  username: "",
  password: "",
  email: "",
  name: "",
  surname: "",
  country: "",
  dob: "",
  description: ""
};

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  authService : Auth;
  availableUsers: Array<User> = [];

  availableUsersExist: WritableSignal<boolean> = signal(false);
  currentUser: WritableSignal<User> = signal(DEFAULT_USER);
  currentImage: string = "";

  currentUserFirstName = computed(() => {
    if(!this.currentUser) {
      return "";
    }

    return this.currentUser().name;
  });
  currentUserAge = computed(() => {
    console.log('curr user');
    if(!this.currentUser) {
      return "";
    }

    return this.getAge(new Date(this.currentUser().dob));
  });

  constructor(authService: Auth) {
    this.authService = authService;
    const userId = this.authService.getUserId();

    fetch(SERVER_ENDPOINT+'/match/available?currentid='+userId)
    .then((res) => res.json())
    .then((data) => {
      this.availableUsers = data.users as Array<User>;
      console.log(this.availableUsers);

      this.availableUsersExist.set(!!this.availableUsers.length);
      if(this.availableUsersExist()) {
        this.adaptFirstLoad(this.availableUsers);
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  adaptFirstLoad(users: Array<User>) {
    this.currentUser.set(users[0]);
    this.currentImage = this.getImageName(this.currentUser());    
  }

  getImageName(user: User) {
    return user.gender == "male" ? "images/man.jpg" : "images/woman.png";
  }

  getAge(date: Date) {
    const diff = Date.now()-Number(date);
    const diffDate = new Date(diff);
    return Math.abs(diffDate.getUTCFullYear()-1970);
  }

  getNextUserToDisplay() {
    if(!this.availableUsers.length) {
      console.log('a');
      this.availableUsersExist.set(!!this.availableUsers.length);
    } else {
      console.log('b');
      this.currentUser.set(this.availableUsers[0]);
      this.currentImage = this.getImageName(this.currentUser());
    }
  }

  async handleMatch() {
    console.log('match');
    await fetch(SERVER_ENDPOINT+"/match/creatematch", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstUserId: this.authService.getUserId(),
        secondUserId: this.currentUser().id,
        resolved: false
      })
    }).then((res) => res.json()).then((data) => {
      if(!data.success) {
        return;
      }

      this.availableUsers = this.availableUsers.filter((user) => user.id != this.currentUser().id);
      console.log('users');
      console.log(this.availableUsers);

      this.getNextUserToDisplay();
    }).catch((err) => {
      console.error(err);
    })
  }

  handleUnmatch() {
    console.log('unmatch');
  }
}
