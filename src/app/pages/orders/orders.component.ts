import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { OrderviewModalComponent } from './../../components/orderview-modal/orderview-modal.component';

import { HttpService } from '../../services/http.service';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  loading: boolean = false;
  orders = [];
  // orderItemNames: any;

  constructor(private router: Router, private httpService: HttpService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loading = true;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getOrders(currentUser.email);
  }

  getItemNames(order): string {
    return order.orderItems.map((el) => el.title).join(', ');
  }

  roundNum(x, n) {
    if (isNaN(x) || isNaN(n)) return false;
    const result = (+x).toFixed(n).replace('.', ',');
    const out = result
      .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
      .split(' ')
      .join('.');
    return out;
  }

  getTotalPrice(order) {
    let prices = order.orderItems.map((el) => el.price);
    return prices.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
  }

  getOrders(email): void {
    this.httpService.getOrdersByEmail(email).subscribe((data) => {
      let ordersInProc = JSON.parse(localStorage.getItem('currentBasketItems')) || [];
      let orderInProcess = {
        orderItems: [...ordersInProc],
        orderStatus: "IN_PROCESS",
      };
      console.log(data)
      this.orders = data;
      if(ordersInProc.length>0) this.orders.push(orderInProcess)
      this.loading = false;
    });
  }

  openDialog(order): void {
    const itemNames = this.getItemNames(order)
    const dialogRef = this.dialog.open(OrderviewModalComponent, {
      width: '350px',
      data: {
        items: itemNames,
        contactNumber: order.contactNumber,
        deliveryAddress: order.deliveryAddress,
        deliveryDate: order.deliveryDate,
        paymentType: order.paymentType,
        totalPrice: this.getTotalPrice(order),
        screen: "ORDERS",
      },
    });
  }

  openDetails(order) {
    this.openDialog(order)
  }

  backHome() {
    this.router.navigate(['user']);
  }
}
