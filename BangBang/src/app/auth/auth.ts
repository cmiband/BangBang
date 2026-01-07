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

export type AccontInfo = {
  email: string;
  name: string;
  surname: string;
  country: string;
  dob: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private loggedIn = false;
  private currentUser: AccontInfo | null = null

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

    console.log(accountData)

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

  getUser(): AccontInfo {
    if(this.currentUser != null) {
      return this.currentUser
    }
    else {
      throw new Error('No data found')
    }
  }
}
