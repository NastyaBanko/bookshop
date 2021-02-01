import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';

import { MatButtonModule } from '@angular/material/button';

import { ApplicationPipesModule } from './../../pipes/ApplicationPipesModule';

@NgModule({
  declarations: [OrdersComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatButtonModule,
    ApplicationPipesModule,
  ]
})
export class OrdersModule { }
