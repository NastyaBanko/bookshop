import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import { UserService } from '../../user.service';
import { HttpService } from '../../services/http.service';
import {Router} from '@angular/router';
import { HttpClient} from '@angular/common/http';

import {AskModalComponent} from './../../components/ask-modal/ask-modal.component';

import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  currentUser: any;
  currentCategories: any;
  savedUsers: any;

  mockCategories = [
    {value: 'all', viewValue: 'All'},
    {value: 'detective', viewValue: 'Detective'},
    {value: 'documentary', viewValue: 'Documentary'},
    {value: 'romance', viewValue: 'Romance'},
    {value: 'adventure', viewValue: 'Adventure'},
  ];

  mockOffers = [
    {id: 1, category:"detective", count: 0, name: "Morning", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", price: "10"},
    {id: 2, category:"documentary", count: 0, name: "Monday", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", price: "15"},
    {id: 3, category:"documentary", count: 0, name: "Aomine", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", price: "13"},
    {id: 4, category:"documentary", count: 0, name: "klgnwrkl", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", price: "13"},
    {id: 5, category:"adventure", count: 0, name: "klgnwrkl", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", price: "13"},
    {id: 6, category:"adventure", count: 0, name: "klgnwrkl", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", price: "13"},
  ];

  selectedCategory: string = this.mockCategories[0].value;
  minPrice: string = "";
  maxPrice: string = "";
  searchName: string = "";

  faShoppingCart = faShoppingCart;

  constructor(private userService: UserService, private httpService: HttpService, private router: Router, private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.http.get('/catalog/api/v1/categories').subscribe((data:any) => this.currentCategories=data);
    this.httpService.getCategories().subscribe(data => this.currentCategories = data);
    setTimeout(() => {
      console.log(this.currentCategories, "currentCategories")
    }, 1000);
    this.getCurrentUser()
    this.getSavedUsers()
  }

  getSavedUsers(): void {
    this.savedUsers = this.userService.getSavedUsers()
  }

  getCurrentUser(): void {
    this.currentUser = this.userService.getCurrentUser()
  }

  addCount(item): void {
    console.log(item)
    // const changedItem = {
    //   id: item.id,
    //   category:item.category, 
    //   count: item.count + 1, 
    //   name: item.name, 
    //   description: item.description, 
    //   price: item.price
    // }
    // let changedOffers = this.mockOffers.filter(el=>el.id!==item.id)
    // changedOffers.push(changedItem)
    // console.log(changedOffers, "changedOffers")
    // this.mockOffers = changedOffers;
  }

  minusCount(item): void {
    console.log(item)
  }

  sortAlphabetically(): void {
    console.log("sort")
    // this.mockOffers.sort(function(a, b) {
    //   let nameA = a.name.toLowerCase();
    //   let nameB = b.name.toLowerCase();
    //   if (nameA < nameB) return -1;
    //   if (nameA > nameB) return 1;
    //   return 0;
    // });
  }

  resetSettings(): void {
    this.selectedCategory = this.mockCategories[0].value;
    this.minPrice = "";
    this.maxPrice = "";
    this.searchName = "";
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AskModalComponent, {
      width: '250px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
