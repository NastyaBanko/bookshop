import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders = [];

  constructor(private router: Router, private httpService: HttpService,) {}

  ngOnInit(): void {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    this.getOrders(currentUser.email)
  }

  getOrders(email): void{
    this.httpService
      .getOrdersByEmail(email)
      .subscribe((data) => {
        console.log(data, "ORDERS")
        console.log("get orders")
    });
  }

  openDetails() {
    console.log('details');
  }

  backHome() {
    this.router.navigate(['user']);
  }
}
