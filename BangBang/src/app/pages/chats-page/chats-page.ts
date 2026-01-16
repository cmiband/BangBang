import { Component } from '@angular/core';
import { WritableSignal } from '@angular/core';
import { signal } from '@angular/core';
import { Auth } from '../../auth/auth';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../types/types';
import { SERVER_ENDPOINT } from '../../constants/constants';
import { Chat } from '../../chat/chat';

@Component({
  selector: 'app-chats-page',
  imports: [Chat,RouterLink],
  templateUrl: './chats-page.html',
  styleUrl: './chats-page.css',
})
export class ChatsPage {
  insideChat: WritableSignal<boolean> = signal(false);
  availableUsersToChat: WritableSignal<User[]> = signal([]);
  currentChat: string = "";

  constructor(private auth: Auth, private router: Router) {
    const currentUserId = this.auth.getUserId();

    fetch(SERVER_ENDPOINT+'/chats/available?currentid='+currentUserId).then((res) => res.json()).then((data) => {
      this.availableUsersToChat.set(data.chats);
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
  handleOpenLogout() {
    this.router.navigate(['/login']);
  }

  handleChatClick(chatId: string) {
    this.currentChat = chatId;
    this.insideChat.set(true);
  }

  handleBack() {
    this.currentChat = "";
    this.insideChat.set(false);
  }
}
