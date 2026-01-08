import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Auth } from '../../auth/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gallery-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './gallery-page.html',
  styleUrl: './gallery-page.css'
})
export class GalleryPage {
  url = ''

  constructor(private authService: Auth) {}

  onSubmit() {
    console.log("dziala")
    if(this.url === '') {
      return
    }
    const check = this.authService.updateUserAvatr(this.url)
    console.log(check)
  }
}
