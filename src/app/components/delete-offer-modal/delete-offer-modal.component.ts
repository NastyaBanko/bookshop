import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UserService } from '../../user.service';

export interface DialogData {
  info: string;
}

@Component({
  selector: 'app-delete-offer-modal',
  templateUrl: './delete-offer-modal.component.html',
  styleUrls: ['./delete-offer-modal.component.css']
})
export class DeleteOfferModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteOfferModalComponent>,
    private userService: UserService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete(){
    this.data.deleteOffer()
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}

