import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';

import { MatButtonModule } from '@angular/material/button';
// import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [OrdersComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatButtonModule,
    // MatCardModule,
  ]
})
export class OrdersModule { }
