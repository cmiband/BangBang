import { AfterViewInit, Component, Input, WritableSignal, signal, Output, EventEmitter } from '@angular/core';
import { io, Socket } from "socket.io-client";
import { Auth } from '../auth/auth';
import { SERVER_ENDPOINT } from '../constants/constants';
import { Thread, Message } from '../types/types';

interface DisplayedMessage  {
  value: string,
  isAuthor: boolean,
  id: string
}

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements AfterViewInit {
  @Input() chatId: string = "";

  authService : Auth;
  socket: Socket | undefined;
  currentMessage: string = "";
  currentThread: Thread | undefined;
  displayedMessages: WritableSignal<DisplayedMessage[]> = signal([]);
  @Output('goBack') goBack = new EventEmitter<void>();

  loading: boolean = false;

  constructor(authService: Auth) {
    this.authService = authService;
  }

  ngAfterViewInit(): void{
    if(!this.chatId) {
      return;
    }

    const currentUserId = this.authService.getUserId();
    const secondUserId = this.chatId;
    this.socket = io(SERVER_ENDPOINT+'/threads');

    this.registerSocketActions();
    this.performLoad(currentUserId, secondUserId);
  }

  registerSocketActions() {
    if(!this.socket) {
      return;
    }

    this.socket.on("refresh", (res: any) => {
      if(!res) {
        return;
      }

      this.currentThread = res.thread as Thread;
      this.prepareMessagesToDisplay();
    });
  }

  async performLoad(currentUserId: string, secondUserId: string) {
    if(!this.socket) {
      return;
    }

    await this.socketCallout("load", {currentUserId: currentUserId, socketId: this.socket.id, secondUserId: secondUserId});
    const thread = await this.socketCallout("messages", {currentUserId: currentUserId, secondUserId: secondUserId});
    this.currentThread = thread.thread;

    this.prepareMessagesToDisplay();
  }

  socketCallout(action: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if(!this.socket) {
        reject("SOCKET_ERROR");
      }

      try {
        this.socket?.emit(action, payload, (res: any) => {
          resolve(res);
        });
      } catch(err) {
        reject(err);
      }
    });
  }

  prepareMessagesToDisplay() {
    if(!this.currentThread) {
      return;
    }

    const currentUserId = this.authService.getUserId();
    const messages: DisplayedMessage[] = [];
    if(this.currentThread.messages) {
      this.currentThread.messages.forEach((message) => {
        messages.push({
          isAuthor: message.authorId==currentUserId,
          value: message.message,
          id: crypto.randomUUID()
        });
      });
    }

    this.displayedMessages.set(messages);
  }

  handleMessageChange(value: string) {
    this.currentMessage = value;
  }

  async handleMessageSend() {
    if(!this.currentMessage) {
      return;
    }
    this.loading = true;

    await this.socketCallout("send", {message: this.currentMessage, author: this.authService.getUserId(), secondUserId: this.chatId});
    this.currentMessage = ""; 

    this.loading = false;
  }

  handleBack() {
    this.goBack.emit();
  }
}
