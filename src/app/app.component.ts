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
    this.http.get('https://www.breakingbadapi.com/api/characters/8').subscribe((data:any) => this.test=data);
    // this.http.get('/catalog/api/v1/categories').subscribe((data:any) => this.currentCategories=data);
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
          this.savedUsers.push(
            this.userService.addUser({ 
              userName: el.userName, 
              type: "user", 
              email: el.email, 
              password: el.password, 
              isLogin: isNew.id&&el.email===isNew.email?true:false } as User)
          )
        })
        this.getSavedUsers()
      }
    }, 1000)
  }

  getSavedUsers(): void {
    this.savedUsers = this.userService.getSavedUsers()
  }

  updateUser(user): void {
    this.userService.updateUser(user)
  }
}
