import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserService } from '../../services/user.service';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

import { AskModalComponent } from './../../components/ask-modal/ask-modal.component';

import { RxUnsubscribe } from '../../classes/rx-unsubscribe';
import { takeUntil } from 'rxjs/operators';

import {LoggedUser} from '../../models/loggedUserModel';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent extends RxUnsubscribe implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  loading: boolean = false;
  currentUser: LoggedUser;
  mockCategories = [];
  mockOffers = [];
  currentOrders: any;
  visibleOffers = [];
  orderInProgress: any = {};
  selectedCategory: string = 'all';
  minPrice: number = 0;
  maxPrice: number = 100;
  searchName: string = '';
  isAlphabetically: boolean = false;

  constructor(
    private userService: UserService,
    private httpService: HttpService,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.getCurrentUser();
    this.getCategories();
    this.getOffers();
    this.getOrders(true);
  }

  getCategories() {
    this.httpService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        let categories = data.map((el) => {
          let category = {};
          category['value'] = el.category;
          category['viewValue'] = el.category;
          return category;
        });
        this.mockCategories = [
          { value: 'all', viewValue: 'all' },
          ...categories,
        ];
      });
  }

  getOffers() {
    this.httpService
      .getOffers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.mockOffers = data;
        this.visibleOffers = this.searchItem(
          this.filterCaregory(
            this.sortAlphabetically(this.filterPrice(data.slice()))
          )
        );
        let prices = data.map((el) => el.price);
        this.minPrice = Math.min(...prices);
        this.maxPrice = Math.max(...prices);
      });
  }

  createOrder(email) {
    let newOrder = {
      offers: [],
      email: email,
    };
    this.httpService
      .createOrder(newOrder)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.orderInProgress = data;
        },
        (err) => console.log(err)
      );
  }

  getOrders(loading = false): void {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.httpService
      .getOrdersByEmail(currentUser.email)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.currentOrders = data;
        let orderInProgress =
          data.find((el) => el.orderStatus === 'IN_PROCESS') || {};
        if (loading && !orderInProgress.id) {
          this.createOrder(currentUser.email);
        } else this.orderInProgress = orderInProgress;
        setTimeout(() => {
          this.loading = false;
        }, 500);
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

  onChange(): void {
    this.visibleOffers = this.searchItem(
      this.filterCaregory(
        this.sortAlphabetically(this.filterPrice(this.mockOffers.slice()))
      )
    );
  }

  viewOrders() {
    this.router.navigate(['user/orders']);
  }

  viewBasket() {
    if (this.orderInProgress.orderItems.length < 1) return;
    this.router.navigate(['user/basket']);
  }

  getCurrentUser(): void {
    this.currentUser = this.userService.getCurrentUser();
  }

  addCount(item): void {
    this.httpService
      .addOfferToOrder(this.orderInProgress.id, item.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.openSnackBar('Order added!', 'alert-success');
          this.getOrders();
        },
        () => this.openSnackBar('Something goes wrong!', 'alert-error')
      );
  }

  filterPrice(arr) {
    return arr.filter((el) => {
      return el.price >= +this.minPrice && el.price <= +this.maxPrice;
    });
  }

  filterCaregory(arr) {
    if (this.selectedCategory === 'all') {
      return arr;
    } else
      return arr.filter((el) => el.category.category === this.selectedCategory);
  }

  searchItem(arr) {
    if (this.searchName.length > 0) {
      return arr.filter((el) =>
        el.title.toLowerCase().includes(this.searchName.toLowerCase())
      );
    } else return arr;
  }

  onChangeIsAlp(): void {
    this.isAlphabetically = true;
    this.visibleOffers = this.searchItem(
      this.filterCaregory(
        this.sortAlphabetically(this.filterPrice(this.mockOffers.slice()))
      )
    );
  }

  sortAlphabetically(arr) {
    if (this.isAlphabetically) {
      return arr.slice().sort(function (a, b) {
        let nameA = a.title.toLowerCase();
        let nameB = b.title.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    } else return arr;
  }

  resetSettings(): void {
    let prices = this.mockOffers.map((el) => el.price);
    this.selectedCategory = this.mockCategories[0].value;
    this.minPrice = Math.min(...prices);
    this.maxPrice = Math.max(...prices);
    this.searchName = '';
    this.isAlphabetically = false;
    this.visibleOffers = this.mockOffers.slice();
  }

  openDialog(): void {
    this.dialog.open(AskModalComponent, { width: '250px' });
  }
}
