import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UserService } from '../../user.service';
import { HttpService } from '../../services/http.service';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';
import { CurrencyPipe } from '@angular/common';

export interface DialogData {
  info: string;
}

@Component({
  selector: 'app-create-offer-modal',
  templateUrl: './create-offer-modal.component.html',
  styleUrls: ['./create-offer-modal.component.css']
})
export class CreateOfferModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CreateOfferModalComponent>,
    private userService: UserService,
    private router: Router,
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  title: any = "";
  urlAddress: any = "";
  selectedCategory: any = "";
  description: any = "";
  price: any = "";
  isCategoryNew: boolean = false;

  mockCategories = this.data.mockCategories;

  onNoClick(): void {
    console.log('stay');
    this.dialogRef.close();
  }

  addNewCategory(){
    this.isCategoryNew = !this.isCategoryNew
  }

  onCreate(){
    if(this.title.length<1 || this.title.urlAddress<1){

    }
    const currentCategory = this.data.categories.find(
      (el) => el.category === this.selectedCategory
    ) || {};
    const newOffer = {
      category: {
        id: currentCategory.id || 100,
        category: this.selectedCategory,
      },
      id: 100,
      description: this.description,
      photo: this.urlAddress,
      price: this.price,
      title: this.title,
    };
    this.httpService.saveOffer(newOffer).subscribe(() => {
      console.log('save offer');
      this.data.getOffers();
      this.data.getCategories();
      this.dialogRef.close();
    });
  }

  ngOnInit(): void {}
}

