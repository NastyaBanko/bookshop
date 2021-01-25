import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UserService } from '../../user.service';
import { HttpService } from '../../services/http.service';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';

export interface DialogData {
  info: string;
}

@Component({
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.css'],
})
export class UpdateOfferComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UpdateOfferComponent>,
    private userService: UserService,
    private router: Router,
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  title: any = this.data.offer.title;
  urlAddress: any = this.data.offer.photo;
  selectedCategory: any = this.data.offer.category.category;
  description: any = this.data.offer.description;
  price: any = this.data.offer.price;
  isCategoryNew: boolean = false;
  dataError: boolean = false;

  mockCategories = this.data.mockCategories;

  onNoClick(): void {
    console.log('stay');
    this.dialogRef.close();
  }

  addNewCategory(){
    this.isCategoryNew = !this.isCategoryNew
  }

  onUpdate() {
    if (
      this.title.length < 1 ||
      this.urlAddress.length < 1 ||
      this.selectedCategory.length < 1 ||
      this.description.length < 1 ||
      this.price < 0 ||
      !this.price
    ) {
      this.dataError = true;
      return;
    } else {
      this.dataError = false;
      const img = new Image();
      img.src = this.urlAddress;
      img.onload = ()=>{
        const curentCategory = this.data.categories.find(
          (el) => el.category === this.selectedCategory
        ) || {};
        let category = {
          id: curentCategory.id,
          category: this.selectedCategory,
        };
        const updatedOffer = {
          id: this.data.offer.id,
          description: this.description,
          photo: this.urlAddress,
          price: this.price,
          title: this.title,
        };
        let newCategory = {
          category: this.selectedCategory,
        };
        if (this.selectedCategory !== this.data.offer.category.category) {
          this.httpService
            .updateOfferCategory(this.data.offer.id, curentCategory.id?category:newCategory)
            .subscribe(() => {
              console.log('category update');
              this.data.getOffers();
            });
        }
        if (!curentCategory.id) {
          this.httpService
            .saveCategory(newCategory)
            .subscribe(() => {
              console.log('add category');
              this.data.getOffers();
              this.data.getCategories();
            });
        }
        this.httpService.updateOffer(updatedOffer).subscribe(() => {
          console.log('update');
          this.dialogRef.close();
          this.data.getOffers();
        });
        console.log(`valid src: ${this.urlAddress}`);
      };
      img.onerror = ()=>{
        this.dataError = true;
        console.log(`unvalid src: ${this.urlAddress}`);
      };
    }
  }

  ngOnInit(): void {}
}
