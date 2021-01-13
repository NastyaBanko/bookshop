import { Injectable } from '@angular/core';

import { Observable, of, BehaviorSubject } from 'rxjs';

import { User } from './user';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {

  private usersUrl = 'api/users/';  // URL to web api
  loggedIn = {type: "", isLogin: false, userName: "", email: "", password: ""};

  constructor(private http: HttpClient) { }

  private usersSubject = new BehaviorSubject(this.http.get<User[]>(this.usersUrl))

    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error(error); 
        return of(result as T);
      };
    }

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    getSavedUsers(): Observable<User[]> {
      return this.usersSubject.getValue()
        .pipe(
          catchError(this.handleError<User[]>('getSavedUsers', []))
        );
    }

    addUser(user: User): Observable<any> {
      return this.http.post(this.usersUrl, user, this.httpOptions).pipe(
        catchError(this.handleError<any>('addUser'))
      );
    }

    updateUser(user: User): Observable<any> {
      return this.http.put(this.usersUrl, user, this.httpOptions).pipe(
        catchError(this.handleError<any>('updateUser'))
      );
    }

    getCurrentUser() {
      return this.loggedIn;
    }

    isAuthenticated() {
      const promise = new Promise(
        (resolve, reject) => {
          setTimeout(
            () => {
              resolve(this.loggedIn);
            },
            800
          );
        }
      );
      return promise;
    }

    login(type, userName, email, password) {
      this.loggedIn.type = type;
      this.loggedIn.userName = userName;
      this.loggedIn.email = email;
      this.loggedIn.password = password;
      this.loggedIn.isLogin = true;
    }

    logout() {
      this.loggedIn.type = "";
      this.loggedIn.userName = "";
      this.loggedIn.email = "";
      this.loggedIn.password = "";
      this.loggedIn.isLogin = false;
    }
}
