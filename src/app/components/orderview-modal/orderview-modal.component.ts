import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UserService } from '../../user.service';

import * as moment from 'moment';

export interface DialogData {
  info: string;
}

@Component({
  selector: 'app-orderview-modal',
  templateUrl: './orderview-modal.component.html',
  styleUrls: ['./orderview-modal.component.css'],
})
export class OrderviewModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<OrderviewModalComponent>,
    private userService: UserService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  deliveryDate = moment(this.data.deliveryDate).format('L');

  onNoClick(): void {
    console.log('stay');
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close();
    localStorage.removeItem('currentBasketItems');
    this.router.navigate(['user']);
  }

  ngOnInit(): void {}
}
