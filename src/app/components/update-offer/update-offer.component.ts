import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { HttpService } from '../../services/http.service';

import { RxUnsubscribe } from '../../classes/rx-unsubscribe';
import { takeUntil } from 'rxjs/operators';

import { InputComponent } from './../input/input.component';

export interface DialogData {
  info: string;
}

@Component({
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.css'],
})
export class UpdateOfferComponent extends RxUnsubscribe implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UpdateOfferComponent>,
    private userService: UserService,
    private router: Router,
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  @ViewChild(InputComponent) somethingInput: InputComponent;

  title: string = this.data.offer.title;
  urlAddress: string = this.data.offer.photo;
  selectedCategory: string = this.data.offer.category.category;
  description: string = this.data.offer.description;
  price: number = this.data.offer.price;
  isCategoryNew: boolean = false;
  dataError: boolean = false;

  mockCategories = this.data.mockCategories;

  onChangedInput(value: string, which: string) {
    this[which] = value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addNewCategory() {
    this.isCategoryNew = !this.isCategoryNew;
  }

  onUpdate() {
    if (
      this.title.length < 1 ||
      this.urlAddress.length < 1 ||
      this.selectedCategory.length < 1 ||
      this.description.length < 1 ||
      +this.price < 0 ||
      !this.price ||
      !+this.price
    ) {
      this.dataError = true;
      return;
    } else {
      this.dataError = false;
      const img = new Image();
      img.src = this.urlAddress;
      img.onload = () => {
        const curentCategory =
          this.data.categories.find(
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
            .updateOfferCategory(
              this.data.offer.id,
              curentCategory.id ? category : newCategory
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.data.getOffers();
            });
        }
        if (!curentCategory.id) {
          this.httpService
            .saveCategory(newCategory)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.data.getOffers();
              this.data.getCategories();
            });
        }
        this.httpService
          .updateOffer(updatedOffer)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.data.successNotify()
            this.dialogRef.close();
            this.data.getOffers();
          }, () => this.data.errorNotify());
      };
      img.onerror = () => {
        this.dataError = true;
      };
    }
  }

  ngOnInit(): void {}
}
