import { Injectable } from '@angular/core';

import { Observable, of, BehaviorSubject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoggedUser } from '../models/loggedUserModel';
import { User } from '../models/userModel';

@Injectable({ providedIn: 'root' })
export class UserService {
  loggedIn: LoggedUser = {
    age: 100,
    email: '',
    isLogin: false,
    login: '',
    name: '',
    password: '',
    patronymic: '',
    role: '',
    surname: '',
  };

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('/shop/api/v1/customers');
  }

  addUser(user: User): Observable<any[]> {
    return this.http.post<any[]>('/shop/api/v1/customers', user);
  }

  getCurrentUser() {
    return this.loggedIn;
  }

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.loggedIn);
      }, 800);
    });
    return promise;
  }

  login(role, name, email, password) {
    this.loggedIn.role = role;
    this.loggedIn.name = name;
    this.loggedIn.email = email;
    this.loggedIn.password = password;
    this.loggedIn.isLogin = true;
  }

  logout() {
    this.loggedIn.role = '';
    this.loggedIn.name = '';
    this.loggedIn.email = '';
    this.loggedIn.password = '';
    this.loggedIn.isLogin = false;
  }
}
