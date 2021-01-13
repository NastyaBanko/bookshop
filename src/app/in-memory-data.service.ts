import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users = [
      {id: 1, type: "admin", userName: "Yagami", email: "yagami@gmail.com", password: "yagami", isLogin: false},
      {id: 2, type: "admin", userName: "Loylet", email: "loylet@gmail.com", password: "loylet", isLogin: false},
      {id: 3, type: "user", userName: "Katya", email: "katya@gmail.com", password: "katya", isLogin: false},
    ];
    return {users};
  }
}
