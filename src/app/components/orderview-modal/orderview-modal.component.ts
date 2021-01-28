import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UserService } from '../../user.service';
import { HttpService } from '../../services/http.service';

import { RxUnsubscribe } from '../../classes/rx-unsubscribe';
import { takeUntil } from 'rxjs/operators';

import * as moment from 'moment';

export interface DialogData {
  info: string;
}

@Component({
  selector: 'app-orderview-modal',
  templateUrl: './orderview-modal.component.html',
  styleUrls: ['./orderview-modal.component.css'],
})
export class OrderviewModalComponent extends RxUnsubscribe implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<OrderviewModalComponent>,
    private userService: UserService,
    private router: Router,
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  deliveryDate = moment(this.data.deliveryDate).format('L');

  onNoClick(): void {
    console.log('stay');
    this.dialogRef.close();
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

  changeOrderStatus(id, status) {
    this.httpService
      .changeOrderStatus(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('change status');
      });
  }

  onConfirm(): void {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let newOrder = {
      offers: [...this.data.itemsIds],
      email: currentUser.email,
      deliveryAddress: this.data.deliveryAddress,
      contactNumber: this.data.contactNumber,
      paymentType: this.data.paymentType === 'card' ? 'CREDIT_CARD' : 'CASH',
      timeStamp: moment(this.data.deliveryDate).format(),
    };
    this.httpService
      .createOrder(newOrder)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.changeOrderStatus(data.id, 'CONFIRMED');
        this.dialogRef.close();
        localStorage.removeItem('currentBasketItems');
        this.router.navigate(['user']);
      });
  }

  ngOnInit(): void {}
}
