import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatButtonModule,
    MatInputModule,
  ]
})
export class AdminModule { }
