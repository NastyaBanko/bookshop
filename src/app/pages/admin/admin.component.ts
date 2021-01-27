import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { UserService } from '../../user.service';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AskModalComponent } from './../../components/ask-modal/ask-modal.component';
import { UpdateOfferComponent } from './../../components/update-offer/update-offer.component';
import { DeleteOfferModalComponent } from './../../components/delete-offer-modal/delete-offer-modal.component';
import { CreateOfferModalComponent } from './../../components/create-offer-modal/create-offer-modal.component';
import { DeleteCategoryModalComponent } from './../../components/delete-category-modal/delete-category-modal.component';

import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
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

  categories = [];

  constructor(
    private userService: UserService,
    private httpService: HttpService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getCurrentCategories();
    this.getCurrentOffers();
    this.getCurrentUser();
    // this.getSavedUsers();
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.savedUsers = data;
    });
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

  getCurrentCategories() {
    this.httpService.getCategories().subscribe((data) => {
      this.categories = data;
      let categories = data.map((el) => {
        let category = {};
        category['value'] = el.category;
        category['viewValue'] = el.category;
        return category;
      });
      this.mockCategories = [{ value: 'all', viewValue: 'all' }, ...categories];
    });
  }

  getCurrentOffers() {
    this.httpService.getOffers().subscribe((data) => {
      this.mockOffers = data;
      let prices = data.map((el) => el.price);
      this.minPrice = Math.min(...prices);
      this.maxPrice = Math.max(...prices);
      this.visibleOffers = this.searchItem(
        this.filterCaregory(
          this.sortAlphabetically(this.filterPrice(data.slice()))
        )
      );
      this.loading = false;
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

  // getSavedUsers(): void {
  //   this.savedUsers = this.userService.getSavedUsers();
  // }

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
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  deleteOffer(id) {
    this.httpService.deleteOffer(id).subscribe(() => {
      console.log('delete');
      this.getCurrentOffers();
    });
  }

  deleteCategory(id) {
    this.httpService.deleteCategory(id).subscribe(() => {
      console.log('deleteCategory');
      this.getCurrentOffers();
      this.getCurrentCategories();
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(CreateOfferModalComponent, {
      width: '450px',
      data: {
        mockCategories: this.mockCategories.filter((el) => el.value !== 'all'),
        categories: this.categories,
        getOffers: () => {
          this.getCurrentOffers();
        },
        getCategories: () => {
          this.getCurrentCategories();
        },
      },
    });
  }

  openUpdateModal(offer): void {
    const dialogRef = this.dialog.open(UpdateOfferComponent, {
      width: '450px',
      data: {
        offer: offer,
        mockCategories: this.mockCategories.filter((el) => el.value !== 'all'),
        categories: this.categories,
        getOffers: () => {
          this.getCurrentOffers();
        },
        getCategories: () => {
          this.getCurrentCategories();
        },
      },
    });
  }

  openDeleteModal(id): void {
    const dialogRef = this.dialog.open(DeleteOfferModalComponent, {
      width: '350px',
      data: {
        deleteOffer: () => {
          this.deleteOffer(id);
        },
      },
    });
  }
  openDeleteCategoryModal(): void {
    const dialogRef = this.dialog.open(DeleteCategoryModalComponent, {
      width: '350px',
      data: {
        categories: this.categories,
        getOffers: () => {
          this.getCurrentOffers();
        },
        getCategories: () => {
          this.getCurrentCategories();
        },
      },
    });
  }
}
