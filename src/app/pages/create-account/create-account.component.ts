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

import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

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
export class CreateAccountComponent extends RxUnsubscribe implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  savedUsers: User[];
  userName: string = '';
  userPassword: string = '';
  loginError: string = '';

  userEmail = new FormControl('', [Validators.required, Validators.email]);
  inputType: string = 'password';

  matcher = new MyErrorStateMatcher();

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.savedUsers = data;
      });
  }

  openSnackBar(message, type) {
    this._snackBar.open(message, 'Cancel', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [type],
    });
  }

  showPassword(): void {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
  }

  login(): void {
    this.router.navigate(['login']);
  }

  validate(userName, userEmail, password) {
    let errors = [];
    if (
      userName.length < 1 ||
      (userEmail.hasError('email') && !userEmail.hasError('required')) ||
      password.length < 1
    ) {
      errors.push('Check entered data.');
      this.loginError = errors.join('\n');
      return;
    }
    if (password.length < 8) {
      errors.push('Your password must be at least 8 characters.');
    }
    if (password.search(/[a-z]/i) < 0) {
      errors.push('Your password must contain at least one small letter.');
    }
    if (password.search(/[0-9]/) < 0) {
      errors.push('Your password must contain at least one digit.');
    }
    if (password.search(/[!@#$%^&*]/) < 0) {
      errors.push('Your password must contain at least one symbol.');
    }
    if (password.search(/[A-Z]/) < 0) {
      errors.push('Your password must contain at least one big letter.');
    }
    if (errors.length > 0) {
      this.loginError = errors.join('\n');
      return false;
    }
    this.loginError = '';
    return true;
  }

  addAccount(): void {
    if (!this.validate(this.userName, this.userEmail, this.userPassword)) {
      return;
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
          .subscribe(
            () => {
              this.openSnackBar('Success!', 'alert-success');
            },
            () => this.openSnackBar('Something goes wrong!', 'alert-error')
          );
        this.router.navigate(['login']);
      }
    }
  }
}
