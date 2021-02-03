import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { OrderviewModalComponent } from './../../components/orderview-modal/orderview-modal.component';

import { HttpService } from '../../services/http.service';

import { MatDialog } from '@angular/material/dialog';

import { RxUnsubscribe } from '../../classes/rx-unsubscribe';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent extends RxUnsubscribe implements OnInit {
  loading: boolean = false;
  orders = [];

  constructor(
    private router: Router,
    private httpService: HttpService,
    public dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getOrders(currentUser.email);
  }

  getItemNames(order): string {
    if (order.orderItems.length > 0) {
      return order.orderItems.map((el) => el.title).join(', ');
    } else return 'unknown';
  }

  getTotalPrice(order) {
    if (order.orderItems.length > 0) {
      let prices = order.orderItems.map((el) => el.price);
      return prices.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );
    } else return 0;
  }

  getOrders(email): void {
    this.httpService
      .getOrdersByEmail(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.orders = data;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
  }

  openDialog(order): void {
    const itemNames = this.getItemNames(order);
    const dialogRef = this.dialog.open(OrderviewModalComponent, {
      width: '350px',
      data: {
        items: itemNames,
        contactNumber: order.contactNumber,
        deliveryAddress: order.deliveryAddress,
        deliveryDate: order.deliveryDate,
        paymentType: order.paymentType,
        totalPrice: this.getTotalPrice(order),
        screen: 'ORDERS',
      },
    });
  }

  openDetails(order) {
    this.openDialog(order);
  }

  backHome() {
    this.router.navigate(['user']);
  }
}
