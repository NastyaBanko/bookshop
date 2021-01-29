import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { UserService } from '../../user.service';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AskModalComponent } from './../../components/ask-modal/ask-modal.component';
import { UpdateOfferComponent } from './../../components/update-offer/update-offer.component';
import { DeleteOfferModalComponent } from './../../components/delete-offer-modal/delete-offer-modal.component';
import { CreateOfferModalComponent } from './../../components/create-offer-modal/create-offer-modal.component';
import { DeleteCategoryModalComponent } from './../../components/delete-category-modal/delete-category-modal.component';

import { RxUnsubscribe } from '../../classes/rx-unsubscribe';
import { takeUntil } from 'rxjs/operators';

import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent extends RxUnsubscribe implements OnInit {
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

  categories = [];

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
    this.getCurrentCategories();
    this.getCurrentOffers();
    this.getCurrentUser();
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
    this.httpService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.categories = data;
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

  getCurrentOffers() {
    this.httpService
      .getOffers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.mockOffers = data;
        let prices = data.map((el) => el.price);
        this.minPrice = Math.min(...prices);
        this.maxPrice = Math.max(...prices);
        this.visibleOffers = this.searchItem(
          this.filterCaregory(
            this.sortAlphabetically(this.filterPrice(data.slice()))
          )
        );
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
  }

  onChange(): void {
    this.visibleOffers = this.searchItem(
      this.filterCaregory(
        this.sortAlphabetically(this.filterPrice(this.mockOffers.slice()))
      )
    );
  }

  getCurrentUser(): void {
    this.currentUser = this.userService.getCurrentUser();
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

  openSnackBar(message, type) {
    this._snackBar.open(message, 'Cancel', {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [type],
    });
  }

  deleteOffer(id) {
    this.httpService
      .deleteOffer(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.openSnackBar('Success!', 'alert-success');
          this.getCurrentOffers();
        },
        () => this.openSnackBar('Something goes wrong!', 'alert-error')
      );
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
        successNotify: () => {
          this.openSnackBar('Success!', 'alert-success');
        },
        errorNotify: () => {
          this.openSnackBar('Something goes wrong!', 'alert-error');
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
        successNotify: () => {
          this.openSnackBar('Success!', 'alert-success');
        },
        errorNotify: () => {
          this.openSnackBar('Something goes wrong!', 'alert-error');
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
        successNotify: () => {
          this.openSnackBar('Success!', 'alert-success');
        },
        errorNotify: () => {
          this.openSnackBar('Something goes wrong!', 'alert-error');
        },
      },
    });
  }
}
