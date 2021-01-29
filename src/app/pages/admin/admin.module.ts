import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    FontAwesomeModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatCardModule,
    MatBadgeModule,
    MatSnackBarModule,
  ]
})
export class AdminModule { }
