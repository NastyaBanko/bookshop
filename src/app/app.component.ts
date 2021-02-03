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

  constructor(private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    let currentPath = window.location.pathname.slice(1);
    let allPathes = this.router.config;
    let isAvailable = allPathes.find((el) => el.path === currentPath) || {};

    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

    if (currentUser.email) {
      if (currentUser.role === 'ADMIN') {
        this.router.navigate([isAvailable.path?'admin':"**"]);
      } else {
        this.router.navigate([
          isAvailable.path
            ? isAvailable.path === 'admin'
              ? 'user'
              : isAvailable.path
            : '**',
        ]);
      }
      this.userService.login(
        currentUser.role,
        currentUser.name,
        currentUser.email,
        currentUser.password
      );
    }
  }
}
