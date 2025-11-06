import { Injectable } from '@angular/core';

export interface User {
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

  private users: User[] = [
    { username: 'barti', password: 'sigma', email: 'email1', name: 'bartosz', surname: 'adamowicz', country: 'Poland', dob: '' },
    {username: '', password: '', email: '', name: '', surname: '', country: '', dob: ''}
  ];

  login(username: string, password: string): boolean {
    const foundUser = this.users.find(
      (user) => user.username === username && user.password === password
    );

    if(foundUser) {
      this.loggedIn = true;
      return true;
    }
    this.loggedIn = false
    return false
  }

  returnUsers() {
    return this.users
  }

  addUser(newUser: User): boolean {
    this.users.push(newUser);
    console.log('Dodano użytkownika:', newUser);
    return true;
  }

  logout(): void {
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
