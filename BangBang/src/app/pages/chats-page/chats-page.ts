import { Component } from '@angular/core';
import { WritableSignal } from '@angular/core';
import { signal } from '@angular/core';
import { Auth } from '../../auth/auth';
import { Router } from '@angular/router';
import { User } from '../../types/types';
import { SERVER_ENDPOINT } from '../../constants/constants';

@Component({
  selector: 'app-chats-page',
  imports: [],
  templateUrl: './chats-page.html',
  styleUrl: './chats-page.css',
})
export class ChatsPage {
  insideChat: WritableSignal<boolean> = signal(false);
  availableUsersToChat: WritableSignal<User[]> = signal([]);

  constructor(private auth: Auth, private router: Router) {
    const currentUserId = this.auth.getUserId();

    console.log('current id', currentUserId);
    fetch(SERVER_ENDPOINT+'/chats/available?currentid='+currentUserId).then((res) => res.json()).then((data) => {
      console.log('available users');
      console.log(data);
    }).catch((err) => {
      console.error(err);
    })
  }

  handleOpenProfile() {
    this.router.navigate(['/profile']);
  }

  handleOpenHome() {
    this.router.navigate(['/home']);
  }
}
