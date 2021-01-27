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
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent implements OnInit {
  savedUsers: User[];
  userName: string = '';
  userPassword: string = '';
  loginError: string = '';

  userEmail = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.savedUsers = data;
    });
  }

  login(): void {
    this.router.navigate(['login']);
  }

  addAccount(): void {
    if (
      this.userName.length < 1 ||
      (this.userEmail.hasError('email') &&
        !this.userEmail.hasError('required')) ||
      this.userPassword.length < 8
    ) {
      this.loginError =
        'Check entered data. Password should be at least 8 symbols';
    } else {
      let isSaved = this.savedUsers.find(
        (el) => el.email === this.userEmail.value || el.name === this.userName
      );
      if (isSaved) {
        this.loginError = 'A user with the same email or name already exists';
      } else {
        this.loginError = '';
        this.userService
          .addUser({
            name: this.userName,
            login: this.userName,
            surname: this.userName,
            patronymic: this.userName,
            age: 100,
            role: 'USER',
            email: this.userEmail.value,
            password: this.userPassword,
          })
          .subscribe(() => {
            console.log('add user');
          });
        this.router.navigate(['login']);
      }
    }
  }
}
