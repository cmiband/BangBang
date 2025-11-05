import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password: string;
  email: string
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private loggedIn = false;

  private users: User[] = [
    { username: 'barti', password: 'sigma', email: '' },
    {username: '', password: '', email: ''}
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
