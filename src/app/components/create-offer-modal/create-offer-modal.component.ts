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
  selector: 'app-create-offer-modal',
  templateUrl: './create-offer-modal.component.html',
  styleUrls: ['./create-offer-modal.component.css'],
})
export class CreateOfferModalComponent extends RxUnsubscribe implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CreateOfferModalComponent>,
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  @ViewChild(InputComponent) somethingInput: InputComponent;

  title: string = '';
  urlAddress: string = '';
  selectedCategory: string = this.data.mockCategories[0].value;
  description: string = '';
  price: string = '';
  isCategoryNew: boolean = false;
  dataError: boolean = false;

  mockCategories = this.data.mockCategories;

  ngOnInit(): void {}

  onChangedInput(value: string, which: string) {
    this[which] = value;
  }

  onNoClick(): void {
    console.log(this.somethingInput.someText, 'RESULT');
    this.dialogRef.close();
  }

  addNewCategory(): void {
    this.isCategoryNew = !this.isCategoryNew;
  }

  onCreate() {
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
        this.httpService
          .saveOffer(newOffer)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            () => {
              this.data.successNotify();
              console.log('save offer');
              this.data.getOffers();
              this.data.getCategories();
              this.dialogRef.close();
            },
            () => this.data.errorNotify()
          );
      };
      img.onerror = () => {
        this.dataError = true;
      };
    }
  }
}
