import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserService } from '../../user.service';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AskModalComponent } from './../../components/ask-modal/ask-modal.component';

import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  loading: boolean = false;
  currentUser: any;
  currentCategories: any;
  savedUsers: any;

  mockCategories = [];

  mockOffers = [];

  visibleOffers=[];

  selectedCategory: string = "all";
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
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.httpService
      .getCategories()
      .subscribe((data) => {
        let categories = data.map((el) => {
          let category = {}
          category["value"] = el.category;
          category["viewValue"] = el.category;
          return category;
        });
        this.mockCategories = [{ value: 'all', viewValue: 'all' }, ...categories]
      });
      
    this.httpService
      .getOffers()
      .subscribe((data) => {
        this.mockOffers = data
        this.visibleOffers = this.searchItem(
          this.filterCaregory(
            this.sortAlphabetically(this.filterPrice(data.slice()))
          )
        )
        let prices = data.map(el=>el.price)
        this.minPrice = Math.min(...prices);
        this.maxPrice = Math.max(...prices);
        this.loading = false;
      });
    // setTimeout(() => {
    //   console.log(this.currentCategories, 'currentCategories');
    //   console.log(this.mockOffers, "mockOffers")
    //   // console.log(this.createOrder, 'createOrder');
    // }, 1000);
    this.getCurrentUser();
    this.getSavedUsers();
  }

  // visibleOffers = this.searchItem(
  //   this.filterCaregory(
  //     this.sortAlphabetically(this.filterPrice(this.mockOffers.slice()))
  //   )
  // );

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

  getSavedUsers(): void {
    this.savedUsers = this.userService.getSavedUsers();
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
    } else return arr.filter((el) => el.category.category === this.selectedCategory);
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
    let prices = this.mockOffers.map(el=>el.price)
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

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
