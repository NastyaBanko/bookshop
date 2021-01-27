import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  savedUsers: User[];
  userPassword: string;
  loginError: string = '';

  userEmail = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();

  currentCategories: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // this.http.get('/api/v1/categories').subscribe((data:any) => this.currentCategories=data);
    setTimeout(() => {
       this.getUsers()
      // this.getSavedUsers();
    }, 1000);
  }

  // getSavedUsers(): void {
  //   this.savedUsers = this.userService.getSavedUsers();
  // }

  getUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.savedUsers=data;
    });
  }

  // updateUser(user): void {
  //   this.userService.updateUser(user);
  // }

  createAccount(): void {
    this.router.navigate(['createAccount']);
  }

  addToLocaleStorage(user): void {
    let currentUser = {
      name: user.name,
      role: user.role,
      email: user.email,
      password: user.password,
      isLogin: true,
      age: 20,
      login: user.name,
      patronymic: "string",
      surname: user.name
    };
    let serialObj = JSON.stringify(currentUser);
    localStorage.setItem('currentUser', serialObj);
  }

  submit(): void {
    let isSaved = this.savedUsers.find(
      (el) =>
        el.email === this.userEmail.value && el.password === this.userPassword
    );
    console.log(this.savedUsers)
    console.log(isSaved)
    if (isSaved) {
      this.loginError = '';

      if (isSaved.role === 'ADMIN') {
        this.router.navigate(['admin']);
      } else this.router.navigate(['user']);
      this.addToLocaleStorage(isSaved);
      this.userService.login(
        isSaved.role,
        isSaved.name,
        isSaved.email,
        isSaved.password
      );
      this.getUsers()
    } else {
      this.loginError = 'Incorrect username or password.';
      this.userService.logout();
    }
  }
}
