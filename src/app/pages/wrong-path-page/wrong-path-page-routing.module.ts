import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WrongPathPageComponent } from './wrong-path-page.component';

const routes: Routes = [{ path: '', component: WrongPathPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WrongPathPageRoutingModule { }
