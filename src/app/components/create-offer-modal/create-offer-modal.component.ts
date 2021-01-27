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
  styleUrls: ['./create-offer-modal.component.css'],
})
export class CreateOfferModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CreateOfferModalComponent>,
    private userService: UserService,
    private router: Router,
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  title: any = '';
  urlAddress: any = '';
  selectedCategory: any = this.data.mockCategories[0].value;
  description: any = '';
  price: any = '';
  isCategoryNew: boolean = false;
  dataError: boolean = false;
  isPictureShow: boolean = false;
  pictureError: boolean = false;

  mockCategories = this.data.mockCategories;

  onNoClick(): void {
    console.log('stay');
    this.dialogRef.close();
  }

  addNewCategory() {
    this.isCategoryNew = !this.isCategoryNew;
  }

  checkImgSrc(src) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      this.isPictureShow = !this.isPictureShow;
      this.pictureError = false;
      console.log(`valid src: ${src}`);
    };
    img.onerror = () => {
      this.isPictureShow = false;
      this.pictureError = true;
      console.log(`unvalid src: ${src}`);
    };
  }

  showPicture() {
    if (this.urlAddress.length > 0) {
      this.checkImgSrc(this.urlAddress);
    } else {
      this.pictureError = true;
      this.isPictureShow = false;
    }
  }

  closePicture() {
    this.isPictureShow = false;
  }

  onCreate() {
    console.log(this.title, this.urlAddress, this.selectedCategory, this.description, this.price, "DATA")
    if (
      this.title.length < 1 ||
      this.urlAddress.length < 1 ||
      this.selectedCategory.length < 1 ||
      this.description.length < 1 ||
      this.price < 0 ||
      !this.price ||
      !+(this.price)
    ) {
      this.dataError = true;
      return;
    } else {
      this.dataError = false;
      const img = new Image();
      img.src = this.urlAddress;
      img.onload = () => {
        const currentCategory =
          this.data.categories.find(
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
        console.log(`valid src: ${this.urlAddress}`);
      };
      img.onerror = () => {
        this.dataError = true;
        console.log(`unvalid src: ${this.urlAddress}`);
      };
    }
  }

  ngOnInit(): void {}
}
