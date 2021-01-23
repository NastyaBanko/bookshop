import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders = [];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  openDetails() {
    console.log('details');
  }

  backHome() {
    this.router.navigate(['user']);
  }
}
