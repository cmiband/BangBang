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
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private loggedIn = false;

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

    this.loggedIn = isSuccessful;
    return isSuccessful;
  }

  logout(): void {
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
