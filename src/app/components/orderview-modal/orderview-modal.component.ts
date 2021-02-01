import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
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

  loadingAddress = false;
  loadingNumber = false;
  loadingPaymentType = false;

  onNoClick(): void {
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
      .subscribe(
        () => {
          if (
            !this.loadingAddress &&
            !this.loadingNumber &&
            !this.loadingPaymentType
          ) {
            this.data.successNotify();
            console.log('change statussss');
            this.dialogRef.close();
            this.router.navigate(['user']);
          }
        },
        () => this.data.errorNotify()
      );
  }

  changeOrderDeliveryAddress(id, address) {
    this.httpService
      .changeDeliveryAddress(id, address)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadingAddress = false;
        console.log('change address');
      });
  }

  changeContactNumber(id, number) {
    this.httpService
      .changeContactNumber(id, number)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadingNumber = false;
        console.log('change number');
      });
  }

  changePaymentType(id, payment) {
    this.httpService
      .changePaymentType(id, payment)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadingPaymentType = false;
        console.log('change type');
      });
  }

  onConfirm(): void {
    this.loadingAddress = true;
    this.loadingNumber = true;
    this.loadingPaymentType = this.data.paymentType === 'card' ? true : false;

    this.changeOrderDeliveryAddress(
      this.data.order.id,
      this.data.deliveryAddress
    );
    this.changeContactNumber(this.data.order.id, this.data.contactNumber);
    if (this.data.paymentType === 'card') {
      this.changePaymentType(this.data.order.id, 'CREDIT_CARD');
    }
    this.changeOrderStatus(this.data.order.id, 'CONFIRMED');
  }

  ngOnInit(): void {}
}
