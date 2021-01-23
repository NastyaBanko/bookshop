import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderConfirmationRoutingModule } from './order-confirmation-routing.module';
import { OrderConfirmationComponent } from './order-confirmation.component';


@NgModule({
  declarations: [OrderConfirmationComponent],
  imports: [
    CommonModule,
    OrderConfirmationRoutingModule
  ]
})
export class OrderConfirmationModule { }
