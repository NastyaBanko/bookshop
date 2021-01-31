import { Component } from '@angular/core';

import { UserService } from './services/user.service';
import { HttpService } from './services/http.service';
import { User } from './user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { RxUnsubscribe } from './classes/rx-unsubscribe';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends RxUnsubscribe {
  title = 'hw7-login';
  savedUsers: any;
  currentCategories: any;
  test: any;

  constructor(
    private userService: UserService,
    private httpService: HttpService,
    private router: Router,
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit(): void {
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (currentUser.email) {
      if (currentUser.role === 'ADMIN') {
        this.router.navigate(['admin']);
      } else this.router.navigate(['user']);
      this.userService.login(
        currentUser.role,
        currentUser.name,
        currentUser.email,
        currentUser.password
      );
      if (currentUser.role === 'USER') {
        // this.getOrders(currentUser.email);
      }
    }
  }

  // createOrder(email) {
  //   let newOrder = {
  //     offers: [],
  //     email: email,
  //   };
  //   this.httpService
  //     .createOrder(newOrder)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(
  //       (data) => {
  //         console.log(data, 'newOrder');
  //       },
  //       (err) => console.log(err)
  //     );
  // }

  // getOrders(email): void {
  //   this.httpService
  //     .getOrdersByEmail(email)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((data) => {
  //       console.log(data, 'ORDERS');
  //       let orderInProgress =
  //         data.find((el) => el.orderStatus === 'IN_PROCESS') || {};
  //       console.log(orderInProgress, 'orderInProgress');
  //       if (!orderInProgress.id) this.createOrder(email);
  //     });
  // }
}
