import { Component } from '@angular/core';

import { UserService } from './user.service';
import { User } from './user';
import {Router} from '@angular/router';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hw7-login';
  savedUsers: any;
  currentCategories: any;
  test: any;
  
  constructor(private userService: UserService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUsers();
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    if(currentUser.email){
      if(currentUser.role === "ADMIN"){
        this.router.navigate(['admin']);
      } else this.router.navigate(['user']);
      this.userService.login(currentUser.role, currentUser.name, currentUser.email, currentUser.password);
    }
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.savedUsers=data;
    });
  }

}
