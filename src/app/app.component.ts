import { Component } from '@angular/core';

import { UserService } from './services/user.service';
import { Router } from '@angular/router';

import { RxUnsubscribe } from './classes/rx-unsubscribe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends RxUnsubscribe {
  title = 'hw7-login';

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (currentUser.email) {
      if (currentUser.role === 'ADMIN') {
        this.router.navigate(['admin']);
      } else this.router.navigate(['user']);
      this.userService.login(
        currentUser.role,
        currentUser.name,
        currentUser.email,
        currentUser.password
      );
    }
  }
}
