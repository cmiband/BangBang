import { Component } from '@angular/core';
import { SERVER_ENDPOINT } from '../../constants/constants';

@Component({
  selector: 'app-user-list-test',
  imports: [],
  templateUrl: './user-list-test.html',
  styleUrl: './user-list-test.css'
})
export class UserListTest {

  private usersData = this.getUsersList()

  async getUsersList(){
    const usersRes = await fetch(SERVER_ENDPOINT+'/users/getAllUsers', {})
    const usersData = await usersRes.json();
    console.log(usersData)
    return usersData
  }
}
