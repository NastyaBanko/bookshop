import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserService } from '../../user.service';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AskModalComponent } from './../../components/ask-modal/ask-modal.component';

import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { cloneDeep } from "lodash";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  currentUser: any;
  currentCategories: any;
  savedUsers: any;

  mockCategories = [
    { value: 'all', viewValue: 'All' },
    { value: 'detective', viewValue: 'Detective' },
    { value: 'documentary', viewValue: 'Documentary' },
    { value: 'romance', viewValue: 'Romance' },
    { value: 'adventure', viewValue: 'Adventure' },
  ];

  mockOffers = [
    {
      id: 1,
      category: 'detective',
      // count: 0,
      name: 'Morning',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      price: 10,
    },
    {
      id: 2,
      category: 'documentary',
      // count: 0,
      name: 'Monday',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      price: 15,
    },
    {
      id: 3,
      category: 'documentary',
      // count: 0,
      name: 'Aomine',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      price: 13,
    },
    {
      id: 4,
      category: 'documentary',
      // count: 0,
      name: 'klgnwrkl',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      price: 13,
    },
    {
      id: 5,
      category: 'adventure',
      // count: 0,
      name: 'klgnwrkl',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      price: 13,
    },
    {
      id: 6,
      category: 'adventure',
      // count: 0,
      name: 'klgnwrkl',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      price: 13,
    },
  ];

  selectedCategory: string = this.mockCategories[0].value;
  minPrice: number = 0;
  maxPrice: number = 100;
  searchName: string = '';
  isAlphabetically = false;

  basketItems = [];

  visibleOffers = this.searchItem(
    this.filterCaregory(
      this.sortAlphabetically(this.filterPrice(this.mockOffers.slice()))
    )
  );

  faShoppingCart = faShoppingCart;

  constructor(
    private userService: UserService,
    private httpService: HttpService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.httpService
      .getCategories()
      .subscribe((data) => (this.currentCategories = data));
    setTimeout(() => {
      console.log(this.currentCategories, 'currentCategories');
    }, 1000);
    this.getCurrentUser();
    this.getSavedUsers();
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
    if(this.basketItems.length<1) return
    this.router.navigate(['user/basket']);
  }

  getSavedUsers(): void {
    this.savedUsers = this.userService.getSavedUsers();
  }

  getCurrentUser(): void {
    this.currentUser = this.userService.getCurrentUser();
  }

  findCurrentCount(item){
    let savedItem = this.basketItems.find(el=>el.id===item.id) || {}
    if(savedItem.id){
      return savedItem.count
    } else return 0
  }

  addCount(item): void {
    let isSaved = this.basketItems.findIndex(el=>el.id===item.id)
    let newItem = cloneDeep(item)
    newItem.count = 1
    if(isSaved<0){
      this.basketItems.push(newItem);
    } else ++this.basketItems[isSaved].count

    console.log(this.basketItems)
  }

  minusCount(item): void {
    let savedItem = this.basketItems.find(el=>el.id===item.id) || {}
    let isSaved = this.basketItems.findIndex(el=>el.id===item.id)
    let newItem = cloneDeep(item)
    newItem.count = 1
    if(!savedItem.id || savedItem.count < 1){
      return
    } else {
      --this.basketItems[isSaved].count;
      if(this.basketItems[isSaved].count<1) this.basketItems.splice(isSaved, 1);
    }

    console.log(this.basketItems)
  }

  filterPrice(arr) {
    return arr.filter((el) => {
      return el.price >= +this.minPrice && el.price <= +this.maxPrice;
    });
  }

  filterCaregory(arr) {
    if (this.selectedCategory === 'all') {
      return arr;
    } else return arr.filter((el) => el.category === this.selectedCategory);
  }

  searchItem(arr) {
    if (this.searchName.length > 0) {
      return arr.filter((el) =>
        el.name.toLowerCase().includes(this.searchName.toLowerCase())
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
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    } else return arr;
  }

  resetSettings(): void {
    this.selectedCategory = this.mockCategories[0].value;
    this.minPrice = 0;
    this.maxPrice = 100;
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
