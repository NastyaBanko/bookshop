import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { User } from '../../models/userModel';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { RxUnsubscribe } from '../../classes/rx-unsubscribe';
import { takeUntil } from 'rxjs/operators';

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
export class LoginComponent extends RxUnsubscribe implements OnInit {
  savedUsers: User[];
  userPassword: string;
  loginError: string = '';

  userEmail = new FormControl('', [Validators.required, Validators.email]);
  inputType: string = 'password';

  matcher = new MyErrorStateMatcher();

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getUsers();
    }, 1000);
  }

  getUsers(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.savedUsers = data;
      });
  }

  showPassword(): void {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
  }

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
      patronymic: 'string',
      surname: user.name,
    };
    let serialObj = JSON.stringify(currentUser);
    localStorage.setItem('currentUser', serialObj);
  }

  submit(): void {
    if (!this.userEmail.value || !this.userPassword) {
      this.loginError = 'Incorrect username or password.';
      return;
    }
    let isSaved = this.savedUsers.find(
      (el) =>
        el.email === this.userEmail.value && el.password === this.userPassword
    );
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
      this.getUsers();
    } else {
      this.loginError = 'Incorrect username or password.';
      this.userService.logout();
    }
  }
}
