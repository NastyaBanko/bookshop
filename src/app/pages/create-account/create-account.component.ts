import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { User } from '../../user';
import { UserService } from '../../user.service';
import {Router} from '@angular/router';
import { HttpClient} from '@angular/common/http';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  savedUsers: User[];
  userName: string = "";
  userPassword: string = "";
  loginError: string = "";

  userEmail = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private userService: UserService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.getSavedUsers();
  }

  getSavedUsers(): void {
    this.savedUsers = this.userService.getSavedUsers()
  }

  login(): void {
    this.router.navigate(['login']);
  }

  addAllToLocaleHost(user): void {
    let currentUser = {
      id: user.id,
      userName: user.userName,
      type: user.type,
      email: user.email,
      password: user.password,
      isLogin: false,
    }
    let addedUsers = JSON.parse(localStorage.getItem("addedUsers")) || []
    addedUsers.push(currentUser)
    let serialObj = JSON.stringify(addedUsers);
    localStorage.setItem("addedUsers", serialObj);
  }

  addAccount(): void {
    if(this.userName.length<1||(this.userEmail.hasError('email') && !this.userEmail.hasError('required'))||this.userPassword.length<1){
      this.loginError = "Check entered data.";
    } else {
      let isSaved = this.savedUsers.find(el=>el.email===this.userEmail.value||el.userName===this.userName)
      if(isSaved){
        this.loginError = "A user with the same email or name already exists";
      } else {
        this.loginError = "";
        this.savedUsers.push(this.userService.addUser({ userName: this.userName, type: "user", email: this.userEmail.value, password: this.userPassword, isLogin: false } as User))
        this.router.navigate(['login']);
      }
    }
    setTimeout(() => {
      let isSaved = this.savedUsers.find(el=>el.email===this.userEmail.value||el.userName===this.userName)
      this.addAllToLocaleHost(isSaved)
    }, 1000);
  }
}
