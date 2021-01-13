import { Component, OnInit } from '@angular/core';

import {MatDialog} from '@angular/material/dialog';

import { UserService } from '../../user.service';
import {Router} from '@angular/router';
import { HttpClient} from '@angular/common/http';

import {AskModalComponent} from './../../components/ask-modal/ask-modal.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  currentUser: any;

  constructor(private userService: UserService, private router: Router, private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCurrentUser()
  }

  getCurrentUser(): void {
    this.currentUser = this.userService.getCurrentUser()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AskModalComponent, {
      width: '250px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
