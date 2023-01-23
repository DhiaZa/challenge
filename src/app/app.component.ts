import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './_services/auth.service';
import { User } from './_models/user.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser: User | undefined;
  connected :any;
  isLogout :boolean = false;
  constructor(
      private router: Router,
      private authenticationService: AuthService
  ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

  }
  ngOnInit() {
    this.authenticationService.currentUser.subscribe((res:any)=>
    this.connected = res.id
)
if(this.connected){
 this.isLogout = false
}

  }
  logout() {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
      this.isLogout = true
  }
  

}
