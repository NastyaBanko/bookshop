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
  constructor(private userService: UserService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    let addedUsers = JSON.parse(localStorage.getItem("addedUsers")) || []
    this.getSavedUsers()
    if(currentUser.id){
      if(currentUser.type === "admin"){
        this.router.navigate(['admin']);
      } else this.router.navigate(['user']);
      this.userService.login(currentUser.type, currentUser.userName, currentUser.email, currentUser.password);
    }
    setTimeout(()=>{
      let isNew = addedUsers.find(el=>el.id===currentUser.id) || {}
      if(currentUser.id && !isNew.id){
        const updateUser = {...currentUser};
        updateUser.isLogin = true;
        this.updateUser(updateUser);
      }
      if(addedUsers){
        addedUsers.map(el=>{
          this.userService.addUser({ 
            userName: el.userName, 
            type: "user", 
            email: el.email, 
            password: el.password, 
            isLogin: isNew.id&&el.email===isNew.email?true:false } as User)
          .subscribe(user => {
            this.savedUsers.push(user);
          });
        })
        this.getSavedUsers()
      }
    }, 1000)
  }

  getSavedUsers(): void {
    this.userService.getSavedUsers()
        .subscribe(savedUsers => this.savedUsers = savedUsers);
  }

  updateUser(user): void {
    this.userService.updateUser(user).subscribe(()=>{console.log("update")})
  }
}
