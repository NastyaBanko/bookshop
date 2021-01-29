import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserService } from '../../user.service';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AskModalComponent } from './../../components/ask-modal/ask-modal.component';

import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { cloneDeep } from 'lodash';

import { RxUnsubscribe } from '../../classes/rx-unsubscribe';
import { takeUntil } from 'rxjs/operators';

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
  currentUser: any;
  currentCategories: any;
  savedUsers: any;

  mockCategories = [];

  mockOffers = [];

  visibleOffers = [];

  selectedCategory: string = 'all';
  minPrice: number = 0;
  maxPrice: number = 100;
  searchName: string = '';
  isAlphabetically = false;

  basketItems = JSON.parse(localStorage.getItem('currentBasketItems')) || [];

  faShoppingCart = faShoppingCart;

  constructor(
    private userService: UserService,
    private httpService: HttpService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
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
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    this.getCurrentUser();
    this.getUsers();
  }

  roundNum(x, n) {
    if (isNaN(x) || isNaN(n)) return false;
    const result = (+x).toFixed(n).replace('.', ',');
    const out = result
      .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
      .split(' ')
      .join('.');
    return out;
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
    if (this.basketItems.length < 1) return;
    this.router.navigate(['user/basket']);
  }

  getUsers(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.savedUsers = data;
      });
  }

  getCurrentUser(): void {
    this.currentUser = this.userService.getCurrentUser();
  }

  findCurrentCount(item) {
    let savedItem = this.basketItems.find((el) => el.id === item.id) || {};
    if (savedItem.id) {
      return savedItem.count;
    } else return 0;
  }

  addCount(item): void {
    let isSaved = this.basketItems.findIndex((el) => el.id === item.id);
    let newItem = cloneDeep(item);
    newItem.count = 1;
    if (isSaved < 0) {
      this.basketItems.push(newItem);
    } else ++this.basketItems[isSaved].count;

    let serial = JSON.stringify(this.basketItems);
    localStorage.setItem('currentBasketItems', serial);
  }

  minusCount(item): void {
    let savedItem = this.basketItems.find((el) => el.id === item.id) || {};
    let isSaved = this.basketItems.findIndex((el) => el.id === item.id);
    let newItem = cloneDeep(item);
    newItem.count = 1;
    if (!savedItem.id || savedItem.count < 1) {
      return;
    } else {
      --this.basketItems[isSaved].count;
      if (this.basketItems[isSaved].count < 1)
        this.basketItems.splice(isSaved, 1);
    }

    let serial = JSON.stringify(this.basketItems);
    localStorage.setItem('currentBasketItems', serial);
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
    const dialogRef = this.dialog.open(AskModalComponent, {
      width: '250px',
      // data: {name: this.name, animal: this.animal}
    });
  }
}
