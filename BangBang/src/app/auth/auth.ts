import { Injectable } from '@angular/core';
import { SERVER_ENDPOINT } from '../constants/constants';

export type User = {
  id: string,
  username: string;
  password: string;
  email: string
  name : string
  surname: string
  country: string
  dob: string
  city: string
  avatar: string
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private loggedIn = false;
  private currentUser: User | null = null

  async login(username: string, password: string): Promise<boolean> {
    let isSuccessful = false;
    await fetch(SERVER_ENDPOINT+'/users/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then((res) => res.json()).then((data) => {
      isSuccessful = data.successful;
    }); 

    if(!isSuccessful) {
      this.currentUser = null;
      return false;
    }
    const qs = new URLSearchParams({ username, password }).toString();
    const accountRes = await fetch(`${SERVER_ENDPOINT}/users/getUser?${qs}`, {})
    const accountData = await accountRes.json();


    if(!accountData.successful) {
      this.currentUser = null;
      return false;
    }
    this.currentUser = accountData.user

    this.loggedIn = isSuccessful;
    return isSuccessful;
  }

  logout(): void {
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUser(): User {
    if(this.currentUser != null) {
      return this.currentUser
    }
    else {
      throw new Error('No data found')
    }
  }
  async updateUserInfo() {
    if(this.currentUser?.password != null && this.currentUser.username != null) {
      const username = this.currentUser.username
      const password = this.currentUser.password
      const qs = new URLSearchParams({ username , password }).toString();
      const accountRes = await fetch(`${SERVER_ENDPOINT}/users/getUser?${qs}`, {})
      const accountData = await accountRes.json();
      if(!accountData.successful) {
        this.currentUser = null;
      }
      this.currentUser = accountData.user
    }
  }

  async updateUserAvatr(url: string): Promise<Boolean> {
    let result: boolean = false
    await fetch(SERVER_ENDPOINT+'/users/updateUserAvatar', {
        method: "PUT",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          email: this.currentUser?.email,
          password: this.currentUser?.password,
          username: this.currentUser?.username,
          url: url
        })
      }).then((res) => res.json()).then((data) => {
      result = data.successful;
      });
    if(result) {
      this.updateUserInfo()
      return true
    }
    return false
  }
}
