import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

export interface DialogData {
  info: string;
}

@Component({
  selector: 'app-ask-modal',
  templateUrl: './ask-modal.component.html',
  styleUrls: ['./ask-modal.component.css'],
})
export class AskModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AskModalComponent>,
    private userService: UserService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  // updateUser(user): void {
  //   this.userService.updateUser(user);
  // }

  cleanLocaleStorage(): void {
    let currentUser = {
      name: "",
      role: "",
      email:"",
      password: "",
      isLogin: false,
      age: 100,
      login: "",
      patronymic: 'string',
      surname: "",
    };
    let serialObj = JSON.stringify(currentUser);
    localStorage.setItem('currentUser', serialObj);
    localStorage.removeItem('currentBasketItems');
  }

  onLogOut(): void {
    this.dialogRef.close();
    this.userService.logout();
    this.cleanLocaleStorage();
    this.router.navigate(['login']);
  }

  ngOnInit(): void {}
}
