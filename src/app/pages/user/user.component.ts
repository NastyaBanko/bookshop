import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import { UserService } from '../../user.service';
import {Router} from '@angular/router';
import { HttpClient} from '@angular/common/http';

import {AskModalComponent} from './../../components/ask-modal/ask-modal.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  currentUser: any;
  currentCategories: any;
  savedUsers: any;

  constructor(private userService: UserService, private router: Router, private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.http.get('/api/v1/categories').subscribe((data:any) => this.currentCategories=data);
    this.getCurrentUser()
    this.getSavedUsers()
  }

  getSavedUsers(): void {
    this.userService.getSavedUsers()
        .subscribe(savedUsers => this.savedUsers = savedUsers);
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
