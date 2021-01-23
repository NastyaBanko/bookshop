import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderConfirmationComponent } from './order-confirmation.component';

const routes: Routes = [{ path: '', component: OrderConfirmationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderConfirmationRoutingModule { }
