import { Component, computed, signal, WritableSignal } from '@angular/core';
import { User } from '../../types/types';
import { Auth } from '../../auth/auth';
import { SERVER_ENDPOINT } from '../../constants/constants';
import { Router, RouterLink } from '@angular/router';

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
  description: "",
  avatar: "",
  city: ""
};

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  authService : Auth;
  availableUsers: Array<User> = [];

  availableUsersExist: WritableSignal<boolean> = signal(false);
  showUserDescription: WritableSignal<boolean> = signal(false);
  currentUser: WritableSignal<User> = signal(DEFAULT_USER);
  currentImage: string = "";

  currentUserCity = computed(() => {
    if(!this.currentUser) {
      return "";
    }
    if(this.currentUser().city === '') {
      return "";
    }
    return ", "+this.currentUser().city
  })

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

  constructor(authService: Auth, private router : Router) {
    this.authService = authService;
    const userId = this.authService.getUserId();

    fetch(SERVER_ENDPOINT+'/match/available?currentid='+userId)
    .then((res) => res.json())
    .then((data) => {
      this.availableUsers = data.users as Array<User>;

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
    if(user.avatar != '') {
      return user.avatar;
    }

    return "images/defaultAvatar.png";
  }

  getAge(date: Date) {
    const diff = Date.now()-Number(date);
    const diffDate = new Date(diff);
    return Math.abs(diffDate.getUTCFullYear()-1970);
  }

  getNextUserToDisplay() {
    if(!this.availableUsers.length) {
      this.availableUsersExist.set(!!this.availableUsers.length);
    } else {
      this.currentUser.set(this.availableUsers[0]);
      this.currentImage = this.getImageName(this.currentUser());
    }
  }

  async handleMatch(resolved: string) {
    const resolvedMatch = resolved == 'resolved';
    await fetch(SERVER_ENDPOINT+"/match/creatematch", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentUserId: this.authService.getUserId(),
        secondUserId: this.currentUser().id,
        resolved: resolvedMatch
      })
    }).then((res) => res.json()).then((data) => {
      if(!data.success) {
        return;
      }

      this.availableUsers = this.availableUsers.filter((user) => user.id != this.currentUser().id);

      this.getNextUserToDisplay();
    }).catch((err) => {
      console.error(err);
    });
  }

  handleOpenProfile() {
    this.router.navigate(['/profile']);
  }

  handleOpenChats() {
    this.router.navigate(['/chats']);
  }

  showDescription(open: boolean) {
    this.showUserDescription.set(open);
  }
}
