import { Injectable } from '@angular/core';

import { Observable, of, BehaviorSubject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  loggedIn = {
    role: '',
    isLogin: false,
    name: '',
    email: '',
    password: '',
  };

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('/shop/api/v1/customers');
  }

  addUser(user: any): Observable<any[]> {
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
