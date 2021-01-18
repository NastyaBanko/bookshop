import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from '@angular/router';

import { UserService } from '../../user.service';

export interface DialogData {
  info: string;
}

@Component({
  selector: 'app-ask-modal',
  templateUrl: './ask-modal.component.html',
  styleUrls: ['./ask-modal.component.css']
})
export class AskModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AskModalComponent>,
    private userService: UserService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    console.log("stay")
    this.dialogRef.close();
  }

  updateUser(user): void {
    this.userService.updateUser(user)
  }

  cleanLocaleStorage(): void {
    let currentUser = {
      id: null,
      userName: "",
      type: "",
      email: "",
      password: "",
      isLogin: false,
    }
    let serialObj = JSON.stringify(currentUser);
    localStorage.setItem("currentUser", serialObj);
  }

  onLogOut(): void{
    console.log("log out")
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const updateUser = {
      id: currentUser.id,
      userName: currentUser.userName,
      type: currentUser.type,
      email: currentUser.email,
      password: currentUser.password,
      isLogin: false,
    }
    this.dialogRef.close();
    this.updateUser(updateUser)
    this.userService.logout()
    this.cleanLocaleStorage()
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
  }

}
