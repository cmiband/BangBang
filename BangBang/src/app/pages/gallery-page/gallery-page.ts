import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Auth } from '../../auth/auth';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-gallery-page',
  imports: [FormsModule, RouterLink, NgFor, NgIf],
  templateUrl: './gallery-page.html',
  styleUrl: './gallery-page.css'
})
export class GalleryPage {
  showSuccess: boolean = false;
  images = [
    {id: 0, src: "images/defaultAvatar.png"},
    {id: 1, src: "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=808&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {id: 2, src: "https://plus.unsplash.com/premium_vector-1719858611039-66c134efa74d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {id: 3, src: "https://plus.unsplash.com/premium_vector-1716905507876-7aa3de5e47bd?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {id: 4, src: "https://plus.unsplash.com/premium_vector-1720780254021-ccda53a85169?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
  ]
  constructor(private authService: Auth) {}

  async onSubmit(numer: number) {   
    let url = ''
    if(numer === 0) {
      url = ''
    }
    else {
      url = this.images[numer].src
    }
    const check = this.authService.updateUserAvatr(url)
    console.log(check)
    if(await check === true) {
      this.showSuccess = true
      setTimeout(() => (this.showSuccess = false), 1000);
    }
  }

  closeAlert() {
    this.showSuccess = false;
  }
}
