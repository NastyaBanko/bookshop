import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { HttpService } from '../../services/http.service';

import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { OrderviewModalComponent } from './../../components/orderview-modal/orderview-modal.component';

import { Router } from '@angular/router';

import { RxUnsubscribe } from '../../classes/rx-unsubscribe';
import { takeUntil } from 'rxjs/operators';

import * as moment from 'moment';

import { LoggedUser } from '../../models/loggedUserModel';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
})
export class BasketComponent extends RxUnsubscribe implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  loading: boolean = false;

  mockCategories = [
    { value: 'card', viewValue: 'Card' },
    { value: 'cash', viewValue: 'Cash' },
  ];

  contactNumber: string = '';
  deliveryAddress: string = '';
  deliveryDate = moment(new Date()).add(1, 'days').format();
  paymentType: string = this.mockCategories[0].value;
  dataError = false;

  orderInProgress: any;
  currentUser: LoggedUser;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private httpService: HttpService,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.getOrders(this.currentUser.email);
  }

  getOrders(email): void {
    this.httpService
      .getOrdersByEmail(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.orderInProgress =
          data.find((el) => el.orderStatus === 'IN_PROCESS') || {};
        if (this.orderInProgress?.orderItems.length < 1) this.backHome();
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
  }

  openSnackBar(message, type) {
    this._snackBar.open(message, 'Cancel', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [type],
    });
  }

  minusCount(item): void {
    this.httpService
      .deleteOrderItemFromOrder(this.orderInProgress.id, item.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.getOrders(this.currentUser.email);
        },
        (err) => console.log(err)
      );
  }

  dateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    let isPast = moment(d).diff(new Date(), 'days');
    return isPast > 0;
  };

  getTotalPrice() {
    if (this.orderInProgress && this.orderInProgress.orderItems) {
      let prices = this.orderInProgress.orderItems.map((el) => el.price);
      if (prices.length > 0) {
        return prices.reduce(
          (accumulator, currentValue) => accumulator + currentValue
        );
      } else return 0;
    }
  }

  backHome() {
    this.router.navigate(['user']);
  }

  continueCreate() {
    if (this.contactNumber.length < 8 || this.deliveryAddress.length < 5) {
      this.dataError = true;
      return;
    } else this.openDialog();
  }

  openDialog(): void {
    let itemNames = null;
    if (this.orderInProgress) {
      itemNames = this.orderInProgress.orderItems
        .map((el) => el.title)
        .join(', ');
    }
    this.dialog.open(OrderviewModalComponent, {
      width: '350px',
      data: {
        items: itemNames || '',
        contactNumber: this.contactNumber,
        deliveryAddress: this.deliveryAddress,
        deliveryDate: this.deliveryDate,
        paymentType: this.paymentType,
        totalPrice: this.getTotalPrice(),
        screen: 'BASKET',
        order: this.orderInProgress,
        successNotify: () => {
          this.openSnackBar('Success!', 'alert-success');
        },
        errorNotify: () => {
          this.openSnackBar('Something goes wrong!', 'alert-error');
        },
      },
    });
  }
}
