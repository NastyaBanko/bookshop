import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UserService } from '../../user.service';
import { HttpService } from '../../services/http.service';

import { RxUnsubscribe } from '../../classes/rx-unsubscribe';
import { takeUntil } from 'rxjs/operators';

export interface DialogData {
  info: string;
}

@Component({
  selector: 'app-delete-category-modal',
  templateUrl: './delete-category-modal.component.html',
  styleUrls: ['./delete-category-modal.component.css'],
})
export class DeleteCategoryModalComponent
  extends RxUnsubscribe
  implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteCategoryModalComponent>,
    private userService: UserService,
    private router: Router,
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  categories = this.data.categories.slice();
  serverCategories: any;

  dataError: boolean = false;

  onNoClick(): void {
    console.log('stay');
    this.dialogRef.close();
  }

  getCurrentCategories() {
    this.httpService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.serverCategories = data;
      });
  }

  updateCategories() {
    console.log(this.serverCategories);
    let wrongCategories = this.categories.filter(
      (el) => el.category.length < 1
    );
    if (wrongCategories.length === 0) {
      this.dataError = false;
      this.categories.forEach((el) => {
        let changedCategory = this.serverCategories.find(
          (item) => item.id === el.id
        );
        if (changedCategory.category !== el.category) {
          let category = {
            category: el.category,
            id: el.id,
          };
          this.httpService
            .updateCategoryName(category)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
              console.log('update category name');
              this.data.getOffers();
              this.data.getCategories();
            });
        }
      });
      this.dialogRef.close();
    } else this.dataError = true;
  }

  deleteCategory(id) {
    this.httpService
      .deleteCategory(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('delete category');
        this.categories = this.categories.filter((el) => el.id !== id);
        this.data.getOffers();
        this.data.getCategories();
      });
  }

  ngOnInit(): void {
    this.getCurrentCategories();
  }
}
