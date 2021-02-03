import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-wrong-path-page',
  templateUrl: './wrong-path-page.component.html',
  styleUrls: ['./wrong-path-page.component.css'],
})
export class WrongPathPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  backHome() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (currentUser.email) {
      if (currentUser.role === 'ADMIN') {
        this.router.navigate(['admin']);
      } else {
        this.router.navigate(['user']);
      }
    } else this.router.navigate(['login']);
  }
}
