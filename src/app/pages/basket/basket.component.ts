import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { OrderviewModalComponent } from './../../components/orderview-modal/orderview-modal.component';

import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';

import * as moment from 'moment';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
})
export class BasketComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  mockCategories = [
    { value: 'card', viewValue: 'Card' },
    { value: 'cash', viewValue: 'Cash' },
  ];

  basketItems = JSON.parse(localStorage.getItem('currentBasketItems')) || [];

  contactNumber: string = '';
  deliveryAddress: string = '';
  deliveryDate = moment(new Date()).add(1, 'days').format();
  paymentType: string = this.mockCategories[0].value;
  dataError = false;

  constructor(private router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  roundNum(x, n) {
    if (isNaN(x) || isNaN(n)) return false;
    const result = (+x).toFixed(n).replace('.', ',');
    const out = result
      .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
      .split(' ')
      .join('.');
    return out;
  }

  openSnackBar(message, type) {
    this._snackBar.open(message, 'Cancel', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [type],
    });
  }

  addCount(item): void {
    let isSaved = this.basketItems.findIndex((el) => el.id === item.id);
    ++this.basketItems[isSaved].count;

    let serial = JSON.stringify(this.basketItems);
    localStorage.setItem('currentBasketItems', serial);
  }

  minusCount(item): void {
    let isSaved = this.basketItems.findIndex((el) => el.id === item.id);
    --this.basketItems[isSaved].count;
    if (this.basketItems[isSaved].count < 1)
      this.basketItems.splice(isSaved, 1);

    let serial = JSON.stringify(this.basketItems);
    localStorage.setItem('currentBasketItems', serial);

    if (this.basketItems.length < 1) this.backHome();
  }

  dateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    let isPast = moment(d).diff(new Date(), 'days');
    return isPast > 0;
  };

  getTotalPrice() {
    let prices = this.basketItems.map((el) => el.price * el.count);
    if (prices.length > 0) {
      return prices.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );
    } else return 0;
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
    const itemNames = this.basketItems.map((el) => el.title).join(', ');
    const itemsIds = [];
    this.basketItems.forEach((el) => {
      for (let i = 0; i < el.count; i++) itemsIds.push(el.id);
    });
    const dialogRef = this.dialog.open(OrderviewModalComponent, {
      width: '350px',
      data: {
        items: itemNames,
        contactNumber: this.contactNumber,
        deliveryAddress: this.deliveryAddress,
        deliveryDate: this.deliveryDate,
        paymentType: this.paymentType,
        totalPrice: this.getTotalPrice(),
        itemsIds: itemsIds,
        screen: "BASKET",
        successNotify: ()=>{
          this.openSnackBar('Success!', 'alert-success');
        },
        errorNotify: ()=>{
          this.openSnackBar('Something goes wrong!', 'alert-error')
        }

      },
    });
  }
}
